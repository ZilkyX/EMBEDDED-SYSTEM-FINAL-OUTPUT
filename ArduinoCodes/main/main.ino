#include "config.h"

void setup() {
  Serial.begin(9600);
  sensor.begin();
  utils.begin();
}

void loop() {

  unsigned long curr = millis();

  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\n');
    cmd.trim();

    if      (cmd == "AUTO")   mode = AUTO;
    else if (cmd == "SLEEP")  mode = SLEEP;
    else if (cmd == "MAINTENANCE") utils.printAllPins();
    else if (cmd == "REFILL_ON")  utils.refillOn();
    else if (cmd == "REFILL_OFF") utils.refillOff();
    else if (cmd == "PUMP_ON")  utils.pumpOn();
    else if (cmd == "PUMP_OFF")  utils.pumpOff();
  }

  if(curr - prev >= interval){
    prev = curr;
    
    switch (mode) {

    case AUTO:
      Serial.println("AUTO MODE");
      utils.autoMode(sensor);
      break;

    case SLEEP:
      Serial.println("SLEEP MODE");
      utils.pumpOff();
      utils.refillOff();
      utils.goToSleep();
      break;

    }

  }

}


