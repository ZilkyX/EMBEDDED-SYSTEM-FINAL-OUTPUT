#include "Utils.h"
#include "Sensors.h"

Utils::Utils(byte pumpRelayPin, byte refillRelayPin) {
  _pumpRelayPin = pumpRelayPin;
  _refillRelayPin = refillRelayPin;
}

void Utils::begin() {
  pinMode(_pumpRelayPin, OUTPUT);
  pinMode(_refillRelayPin, OUTPUT);
  pinMode(2, INPUT_PULLUP);

  digitalWrite(_pumpRelayPin, HIGH);    
  digitalWrite(_refillRelayPin, HIGH); 

  disableUnusedPins();
}


void Utils::disableUnusedPins() {
  power_spi_disable();

  for (byte pin = 0; pin <= 13; pin++) {
    if (pin == 2 || pin == 4 || pin == 6 || pin == 7) continue;
    if (pin >= 10 && pin <= 13) continue;
    pinMode(pin, INPUT);   
  }

  byte analogPins[] = {A0, A1, A2, A3, A4, A5};
  for (byte i = 0; i < 6; i++) {
    byte pin = analogPins[i];
    if (pin == A0 || pin == A1 || pin == A3 || pin == A5 || pin == A4) continue;
    pinMode(pin, INPUT);  
  }

}

void wakeUp() {
}

void Utils::goToSleep() {
  set_sleep_mode(SLEEP_MODE_PWR_DOWN);

  sleep_enable();

  attachInterrupt(digitalPinToInterrupt(2), wakeUp, LOW);

  sleep_mode();   

  detachInterrupt(digitalPinToInterrupt(2));
  sleep_disable();
}


// MAIN READING GETTER
void Utils::autoMode(Sensors &sensor){
    float tempC = sensor.getCelsius();
    float ph = sensor.getPH();
    float tds = sensor.getTDS(tempC);

    int waterPercent = sensor.getWaterLevelPercent();
    String waterStatus = sensor.getWaterLevelStatus();

    Serial.print("{");
    Serial.print("\"tempC\":"); Serial.print(tempC); Serial.print(",");
    Serial.print("\"pH\":"); Serial.print(ph); Serial.print(",");
    Serial.print("\"tds\":"); Serial.print(tds); Serial.print(",");
    Serial.print("\"waterPercent\":"); Serial.print(waterPercent); Serial.print(",");
    Serial.print("\"waterStatus\":\""); Serial.print(waterStatus); Serial.print("\"");
    Serial.println("}");
}

void Utils::printAllPins() {

  Serial.print("{");

  // ---- DIGITAL PINS JSON ----
  Serial.print("\"digital\":{");
  for (byte pin = 0; pin <= 13; pin++) {
    pinMode(pin, INPUT_PULLUP);
    int state = digitalRead(pin);

    Serial.print("\"D");
    Serial.print(pin);
    Serial.print("\":\"");
    Serial.print(state == HIGH ? "HIGH" : "LOW");
    Serial.print("\"");

    if (pin < 13) Serial.print(",");
  }
  Serial.print("},");

  // ---- ANALOG PINS JSON ----
  Serial.print("\"analog\":{");
  for (byte a = 0; a < 6; a++) {
    int value = analogRead(A0 + a);

    Serial.print("\"A");
    Serial.print(a);
    Serial.print("\":");
    Serial.print(value);

    if (a < 5) Serial.print(",");
  }
  Serial.print("}");

  Serial.print("}");
  Serial.println();  
}



void Utils::pumpOn() {
  digitalWrite(_pumpRelayPin, LOW);   
}

void Utils::pumpOff() {
  digitalWrite(_pumpRelayPin, HIGH);  
}


void Utils::refillOn() {
  digitalWrite(_refillRelayPin, LOW);
}

void Utils::refillOff() {
  digitalWrite(_refillRelayPin, HIGH); 
}
