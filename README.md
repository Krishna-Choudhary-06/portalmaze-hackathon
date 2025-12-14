# 🌀 PortalMaze — Teleportation-Based Maze Puzzle Game

PortalMaze is a single-player, grid-based maze puzzle game built for the PCON HackSphere 48-Hour Hackathon.  
The player must navigate from START to GOAL using strategic movement, teleportation portals, and limited wall-breaking abilities, while competing against internally computed optimal paths.

## 🎮 Game Concept
The core challenge of PortalMaze lies in:
- Strategic navigation in a grid-based maze
- Optional teleportation using color-paired portals
- Smart decision-making on when (or whether) to break walls

The game supports two independent modes, each with its own scoring and optimal path validation.

## 🚀 Live Demo
Live Game: [(add your link here) ](https://portalmaze-hackathon.vercel.app/) 
Demo Video: ([add your video link here](https://youtu.be/wLYBfEJ7YW0))

## 🧩 Game Modes
No-Wall-Break Mode:
- Wall breaking is completely disabled
- Solve the maze using movement and portals only

Wall-Break Mode:
- Break at most K walls
- Broken walls become walkable paths

## 🗺️ Maze Elements
S → Start  
G → Goal  
# → Wall  
. → Empty Path  
Colored Cells → Teleport Portals  

## 🎮 Controls
Move → W / A / S / D or Arrow Keys  
Teleport → ENTER  
Break Wall → SHIFT + Direction Key  

## 🧠 Internal Path Analysis
The game internally computes:
- Shortest path without wall breaks (BFS)
- Shortest path with up to K wall breaks (Multi-state BFS)

Optimal paths are used only for scoring and validation.

## 🏆 Scoring
Player steps are compared against the optimal path length.  
Completion time is used as a tie-breaker.

## 🛠️ Tech Stack
HTML, CSS, JavaScript  
Browser localStorage for persistence  
Deployed via Replit / Netlify  

## ⚙️ Setup
1. Clone the repository
2. Open index.html in a browser

## 👤 Author
Krishna Kumar Choudhary 
PCON HackSphere Hackathon 2024

