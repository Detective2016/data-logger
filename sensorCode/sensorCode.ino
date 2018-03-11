#define SENSORPIN A0

unsigned long targetTime=0;
const unsigned long intervall=60000;
void setup(){
Serial.begin(115200);
}


void loop(){
	if(millis()>=targetTime){
		Serial.println(analogRead(SENSORPIN));
		targetTime= millis()+intervall;
	}
}
