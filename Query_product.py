import pyodbc
from generator import generate_customers
from generator import generate_products
from config import connection_string

# Just a file for populating tables with some random data here. Feel free to ignore
def query_product():
    print("Query")
    try:
        conn = pyodbc.connect(connection_string)
        cursor = conn.cursor()
        print("Connected to server")

        print("Inserting into CUSTOMER table...")
        products = list(generate_products())

        query = """
                INSERT INTO PRODUCT (ProductId, name, description, category, price)
                VALUES {}
                """.format(
            ", ".join(
                [
                    "('{}', '{}','{}', '{}', '{}')".format(
                        product[0],
                        product[1].replace("'", "''"),
                        product[2].replace("'", "''"),
                        product[3].replace("'", "''"),
                        product[4]
                    )
                    for product in products
                ]
            )
        )
        cursor.execute(query)
        conn.commit()
        print("PRODUCT table populated!")

    except Exception as e:
        print("An Error occurred:", e)

