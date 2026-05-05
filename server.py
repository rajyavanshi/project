from fastapi import FastAPI
import requests

app = FastAPI()

@app.get("/api/data/{ticker}")
def get_data(ticker: str):
    url = f"https://query1.finance.yahoo.com/v8/finance/chart/{ticker}?range=2y&interval=1d"
    headers = {"User-Agent": "Mozilla/5.0"}
    res = requests.get(url, headers=headers)
    return res.json()
