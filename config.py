num_products = 30
training_epochs =10
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
container_name = "purchasehistory"
blob_name = "purchase_record.json"
blob_connection_string = "DefaultEndpointsProtocol=https;AccountName=db2024supplychainblob;AccountKey=NnwCCN6LXiSWlH2VCLUABuSKFNdLH4ZBlXuwQ6DJJG/vqwpiziaq8qSDqVEyynUEn6XDpgGtZNdW+AStLK0fCg==;EndpointSuffix=core.windows.net"
