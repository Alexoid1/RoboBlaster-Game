# AI CONTEXT - RoboBlaster Game
# Para uso exclusivo del asistente de IA

## PROYECTO: Juego de plataformas Phaser 3 (MegaMan-style)
**Tipo**: Videojuego educativo/capstone assessment
**Estado**: En desarrollo - añadiendo enemigo SkullFire
**Live URL**: https://robo-blaster-game.netlify.app/

## ESTRUCTURA CLAVE (quick reference)

### PUNTO DE ENTRADA
- `src/index.js` → Clase Game extiende Phaser.Game
- `window.game = new Game()` → Instancia global
- `this.globals = { model, bgMusic: null }` → Estado global

### CONFIGURACIÓN PHASER
- `src/Config/config.js` → type: Phaser.AUTO, 1000x730, physics: arcade
- NO gravity por defecto (y: 0), debug: true

### JERARQUÍA DE CLASES
```
Entity (base class - Phaser.Physics.Arcade.Sprite)
├── Player (hp: 3 corazones, daño: 10, doble salto, paralizable)
├── ChaserDude (enemigo que persigue en X)
├── JumperDude (enemigo que salta)
└── SkullFire (NUEVO - enemigo que flota verticalmente y paraliza)

Game extends Phaser.Game
└── 8 Scenes (Boot, Preloader, Menu, Game, GameOver, etc.)

Componentes:
- Bullet (proyectiles con textura 'bullet')
- Slash/SlashGroup (ataques melee)
- HeartPickup (corazones recolectables)
- Sound (audio management)
- Button (UI)
```

### ESCENAS (8 total)
1. BootScene → PreloaderScene → MenuScene
2. MenuScene → GameScene (main gameplay)
3. GameScene → GameOverScene (on death)
4. Side scenes: LeaderBoardScene, CreditsScene, OptionsScene

### ARCHIVOS CRÍTICOS PARA MODIFICAR
- `src/Js/Player.js` → Lógica del jugador, sistema de corazones, doble salto, paralización (`isParalyzed`)
- `src/Scenes/GameScene.js` → Gameplay principal, tile world, rampas, UI corazones, enemigos, colisiones
- `src/Js/Entity.js` → Clase base para todas las entidades
- `src/Config/config.js` → Configuración Phaser
- `src/Scenes/PreloaderScene.js` → Carga de assets (fire-skull atlas, tiles, corazones, bullet)
- `src/Js/SkullFire.js` → NUEVO enemigo flotante con paralización
- `src/Js/Bullet.js` → Proyectiles del jugador
- `src/Js/HeartPickup.js` → Corazones recolectables

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
  this.setGravityY(520);
  this.setCollideWorldBounds(true);
  // Player-specific
  this.maxHearts = 3;
  this.hearts = 3;
  this.isInvulnerable = false;
  this.isParalyzed = false;
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
Entity.js          # Base class (Phaser.Physics.Arcade.Sprite)
Player.js          # Main player (extends Entity)
ChaserDude.js      # Chasing enemy (extends Entity)
JumperDude.js      # Jumping enemy (extends Entity)
SkullFire.js       # NEW - Floating enemy, paralyzes player (extends Entity)
FireSkullEnemy.js  # Alternate version (not used currently)
Bullet.js          # Projectile class
HeartPickup.js     # Collectible heart item
Slash.js           # Melee attack sprite
SlashGroup.js      # Melee attack group
Sound.js           # Audio management
Button.js          # UI buttons
```

### src/Scenes/ (game states)
```
BootScene.js       # Initialization
PreloaderScene.js  # Asset loading (fire-skull atlas, tiles, hearts, bullet, etc.)
MenuScene.js       # Main menu
GameScene.js       # Main gameplay (tile world, ramps, enemies, hearts UI, collisions)
GameOverScene.js   # Game over screen (score submission form)
LeaderBoardScene.js# Score leaderboard (API)
CreditsScene.js    # Credits (scrolling text)
OptionsScene.js    # Game options (music/sound toggles)
```

### UTILITIES
```
src/Tools/api.js           # API calls (leaderboard CRUD)
src/Tools/dom.js           # DOM manipulation (form for score submission)
src/Tools/localStorage.js  # Local storage wrapper (save/load score)
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
  "phaser": "^4.0.0"
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
this.maxHearts = 3;      // Máximo de corazones (3 completos = 6 medios)
this.hearts = 3;         // Corazones actuales
this.isInvulnerable = false;
this.invulnerabilityTimer = null;
this.alive = true;
this.damage = 10;
this.isParalyzed = false; // Estado de paralización (SkullFire)

// Sistema de doble salto
this.jumpsAvailable = 2;
this.jumpForce = -470;
this.doubleJumpForce = -350;
this.wasOnGround = true;

// En GameScene.js
this.monsters = [];       // Array de ChaserDude
this.monsters2 = [];      // Array de JumperDude
this.skullFire = [];      // Array de SkullFire
this.allMonsters = [];    // Concatenación de todos los enemigos
this.bullets = group;     // Phaser group para balas
this.heartsGroup = group; // Phaser group para corazones recolectables
```

## PHYSICS CONFIGURATION
- Arcade physics (no gravity default)
- Player: `setGravityY(520)` → Custom gravity
- `setCollideWorldBounds(true)` → No salir de pantalla
- Body size: 177x210 (Player), scaled 0.5
- ChaserDude/JumperDude: gravity 800, scale 3, body 28x47
- SkullFire: gravity 0 (flota), scale 2, body 40x40

## EVENTOS Y COLISIONES
- Phaser built-in collision system (physics.add.collider/overlap)
- `this.allMonsters` (array) usado en overlaps con player, balas, y slash
- Groups para manejo de múltiples entidades
- Scene events para transiciones

## ASSETS Y MEDIA
- Directorio `src/assets/` para sprites y UI
- Sonidos manejados por clase `Sound`
- PreloaderScene carga todos los assets
- **Tile assets**: `/home/pablo/Documentos/spreets/kenney_new-platformer-pack-1.1/Sprites/Tiles/Double/`
- **Ramp tiles**: `terrain_stone_ramp_long_a`, `terrain_stone_ramp_long_b`, `terrain_stone_ramp_long_c`
- **Heart system**: `hud_heart`, `hud_heart_half`, `hud_heart_empty`, `heart` (collectible)
- **SkullFire**: `fire-skull.png` + `fire-skull.json` (atlas, frames: sprite1-sprite8)
- **Bullet**: `bullet6.png`
- **Player animations**: `stand`, `walk`, `jump`, `dash`, `slash`, `attackD`, `blast` (spritesheets)

## ENEMIGO SKULLFIRE (NUEVO)

### Características
- Flota verticalmente (sin gravedad) usando aceleración Y
- Rango de detección: 780px del jugador
- Persigue al jugador cuando está cerca
- HP: 1300, Daño: 50
- **Paraliza al jugador** por 3 segundos al contacto (tinte azul, controles congelados)
- Animación: `skullFly` (frames sprite1-sprite8 del atlas fireSkull)

### Código clave en SkullFire.js
```javascript
// Constructor
this.setFrame('sprite1');  // Frame inicial del atlas
this.setScale(2);
this.body.setSize(40, 40);
this.setGravityY(0);
this.hp = 1300;
this.damage = 50;
this.startY = config.y;  // Posición Y inicial para flotación
this.floatSpeed = 60;

// Update
this.play('skullFly', true);  // Animación continua
// Flotación cíclica con moveC()
// Persecución y flip con flipSkull()
```

### Pendiente de implementar en GameScene.js
- Overlap de SkullFire con el jugador → llamar a `paralyzePlayer()`
- Wrapping de controles en `if (!this.player.isParalyzed)`

## COMMON TASKS & LOCATIONS

### Añadir nuevo enemigo
1. Crear clase en `src/Js/` que extienda `Entity`
2. Cargar asset en `PreloaderScene.js`
3. Crear animación en `GameScene.js` `create()`
4. Instanciar en `GameScene.js` con función creadora
5. Añadir colisiones/overlaps

### Modificar jugador
- `src/Js/Player.js` → Stats, movimiento, habilidades, `isParalyzed`
- `src/Scenes/GameScene.js` → Input handling, game logic, wrapping de controles

### Añadir nueva escena
1. Crear archivo en `src/Scenes/`
2. Importar en `src/index.js`
3. Añadir a `this.scene.add()`
4. Configurar transiciones desde otras escenas

### Modificar UI
- `src/Js/Button.js` → Botones reutilizables
- Cada Scene tiene sus propios elementos UI
- DOM manipulation en `src/Tools/dom.js`

## GOTCHAS Y NOTAS TÉCNICAS

1. **NO gravity por defecto** → Player tiene gravity personalizada (520), enemigos terrestres 800
2. **Entity es clase base** → Usa `setTexture(config.texture)`, funciona con atlas pero necesita `setFrame()` para frame inicial
3. **window.game es global** → Acceder desde cualquier lugar
4. **Scene management** → Phaser maneja transiciones automáticas
5. **Audio via Sound class** → No usar Phaser audio directamente
6. **Testing requiere mocks** → Canvas y assets mockeados
7. **Arcade physics solo rectángulos/círculos** → Rampas implementadas con múltiples cuerpos pequeños
8. **Sistema de corazones** → 3 corazones = 6 medios, invulnerabilidad 3 segundos tras daño
9. **Doble salto** → 2 saltos disponibles, segundo salto 75% fuerza del primero
10. **Shooting while running** → Separado de lógica de movimiento en GameScene.js
11. **Phaser 4** → El proyecto usa phaser ^4.0.0 (no 3.x)
12. **allMonsters es array** → Se usa directamente en `physics.add.overlap()`, Phaser lo acepta
13. **SkullFire invisible sin setFrame** → Los sprites de atlas necesitan `setFrame('sprite1')` para ser visibles
14. **`this.body.y` vs `this.y`** → Para sprites con física, usar `this.body.y` para mover en Y
15. **update() sin parámetros** → Si `update()` se define sin parámetros, `time` será `undefined`

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
- **Graphics**: `src/assets/` directory, Scene preload methods
- **Audio**: `Sound.js`, Scene create methods
- **UI**: `Button.js`, Scene create methods
- **Game flow**: Scene transition methods
- **Physics**: `config.js`, Entity constructors
- **Tile system**: `GameScene.js` createTileWorld(), PreloaderScene.js
- **Ramp physics**: `GameScene.js` createRealRamp()
- **Heart system**: `Player.js` damageOrKill(), `GameScene.js` createHeartsUI()
- **Double jump**: `Player.js` tryJump(), `GameScene.js` update() jump logic
- **Shooting**: `Bullet.js`, `GameScene.js` shooting logic
- **SkullFire enemy**: `SkullFire.js` (clase), `GameScene.js` (spawn, overlaps, paralización)
- **Leaderboard API**: `src/Tools/api.js`, `src/Tools/dom.js`, `LeaderBoardScene.js`
