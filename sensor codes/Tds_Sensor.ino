
#include "Tds_Sensor.h"
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include "config.h"

TDSSensor tds(TDS_PIN);
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

void setup() {
  Serial.begin(115200);

  // Initialize TDS Sensor
  tds.begin();
  Serial.println("TDS Meter Initialized...");

  // Initialize OLED
  if (!display.begin(SSD1306_SWITCHCAPVCC, OLED_ADDRESS)) {
    Serial.println("OLED initialization failed!");
    while (1);
  }

  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 0);
  display.println("TDS Meter Ready...");
  display.display();
  delay(1500);
}

void loop() {
  float tdsValue = tds.getTDS(25.0); // Temperature set to 25°C by default
  
  // Serial Output
  Serial.print("TDS Value: ");
  Serial.print(tdsValue, 0);
  Serial.println(" ppm");

  // OLED Display Output
  display.clearDisplay();
  display.setTextSize(2);
  display.setCursor(0, 10);
  display.print("TDS:");
  display.setCursor(50, 10);
  display.print(tdsValue, 0);
  display.print("ppm");

  display.display();

  delay(100);
}
