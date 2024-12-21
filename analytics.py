import warnings
warnings.filterwarnings("ignore")
import numpy as np
import pyodbc
import pandas as pd
import matplotlib.pyplot as plt
from statsmodels.tsa.arima.model import ARIMA
from config import connection_string

def getDailyOrderAmount():
    global connection_string
    print("Connecting to database...")
    try:

        conn = pyodbc.connect(connection_string)
        print("Connected to the server")

        query = """
        SELECT 
            OrderDate, SUM(TotalAmount) AS TotalAmountSum
        FROM 
            ORDERS
        GROUP BY 
            OrderDate
        ORDER BY 
            OrderDate;
        """

        df = pd.read_sql(query, conn)
        conn.close()
        print("Connection closed")

        plt.figure(figsize=(10, 6))
        plt.plot(df['OrderDate'], df['TotalAmountSum'], marker='o', linestyle='-', label='Total Amount by Date')
        plt.xlabel("Order Date")
        plt.ylabel("Total Amount (Dollar)")
        plt.title("Total Amount by Order Date")
        plt.legend()
        plt.show()

    except Exception as e:
        print("Error occurred:", e)

def plotProductSales():
    global connection_string
    print("Connecting to database...")
    try:


        conn = pyodbc.connect(connection_string)
        print("Connected to the server")

        product_ids = input("Enter product IDs separated by space: ").strip().split()
        for element in product_ids:
            if not element.isdigit():
                print("Invalid product ID input, closing connection...", )
                conn.close()
                print("Connection closed")

                return

        product_ids = ",".join(product_ids)


        query = f"""
        SELECT 
            p.ProductID,
            p.Name AS ProductName,
            SUM(oi.Quantity) AS TotalQuantitySold,
            SUM(oi.Quantity * oi.UnitPrice) AS TotalAmount
        FROM 
            OrderItem oi
        JOIN 
            PRODUCT p ON oi.ProductID = p.ProductID
        WHERE 
            p.ProductID IN ({product_ids})
        GROUP BY 
            p.ProductID, p.Name
        ;
        """

        df = pd.read_sql(query, conn)
        conn.close()
        print("Connection closed")

        if df.empty:
            print("No data found.")
            return

        plt.figure(figsize=(10, 6))
        plt.bar(df['ProductName'], df['TotalQuantitySold'], color='#f2c777', alpha=0.7)
        plt.title("Total Quantity Sold by Product")
        plt.xlabel("Product Name")
        plt.ylabel("Total Quantity Sold")
        plt.show()

        plt.figure(figsize=(10, 6))
        plt.bar(df['ProductName'], df['TotalAmount'], color='#a6a7ed', alpha=0.7)
        plt.title("Total Amount by Product")
        plt.xlabel("Product Name")
        plt.ylabel("Total Amount (Dollar)")
        plt.show()

    except Exception as e:
        print("An error occurred:", e)

def predict_future_sales():
    print("Connecting to database...")
    try:

        conn = pyodbc.connect(connection_string)
        print("Connected to the server")

        product_id = input("Enter ProductID: ").strip()
        if not product_id.isdigit():
            print("Invalid ProductID. Please enter a numeric value.")
            return

        query = f"""
        SELECT 
            Name, OrderDate, SUM(oi.Quantity) AS DailyQuantity
        FROM 
            OrderItem oi
        JOIN 
            ORDERS o ON oi.OrderID = o.OrderID
        JOIN 
            PRODUCT p ON oi.ProductID = p.ProductID
        WHERE 
            oi.ProductID = {product_id}
        GROUP BY 
            OrderDate, Name
        ORDER BY 
            OrderDate;
        """

        df = pd.read_sql(query, conn)
        conn.close()
        print("Connection closed")

        if df.empty:
            print(f"No sales data found for ProductID {product_id}.")
            return

        df['OrderDate'] = pd.to_datetime(df['OrderDate'])

        df.set_index('OrderDate', inplace=True)
        df = df['DailyQuantity'].resample('M').sum()

        if df.isnull().all():
            print("No valid data available for forecasting.")
            return

        model = ARIMA(df, order=(3, 1, 0))
        model_fit = model.fit()

        forecast = model_fit.forecast(steps=3)
        forecast_dates = pd.date_range(df.index[-1] + pd.offsets.MonthBegin(1), periods=3, freq='MS')

        forecast_df = pd.DataFrame({'ForecastDate': forecast_dates, 'PredictedQuantity': forecast})


        plt.figure(figsize=(12, 6))
        plt.plot(df.index, df, label='Historical sales quantities', marker='o')
        plt.plot(forecast_dates, forecast, label='Forecast quantities', marker='x', color='red')

        plt.title(f"3-Month Sales Forecast for product with productID {product_id}")
        plt.xlabel("Date")
        plt.ylabel("Total Quantity Sold")
        plt.legend()
        plt.grid()
        plt.show()

    except Exception as e:
        print("An error occurred:", e)