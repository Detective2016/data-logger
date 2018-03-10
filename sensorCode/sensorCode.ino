#define SENSORPIN A0

unsigned long targetTime=0;
const unsigned long intervall=5;
void setup(){
Serial.begin(9600);
}


void loop(){
	if(millis()>=targetTime){
		Serial.println(analogRead(SENSORPIN));
		targetTime= millis()+intervall;
	}
}
