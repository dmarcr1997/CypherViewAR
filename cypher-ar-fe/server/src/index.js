const express = require('express');
const cors = require('cors');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const app = express();
app.use(cors({
  origin: 'http://localhost:3001' // Replace with your React app's origin
}));
const port = process.env.PORT || 3000; // Use port 3000 by default
const serialPort = new SerialPort({
    path: 'COM12', 
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false });
const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\r\n' }));
let dataBuffer = '';

const getAddressData = () => {
    return new Promise((resolve, reject) => {
        sendToSerial('getHederaAddress'); // Send 'getAddress' to the serial port

        parser.once('data', (data) => {
            dataBuffer += data;
            resolve(dataBuffer); // Resolve the promise with the received data
        });

        parser.once('error', (error) => {
            reject(error); // Reject the promise with the error
        });
    });
};

function sendToSerial(data) {
    console.log("sending to serial: " + data);
    serialPort.write(data);
}

app.get('/getHederaAddress', async (req, res) => {
    const data = await getAddressData();
    dataBuffer = '';
    res.send({address: data});
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
