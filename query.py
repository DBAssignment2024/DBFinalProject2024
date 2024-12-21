import pyodbc
from generator import generate_customers
from config import connection_string

# Just a file for populating tables with some random data here. Feel free to ignore

def query():
    print("Query")
    try:
        conn = pyodbc.connect(connection_string)
        cursor = conn.cursor()
        print("Connected to server")

        print("Inserting into CUSTOMER table...")
        customers = list(generate_customers(1000))

        query = """
                INSERT INTO CUSTOMER (First_Name, Last_Name, Email, Addr, Phone)
                VALUES {}
                """.format(
            ", ".join(
                [
                    "('{}', '{}', '{}', '{}', '{}')".format(
                        customer[0].replace("'", "''"),
                        customer[1].replace("'", "''"),
                        customer[2].replace("'", "''"),
                        customer[3].replace("'", "''"),
                        customer[4].replace("'", "''")
                    )
                    for customer in customers
                ]
            )
        )
        cursor.execute(query)
        conn.commit()
        print("CUSTOMER table populated!")



    except exception as e:
        print("Error occurred:", e)
