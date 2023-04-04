import requests
import time
import json 
from pprint import pprint

start = 0

symbols = []

try:    
    while start < 10000:
        print(start)
        url = "https://symbol-search.tradingview.com/symbol_search/v3/?text=&hl=1&exchange=&lang=en&search_type=undefined&start=" + str(start) + "&domain=production&sort_by_country=US"
        x = requests.get(url)
        start += 50
        time.sleep(0.2)

        if str(x.status_code) == "200":
            data = x.json()
            print(data)
            symbols += data['symbols']

            with open('symbols.txt', 'w') as the_file:
                the_file.write(json.dumps(symbols))
        else:
            print("Not 200: " + str(x.status_code))
except Exception as err:
    pprint(err)

print(symbols)