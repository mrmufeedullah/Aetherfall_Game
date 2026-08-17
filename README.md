# Aetherfall 🎮

A browser-based 3D adventure game built with **Three.js**. Climb ruined platforms, collect glowing shards, and reach the portal — solo or with friends over WebSockets.

## Features
- Procedural terrain, platforms, trees, rocks — no external assets
- Physics-based movement: gravity, jumping, sprinting, platform climbing
- Desktop (WASD + mouse) and mobile (touch joystick + swipe-look) controls
- Dynamic lighting, shadows, fog, glowing collectibles
- Optional real-time multiplayer via WebSockets

## Play Solo
Just open `aetherfall.html` in any modern browser. No build step, no install.

## Play Multiplayer
```bash
npm install ws
node server.js
```
Then open `aetherfall.html` in two or more browser tabs/devices, choose **Connect & Play**, and point them at `ws://localhost:8080` (or your server's LAN IP / host).

## Controls
| Action | Desktop | Mobile |
|---|---|---|
| Move | WASD | Left joystick |
| Look | Mouse | Swipe right side |
| Jump | Space | Jump button |
| Sprint | Shift | — |

## Files
- `aetherfall.html` — the game (client + rendering + input + multiplayer client)
- `server.js` — minimal WebSocket relay server for multiplayer

## Tech
Three.js (r128), vanilla JS, WebGL, WebSockets. No frameworks, no build tools.

## License
MIT — do whatever you want with it.
