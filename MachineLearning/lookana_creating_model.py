import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.cross_validation import train_test_split
pd.options.mode.chained_assignment = None
from sklearn.externals import joblib


# Prepare Data
data = pd.read_csv("data/ml_data_80_percent.csv")

# Prepare Input Data
data_inputs = data[["type", "contextAware", "rate_in_list", "distance",
                    "duration", "weather", "rating", "gender", "age", "mood"]]
print(data_inputs.head())

print(len(data_inputs))


# Prepare Expected Values
expected_result = data[["accepted"]]
print(expected_result.head())

# Prepare for Train and Test Tables
input_train, input_test, expected_train, expected_test = train_test_split(data_inputs, expected_result, test_size=0.33, random_state=42)

print(input_train.head())
print(expected_train.head())

#Preapre Modeling and Testing datas
clf = RandomForestClassifier(n_estimators=100)
clf.fit(input_train, expected_train.values.ravel())
accuracy = clf.score(input_test, expected_test)

print("============= accuracy =================")
print("Accuracy = {}%".format(accuracy * 100))

joblib.dump(clf, "model/lookana_model_80_20", compress=9)