const socket = require('socket.io-client');
const Data = require('../model/data');
const crypto = require('crypto');
const http = require('http');
const server = http.createServer();
const socketIo = require('socket.io');
const io = socketIo(server);
const express = require('express'); 
const router = express.Router();


const socketUrl = 'http://localhost:8080'; 
const socketOptions = { transports: ['websocket'] };

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomItem = (arr) => arr[getRandomInt(0, arr.length - 1)];

const emitterSocket = socket.connect(socketUrl, socketOptions);

emitterSocket.on('connect', () => {
  console.log('Emitter connected to listener');

  setInterval(() => {
    const numMessages = getRandomInt(49, 499);
    const messages = [];

    for (let i = 0; i < numMessages; i++) {
      const name = getRandomItem(Data.names);
      const origin = getRandomItem(Data.locations);
      const destination = getRandomItem(Data.locations);
      const payload = { name, origin, destination };
      const secretKey = crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');
      payload.secret_key = secretKey;
      messages.push(payload);
    }

    emitterSocket.emit('encrypted-data-stream', messages);
  }, 5000); 
});

io.on('connection', (socket) => {
    console.log('Emitter connected:', socket.id);
  
    socket.on('encrypted-data-stream', (dataStream) => {
      for (const payload of dataStream) {
        const { name, origin, destination, secret_key } = payload;
        const computedSecretKey = crypto.createHash('sha256').update(JSON.stringify({ name, origin, destination })).digest('hex');
        
        if (secret_key === computedSecretKey) {
          const newData = new Data({ name, origin, destination, secret_key });
          newData.save();
        } else {
          console.log('Data integrity compromised. Discarding entry:', payload);
        }
      }
    });
  });


router.get('/', (req, res) => res.render('home'));

module.exports = router;