from pornhub_api import PornhubApi
from pprint import pprint
import sys

api = PornhubApi()

data = api.search.search(
    str(sys.argv[1]),
    ordering="mostviewed",
    period="weekly",
)

for vid in data.videos:
    print('{"title": "' + vid.title + '", "url": "' + vid.url + '", "thumb": "' + vid.default_thumb + '"}')
    sys.exit(0)
