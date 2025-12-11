#ifndef SENSORS_H
#define SENSORS_H

#include <OneWire.h>
#include <DallasTemperature.h>
#include <Arduino.h>

class Sensors {
  private:
    // Pins
    byte _temperaturePin;
    byte _tdsPin;
    byte _phPin;
    byte _waterLevelPin;   

    // Temperature sensor lib
    OneWire* _oneWire;
    DallasTemperature* _temperatureSensor;

    // pH variables
    float _phCalibrationValue;
    int _buffer[10];
    int _temp;
    unsigned long _avgval;

    // TDS variables
    int* _analogBuffer;
    int* _analogBufferTemp;
    int _analogBufferIndex;

    int getMedianNum(int bArray[], int filterLen);

  public:
    Sensors(byte temperaturePin, byte tdsPin, byte phPin, byte waterLevelPin, float phCalibrationValue);
    void begin();
    float getFahrenheit();
    float getCelsius();
    float getPH();
    float getTDS(float temperature);
    int getWaterLevelRaw();       
    int getWaterLevelPercent();   
    String getWaterLevelStatus();
};

#endif
