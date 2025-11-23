#ifndef PH_H
#define PH_H

#include <Arduino.h>

class PHSensor {
  public:
    PHSensor(byte pin, float calibrationValue = 22.34);
    float getPH();

  private:
    byte _pin;
    float _calibrationValue;
    int _buffer[10];
    int _temp;
    unsigned long _avgval;
};

#endif
