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
