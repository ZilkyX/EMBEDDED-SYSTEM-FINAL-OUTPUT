#ifndef TEMPERATURE_SENSOR_H
#define TEMPERATURE_SENSOR_H

#include <OneWire.h>
#include <DallasTemperature.h>
#include <Arduino.h>

class TemperatureSensor {
  private:
    byte _pin;
    OneWire* _oneWire;
    DallasTemperature* _sensors;

  public:
    TemperatureSensor(byte pin);
    void begin();
    float getFahrenheit();
    float getCelsius();
};

#endif
