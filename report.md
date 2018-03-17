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
