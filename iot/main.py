import time
import json
import paho.mqtt.client as mqtt
from sensors import *
import threading

broker = 'test.mosquitto.org'
bin_id = 'SB0005'

def on_connect(client, userdata, flags, rc):
	print('Connected:', client.is_connected)
	client.subscribe('TrashPhoto/PC')
def on_message(client, userdata, message):
    msg = message.payload.decode('utf-8')
    print(msg)
    msg = json.loads(msg)
    img = takePic('monitor')
    data = {'bin_id': bin_id,'img': img}
    mqtt.publish('TrashPhoto/RP', json.dumps(data))
    time.sleep(3)

mqtt = mqtt.Client()
mqtt.on_connect = on_connect
mqtt.on_message = on_message
mqtt.connect(broker, 1883) 
mqtt.loop_start()

height = 50  # height of trash bin
global l; l = 1   # for photo name
global f; f = 1
term = 2 #60*2    # term of detecting amount
black()

## Event Thread
def fire_con(x):
    global f
    data = {'bin_id': bin_id, 'fire': True}
    while 1:
        fire_img = takePic('load')
        data['fire_img'] = fire_img
        data['fire_img_name'] = f'/{bin_id}_fire_{f}.jpg'; f+=1
        mqtt.publish('TrashTrackr/RP', json.dumps(data))
        data = {'bin_id': bin_id}
        time.sleep(3)
        if not fire(): break
set_smoke_event(fire_con)

## Main Thread
def main_thread():
    global l
    while 1:
        dist = get_distance() - 10
        if dist > height:   amount = 0
        elif dist < 0:      amount = 100
        else:               amount = (height-dist)*100//height
        print(f'dist: {dist}, amount: {amount}%')
        data = {'bin_id': bin_id,'amount': amount}
        if amount >= 90:
            load_img = takePic('load')
            data['load_img'] = load_img
            data['load_img_name'] = f'/{bin_id}_load_{l}.jpg'; l+=1
        mqtt.publish('TrashTrackr/RP', json.dumps(data))
        if amount < 40: green()
        elif amount < 80: yellow()
        else: red()
        time.sleep(term) # 2 min

# main thread start
main_thread = threading.Thread(target=main_thread)
main_thread.start()

try:
    main_thread.join()  # wait for end of main thread

except KeyboardInterrupt:
    destroy()
    mqtt.loop_stop()
