import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'src/utils/cors';
import socketIO, { Server } from 'socket.io';
import http from 'http';
import axios from 'axios';

const PORT = process.env.PORT || 5000;
const ALCHEMY_AUTH_KEY = process.env.ALCHEMY_AUTH_KEY;
const WEBHOOK_ID = process.env.WEBHOOK_ID;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!');
});

const io: Server = new socketIO.Server(server);

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
  socket.on('register address', (msg) => {
    //send address to Alchemy to add to notification
    addAddress(msg);
  });
});

async function addAddress(new_address: string) {
  console.log('adding address ' + new_address);
  const body = {
    webhook_id: WEBHOOK_ID,
    addresses_to_add: [new_address],
    addresses_to_remove: [],
  };
  try {
    const response = await axios.patch(
      'https://dashboard.alchemyapi.io/api/update-webhook-addresses',
      body,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Alchemy-Token': ALCHEMY_AUTH_KEY,
        },
      }
    );
    console.log('Successfully added address:', response.data);
  } catch (err) {
    console.error('Error! Unable to add address:', err);
  }
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);

  if (req.method === 'POST' && req.url === '/alchemyhook') {
    notificationReceived(req);
    res.status(200).end();
  } else {
    res.status(404).end();
  }
}

function notificationReceived(req: NextApiRequest) {
  console.log('notification received!');
  io.emit('notification', JSON.stringify(req.body));
}

server.listen(PORT, () => console.log(`Listening on ${PORT}`));

export default handler;