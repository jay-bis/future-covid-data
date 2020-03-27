from flask import Flask

app = Flask(__name__)

@app.route('/')
def home_route():
    return {'response': 'Hello World'}