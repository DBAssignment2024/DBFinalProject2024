import random
from faker import Faker

from datetime import datetime, timedelta
from config import num_products
fake = Faker()

products = [
    {"id": 1, "name": "Wireless Headphones"},
    {"id": 2, "name": "Smartphone"},
    {"id": 3, "name": "Laptop"},
    {"id": 4, "name": "Tablet"},
]


def generate_customers(num_customers=10):
    for i in range(1, num_customers + 1):
        first_name = fake.first_name()
        last_name = fake.last_name()
        email = fake.email()
        addr = fake.address()
        phone = fake.phone_number()[:14]
        username = fake.user_name()
        passwordHash = "!@#$%^&*()"
        yield (first_name, last_name, email, addr, phone, username, passwordHash)


def generate_products():
    food_items = ["Apple", "Banana", "Carrot", "Steak", "Pizza", "Pasta", "Ice Cream", "Bread", "Cheese", "Salad"]
    book_titles = ["The Great Gatsby", "1984", "To Kill a Mockingbird", "The Catcher in the Rye", "Moby Dick",
                   "War and Peace", "Pride and Prejudice", "The Hobbit", "Harry Potter", "Lord of the Rings"]
    electronics = ["Smartphone", "Laptop", "Tablet", "Headphones", "Smartwatch", "Monitor", "Keyboard",
                   "Mouse", "Camera", "Printer"]

    categories = [
        ("Food", food_items),
        ("Books", book_titles),
        ("Electronics", electronics)
    ]

    product_id = 1
    for category_name, items in categories:
        for name in items:
            description = fake.sentence(nb_words=10)
            price = round(random.uniform(10, 100), 2)

            yield (product_id, name, description, category_name, price)
            product_id += 1


def generate_orders(n=200):
    statuses = ["Pending", "Shipped", "Delivered", "Cancelled"]

    for order_id in range(1, 201):
        order_date = (datetime.now() - timedelta(days=random.randint(0, 365))).strftime(
            '%Y-%m-%d')
        total_amount = round(random.uniform(10, 1000), 2)
        status = random.choice(statuses)
        customer_id = random.randint(1, 1000)

        yield (order_id, order_date, total_amount, status, customer_id)

def generate_order_items(num_items):
    for order_item_id in range(1, num_items + 1):
        quantity = random.randint(1, 10)
        unit_price = round(random.uniform(5, 500), 2)
        order_id = random.randint(1, 200)
        product_id = random.randint(1, num_products)
        yield (order_item_id, quantity, unit_price, order_id, product_id)