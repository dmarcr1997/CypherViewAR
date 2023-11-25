const express = require('express');
const SerialPort = require('serialport');

const app = express();
const port = process.env.PORT || 3000; // Use port 3000 by default
const serialPort = new SerialPort('COM8', { baudRate: 9600 });

let address = '';

serialPort.on('data', (data) => {
  address = data.toString().trim(); // Extract the address value from the received data
});

app.post('/getHederaAddress', (req, res) => {
    serialPort.write('getHederaAddress'); // Send 'getHederaAddress' to the serial port

    serialPort.on('data', (data) => {
        // Handle the response from the Arduino
        const address = data.toString().trim();
        res.send({ address });
    });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
