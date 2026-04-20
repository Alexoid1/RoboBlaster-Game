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
- `src/Js/Player.js` → Lógica del jugador, sistema de corazones, doble salto
- `src/Scenes/GameScene.js` → Gameplay principal, tile world, rampas, UI corazones
- `src/Js/Entity.js` → Clase base para todas las entidades
- `src/Config/config.js` → Configuración Phaser
- `src/Scenes/PreloaderScene.js` → Carga de assets de tiles, corazones, splat.png
- `src/Js/Laser.js` → Proyectiles con splat.png

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
  // Sistema de corazones
  this.maxHearts = 3;
  this.hearts = 3;
  this.isInvulnerable = false;
  // Sistema de doble salto
  this.jumpsAvailable = 2;
  this.jumpForce = -470;
  this.doubleJumpForce = -350;
}
```

### MÉTODOS COMUNES EN ENTITIES
- `damageOrKill(damage)` → Aplica daño, retorna true si muere
- `die()` → Maneja muerte
- `update()` → Lógica por frame (override de Phaser)
- `activateInvulnerability(duration)` → Activa invulnerabilidad con parpadeo
- `updateJumpState(onGround)` → Actualiza estado de saltos
- `tryJump()` → Intenta realizar salto (doble salto)
- `addHeart()` → Añade corazón al jugador

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

// En Player.js (SISTEMA DE CORAZONES)
this.maxHearts = 3;      // Máximo de corazones (3 corazones completos = 6 medios)
this.hearts = 3;         // Corazones actuales
this.isInvulnerable = false; // Estado de invulnerabilidad
this.invulnerabilityTimer = null; // Temporizador de invulnerabilidad
this.alive = true;       // Estado de vida
this.damage = 10;        // Base damage

// Sistema de doble salto
this.jumpsAvailable = 2; // Saltos disponibles (doble salto)
this.jumpForce = -470;   // Fuerza del primer salto
this.doubleJumpForce = -350; // Fuerza del segundo salto (75% del primero)
this.wasOnGround = true; // Para detectar cuando toca el suelo
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
- **Tile assets**: `/home/pablo/Documentos/spreets/kenney_new-platformer-pack-1.1/Sprites/Tiles/Double/`
- **Ramp tiles**: `terrain_stone_ramp_long_a`, `terrain_stone_ramp_long_b`, `terrain_stone_ramp_long_c`
- **Heart system**: `hud_heart`, `hud_heart_half`, `hud_heart_empty`, `heart` (collectible)
- **Projectile**: `splat.png` usado como `redlight` y `splat`

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
7. **Arcade physics solo rectángulos/círculos** → Rampas implementadas con múltiples cuerpos pequeños
8. **Sistema de corazones** → 3 corazones = 6 medios, invulnerabilidad 3 segundos tras daño
9. **Doble salto** → 2 saltos disponibles, segundo salto 75% fuerza del primero
10. **Shooting while running** → Separado de lógica de movimiento en GameScene.js

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
- **Tile system**: `GameScene.js` createTileWorld(), PreloaderScene.js
- **Ramp physics**: `GameScene.js` createRealRamp()
- **Heart system**: `Player.js` damageOrKill(), `GameScene.js` createHeartsUI()
- **Double jump**: `Player.js` tryJump(), `GameScene.js` update() jump logic
- **Shooting**: `Laser.js`, `LaserGroup.js`, `GameScene.js` shooting logic