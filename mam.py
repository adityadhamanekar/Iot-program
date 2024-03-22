
import json
from gpiozero import Buzzer
import time
from urllib import request
from datetime import datetime

bz=Buzzer(20)

def datetime_from_utc_to_local(utc_datetime):
    now_timestamp = time.time()
    offset = datetime.fromtimestamp(now_timestamp) - datetime.utcfromtimestamp(now_timestamp)
    dt = utc_datetime + offset
    date1 = dt.strftime('%d-%m-%Y')
    time1 = dt.strftime('%H:%M:%S')
    return(date1,time1)

READ_API_KEY='NLB6NHHBZ7QL5HXV' # Modify READ_API_KEY
CHANNEL_ID='2431265'

url = f"http://api.thingspeak.com/channels/{CHANNEL_ID}/feeds/last.json?api_key={READ_API_KEY}"
connection = request.urlopen(url)
response = connection.read()
data = json.loads(response)
temperature = data['field1']
humidity = data['field2']
timeStamp = data['created_at']

print(timeStamp)
ts = datetime.fromisoformat(timeStamp[:-1]).astimezone()
Date, Time = datetime_from_utc_to_local(ts)

print(f'Date: {Date} Time: {Time}  Temperature: {temperature}°C  Humidity: {humidity}%')

if eval(temperature) < 20:
    bz.beep(n=1)
elif eval(temperature) < 30:
    bz.beep(n=5)
elif eval(temperature) < 40:
    bz.beep(n=3)
else: 
    bz.beep(n=4)
    time.sleep(8)
    
bz.close()

