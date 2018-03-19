# Lab05

## Part A
a. Based on the readings from the serial monitor, what is the range of the analog values being read? <br />
50 - 1023 <br />
b. How many bits of resolution does the analog to digital converter (ADC) on the Arduino have(hint: where might you look to find this sort of thing)? How many are you using with the range of values you're seeing? <br />
10 bit as it can display up to 1023 <br />

## Part B
1a. Describe the voltage change over the sensing range of the sensor. A sketch of voltage vs. distance would work also. Does it match up with what you expect from the datasheet? <br />

2a. Include your accelerometer read-out code in your write-up. <br />
normal: 351, 350, 427
down Y: 352, 275, 368
up X: 284, 346, 367
up Y: 354,416,350
down X: 424, 345, 356

```c
// these constants describe the pins. They won't change:
const int groundpin = 18;             // analog input pin 4 -- ground
const int powerpin = 19;              // analog input pin 5 -- voltage
const int xpin = A1;                  // x-axis of the accelerometer
const int ypin = A2;                  // y-axis
const int zpin = A3;                  // z-axis (only on 3-axis models)

void setup() {
  // initialize the serial communications:
  Serial.begin(9600);

  // Provide ground and power by using the analog inputs as normal digital pins.
  // This makes it possible to directly connect the breakout board to the
  // Arduino. If you use the normal 5V and GND pins on the Arduino,
  // you can remove these lines.
  pinMode(groundpin, OUTPUT);
  pinMode(powerpin, OUTPUT);
  digitalWrite(groundpin, LOW);
  digitalWrite(powerpin, HIGH);
}

void loop() {
  // print the sensor values:
  Serial.print(analogRead(xpin));
  // print a tab between values:
  Serial.print("\t");
  Serial.print(analogRead(ypin));
  // print a tab between values:
  Serial.print("\t");
  Serial.print(analogRead(zpin));
  Serial.println();
  // delay before next reading:
  delay(100);
}
```

## Part C
The circuit with capacitors can be used to reduce noise. When we turn the rotary encoder, we can see changes in the output. <br />

## Part D
1a. Turn in a copy of your final state diagram. <br />
2a. How many byte-sized data samples can you store on the Atmega328? <br />
1024 as that's when the memory starts to rewrite from the beginning <br />
b. How would you get your analog data from the ADC to be byte-sized? <br />
For the analog inputs we divide them by 4 to translate 0-1023 value to each byte of 0-255 to store in EEPROM. <br />
3. We did not use the Raspberry Pi. <br />
4a. Use the lab camera or your own camera/cell phone to record and upload a short demo video of your logger in action. <br />

```c

#include <EEPROM.h>

int addr = 0;
int address = 0;
byte value;
int sensorPin1 = A0;    // select the input pin for the potentiometer
int sensorPin2 = A1;
int sensorPin3 = A2;
int sensorPin4 = A3;
int sensorPin5 = A4;
int sensorValue1 = 0;  // variable to store the value coming from the sensor
int sensorValue2 = 0;
int sensorValue3 = 0;
int sensorValue4 = 0;
int sensorValue5 = 0;
int LED_01 = 13;
int LED_02 = 12;
int LED_03 = 11;
int LED_04 = 10;
int LED_05 = 9;
int keys[] = {0, 0, 0, 0, 0};

void setup() {
  // declare the ledPin as an OUTPUT:
  Serial.begin(9600);
  pinMode(LED_01, OUTPUT);
  pinMode(LED_02, OUTPUT);
  pinMode(LED_03, OUTPUT);
  pinMode(LED_04, OUTPUT);
  pinMode(LED_05, OUTPUT);
  Serial.println("ready to learn piano?");
}

void loop() {
  Serial.println("try press some keys: ");
  
  // read the value from the sensor:
  sensorValue1 = analogRead(sensorPin1);
  sensorValue2 = analogRead(sensorPin2);
  sensorValue3 = analogRead(sensorPin3);
  sensorValue4 = analogRead(sensorPin4);
  sensorValue5 = analogRead(sensorPin5);

  if (sensorValue1 < 300) {
    keys[0] = 1;
  }
  if (sensorValue2 < 300) {
    keys[1] = 1;
  }
  if (sensorValue3 < 300) {
    keys[2] = 1;
  }
  if (sensorValue4 < 300) {
    keys[3] = 1;
  }
  if (sensorValue5 < 300) {
    keys[4] = 1;
  }
  
  led_on();
  led_off();
  write(sensorValue1);
  write(sensorValue2);
  write(sensorValue3);
  write(sensorValue4);
  write(sensorValue5);

  for (int i = 0; i < 5; i++) {
    read(i);
  }

  clear_keys();
  
  delay(1000);
}

void debug() {
  Serial.print("s1: ");
  Serial.println(sensorValue1);
  Serial.print("s2: ");
  Serial.println(sensorValue2);
  Serial.print("s3: ");
  Serial.println(sensorValue3);
  Serial.print("s4: ");
  Serial.println(sensorValue4);
  Serial.print("s5: ");
  Serial.println(sensorValue5);
}

void clear_keys() {
  for (int i = 0; i < 5; i++) {
    keys[i] = 0;
  }
}

void led_on() {
  int i = 0;
  for (int pin = 13; pin > 8; pin--) {
    if (keys[i] == 1) {
      digitalWrite(pin, HIGH);
    }
    i++;
  }
  delay(1000);
}

void led_off() {
  int i = 0;
  for (int pin = 13; pin > 8; pin--) {
    if (keys[i] == 1) {
      digitalWrite(pin, LOW);
    }
    i++;
  }
  delay(1000);
}

void write(int sensorValue) {
  int val = sensorValue / 4;
  EEPROM.write(addr, val);
  addr = addr + 1;
  if (addr == EEPROM.length()) {
    addr = 0;
  }
}

void read(int key) {
  value = EEPROM.read(address);

  if (value < 100) {
    Serial.print(address);
    Serial.print("\t");
    switch (key) {
      case 0:
        Serial.print("THUMB NOTE C");
        break;
      case 1:
        Serial.print("INDEX NOTE D");
        break;
      case 2:
        Serial.print("MIDDLE NOTE E");
        break;
      case 3:
        Serial.print("RING NOTE F");
        break;
      case 4:
        Serial.print("PINKY NOTE G");
        break;
      default:
        Serial.print("NONE");
    }
    Serial.print("\t");
    Serial.print(value, DEC);
    Serial.println();
  }

  address = address + 1;
  if (address == EEPROM.length()) {
    address = 0;
  }
}
```
