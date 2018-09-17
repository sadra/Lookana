# Lookana Bot


[![Version](https://img.shields.io/badge/version-1.0.0-red.svg?style=flat)](https://github.com/sadra/Lookana)
[![License](https://img.shields.io/badge/License-THE%20CRAPL%20v0%20BETA%201-orange.svg)](https://github.com/sadra/Lookana/blob/master/LICENSE)
[![NodeJs](https://img.shields.io/badge/NodeJs-v7.7.3-brightgreen.svg)]()
[![npm](https://img.shields.io/badge/npm-4.1.2-yellow.svg)]()
[![Python](https://img.shields.io/badge/Python-3.6-blue.svg)]()


This is a Case Study for my Master of e-Commerce proposal.

For this project i use `NodeJs` as the core, and `python` for the machine learning on the data.

## Abstract

In the last decade, with the advent of mobile phones, especially smartphones and tablets, our ability to collect accurate and accurate information from users has increased. This information can be used to improve systems that deal with users (such as recommender systems) and create customized results for each particular user.

Mobile phones are the most important tools to access this information. Since we currently have fewer people who do not use this tool, we can get the same information from all users in the same way. Mobile phones allow us to have access to information such as location, speed, height, ambient light intensity, and so on for every particular user. With this information, we can refine our data, and ultimately give it the data that best matches the user's context.

One of the problems that the advocate systems deal with is that they only propose analyzing the data collected by the user. But in a well-informed environment, in addition to studying the behavior of the user and also checking his account, we can increase the accuracy of the suggestions by using the system's notification to the user's environment.

Identifying and suggesting options that are solely personalized for the user and will certainly be welcomed will be a big challenge. How to choose the options for the user and refine them, and then sort them according to the degree of importance and proximity to the user's own taste and conditions.

In this research, we intend to prove that using the real data from the physical environment (not just analytical data) can provide more intelligent advisory systems by implementing a recreational adventure system that is perceived to be environmentally conscious. Make it anyway.

In this study, we will study, on a case-by-case basis, a time-consuming advocate system named Lukana's LookanaBot. The system will refine and then rank a handful of suggestions by collecting user personal information such as age, gender, morale and interests, as well as collecting environment information such as location, hours, weather conditions and traffic on the route. And finally, it suggests the user with priority. In this study, we plan to optimize the system to automate and automate all identification, data refinement, suggestions, and accuracy checks.

## How to use

1. Before everything make sure that you've installed `Nodejs` and `MongoDB` on your server.

2. Then make a clone from this project on your server:

    ```bash
    git@github.com:sadra/Lookana.git
    ```

3. Then, install the dependencies:

    ```bash
    npm install
    ```

4. Install the `pm2`

    ```bash
    npm install pm2 -g
    ```

5. I used several api at this project. You should get the key from these:
    * [Skybiometry](https://skybiometry.com/)
    * [Sightengine](https://sightengine.com/)
    * [Clarifai](https://clarifai.com/)
    * [Apixu](https://www.apixu.com/)
    * [Google Places](https://cloud.google.com/maps-platform/places/)

6. Create a new `.env` file and fill the parameters with you data.

    ```json
    {
        "port": 30000,
        "telegram_token": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        "mongo": {
        "uri": "localhost:port", //database url
        "db": "db_name"
        },
        "api": {
          "skybiometry_key" : "XXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
          "skybiometry_secret" : "XXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
          "sightengine_key" : "XXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
          "sightengine_secret" : "XXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
          "clarifai_key" : "XXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
          "apixu" : "XXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
          "googleMap_key" : "XXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
        }
    }
    ```

7. Run the app throw **pm2**:

    ```bash
    pm2 start lookana.js
    ```

## Machine Learning

There is an implemented machine learning folder that i used for research on my data from the lookana system and users who used it.
If you want know how to use this project, just follow the steps:

1. For using **Machine Learning** project got to the path:

    ```bash
    cd /MachineLearning
    ```

2. All the data you need to use, stored at `/data` folder.

    * All `ml_data_x` are ready for learning and making the model.
    * All `test_data_x` are ready for test the real data.
    * All `lookana_expected_test_result_x` are real result for comparing the predicted and real data.

3. You can find created model files in `/model` folder.

4. For using the codes, just run project with python:

    ```bash
    python lookana_creating_model.py
    ```

    or if you use ***PyCharm*** just right click on file and select the `Run`.

## License

The project is released under the [THE CRAPL v0 BETA 1](./LICENSE)
