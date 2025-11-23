#include "pH_Sensor.h"

// Constructor: Initialize pH sensor with pin and calibration value
PHSensor::PHSensor(byte pin, float calibrationValue) {
  _pin = pin;
  _calibrationValue = calibrationValue;
}

float PHSensor::getPH() {
  // Read ADC multiple times
  for(int i = 0; i < 10; i++) {
    _buffer[i] = analogRead(_pin);
    delay(30);
  }

  // Sort readings
  for(int i = 0; i < 9; i++) {
    for(int j = i + 1; j < 10; j++) {
      if(_buffer[i] > _buffer[j]) {
        _temp = _buffer[i];
        _buffer[i] = _buffer[j];
        _buffer[j] = _temp;
      }
    }
  }

  // Average middle values
  _avgval = 0;
  for(int i = 2; i < 8; i++) {
    _avgval += _buffer[i];
  }

  // Convert to voltage
  float volt = (float)_avgval * 5.0 / 1024.0 / 6.0;

  // Convert to pH value
  float phValue = -5.70 * volt + _calibrationValue;
  return phValue;
}
