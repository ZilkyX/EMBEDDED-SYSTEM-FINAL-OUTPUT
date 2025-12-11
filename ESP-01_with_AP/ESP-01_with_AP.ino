#include "WiFiController.h"

WiFiController controller;

void setup() {
  controller.begin();
}

void loop() {
  controller.loop();
}
