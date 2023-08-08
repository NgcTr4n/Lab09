#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ArduinoJson.h>
#define DHTTYPE DHT11
#include "DHT.h"
#define DHTPIN 2
DHT dht(DHTPIN, DHTTYPE);

const char *SSID = "FPT";
const char *PASSWORD = "0985559059";
const char *URL = "http://192.168.1.12/api/addSensorData";

ESP8266WiFiMulti WiFiMulti;
WiFiClient client;
HTTPClient http;

void setup() {
  Serial.begin(115200);
  Serial.setDebugOutput(true);

  for (uint8_t t = 4; t > 0; t--) {
    Serial.printf("[SETUP] WAIT %d...\n", t);
    delay(1000);
  }

  WiFi.mode(WIFI_STA);
  WiFiMulti.addAP(SSID, PASSWORD);

  while (WiFiMulti.run() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void postJsonData() {
  if (WiFiMulti.run() == WL_CONNECTED) {
    if (http.begin(client, URL)) {
      const int capacity = JSON_OBJECT_SIZE(5);
      StaticJsonDocument<capacity> doc;
      
      dht.begin();
      float h = dht.readHumidity();
      float t = dht.readTemperature();
      
      doc["id"] = "ZwKejsxWzrJfVXcOlywJ";
      doc["temperature"] = "23"; // Use the actual temperature value here
      doc["humid"] = "34"; // Use the actual humidity value here
      doc["time"] = "2021-06-07";
      doc["farmid"] = "3";
      
      char output[512]; // Adjust the size if necessary
      serializeJson(doc, output);
     
      http.addHeader("Content-Type", "application/json");
      int httpCode = http.POST(output);

      if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_MOVED_PERMANENTLY) {
        String payload = http.getString();
        
        DynamicJsonDocument docResponse(2048);
        DeserializationError err = deserializeJson(docResponse, payload);
        if (err) {
          Serial.print(F("deserializeJson() failed with code "));
          Serial.println(err.c_str());
        } else {
          const char *name = docResponse["name"];
          Serial.print("Name: ");
          Serial.println(name);
        }
      } else {
        Serial.printf("[HTTP] POST... failed, error: %s\n", http.errorToString(httpCode).c_str());
      }

      http.end();
    }
  }
}

void loop() {
  postJsonData();
  delay(10000);
}
