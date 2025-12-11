#ifndef UTILS_H
#define UTILS_H

#include <Arduino.h>
#include <avr/sleep.h>
#include <avr/interrupt.h>
#include <avr/power.h>
#include <avr/io.h>
#include "Sensors.h"   

class Utils {
  private:
    byte _pumpRelayPin;
    byte _refillRelayPin;

  public:
    Utils(byte pumpRelayPin, byte refillRelayPin);

    void begin();

    void autoMode(Sensors &sensor);

    void pumpOn();
    void pumpOff();

    void refillOn();
    void refillOff();

    void goToSleep(); 

    void disableUnusedPins();
    void printAllPins();

};


#endif
