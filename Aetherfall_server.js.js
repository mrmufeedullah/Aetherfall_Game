// Aetherfall multiplayer relay server
// -----------------------------------
// Minimal WebSocket server that broadcasts each player's position/rotation
// to every other connected player. Pair with aetherfall.html.
//
// Setup:
//   npm init -y
//   npm install ws
//   node server.js
//
// Then in the game's start screen, use "Connect & Play" with:
//   ws://localhost:8080          (same machine)
//   ws://<your-lan-ip>:8080      (other devices on your network)

const WebSocket = require('ws');

const PORT = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: PORT });

// id -> { ws, lastState }
const players = new Map();

function broadcast(data, exceptWs) {
  const payload = JSON.stringify(data);
  for (const { ws } of players.values()) {
    if (ws !== exceptWs && ws.readyState === WebSocket.OPEN) {
      ws.send(payload);
    }
  }
}

wss.on('connection', (ws) => {
  let myId = null;

  ws.on('message', (raw) => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }

    if (msg.type === 'join') {
      myId = msg.id;
      players.set(myId, { ws, lastState: null });

      // send the new player the current state of everyone else
      for (const [id, p] of players) {
        if (id !== myId && p.lastState) {
          ws.send(JSON.stringify({ type: 'update', id, ...p.lastState }));
        }
      }
      console.log(`[+] ${myId} joined (${players.size} online)`);
    }

    if (msg.type === 'update' && myId) {
      const state = { x: msg.x, y: msg.y, z: msg.z, yaw: msg.yaw, color: msg.color };
      const entry = players.get(myId);
      if (entry) entry.lastState = state;
      broadcast({ type: 'update', id: myId, ...state }, ws);
    }

    if (msg.type === 'leave' && myId) {
      players.delete(myId);
      broadcast({ type: 'leave', id: myId });
      console.log(`[-] ${myId} left (${players.size} online)`);
    }
  });

  ws.on('close', () => {
    if (myId) {
      players.delete(myId);
      broadcast({ type: 'leave', id: myId });
      console.log(`[-] ${myId} disconnected (${players.size} online)`);
    }
  });
});

console.log(`Aetherfall relay server listening on ws://localhost:${PORT}`);