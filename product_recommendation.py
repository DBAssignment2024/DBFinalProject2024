import tensorflow as tf
from tensorflow.keras.layers import Dense, Dropout, Add, Input
from tensorflow.keras.models import Model
import pandas as pd
import numpy as np
import random
from azure.storage.blob import BlobServiceClient
import json
import pyodbc
from config import *

# this generating function for testing the ML model only!!!!!!!! The actually productIDs dont have to be assigned according to their correlation whatsoever
# and one can and should change the number of products in the config file to get the desired input and output vector shape when using actual data fetched
# from blob to train the network. See below
def generate_purchase_records():
    num_customers = 1000
    num_records = 5000

    product_groups = {
        "1-10": list(range(1, 11)),
        "11-20": list(range(11, 21)),
        "21-30": list(range(21, 31))
    }

    group_choice_probabilities = [1/3, 1/3, 1/3]
    records = []

    customer_group_purchases = {customer_id: {group: 0 for group in product_groups} for customer_id in
                                range(1, num_customers + 1)}

    for _ in range(num_records):
        customer_id = random.randint(1, num_customers)

        past_purchases = customer_group_purchases[customer_id]
        total_purchases = sum(past_purchases.values())

        if total_purchases > 0:
            group_choice_probabilities = [
                (past_purchases[group] + 1) / (total_purchases + len(product_groups))
                for group in product_groups
            ]
        else:
            group_choice_probabilities = [1 / 3, 1 / 3, 1 / 3]

        chosen_group_key = random.choices(list(product_groups.keys()), weights=group_choice_probabilities, k=1)[0]
        chosen_group = product_groups[chosen_group_key]

        product_id = random.choice(chosen_group)

        quantity = random.randint(1, 5)

        records.append({
            "CustomerID": customer_id,
            "ProductID": product_id,
            "PurchasedQuantity": quantity
        })

        customer_group_purchases[customer_id][chosen_group_key] += 1

    return pd.DataFrame(records)


def build_resnet(input_dim, blocks):
    inputs = Input(shape=(input_dim,))
    x = Dense(64, activation='relu')(inputs)

    for _ in range(blocks):
        shortcut = x
        x = Dense(64, activation='relu')(x)
        x = Dropout(0.3)(x)
        x = Dense(64, activation='relu')(x)
        x = Add()([shortcut, x])

    outputs = Dense(input_dim, activation='sigmoid')(x)
    return Model(inputs, outputs)


def create_resnet():
    model = build_resnet(input_dim=num_products, blocks=10)
    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
    model.summary()
    return model


def train_with_new_data(model):
    try:
        blob_service_client = BlobServiceClient.from_connection_string(blob_connection_string)
        container_client = blob_service_client.get_container_client(container_name)
        blob_client = container_client.get_blob_client(blob_name)

        blob_content = blob_client.download_blob().readall()
        json_data = json.loads(blob_content)
        print("Successfully fetched JSON data from Azure Blob Storage.")
    except Exception as e:
        print("Failed to fetch JSON data from Azure Blob Storage.")
        print(e)
        return

    all_new_records = []
    for record in json_data:
        user_id = record["userId"]
        for product in record["products"]:
            all_new_records.append({
                "CustomerID": user_id,
                "ProductID": product["ProductId"],
                "PurchasedQuantity": product["Quantity"]
            })

    if not all_new_records:
        print("Json file contains no usable record to train on!.")
        return

    new_data = pd.DataFrame(all_new_records)
    all_product_ids = list(range(1, num_products + 1))
    product_matrix = new_data.pivot_table(index='CustomerID',
                                          columns='ProductID',
                                          values='PurchasedQuantity',
                                          fill_value=0)
    product_matrix = product_matrix.reindex(columns=all_product_ids, fill_value=0)
    product_matrix = (product_matrix > 0).astype(int)

    X_new = product_matrix.values
    Y_new = product_matrix.values

    model.fit(X_new, Y_new, epochs=training_epochs, batch_size=16)
    print("Model further trained with new data.")
    return model

# train a resnet using the generator from above that can be further trained with json data from blob, for testing the ML part
def train_resnet_with_generator():
    data = generate_purchase_records()
    all_product_ids = list(range(1, num_products + 1))
    product_matrix = data.pivot_table(index='CustomerID', columns='ProductID', values='PurchasedQuantity', fill_value=0)
    product_matrix = product_matrix.reindex(columns=all_product_ids, fill_value=0)
    product_matrix = (product_matrix > 0).astype(int)
    product_matrix.to_csv("product_matrix.txt", sep='\t')
    print(product_matrix)

    model = create_resnet()

    X = product_matrix.values
    Y = product_matrix.values

    from sklearn.model_selection import train_test_split
    X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.2, random_state=42)

    model.fit(X_train, Y_train, epochs=training_epochs, batch_size=16, validation_data=(X_test, Y_test))

    return model


def recommend(model, customer_purchase_vector):

    predicted_probabilities = model.predict(customer_purchase_vector)

    already_bought = np.where(customer_purchase_vector[0] == 1)[0]
    sorted_product_indices = np.argsort(predicted_probabilities[0])[::-1]
    recommended_products = [idx for idx in sorted_product_indices if
                            idx not in already_bought]  # exclude the ones the customer has already bought, optional
    top_5_products = [int(idx + 1) for idx in recommended_products[:5]]
    try:
        conn = pyodbc.connect(connection_string)
        cursor = conn.cursor()
        product_ids_str = ", ".join(map(str, top_5_products))

        query = f"""
                    SELECT ProductID, Name
                    FROM PRODUCT
                    WHERE ProductID IN ({product_ids_str});
                """

        cursor.execute(query)
        results = cursor.fetchall()
    except Exception as e:
        print("Error occurred:", e)
        return None

    product_details = [(row.ProductID, row.Name) for row in results]
    conn.close()

    print("Top 5 Recommended Products in '(ProductID,Name)' format:", product_details)
