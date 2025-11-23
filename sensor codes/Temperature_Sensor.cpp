#include "Temperature_Sensor.h"

TemperatureSensor::TemperatureSensor(byte pin) {
  _pin = pin;
  _oneWire = new OneWire(_pin);
  _sensors = new DallasTemperature(_oneWire);
}

void TemperatureSensor::begin() {
  _sensors->begin();
}

float TemperatureSensor::getFahrenheit() {
  _sensors->requestTemperatures();
  float tempC = _sensors->getTempCByIndex(0);
  float tempF = _sensors->toFahrenheit(tempC);
  return tempF;
}

float TemperatureSensor::getCelsius() {
  _sensors->requestTemperatures();
  float tempC = _sensors->getTempCByIndex(0);
  return tempC;
}
