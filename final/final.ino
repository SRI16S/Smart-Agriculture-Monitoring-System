#include <Wire.h>
#include <BH1750.h>
#include <DHT.h>

// Pin Definitions
#define SOIL_MOISTURE_PIN A0
#define GAS_SENSOR_PIN 2    // Digital
#define PIR_PIN 3           // Digital
#define RAIN_SENSOR_PIN 4   // Digital
#define PUMP_PIN 5          // Digital output
#define BUZZER_PIN 6        // Digital output
#define DHT_PIN 7           // Digital
#define DHTTYPE DHT22

BH1750 lightMeter;
DHT dht(DHT_PIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  
  // Initialize I2C (A4=SDA, A5=SCL)
  Wire.begin();
  lightMeter.begin();
  
  dht.begin();

  // Set pin modes
  pinMode(GAS_SENSOR_PIN, INPUT);
  pinMode(PIR_PIN, INPUT);
  pinMode(RAIN_SENSOR_PIN, INPUT);
  pinMode(PUMP_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);

  digitalWrite(PUMP_PIN, LOW);
  digitalWrite(BUZZER_PIN, LOW);
  
  Serial.println("System initialized");
}

void loop() {
  // 1. Soil Moisture
  int soilValue = analogRead(SOIL_MOISTURE_PIN);
  int soilPercent = map(soilValue, 1023, 300, 0, 100); // Calibrated for typical sensors
  Serial.print("Soil Moisture: ");
  Serial.print(soilPercent);
  Serial.println("%");

  if (soilPercent < 30) {
    digitalWrite(PUMP_PIN, HIGH);
    Serial.println("Pump ON");
  } else if (soilPercent > 80) {
    digitalWrite(PUMP_PIN, LOW);
    Serial.println("Pump OFF");
  }

  // 2. Gas Sensor
  Serial.print("Gas: ");
  Serial.println(digitalRead(GAS_SENSOR_PIN) ? "Clean" : "Detected!");

  // 3. Light Sensor
  Serial.print("Light: ");
  Serial.print(lightMeter.readLightLevel());
  Serial.println(" lux");

  // 4. PIR Sensor
  bool motion = digitalRead(PIR_PIN);
  Serial.print("Motion: ");
  Serial.println(motion ? "Detected" : "None");
  
  if (motion) {
    digitalWrite(BUZZER_PIN, HIGH);
    delay(1000);
    digitalWrite(BUZZER_PIN, LOW);
  }

  // 5. Rain Sensor
  Serial.print("Rain: ");
  Serial.println(digitalRead(RAIN_SENSOR_PIN) ? "Dry" : "Wet");

  // 6. DHT Sensor
  Serial.print("Temp: ");
  Serial.print(dht.readTemperature());
  Serial.print("°C, Hum: ");
  Serial.print(dht.readHumidity());
  Serial.println("%");

  Serial.println("-------------------");
  delay(3000);
}