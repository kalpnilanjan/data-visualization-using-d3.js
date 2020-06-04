import json

from flask import Flask, render_template
import pandas as pd

app = Flask(__name__)

@app.route("/")
def index():
    df = pd.read_csv('./data/dataset.csv')
    chart_data = df.to_dict(orient='records')
    chart_data = json.dumps(chart_data, indent=2)
    data = {'chart_data': chart_data}
    return render_template("index.html", data=data)


if __name__ == "__main__":
    app.jinja_env.auto_reload = True
    app.run(debug=True)