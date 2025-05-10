import RPi.GPIO as GPIO
import time
import board
import neopixel
import os # for camera
import base64

# ORDER: led - sonic - smoke - (button) - camera - cleanup

GPIO.setmode(GPIO.BCM)
r = 16
g = 20
b = 21
trig = 2
echo = 3
fire = 23

## NEOPIXEL
pixel_pin = board.D18 ## CONNECT ONLY GND AND GPIO18
num_pixels = 23
ORDER = neopixel.GRBW
pixels = neopixel.NeoPixel(pixel_pin, num_pixels, brightness=0.2, auto_write=False, pixel_order=ORDER)
## LED
GPIO.setup(r, GPIO.OUT)
GPIO.setup(g, GPIO.OUT)
GPIO.setup(b, GPIO.OUT)
GPIO.output(b, 1)
def red():
    GPIO.output(r, 0)
    GPIO.output(g, 1)
    pixels.fill((255, 0, 0))
def yellow():
    GPIO.output(r, 0)
    GPIO.output(g, 0)
    pixels.fill((255, 200, 0))
def green():
    GPIO.output(r, 1)
    GPIO.output(g, 0)
    pixels.fill((0, 255, 0))
def black():
    GPIO.output(r, 1)
    GPIO.output(g, 1)
    pixels.fill((0, 0, 0))

## SONIC
GPIO.setup(trig, GPIO.OUT)
GPIO.setup(echo, GPIO.IN)
def get_distance():
    GPIO.output(trig, False)
    time.sleep(0.5)
    GPIO.output(trig, True)
    time.sleep(0.00001)
    GPIO.output(trig, False)
    while GPIO.input(echo) == 0:
        pulse_start = time.time()
    while GPIO.input(echo) == 1:
        pulse_end = time.time()
    pulse_duration = pulse_end - pulse_start
    distance = pulse_duration * 17000
    return round(distance)


## SMOKE
GPIO.setup(fire, GPIO.IN, pull_up_down=GPIO.PUD_UP)
def set_smoke_event(cb):
    GPIO.add_event_detect(23, GPIO.FALLING, callback=cb, bouncetime=300)
def fire():
    isFire = 0
    if GPIO.input(fire) == 0: # detected
        isFire = 1
    return isFire

## CAMERA
def takePic(name):
    os.system('libcamera-still --immediate -o %s.jpg --width 300 --height 300'%name)
    with open(name+'.jpg', 'rb') as file:
        return base64.b64encode(file.read()).decode('utf-8')

## CLEANUP
def destroy():
    black()
    GPIO.cleanup()