#ifndef TDS_H
#define TDS_H

#include <Arduino.h>

class TDSSensor {
  public:
    TDSSensor(byte pin, float vref = 5.0, int scount = 30);
    void begin();
    float getTDS(float temperature = 25.0);

  private:
    int getMedianNum(int bArray[], int filterLen);
    byte _pin;
    float _vref;
    int _scount;
    int* _analogBuffer;
    int* _analogBufferTemp;
    int _analogBufferIndex;
};

#endif
