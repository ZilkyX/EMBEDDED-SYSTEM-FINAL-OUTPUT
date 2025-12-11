#include "Sensors.h"

static const float VREF = 5.0;
static const int SCOUNT = 30;

Sensors::Sensors(byte temperaturePin, byte tdsPin, byte phPin, byte waterLevelPin,float phCalibrationValue) {
  _temperaturePin = temperaturePin;
  _tdsPin = tdsPin;
  _phPin = phPin;
  _waterLevelPin = waterLevelPin;

  _phCalibrationValue = phCalibrationValue;

  _oneWire = new OneWire(_temperaturePin);
  _temperatureSensor = new DallasTemperature(_oneWire);

  _analogBuffer = new int[SCOUNT];
  _analogBufferTemp = new int[SCOUNT];
  _analogBufferIndex = 0;
}

void Sensors::begin() {
  _temperatureSensor->begin();
  pinMode(_tdsPin, INPUT);
  pinMode(_waterLevelPin, INPUT); 

}

// Temperature Sensor

float Sensors::getFahrenheit() {
  _temperatureSensor->requestTemperatures();
  float tempC = _temperatureSensor->getTempCByIndex(0);
  return _temperatureSensor->toFahrenheit(tempC);
}

float Sensors::getCelsius() {
  _temperatureSensor->requestTemperatures();
  return _temperatureSensor->getTempCByIndex(0);
}

//pH level Sensor

float Sensors::getPH() {
  for(int i = 0; i < 10; i++) {
    _buffer[i] = analogRead(_phPin);
    delay(30);
  }

  for(int i = 0; i < 9; i++) {
    for(int j = i + 1; j < 10; j++) {
      if(_buffer[i] > _buffer[j]) {
        int temp = _buffer[i];
        _buffer[i] = _buffer[j];
        _buffer[j] = temp;
      }
    }
  }

  _avgval = 0;
  for(int i = 2; i < 8; i++) {
    _avgval += _buffer[i];
  }

  float volt = (float)_avgval * VREF / 1024.0 / 6.0;

  return -5.70 * volt + _phCalibrationValue;
}

// TDS Sensor

int Sensors::getMedianNum(int bArray[], int filterLen) {
  int bTab[filterLen];

  for (int i = 0; i < filterLen; i++)
    bTab[i] = bArray[i];

  for (int j = 0; j < filterLen - 1; j++) {
    for (int i = 0; i < filterLen - j - 1; i++) {
      if (bTab[i] > bTab[i + 1]) {
        int temp = bTab[i];
        bTab[i] = bTab[i + 1];
        bTab[i + 1] = temp;
      }
    }
  }

  if (filterLen & 1)
    return bTab[(filterLen - 1) / 2];
  else
    return (bTab[filterLen / 2] + bTab[filterLen / 2 - 1]) / 2;
}

float Sensors::getTDS(float temperature) {
  static unsigned long analogSampleTime = millis();
  
  if (millis() - analogSampleTime > 40U) {
    analogSampleTime = millis();
    _analogBuffer[_analogBufferIndex] = analogRead(_tdsPin);

    _analogBufferIndex++;
    if (_analogBufferIndex == SCOUNT)
      _analogBufferIndex = 0;
  }

  static float tdsValue = 0;
  static unsigned long calcTime = millis();

  if (millis() - calcTime > 800U) {
    calcTime = millis();

    for (int i = 0; i < SCOUNT; i++)
      _analogBufferTemp[i] = _analogBuffer[i];

    float averageVoltage = getMedianNum(_analogBufferTemp, SCOUNT) * VREF / 1024.0;

    float compensationCoefficient = 1.0 + 0.02 * (temperature - 25.0);
    float compensationVoltage = averageVoltage / compensationCoefficient;

    tdsValue =
      (133.42 * pow(compensationVoltage,3)
      - 255.86 * pow(compensationVoltage,2)
      + 857.39 * compensationVoltage) * 0.5;
  }

  return tdsValue;
}

//Water Level Sensor

int Sensors::getWaterLevelRaw() {
  return analogRead(_waterLevelPin);
}

int Sensors::getWaterLevelPercent() {
  int raw = analogRead(_waterLevelPin);
  return map(raw, 0, 1023, 0, 100);
}

String Sensors::getWaterLevelStatus() {
  int percent = getWaterLevelPercent();

  if (percent < 20) return "LOW";
  if (percent < 70) return "MEDIUM";
  return "HIGH";
}