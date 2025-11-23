#include "Tds_Sensor.h"

TDSSensor::TDSSensor(byte pin, float vref, int scount) {
  _pin = pin;
  _vref = vref;
  _scount = scount;
  _analogBuffer = new int[_scount];
  _analogBufferTemp = new int[_scount];
  _analogBufferIndex = 0;
}

void TDSSensor::begin() {
  pinMode(_pin, INPUT);
}

int TDSSensor::getMedianNum(int bArray[], int filterLen) {
  int bTab[filterLen];
  for (int i = 0; i < filterLen; i++)
    bTab[i] = bArray[i];
  int i, j, bTemp;
  for (j = 0; j < filterLen - 1; j++) {
    for (i = 0; i < filterLen - j - 1; i++) {
      if (bTab[i] > bTab[i + 1]) {
        bTemp = bTab[i];
        bTab[i] = bTab[i + 1];
        bTab[i + 1] = bTemp;
      }
    }
  }
  if ((filterLen & 1) > 0) {
    bTemp = bTab[(filterLen - 1) / 2];
  } else {
    bTemp = (bTab[filterLen / 2] + bTab[filterLen / 2 - 1]) / 2;
  }
  return bTemp;
}

float TDSSensor::getTDS(float temperature) {
  static unsigned long analogSampleTime = millis();
  if (millis() - analogSampleTime > 40U) {
    analogSampleTime = millis();
    _analogBuffer[_analogBufferIndex] = analogRead(_pin);
    _analogBufferIndex++;
    if (_analogBufferIndex == _scount) _analogBufferIndex = 0;
  }

  static float tdsValue = 0;
  static unsigned long printTime = millis();
  if (millis() - printTime > 800U) {
    printTime = millis();

    for (int i = 0; i < _scount; i++) {
      _analogBufferTemp[i] = _analogBuffer[i];
    }

    float averageVoltage = getMedianNum(_analogBufferTemp, _scount) * _vref / 1024.0;

    float compensationCoefficient = 1.0 + 0.02 * (temperature - 25.0);
    float compensationVoltage = averageVoltage / compensationCoefficient;

    tdsValue = (133.42 * compensationVoltage * compensationVoltage * compensationVoltage
                - 255.86 * compensationVoltage * compensationVoltage
                + 857.39 * compensationVoltage) * 0.5;
  }

  return tdsValue;
}
