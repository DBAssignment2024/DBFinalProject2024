import random
from faker import Faker
import sqlite3

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
        yield (first_name, last_name, email, addr, phone)


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
