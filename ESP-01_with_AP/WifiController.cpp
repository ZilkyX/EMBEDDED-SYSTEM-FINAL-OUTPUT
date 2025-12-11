#include "WiFiController.h"

WiFiController::WiFiController() : server(80) {}


// ================= EEPROM Helpers =================
String WiFiController::readStringFromEEPROM(int addr, int maxLen) {
    char buf[maxLen + 1];
    for (int i = 0; i < maxLen; i++) buf[i] = EEPROM.read(addr + i);
    buf[maxLen] = '\0';
    return String(buf);
}

void WiFiController::writeStringToEEPROM(int addr, const String &str, int maxLen) {
    int len = str.length();
    if (len > maxLen) len = maxLen;
    for (int i = 0; i < maxLen; i++) {
        EEPROM.write(addr + i, (i < len) ? str[i] : 0);
    }
    EEPROM.commit();
}



// ================ Start AP Config Mode =================
void WiFiController::startConfigAP() {
    WiFi.softAP("ESP_Config");
    Serial.println("AP Started: ESP_Config");

    server.on("/", [&]() {
        String html = "<h2>WiFi Configuration</h2>"
                      "<form action='/save' method='POST'>"
                      "SSID:<br><input name='ssid'><br>"
                      "Password:<br><input name='pass'><br>"
                      "<input type='submit' value='Save'>"
                      "</form>";
        server.send(200, "text/html", html);
    });

    server.on("/save", [&]() {
        if (server.hasArg("ssid") && server.hasArg("pass")) {
            writeStringToEEPROM(SSID_ADDR, server.arg("ssid"), MAX_LEN);
            writeStringToEEPROM(PASS_ADDR, server.arg("pass"), MAX_LEN);

            server.send(200, "text/html", "<h2>Saved! Reboot ESP.</h2>");
        } else {
            server.send(400, "text/html", "Missing SSID or Password");
        }
    });

    server.begin();
    configMode = true;
}



// ================ Try Connect From EEPROM =================
bool WiFiController::connectWiFiFromEEPROM() {
    EEPROM.begin(EEPROM_SIZE);

    String ssidStored = readStringFromEEPROM(SSID_ADDR, MAX_LEN);
    String passStored = readStringFromEEPROM(PASS_ADDR, MAX_LEN);

    if (ssidStored.length() == 0) return false;

    WiFi.begin(ssidStored.c_str(), passStored.c_str());
    Serial.print("Connecting to WiFi: ");
    Serial.println(ssidStored);

    unsigned long start = millis();
    while (WiFi.status() != WL_CONNECTED && millis() - start < 10000) {
        delay(500);
        Serial.print(".");
    }

    if (WiFi.status() == WL_CONNECTED) {
        Serial.println("\nWiFi Connected!");
        Serial.print("IP: ");
        Serial.println(WiFi.localIP());
        return true;
    }

    Serial.println("\nWiFi Connect Failed!");
    return false;
}



// ================ Commands from Server =================
void WiFiController::handleCommand(const String& command) {
    if (command == "AUTO") {
    Serial.println("AUTO");
    } 
    else if (command == "SLEEP") {
        Serial.println("SLEEP");
    } 
    else if (command == "PING") {
        Serial.println("MAINTENANCE");
    } 
    else if (command == "WATER_ON") {
        Serial.println("WATER_ON");
    } 
    else if (command == "WATER_OFF") {
        Serial.println("WATER_OFF");
    } 
    else if (command == "REFILL_ON") {
        Serial.println("REFILL_ON");
    } 
    else if (command == "REFILL_OFF") {
        Serial.println("REFILL_OFF");
    } 
    else {
        Serial.println("Unknown command: " + command);
    }
}



// ================ WebSocket Event Handler =================
void WiFiController::webSocketEvent(WStype_t type, uint8_t* payload, size_t length) {
  switch (type) {
    case WStype_CONNECTED:
      Serial.println("WS_CONNECTED");
      webSocket.sendTXT("{\"type\":\"identify\",\"client\":\"esp\"}");
      break;

    case WStype_DISCONNECTED:
      Serial.println("WS_DISCONNECTED");
      break;

    case WStype_TEXT: {
      String text = String((char*)payload);

      StaticJsonDocument<256> doc;
      DeserializationError error = deserializeJson(doc, text);
      if (!error) {
        // Handle command from dashboard
        if (doc.containsKey("type") && String(doc["type"]) == "cmd") {
          String command = doc["command"];
          handleCommand(command);
        }
      } else {
        Serial.println("Failed to parse JSON");
      }
    }
    break;

    default:
      break;
  }
}



// ================ POST Logs to Backend =================
void WiFiController::sendLogToServer() {
    if (WiFi.status() != WL_CONNECTED || lastSensorJson.length() == 0) return;

    StaticJsonDocument<256> inDoc;
    deserializeJson(inDoc, lastSensorJson);

    StaticJsonDocument<256> outDoc;
    outDoc["temperature"] = inDoc["tempC"];
    outDoc["ph"] = inDoc["pH"];
    outDoc["tds"] = inDoc["tds"];

    float pH = inDoc["pH"];
    if (pH >= 7.0 && pH <= 8.0) outDoc["status"] = "Good";
    else if (pH > 8.0) outDoc["status"] = "Fair";
    else outDoc["status"] = "Poor";

    String json;
    serializeJson(outDoc, json);

    WiFiClient client;
    HTTPClient http;

    http.begin(client, "http://192.168.100.7:3000/api/saveReading");
    http.addHeader("Content-Type", "application/json");

    int code = http.POST(json);
    Serial.print("POST Response: ");
    Serial.println(code);

    http.end();
}



// ================ Begin (Called in setup) =================
void WiFiController::begin() {
    Serial.begin(9600);

    if (!connectWiFiFromEEPROM()) {
        startConfigAP();
    }

    webSocket.begin("192.168.100.7", 3001, "/");
    webSocket.onEvent(std::bind(&WiFiController::webSocketEvent, this,
                                std::placeholders::_1,
                                std::placeholders::_2,
                                std::placeholders::_3));
    webSocket.setReconnectInterval(5000);
}



// ================ Main Loop =================
void WiFiController::loop() {
    if (configMode) {
        server.handleClient();
        return;
    }

    webSocket.loop();

      // Read Serial input from Arduino
    if (Serial.available()) {
      String msg = Serial.readStringUntil('\n');
      msg.trim();

      if (msg.length() > 0) {

        // Parse JSON sent from Arduino
        StaticJsonDocument<256> doc;

        // If it's the pin maintenance JSON
        if (msg.startsWith("{\"digital\"")) {
          StaticJsonDocument<512> wsDoc;
          wsDoc["type"] = "pims";

          DynamicJsonDocument dataDoc(512);
          deserializeJson(dataDoc, msg);
          wsDoc["data"] = dataDoc.as<JsonObject>();

          char buffer[512];
          size_t n = serializeJson(wsDoc, buffer);
          webSocket.sendTXT(buffer, n);
          return;
        }

        // Otherwise, handle sensor JSON
        DeserializationError error = deserializeJson(doc, msg);
        if (!error) {

          // Save for POST
          lastSensorJson = msg;

          StaticJsonDocument<256> wsDoc;
          wsDoc["type"] = "sensor";
          wsDoc["data"]["temperature"] = doc["tempC"];
          wsDoc["data"]["ph"] = doc["pH"];
          wsDoc["data"]["tds"] = doc["tds"];
          wsDoc["data"]["waterPercent"] = doc["waterPercent"];
          wsDoc["data"]["waterStatus"] = doc["waterStatus"];

          char buffer[256];
          size_t n = serializeJson(wsDoc, buffer);
          webSocket.sendTXT(buffer, n);

        } else {
          Serial.println("Invalid sensor JSON");
        }
      }
    }

    // Interval POST
    unsigned long now = millis();
    if (now - lastPostTime > postInterval) {
        lastPostTime = now;
        sendLogToServer();
    }
}
