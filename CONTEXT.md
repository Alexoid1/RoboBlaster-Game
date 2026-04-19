# AI CONTEXT - RoboBlaster Game
# Para uso exclusivo del asistente de IA

## PROYECTO: Juego de plataformas Phaser 3 (MegaMan-style)
**Tipo**: Videojuego educativo/capstone assessment
**Estado**: Completado, funcional
**Live URL**: https://robo-blaster-game.netlify.app/

## ESTRUCTURA CLAVE (quick reference)

### PUNTO DE ENTRADA
- `src/index.js` → Clase Game extiende Phaser.Game
- `window.game = new Game()` → Instancia global
- `this.globals = { model, bgMusic: null }` → Estado global

### CONFIGURACIÓN PHASER
- `src/Config/config.js` → type: Phaser.AUTO, 1000x630, physics: arcade
- NO gravity por defecto (y: 0), debug: false

### JERARQUÍA DE CLASES
```
Entity (base class)
├── Player (hp: 1000, damage: 10)
├── ChaserDude (enemy)
└── JumperDude (enemy)

Game extends Phaser.Game
└── 8 Scenes (Boot, Preloader, Menu, Game, GameOver, etc.)

Componentes:
- Laser/LaserGroup (disparos)
- Slash/SlashGroup (ataques melee)
- Sound (audio management)
- Button (UI)
```

### ESCENAS (8 total)
1. BootScene → PreloaderScene → MenuScene
2. MenuScene → GameScene (main gameplay)
3. GameScene → GameOverScene (on death)
4. Side scenes: LeaderBoardScene, CreditsScene, OptionsScene

### ARCHIVOS CRÍTICOS PARA MODIFICAR
- `src/Js/Player.js` → Lógica del jugador, HP, daño
- `src/Scenes/GameScene.js` → Gameplay principal
- `src/Js/Entity.js` → Clase base para todas las entidades
- `src/Config/config.js` → Configuración Phaser

## PATRONES DE CÓDIGO DETECTADOS

### IMPORT/EXPORT
```javascript
// Todos usan ES6 modules
import Phaser from 'phaser';
import Entity from './Entity';
export default class Player extends Entity
```

### CONSTRUCTORES TÍPICOS
```javascript
constructor(config) {
  super({ ...config, texture: 'stand' });
  this.body.setSize(160, 200);
  this.setScale(0.5);
  // Player-specific
  this.hp = 1000;
  this.damage = 10;
}
```

### MÉTODOS COMUNES EN ENTITIES
- `damageOrKill(damage)` → Aplica daño, retorna true si muere
- `die()` → Maneja muerte
- `update()` → Lógica por frame (override de Phaser)

### CONVENCIONES DE NOMBRES
- Clases: PascalCase (Player, GameScene, ChaserDude)
- Métodos: camelCase (damageOrKill, update)
- Variables: camelCase (bgMusic, touchDamage)
- Archivos: PascalCase para clases, camelCase para utilidades

## SISTEMA DE ARCHIVOS RELEVANTE

### src/Js/ (core game logic)
```
Entity.js          # Base class for all game entities
Player.js          # Main player (extends Entity)
ChaserDude.js      # Chasing enemy
JumperDude.js      # Jumping enemy  
Laser.js           # Projectile class
LaserGroup.js      # Projectile group management
Slash.js           # Melee attack
SlashGroup.js      # Melee attack group
Sound.js           # Audio management
Button.js          # UI buttons
```

### src/Scenes/ (game states)
```
BootScene.js       # Initialization
PreloaderScene.js  # Asset loading
MenuScene.js       # Main menu
GameScene.js       # Main gameplay
GameOverScene.js   # Game over screen
LeaderBoardScene.js# Score leaderboard
CreditsScene.js    # Credits
OptionsScene.js    # Game options
```

### UTILITIES
```
src/Js/api.js           # API calls (leaderboard)
src/Js/dom.js          # DOM manipulation
src/Js/localStorage.js # Local storage wrapper
```

## DEPENDENCIAS Y BUILD

### package.json highlights
```json
"scripts": {
  "test": "jest",
  "build": "webpack --config webpack/prod.js",
  "start": "webpack-dev-server --config webpack/base.js --open"
},
"dependencies": {
  "phaser": "^3.24.1"
}
```

### Webpack configs
- `webpack/base.js` → Desarrollo
- `webpack/prod.js` → Producción

### Testing setup
- Jest con `jest-canvas-mock`
- Mocks para assets (.gif, .png, etc.)
- `test/mocks/fileMock.js`

## VARIABLES DE ESTADO GLOBAL
```javascript
// En src/index.js
this.globals = {
  model: new Sound(),    // Audio state
  bgMusic: null          // Current background music
};

// En Player.js
this.hp = 1000;          // Health points
this.touch = false;      // Damage cooldown flag
this.alive = true;       // Life state
this.damage = 10;        // Base damage
```

## PHYSICS CONFIGURATION
- Arcade physics (no gravity default)
- Player: `setGravityY(520)` → Custom gravity
- `setCollideWorldBounds(true)` → No salir de pantalla
- Body size: 160x200 (Player), scaled 0.5

## EVENTOS Y COLISIONES
- Phaser built-in collision system
- Groups para manejo de múltiples entidades
- Scene events para transiciones

## ASSETS Y MEDIA
- Directorio `images/` para sprites y UI
- Sonidos manejados por clase `Sound`
- PreloaderScene carga todos los assets

## COMMON TASKS & LOCATIONS

### Añadir nuevo enemigo
1. Crear clase en `src/Js/` que extienda `Entity`
2. Añadir a `GameScene.js` en `create()` method
3. Configurar física y comportamiento en `update()`

### Modificar jugador
- `src/Js/Player.js` → Stats, movimiento, habilidades
- `src/Scenes/GameScene.js` → Input handling, game logic

### Añadir nueva escena
1. Crear archivo en `src/Scenes/`
2. Importar en `src/index.js`
3. Añadir a `this.scene.add()`
4. Configurar transiciones desde otras escenas

### Modificar UI
- `src/Js/Button.js` → Botones reutilizables
- Cada Scene tiene sus propios elementos UI
- DOM manipulation en `src/Js/dom.js`

## GOTCHAS Y NOTAS TÉCNICAS

1. **NO gravity por defecto** → Player tiene gravity personalizada (520)
2. **Entity es clase abstracta** → Todas las entidades la extienden
3. **window.game es global** → Acceder desde cualquier lugar
4. **Scene management** → Phaser maneja transiciones automáticas
5. **Audio via Sound class** → No usar Phaser audio directamente
6. **Testing requiere mocks** → Canvas y assets mockeados

## QUICK COMMANDS
```bash
# Ver estado actual
git status
npm run test

# Desarrollo
npm start          # http://localhost:8080

# Build
npm run build      # Output en dist/

# Ver estructura
find src -name "*.js" | grep -v node_modules
```

## CONTACT POINTS FOR MODIFICATIONS
- **Game balance**: `Player.js` (hp, damage), enemy classes
- **Graphics**: `images/` directory, Scene preload methods
- **Audio**: `Sound.js`, Scene create methods
- **UI**: `Button.js`, Scene create methods
- **Game flow**: Scene transition methods
- **Physics**: `config.js`, Entity constructors