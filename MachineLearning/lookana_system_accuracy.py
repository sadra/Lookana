import numpy as np
import pandas as pd
import math
from sklearn.ensemble import RandomForestClassifier
from sklearn.cross_validation import train_test_split
pd.options.mode.chained_assignment = None
from sklearn.externals import joblib
from sklearn.metrics import confusion_matrix
import matplotlib.pyplot as plt
import itertools
from sklearn.metrics import roc_curve, auc



# Prepare Data
test_data = pd.read_csv("data/test_data_20_percent.csv")
print(test_data.head())


#Validate data
test_data_inputs = test_data[["type", "contextAware", "rate_in_list", "distance",
                    "duration", "weather", "rating", "gender", "age", "mood"]]


print("========== validated test data ==========")
print(test_data_inputs.head())


#Load created model
created_model = joblib.load("model/lookana_model_80_20")
predicted_test_data = created_model.predict(test_data_inputs)

print("========== Predicted Test Data ==========")
print(predicted_test_data)
print(len(predicted_test_data))




def getConfusionMatrix():
    pred = predicted_test_data
    lookana_expected_result_data = np.loadtxt("data/lookana_expected_test_result_20_percent.txt", dtype="int32")
    diff_arr = np.equal(lookana_expected_result_data, pred)
    correct_answer = np.sum(diff_arr)
    predict_accuracy = correct_answer / len(pred)*100
    print("lookana real data accuracy: ", "%.2f" % predict_accuracy, "%")
    y_true = lookana_expected_result_data
    y_pred = pred
    return confusion_matrix(y_true, y_pred)

#Compare tested data with ral result
def printIndexes(confusion_matrix):
    tn, fp, fn, tp = confusion_matrix.ravel()
    acc = (tp+tn) / (tn+fp+fn+tp)
    err = 1 - acc
    ppv = (tp) / (tp+fp)
    npv = (tn) / (tn+fn)
    tpr = (tp) / (tp+fn)
    tnr = (tn) / (tn+fp)
    f1 = 2 * ((ppv*tpr)/(ppv+tpr))
    mcc = (tp*tn - fp*fn) / math.sqrt( (tp+fp) * (tp+fn) * (tn+fp) * (tn+fn) )

    dr = (tp) / (fn+tp)
    far = (fp) / (tn+fp)

    fnr = (fn) / (fn+tp)
    fpr = (fp) / (fp+tn)

    print("\n")
    print( "Accuracy: ", acc )
    print( "Error: ", err )
    print( "Precision or Positive Predictive Value: ", ppv )
    print( "Negative Predictive Value: ", npv )
    print("\n")
    print( "Sensitivity, Recall, Hit Rate, or True Positive Rate: ", tpr )
    print( "Specificity, Selectivity or True Negative Rate: ", tnr )
    print( "False Positive Rate: ", fpr )
    print( "False Negative Rate: ", fnr )
    print("\n")
    print( "F1 score: ", f1 )
    print( "Matthews Correlation Coefficient: ", mcc )
    print("\n")
    print( "DR: ", dr )
    print( "FAR: ", far )
    print("\n")


print('\033[92m'+"========== Result ==========")
confusion_matrix = getConfusionMatrix()
printIndexes(confusion_matrix)


def plot_confusion_matrix(cm, classes,
                          normalize=False,
                          title='Confusion matrix',
                          cmap=plt.cm.Blues):
    """
    This function prints and plots the confusion matrix.
    Normalization can be applied by setting `normalize=True`.
    """
    if normalize:
        cm = cm.astype('float') / cm.sum(axis=1)[:, np.newaxis]
        print("Normalized confusion matrix")
    else:
        print('Confusion matrix, without normalization')

    print(cm)

    plt.imshow(cm, interpolation='nearest', cmap=cmap)
    plt.title(title)
    plt.colorbar()
    tick_marks = np.arange(len(classes))
    plt.xticks(tick_marks, classes, rotation=45)
    plt.yticks(tick_marks, classes)

    fmt = '.2f' if normalize else 'd'
    thresh = cm.max() / 2.
    for i, j in itertools.product(range(cm.shape[0]), range(cm.shape[1])):
        plt.text(j, i, format(cm[i, j], fmt),
                 horizontalalignment="center",
                 color="white" if cm[i, j] > thresh else "black")

    plt.tight_layout()
    plt.ylabel('Actual')
    plt.xlabel('Predicted')


class_names = ['accepted', 'denied']
np.set_printoptions(precision=2)

# Plot non-normalized confusion matrix
plt.figure()
plot_confusion_matrix(confusion_matrix, classes=class_names,
                      title='Confusion matrix, without normalization')
# Plot normalized confusion matrix
plt.figure()
plot_confusion_matrix(confusion_matrix, classes=class_names, normalize=True,
                      title='Normalized confusion matrix')
plt.show()



def GetRates():
    pred = predicted_test_data
    lookana_expected_result_data = np.loadtxt("data/lookana_expected_test_result_20_percent.txt", dtype="int32")
    diff_arr = np.equal(lookana_expected_result_data, pred)
    correct_answer = np.sum(diff_arr)
    predict_accuracy = correct_answer / len(pred)*100
    print("lookana real data accuracy: ", "%.2f" % predict_accuracy, "%")
    y_true = lookana_expected_result_data
    y_pred = pred

    from sklearn.metrics import roc_curve, auc
    fpr, tpr, thresholds = roc_curve(y_pred, y_true)
    roc_auc = auc(fpr, tpr)

    plt.figure()
    plt.plot(fpr, tpr, color='darkorange', lw=1, label='ROC curve (area = %0.2f)' % roc_auc)
    plt.plot([0, 1], [0, 1], color='navy', lw=1, linestyle='--')
    plt.xlim([0.0, 1.0])
    plt.ylim([0.0, 1.05])
    plt.xlabel('False Positive Rate')
    plt.ylabel('True Positive Rate')
    plt.title('Receiver operating characteristic')
    plt.legend(loc="lower right")
    plt.show()


GetRates()

