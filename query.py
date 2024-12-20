import pyodbc
from generator import generate_customers
def query():
    print("Query")
    try:

        connection_string = """
        Driver={ODBC Driver 18 for SQL Server};
        Server=tcp:scn.database.windows.net,1433;
        Database=SupplyChain;
        Uid=CloudSA10a2445c;
        Pwd=DBProject@2024;  
        Encrypt=yes;
        TrustServerCertificate=no;
        Connection Timeout=30;
        """

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
