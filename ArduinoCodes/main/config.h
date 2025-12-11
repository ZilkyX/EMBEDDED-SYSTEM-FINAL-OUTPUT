#ifndef CONFIG_H
#define CONFIG_H

// Sensor Pins
#define TEMP_PIN 4        
#define TDS_PIN A0       
#define PH_PIN A1           
#define WATER_PIN A3    

// Actuator Pins
#define PUMP_RELAY 7
#define REFILL_RELAY 8

float PH_CALIBRATION = 21.78;  

#include "Sensors.h"
#include "Utils.h"

Sensors sensor(TEMP_PIN, TDS_PIN, PH_PIN, WATER_PIN, PH_CALIBRATION);
Utils utils(PUMP_RELAY, REFILL_RELAY);

enum { AUTO, SLEEP, MAINTENANCE };
int mode = AUTO;

unsigned long int interval = 1000;
unsigned long int prev = 0;

#endif
