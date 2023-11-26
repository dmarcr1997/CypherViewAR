void setup() {
  Serial.begin(9600);
}

void loop() {
  if (Serial.available() > 0) {
      // Read data from the serial port
      String data = Serial.readStringUntil('\n');

      // Check if the data is a request for the Hedera address
      if (data == "getHederaAddress") {
        // Get the Hedera address from the Arduino
        String hederaAddress = getHederaAddress();

        // Send the Hedera address to the React webapp
        Serial.println(hederaAddress);
    }
  }
}

String getHederaAddress() {
  // Implement your logic to get the Hedera address from the Arduino
  // This could be reading from a sensor or retrieving it from memory
  return "0.0.141988";
}