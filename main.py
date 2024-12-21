from product_recommendation import *
from analytics import *
import numpy as np
from config import num_products


def main():
    # for testing product_recommendation.py
    print("Testing functions in product_recommendation.py ~~~")
    test_customer_vector = np.zeros((1, num_products))  #A ONE-HOT encoding of whether test customer has purchased each
                                                        #product
    test_customer_vector[0, [2,5,13,6]] = 1

    #p.s. The json file on Blob only contains a few records
    #Comment the train_with_new_data line and uncomment the train_resnet_with_generator line to test it with generator
    #generated data
    model = create_resnet()
    #model = train_resnet_with_generator()
    model = train_with_new_data(model)

    recommend(model, test_customer_vector)

    #for testing analytics.py
    print("Testing functions in analytics.py ~~~")
    getDailyOrderAmount()
    plotProductSales()
    predict_next_week_sales()


if __name__ == '__main__':
    main()
