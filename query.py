import pyodbc
from generator import *
from config import connection_string

def populate_customers(n):
    print("Query")
    try:
        conn = pyodbc.connect(connection_string)
        cursor = conn.cursor()
        print("Connected to server")

        print("Inserting into CUSTOMER table...")
        customers = list(generate_customers(n))

        query = """
                INSERT INTO CUSTOMER (First_Name, Last_Name, Email, Addr, Phone, Username, passwordHash)
                VALUES {}
                """.format(
            ", ".join(
                [
                    "('{}', '{}', '{}', '{}', '{}', '{}', '{}')".format(
                        customer[0].replace("'", "''"),
                        customer[1].replace("'", "''"),
                        customer[2].replace("'", "''"),
                        customer[3].replace("'", "''"),
                        customer[4].replace("'", "''"),
                        customer[5].replace("'", "''"),
                        customer[6].replace("'", "''")
                    )
                    for customer in customers
                ]
            )
        )
        cursor.execute(query)
        conn.commit()
        print("CUSTOMER table populated!")

    except Exception as e:
        print("Error occurred:", e)

def populate_orders(n):
    print("Query")
    try:
        conn = pyodbc.connect(connection_string)
        cursor = conn.cursor()
        print("Connected to server")

        print("Inserting into ORDERS table...")
        orders = list(generate_orders(200))

        query = """
                INSERT INTO ORDERS (OrderID,OrderDate, TotalAmount, Status, CustomerID)
                VALUES {}
                """.format(
            ", ".join(
                [
                    "('{}','{}', {}, '{}', {})".format(
                        order[0],
                        order[1].replace("'", "''"),  # OrderDate
                        order[2],  # TotalAmount (numeric)
                        order[3].replace("'", "''"),  # Status
                        order[4]  # CustomerID (numeric)
                    )
                    for order in orders
                ]
            )
        )
        cursor.execute(query)
        conn.commit()
        print("ORDERS table populated!")

    except Exception as e:
        print("Error occurred:", e)

def populate_order_items(num_items):
    print("Populating ORDER_ITEMS table...")
    try:
        conn = pyodbc.connect(connection_string)
        cursor = conn.cursor()
        print("Connected to server")

        order_items = list(generate_order_items(num_items))

        query = """
                INSERT INTO ORDERITEM (OrderItemId, Quantity, UnitPrice, OrderId, ProductID)
                VALUES {}
                """.format(
            ", ".join(
                [
                    "({}, {}, {}, {}, {})".format(
                        order_item[0],  # OrderItemId
                        order_item[1],  # Quantity
                        order_item[2],  # UnitPrice
                        order_item[3],  # OrderId
                        order_item[4]   # ProductID
                    )
                    for order_item in order_items
                ]
            )
        )
        cursor.execute(query)
        conn.commit()
        print("ORDER_ITEMS table populated!")

    except Exception as e:
        print("Error occurred:", e)
