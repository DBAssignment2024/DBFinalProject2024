import tensorflow as tf
from tensorflow.keras.layers import Dense, Dropout, Add, Input
from tensorflow.keras.models import Model
import pandas as pd
import numpy as np
import random


# for testing only
def generate_purchase_records():

    num_customers = 1000
    num_products = 30
    num_records = 5000

    product_groups = {
        "1-10": list(range(1, 11)),
        "11-20": list(range(11, 21)),
        "21-30": list(range(21, 31))
    }

    group_choice_probabilities = [1 / 3, 1 / 3, 1 / 3]
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

def train_with_new_data(model, new_data_urls):
    all_new_records = []

    for url in new_data_urls:
        response = requests.get(url)
        if response.status_code == 200:
            new_records = pd.DataFrame(json.loads(response.text))
            all_new_records.append(new_records)
        else:
            print(f"Failed to fetch data from {url}")

    if not all_new_records:
        print("No new records to train on.")
        return

    new_data = pd.concat(all_new_records, ignore_index=True)

    all_product_ids = list(range(1, 31))
    product_matrix = new_data.pivot_table(index='CustomerID', columns='ProductID', values='PurchasedQuantity', fill_value=0)
    product_matrix = product_matrix.reindex(columns=all_product_ids, fill_value=0)
    product_matrix = (product_matrix > 0).astype(int)

    X_new = product_matrix.values
    Y_new = product_matrix.values


    model.fit(X_new, Y_new, epochs=10, batch_size=16)
    print("Model further trained with new data.")
def recommend_product():
    data = generate_purchase_records()
    all_product_ids = list(range(1, 31))
    product_matrix = data.pivot_table(index='CustomerID', columns='ProductID', values='PurchasedQuantity', fill_value=0)
    product_matrix = product_matrix.reindex(columns=all_product_ids, fill_value=0)
    product_matrix = (product_matrix > 0).astype(int)
    product_matrix.to_csv("product_matrix.txt", sep='\t')
    print(product_matrix)

    model = build_resnet(input_dim=30, blocks=5)
    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
    model.summary()

    X = product_matrix.values
    Y = product_matrix.values

    from sklearn.model_selection import train_test_split
    X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.2, random_state=42)

    model.fit(X_train, Y_train, epochs=50, batch_size=16, validation_data=(X_test, Y_test))

    new_customer_input = np.zeros((1, 30))
    new_customer_input[0, [2]] = 1

    predicted_probabilities = model.predict(new_customer_input)

    recommended_products = np.argsort(predicted_probabilities[0])[::-1][:5] + 1  # because the product IDs in the DB actually start from 1
    print("Recommended Products:", recommended_products)


