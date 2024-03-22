export const a1 = `
import time
import RPi.GPIO as gpio

gpio.setwarnings(False)
gpio.setmode(gpio.BCM)
led1 = 3

gpio.setup(led1,gpio.OUT,initial=gpio.LOW)
try:
    while(True):
        gpio.output(led1, gpio.LOW)
        time.sleep(1)
        gpio.output(led1, gpio.HIGH)
        time.sleep(2)
except KeyboardInterrupt:
    gpio.output(led1, gpio.LOW)
    gpio.cleanup()
`;

const a02 = `
import time
import RPi.GPIO as gpio
gpio.setwarnings(False)
gpio.setmode(gpio.BOARD)

led1 = 15 
switch1= 23 

gpio.setup(led1,gpio.OUT,initial=0)
gpio.setup(switch1,gpio.IN)

def glow_led(event):
    if event == switch1 :
        gpio.output(led1, True)
        time.sleep(0.2)
        gpio.output(led1, False)
        gpio.add_event_detect(switch1, gpio.RISING , callback = glow_led, bouncetime = 1)


try:
    while(True):
        time.sleep(1)
except KeyboardInterrupt:

    gpio.cleanup()
`;

const a2 = `
import time
import Adafruit_DHT
from datetime import datetime


def send_dht():
    sensor=Adafruit_DHT.DHT11
    gpio=4
    humidity,temperature=Adafruit_DHT.read_retry(sensor,gpio)
    if humidity is not None and temperature is not None:
        print('Temp={0:0.1f}*C Humidity={1:0.1f}%'.format(temperature, humidity))
    else:
        print('Failed to get reading. Try again')
        time.sleep(2)


while(True):
    send_dht()

`;

const a3 = `
import time
import Adafruit_DHT
from datetime import datetime 
import serial

s=serial.Serial("/dev/rfcomm0",9600,timeout=1)

def send_bluetooth_dht():
    sensor=Adafruit_DHT.DHT11
    gpio=4
    humidity,temperature=Adafruit_DHT.read_retry(sensor,gpio)

    if humidity is not None and temperature is not None:
        print('Temp={0:0.1f}*C Humidity={1:0.1f}%'.format(temperature, humidity))
    else:
        print('Failed to get reading. Try again')
        time.sleep(2)
        
    time=datetime.now().strftime('%H:%M:%S')

    if humidity !=None or temperature !=None:
        s.write("Temperature at {} is {}\n".format(time,temperature).encode('ascii'))
        s.write("Humidity at {} is {}\n".format(time,humidity).encode('ascii'))
        print('Humidity={} ; Temperature = {} '.format(humidity,temperature))
    else:
        s.write('Unable to read from sensor at time {}\n'.format(time).encode('ascii'))
        print('Unable to red from sensor at time {}'.format(time))

commands=('dht','')

try:
    while True:
        inp=s.readline().decode('utf8').strip().lower()
        print(inp)
        if inp in commands:
            if inp=='dht':
                send_bluetooth_dht()
        else:
            print('Invalid command word')
            s.write('Invalid command word\n'.encode('ascii'))
        time.sleep(2)
except KeyboardInterrupt:
    pass


`;

const a5 = `

import time
import RPi.GPIO as gpio

gpio.setwarnings(False)
gpio.setmode(gpio.BCM) 

led1 = 3 

import serial
s=serial.Serial("/dev/rfcomm0",9600,timeout=1)
gpio.setup(led1,gpio.OUT,initial=gpio.LOW)

commands=('1','0','')

try:
    while True:
        inp=s.readline().decode('utf8').strip().lower()
        print(inp)
        if inp in commands:
            if inp == '1':
                gpio.output(led1, gpio.HIGH)
                print("LED ON")
                time.sleep(1)
            elif inp == '0':
                gpio.output(led1, gpio.LOW)
                print("LED OFF")
            else:
                print("invalid ")
        else:
            print('Invalid command word')
            s.write('Invalid command word\n'.encode('ascii'))
            time.sleep(2)

except KeyboardInterrupt:
    pass



`;

const a6 = `
import urllib.request
import time
WRITE_API_KEY = "F7O2WL6BYU6QJ891" # Substitute this string with yours
baseurl = f"https://api.thingspeak.com/update?api_key={WRITE_API_KEY}"
import Adafruit_DHT

sensor=Adafruit_DHT.DHT11

gpio=4

humidity, temperature = Adafruit_DHT.read_retry(sensor, gpio)

if humidity is not None and temperature is not None:
    print('Temp={0:0.1f}*C Humidity={1:0.1f}%'.format(temperature, humidity))
else:
    print('Failed to get reading. Try again!')
    time.sleep(2)

try:
    f = urllib.request.urlopen(baseurl + f'&field1={temperature}&field2={humidity}')
    f.close()
    print(f'Humidity = {humidity}%')
    print(f'Temperature = {temperature}\u00B0C')
    print("Uploaded to Thingspeak Successfully")
except:
    print('Not successful in uploading to Thingspeak.com...Exiting..')
else: 
    print("Sensor reading error Occured")

`;

const a7 = `
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

url = f"http://api.thingspeak.com/channels/{CHANNEL_ID}/feeds/last.json?api_key=
{READ_API_KEY}"
connection = request.urlopen(url)
response = connection.read()
data = json.loads(response)
temperature = data['field1']
humidity = data['field2']
timeStamp = data['created_at']

print(timeStamp)
ts = datetime.fromisoformat(timeStamp[:-1]).astimezone()
Date, Time = datetime_from_utc_to_local(ts)

print(f'Date: {Date}\nTime: {Time}\nTemperature: \{temperature}\u00B0C\nHumidity: {humidity}%')

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

`;

const a9 = `

import paho.mqtt.client as mqtt
import Adafruit_DHT
import time
from datetime import datetime

sensor=Adafruit_DHT.DHT11
gpio=4
h,t=Adafruit_DHT.read_retry(sensor, gpio)
print(h,t)

timenow=datetime.now().strftime("%H:%M:%S")

message=f"Temperature: {t}, humidity: {h} @ {timenow}"

client = mqtt.Client()
client.connect("test.mosquitto.org",1883,60)
client.publish("hello_mqtt", message)
client.disconnect()


`;

const a11 = `
from flask import Flask, render_template
import Adafruit_DHT

app = Flask(__name__)

DHT_SENSOR = Adafruit_DHT.DHT11
DHT_PIN = 4 
@app.route('/')

def index():
    humidity, temperature = Adafruit_DHT.read_retry(DHT_SENSOR, DHT_PIN)
    if humidity is not None and temperature is not None:
        return render_template('index.html', temperature=temperature, humidity=humidity)
    else:
        return "Failed to retrieve data from the DHT sensor"
    
if __name__ == '__main__':
    app.run(debug=True, host='172.20.10.5')

`;

const a12 = `
import paho.mqtt.client as mqtt
import paho.mqtt.client as mqtt

# This is the Subscriber
def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))
    client.subscribe("hello_mqtt")

def on_message(client, userdata, msg):
    print(msg.payload.decode())
    client.disconnect()

client = mqtt.Client()

client.connect("test.mosquitto.org",1883,60)
client.on_connect = on_connect
client.on_message = on_message
client.loop_forever()

`;



const programList = [a1, a02, a3,a5,a6,a7,a9,a11,a12]
