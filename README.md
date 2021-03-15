# How to run locally on your machine:
Starting from ~/react-flask-app/. (AKA where this readme is):

Terminal 1:
> venv\Scripts\activate (start the virtual environment)

> yarn start

Terminal 2:
> $env:FLASK_APP = "api.py" (only do this if running in Windows Powershell)

> yarn start-api

Your browser should automatically open up on http://localhost:3000/