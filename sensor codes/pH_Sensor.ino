// Library Imports
#include "pH_Sensor.h"           // Custom pH Sensor class
#include <Wire.h>                // I2C communication library
#include <Adafruit_GFX.h>        // Core graphics library for OLED
#include <Adafruit_SSD1306.h>    // OLED driver library
#include "config.h"              // Contains PIN numbers, screen size, calibration values

// Create pH sensor object
PHSensor phSensor(PH_PIN, PH_CALIBRATION);       
// OLED object
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);  

void setup() {
  // Initialize Serial Monitor for debugging
  Serial.begin(9600);        

  // Initialize OLED Display
  if (!display.begin(SSD1306_SWITCHCAPVCC, OLED_ADDRESS)) {
    Serial.println("OLED initialization failed!");
    while (1);  // Stop execution if OLED is not detected
  }

  // Initial setup of OLED Display
  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);
  display.setTextSize(1);
  display.setCursor(0, 0);
  display.println("pH Sensor Ready...");
  display.display();
  delay(1500);
}

void loop() {
  // Read pH value from sensor
  float ph = phSensor.getPH();   

  // Serial print the pH value
  Serial.print("pH Value: ");
  Serial.println(ph);

  //Clear OLED Display
  display.clearDisplay();

  //Set text size and cursor 
  display.setTextSize(2);
  display.setCursor(0, 20);

  //Display pH value
  display.print("pH:");       
  display.setCursor(60, 20);

  // Display value with 2 decimal places
  display.print(ph, 2);      
  display.display();

  // Update every 1 second
  delay(1000);                
}
