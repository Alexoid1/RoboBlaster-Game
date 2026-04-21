/* eslint-disable no-unused-expressions */
import * as Phaser from 'phaser';
import JumperDude from '../Js/JumperDude';
import ChaserDude from '../Js/ChaserDude';
import Player from '../Js/Player';
import SlashGroup from '../Js/SlashGroup';
import Bullet from '../Js/Bullet';
import HeartPickup from '../Js/HeartPickup';
import LocalStorage from '../Tools/localStorage';

// Variables globales para controles y estado del juego
let cursors;
const speedX = 385;          // Velocidad horizontal del jugador
let gameOver = false;        // Estado de fin de juego
let blast;                   // Referencia al efecto de blast
let timer = true;            // Temporizador para habilidades
let timerSlash = true;       // Temporizador para ataque slash

/**
 * Crea un fondo repetitivo de bosque
 * @param {Phaser.Scene} scene - Escena donde se creará el fondo
 * @param {number} count - Número de repeticiones
 * @param {string} texture - Textura a usar
 * @param {number} scrollFactor - Factor de desplazamiento (parallax)
 */
const backgroundCreatorForest1 = (scene, count, texture, scrollFactor) => {
  let x = 0;

  for (let i = 0; i < count; i += 1) {
    const m = scene.add.image(x, scene.scale.height, texture)
      .setScale(1.3)
      .setScrollFactor(scrollFactor);
    x += m.width;
  }
};

/**
 * Escena principal del juego donde ocurre toda la acción
 * Maneja al jugador, enemigos, física, puntuación y colisiones
 */
export default class GameScene extends Phaser.Scene {
  teclaE;
  constructor() {
    super('Game');
    // Variables de instancia      // Grupo de láseres/proyectiles
    this.monsters;
    this.monsters2;
    this.allMonsters;          // Array de enemigos
    this.monster;           // Referencia temporal a enemigo
    this.chaser;            // Referencia a enemigo perseguidor
    this.heathText;         // Texto de salud en UI
    this.scoreText;         // Texto de puntuación en UI
    this.score;             // Puntuación actual
    this.model;             // Modelo de sonido/configuración
    this.platformNumber;    // Número de plataformas
    this.particles;         // Sistema de partículas
    this.emitter;           // Emisor de partículas
    this.heartsGroup; 
    this.bullets;      // Grupo de corazones recolectables
  }

  /**
   * Crea el sistema de partículas para efectos visuales
   */
  createParticles() {
    this.particles = this.add.particles('redlight', {
      x: 100,
      y: 150,
      speed: 200,
      lifespan: 500,
      blendMode: 'ADD',
      scale: { start: 1, end: 0 },
      active: false,
    });
    this.emitter = this.particles;
  }

  /**
   * Método create de Phaser - Se ejecuta una vez al iniciar la escena
   * Configura el mundo del juego, jugador, enemigos, física y UI
   */
  create() {
    // Configuración de sonido - Música apagada por el momento
    this.model = this.sys.game.globals.model;
     //if (this.model.musicOn === true && this.model.bgMusicPlaying === false) {
      //this.bgMusic = this.sound.add('bgMusic', { volume: 0.3, loop: true });
      // this.bgMusic.play();
      // this.model.bgMusicPlaying = true;
      // this.sys.game.globals.bgMusic = this.bgMusic;
     //}
    // Comentado para apagar música temporalmente
    
    // Inicialización de variables
    this.platformNumber = 3;  // Número de plataformas en el nivel
    this.score = 0;            // Puntuación inicial

    let groundX = 39240;
   

    const groundY = 589;
    const platforms = this.physics.add.staticGroup();

    const backgroundCreatorGround = (count, texture) => {
      for (let j = 0; j < count; j += 1) {
        const g = platforms.create(groundX, groundY, texture).setScale(2).refreshBody();
        const { body } = g;
        body.updateFromGameObject();
        groundX += 4240;
      }
    };
    const { width } = this.scale;
    const { height } = this.scale;

    this.add.image(width * 0.5, height * 0.5, 'moon').setScale(0.6, 0.6).setScrollFactor(0);
    this.add.image(0, height, 'clouds').setScale(0.5, 0.5).setOrigin(0, 1.2).setScrollFactor(0);
    backgroundCreatorForest1(this, 20, 'forest1', 0.25);
    backgroundCreatorForest1(this, 15, 'forest2', 0.35);
    backgroundCreatorForest1(this, 10, 'forest3', 0.50);
    backgroundCreatorGround(this.platformNumber, 'ground');
    
    // Crear plataformas flotantes adicionales para saltos usando textura 'platform'
    this.createFloatingPlatforms = () => {
      // Crear un grupo separado para plataformas flotantes
      this.floatingPlatforms = this.physics.add.staticGroup();
      
     
      const platform4 = this.floatingPlatforms.create(16680, groundY - 400, 'terrain_stone_block').setScale(0.5).refreshBody();
      platform4.body.updateFromGameObject();

      const platform5 = this.floatingPlatforms.create(16950, -100, 'terrain_stone_block').setScale(0.5).refreshBody();
      platform5.body.updateFromGameObject();

      const platform6 = this.floatingPlatforms.create(17350, -289, 'terrain_stone_block').setScale(0.5).refreshBody();
      platform6.body.updateFromGameObject();

      const platform7 = this.floatingPlatforms.create(17580, -450, 'terrain_stone_block').setScale(0.5).refreshBody();
      platform7.body.updateFromGameObject();

      const platform8 = this.floatingPlatforms.create(17350, -650, 'terrain_stone_block').setScale(0.5).refreshBody();
      platform8.body.updateFromGameObject();

      const platform9 = this.floatingPlatforms.create(18000, -790, 'terrain_stone_block').setScale(0.5).refreshBody();
      platform9.body.updateFromGameObject();


    };
    
      this.createFloatingPlatforms();
      
      // Crear rampa real en x=500 (múltiples cuerpos pequeños)
      this.createRealRamp = () => {
        // Grupo para la rampa
        this.realRampGroup = this.physics.add.staticGroup();
        
        const rampX = 1984;
        const rampY = 680; // 100px arriba del suelo
        const stepWidth = 8;  // Ancho de cada paso
        const stepHeight = 8;  // Alto de cada paso
        const steps = 32;       // Número de pasos (64px total / 8px por paso)
        
        // Crear sprite visual de rampa (opcional, para apariencia)
        this.add.sprite(rampX , rampY - 85, 'terrain_stone_ramp_long_b')
          .setScale(1)
          .setFlipX(true);
        this.add.sprite(rampX+110 , rampY - 77, 'terrain_stone_ramp_long_a')
          .setScale(1)
          .setFlipX(true);
        this.add.sprite(rampX+237 , rampY - 77, 'terrain_stone_ramp_long_c')
          .setScale(1)
          .setFlipX(true);  // Voltear para que suba de izq a der
        
        // Crear múltiples cuerpos pequeños en escalera
        for (let i = 0; i < steps; i++) {
          const stepX = rampX + (i * stepWidth);
          const stepY = rampY - (i * (stepHeight / 2)); // Pendiente suave
          
          // Crear cuerpo de colisión (invisible)
          const step = this.realRampGroup.create(stepX, stepY, null)
            .setVisible(false) // Ocultar sprite
            .setSize(stepWidth, stepHeight)
            .refreshBody();
          
          step.body.updateFromGameObject();
        }
        
        
      
        
        // Añadir colisiones
        this.physics.add.collider(this.realRampGroup, this.player);
        
        // También para enemigos (si existen)
        if (this.monsters && this.monsters.length > 0) {
          this.monsters.forEach(monster => {
            this.physics.add.collider(monster, this.realRampGroup);
          });
        }
      
      };
      
      // La rampa se creará después del jugador
     
     
      
      // Crear plataforma en x=200 usando matriz
      this.createMatrixPlatform = () => {
        // Matriz para la plataforma (1 = tile, 0 = vacío)
        // Esta matriz crea una plataforma de 7 tiles de ancho
        const platformMatrix = [
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,14,15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,14,2,2,15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,14,2,2,2,2,15],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,14,2,15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,14,2,2,2,2,15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          // Fila superior con rampa (11 = ramp_long_a, 12 = ramp_long_b, 13 = ramp_long_c)
          [3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,5,5,5,5,5,5,5,5,5,5,5,5,7,0,0,0,0,0,0,0,3,1,1,4,0,0,0,0,0,0,3,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3],
          // Fila media
          [6,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,7,0,0,0,0,0,0,0,6,5,5,7,0,0,0,0,0,0,6,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,7],
          // Fila inferior
          [9,0]
        ];

        const platformZone = [
          [0,0,16,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,16,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,16,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,16,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,16,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,16,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,14,2,2,2,15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,14,15,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,16,0,0,0,0,0,14,2,2,2,15],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,16,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,16,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,16,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,16,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,16,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,16,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,16,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,16,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,16,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,16,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,14,2,2,2,15],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,14,2,2,2,15,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

        ]
        
        // Mapeo de números a texturas de tiles
        const tileTextures = {
          0: null, // Vacío8,8,8
          1: 'terrain_stone_block_top', // Tile superior de piedra
          2: 'terrain_stone_horizontal_middle', // Tile medio
          3: 'terrain_stone_block_top_left', // Esquina izquierda
          4: 'terrain_stone_block_top_right', // Esquina derecha
          5: 'terrain_stone_block_center', // Esquina derecha
          6: 'terrain_stone_block_left',
          7: 'terrain_stone_block_right', // Esquina derecha 
          8: 'terrain_stone_block_bottom',
          9: 'terrain_stone_block_bottom_left',
          10: 'terrain_stone_block_bottom_right',
          11: 'terrain_stone_ramp_long_a',
          12: 'terrain_stone_ramp_long_b',
          13: 'terrain_stone_ramp_long_c',
          14: 'terrain_stone_horizontal_left',
          15: 'terrain_stone_horizontal_right',
          16: 'terrain_stone_block'

        };
        
        // Crear grupo para la plataforma
        this.matrixPlatform = this.physics.add.staticGroup();
        
        const startX = 0; // Posición X inicial
        const startY = groundY - 150; // 150px arriba del suelo
        const tileSize = 64; // Tamaño aproximado de los tiles
        
        // Recorrer la matriz y crear tiles
        for (let row = 0; row < platformMatrix.length; row++) {
          for (let col = 0; col < platformMatrix[row].length; col++) {
            const tileType = platformMatrix[row][col];
            
            if (tileType !== 0 && tileTextures[tileType]) {
              // Calcular posición basada en matriz
              const x = startX + (col * tileSize);
              const y = startY + (row * tileSize);
              
               // Determinar qué textura usar basado en la posición
               let texture = tileTextures[tileType];
               
               // Crear el tile
               const tile = this.matrixPlatform.create(x, y, texture)
                 .setScale(0.5);
               
                // Manejo especial para rampas
                if (tileType === 2 || tileType === 14 || tileType===15) { // Usa un número que no estés usando
                  tile.body.checkCollision.up = true;
                  tile.body.checkCollision.down = false;
                  tile.body.checkCollision.left = false;
                  tile.body.checkCollision.right = false;
                }
             
               
              
               
               tile.refreshBody();
               tile.body.updateFromGameObject();
            }
          }
        }

        

        const zoneX = 18900; // Posición X inicial
        const zoneY = -1860; // 150px arriba del suelo

        for (let row = 0; row < platformZone.length; row++) {
          for (let col = 0; col < platformZone[row].length; col++) {
            const tileType = platformZone[row][col];
            
            if (tileType !== 0 && tileTextures[tileType]) {
              // Calcular posición basada en matriz
              const a = zoneX + (col * tileSize);
              const b = zoneY + (row * tileSize);
              
               // Determinar qué textura usar basado en la posición
               let texture = tileTextures[tileType];
               
               // Crear el tile
               const tile = this.matrixPlatform.create(a, b, texture)
                 .setScale(0.5);
               
                // Manejo especial para rampas
                if (tileType === 16) { // Usa un número que no estés usando
                  tile.body.checkCollision.up = true;
                  tile.body.checkCollision.down = false;
                  tile.body.checkCollision.left = false;
                  tile.body.checkCollision.right = false;
                }
             
               
              
               
               tile.refreshBody();
               tile.body.updateFromGameObject();
            }
          }
        }
        
       
        
        // Añadir una segunda plataforma más arriba (usando matriz diferente)
        const floatingPlatformMatrix = [
          [3,1,1,1,1,1,1,1,1,1,4],
          [5,5,5,5,5,5,5,5,5,5,5],
          [0,0,0,0,0],
        ];
        
        const floatingStartX = 2284;
        const floatingStartY = 572;
        
        for (let row = 0; row < floatingPlatformMatrix.length; row++) {
          for (let col = 0; col < floatingPlatformMatrix[row].length; col++) {
            const tileType = floatingPlatformMatrix[row][col];
            
            if (tileType !== 0 && tileTextures[tileType]) {
              const x = floatingStartX + (col * tileSize);
              const y = floatingStartY + (row * tileSize);
              
              let texture = tileTextures[tileType];
              
              const tile = this.matrixPlatform.create(x, y, texture)
                .setScale(0.5)
                .refreshBody();
              
              tile.body.updateFromGameObject();
            }
          }
        }
      };
      
      this.createMatrixPlatform();
      
      this.scoreText = this.add.text(26, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' }).setScrollFactor(0);
      this.positionXText = this.add.text(26, 96, 'X: 0', { fontSize: '32px', fill: '#fff' }).setScrollFactor(0);
      this.positionYText = this.add.text(26, 136, 'Y: 0', { fontSize: '32px', fill: '#fff' }).setScrollFactor(0);
    
    // Sistema de corazones
    this.heartsContainer = this.add.container(26, 70); // Cambiado de 56 a 70 para bajar los corazones
    this.heartsSprites = [];
    
    /**
     * Crea la UI de corazones basada en la vida del jugador
     */
    this.createHeartsUI = () => {
      // Limpiar corazones existentes
      this.heartsSprites.forEach(heart => heart.destroy());
      this.heartsSprites = [];
      
      const heartSize = 15; // Reducido de 32
      const heartSpacing = 35; // Aumentado de 10
      
      // Crear corazones basados en la vida del jugador
      for (let i = 0; i < this.player.maxHearts; i++) {
        const heartX = i * (heartSize + heartSpacing);
        
        // Determinar el estado del corazón
        let heartTexture = 'hud_heart_empty';
        if (this.player.hearts >= i + 1) {
          heartTexture = 'hud_heart'; // Corazón lleno
        } else if (this.player.hearts > i) {
          heartTexture = 'hud_heart_half'; // Medio corazón (ej: 2.5 corazones)
        }
        
        const heart = this.add.sprite(heartX, 0, heartTexture)
          .setScale(0.6) // Reducido de 0.8
          .setScrollFactor(0);
        
        this.heartsSprites.push(heart);
        this.heartsContainer.add(heart);
      }
    };
    
    /**
     * Actualiza la UI de corazones después de recibir daño o añadir corazones
     */
    this.updateHeartsUI = () => {
      // Si maxHearts cambió, recrear toda la UI

      if (this.heartsSprites.length !== this.player.maxHearts) {
        this.createHeartsUI();
        return;
      }
      
      // Actualizar texturas de corazones existentes
      for (let i = 0; i < this.player.maxHearts; i++) {
        const heart = this.heartsSprites[i];
        
        // Determinar el estado del corazón
        let heartTexture = 'hud_heart_empty';
        if (this.player.hearts >= i + 1) {
          heartTexture = 'hud_heart'; // Corazón lleno
        } else if (this.player.hearts > i) {
          heartTexture = 'hud_heart_half'; // Medio corazón
        }
        
        heart.setTexture(heartTexture);
      }
    };
    
    
    
    // La UI se creará después de que el jugador sea creado
    this.monsters = [];
    this.monsters2 = []
    
    // Crear sistema de partículas
    this.createParticles();
    
    const monsterCreatorChaser = (cord) => {
       // Cambiado de 1000 a 600 para estar aún más cerca del jugador
      for (let j = 0; j < cord.length; j += 1) {   
            
              this.monster = new ChaserDude({
                scene: this,
                x: cord[j][0], // Separación mayor para que no se amontonen
                y: cord[j][1], // Ajustado para que estén SOBRE las plataformas (groundY - 150 = 439)
                key: `chaser${cord.length}${j}`,
              });
              this.physics.add.collider(this.monster, platforms);
              // Añadir colisión con la plataforma de matriz si existe
              if (this.matrixPlatform) {
                this.physics.add.collider(this.monster, this.matrixPlatform);
              }
              this.monsters.push(this.monster);
              this.monster.setBounce(2400, 0, 4900, this.scale.height);
                       
        }   
          
     }

      
    monsterCreatorChaser([[7900, 400],[8000,400],[8200,400],[13800,400],[13900,400],[14100,400]]);

    const monsterCreatorJumper = (cord) => {
      // Cambiado de 1000 a 600 para estar aún más cerca del jugador
     for (let j = 0; j < cord.length; j += 1) {      
           
        this.monster = new JumperDude({
               scene: this,
               x: cord[j][0], // Separación mayor para que no se amontonen
               y: cord[j][1], // Ajustado para que estén SOBRE las plataformas (groundY - 150 = 439)
               key: `Jumper${cord.length}${j}`,
        });
        this.physics.add.collider(this.monster, platforms);
             // Añadir colisión con la plataforma de matriz si existe
        if (this.matrixPlatform) {
            this.physics.add.collider(this.monster, this.matrixPlatform);
        }
        this.monsters2.push(this.monster);
        this.monster.setBounce(2400, 0, 4900, this.scale.height);
         
      }
         
    }

    monsterCreatorJumper([[8100,400],[14000,400]])
    // Opción 2: concat
    this.allMonsters = this.monsters.concat(this.monsters2)
    
    // Añadir colisión entre enemigos para evitar que se sobrepongan
    if (this.monsters.length > 1) {
      for (let i = 0; i < this.monsters.length; i++) {
        for (let j = i + 1; j < this.monsters.length; j++) {
          this.physics.add.collider(this.monsters[i], this.monsters[j]);
        }
      }
    }
    
    // Añadir colisión de enemigos con plataformas flotantes
    if (this.floatingPlatforms && this.allMonsters.length > 0) {
      this.allMonsters.forEach(monster => {
        this.physics.add.collider(monster, this.floatingPlatforms);
      });
     
    }
    
    // Añadir colisión de enemigos con plataformas de tiles (matrixPlatform)
    if (this.matrixPlatform && this.allMonsters.length > 0) {
      this.allMonsters.forEach(monster => {
        this.physics.add.collider(monster, this.matrixPlatform);
      });
      
    }

    this.player = new Player({
      scene: this,
      x: 400,
      y: 100,
      key: 'player',
    });

    // Crear UI de corazones después de crear el jugador
    this.createHeartsUI();
    
    // Crear grupo de corazones recolectables
    this.heartsGroup = this.physics.add.group({
      classType: HeartPickup,
      maxSize: 10,
      runChildUpdate: true
    });
    
    // Crear corazón coleccionable inicial en x=-70, y=620 (sobre plataforma)
    const initialHeart = new HeartPickup(this, -70, 620);
    this.heartsGroup.add(initialHeart);
    console.log('Corazón PERMANENTE creado en (-70, 620)');
    
    // Corazon coleccionable en plataformas flotantes
    const platformHeart = new HeartPickup(this, 18580, -980);
    this.heartsGroup.add(platformHeart);
    console.log('Corazón PERMANENTE creado en (18650, -900)');

    const platformZoneHeart = new HeartPickup(this, 19027, -1980);
    this.heartsGroup.add(platformZoneHeart);
    console.log('Corazón PERMANENTE creado en (19027, -1950)');
    
   

    // Crear rampa real en x=500 (después de crear el jugador)
    this.createRealRamp();

    // Configurar límites del mundo físico para evitar que el jugador se salga
    // Límite superior: -3000 (permite subir 3000px más arriba del borde de pantalla)
    // Límite inferior: 800 (suficiente para plataformas flotantes + margen)
    const worldBoundsTop = -3000;
    const worldBoundsHeight = 3800; // 3000 + 800
    this.physics.world.setBounds(-300, worldBoundsTop, 300000, worldBoundsHeight);
    
    // Ajustar límites de cámara para permitir movimiento vertical
    // Altura máxima: desde -3000 hasta 800px (permite ver mucho más arriba)
    const cameraBoundsTop = -3000;
    const cameraMaxHeight = 3800; // 3000 + 800
    this.cameras.main.setBounds(0, cameraBoundsTop, 300000, cameraMaxHeight);


    this.slashGroup = new SlashGroup(this);
    
    // Crear grupo de balas
    this.bullets = this.physics.add.group({
        classType: Bullet,
        maxSize: 5,
        runChildUpdate: true
    });

    
    this.slashInterval = () => {
      timerSlash = false;
      this.time.addEvent({
        delay: 50,
        repeat: 0,
        callbackScope: this,
        callback() {
          Phaser.Actions.Call(this.slashGroup.getChildren(), child => {
            child.active = false;

            this.time.addEvent({
              delay: 700,
              repeat: 0,
              callbackScope: this,
              callback() {
                timerSlash = true;
                child.disableBody(true, true);
              },
            });
          });
        },
      });
    };

    this.physics.add.collider(platforms, this.player);
    
    // Añadir colisión del jugador con plataformas flotantes
    if (this.floatingPlatforms) {
      this.physics.add.collider(this.floatingPlatforms, this.player);
    }
    
    // Añadir colisión del jugador con la plataforma de tiles
    if (this.tilePlatform) {
      this.physics.add.collider(this.tilePlatform, this.player);
    }
    
    // Añadir colisión del jugador con la plataforma de matriz
    if (this.matrixPlatform) {
      this.physics.add.collider(this.matrixPlatform, this.player);
    }

    this.physics.add.overlap(this.allMonsters, this.player, null, (mon2, player) => {
      // Si el jugador es invulnerable, aplicar daño de corazón completo
      const damageType = player.isInvulnerable ? 1 : 0.5;
      
      // Aplicar daño
      const died = player.damg(damageType);
      
      // Efecto visual de daño
      player.setTint(0xff0000);
      this.time.delayedCall(200, () => {
        player.setTint(0xffffff);
      });
      
      // Empujar al jugador lejos del monstruo
      const pushDirection = player.x < mon2.x ? -200 : 200;
      player.body.setVelocity(pushDirection, -150);
      
      // Actualizar UI de corazones
      this.updateHeartsUI();
      
      // Verificar si el jugador murió
      if (died) {
        gameOver = true;
      }
    }, this);
    
    // Overlap para recoger corazones coleccionables
    this.physics.add.overlap(this.player, this.heartsGroup, (player, heart) => {
      // SIEMPRE: Aumentar el máximo de corazones en 1
      player.maxHearts += 1;
      
      // SIEMPRE: Recuperar 1 corazón de vida (a menos que ya esté al nuevo máximo)
      if (player.hearts < player.maxHearts) {
        player.hearts += 1;
      }
      
      // Actualizar UI con el nuevo corazón
      this.createHeartsUI();
      
      // Efecto de partículas al recolectar corazón
      this.particles.emitParticleAt(heart.x, heart.y, 25);
      
      // Sonido (opcional)
      // this.sound.play('collectSound', { volume: 0.5 });
      
      // Destruir el corazón coleccionable
      heart.destroy();
      
      // Efecto visual
      player.setTint(0x00ff00);
      this.time.delayedCall(300, () => {
        player.setTint(0xffffff);
      });
    }, null, this);
    this.physics.add.overlap(this.bullets, this.allMonsters,null, (monster, bullet) => {
      monster.setTint(0xff0000);
      // If bullet hits planet, destroy the bullet and play the effect
      monster.damg(50);
      bullet.destroyBullet(true);
      this.score += 100;
      this.scoreText.setText(`Score: ${this.score}`);
      
      return true;
    });

    
    this.physics.add.overlap(this.slashGroup, this.allMonsters, null, (mon, slash) => {
      mon.setTint(0xff0000);
      const died = mon.damg(250);
      this.score += 250;
      if (died) {
        this.score += 2000;
      }
      this.scoreText.setText(`Score: ${this.score}`);

      slash.setActive(false);
      slash.body.enable = false;
      return true;
    }, null, this);

    this.enemies = this.add.group();
    
    // Configurar cámara para seguir al jugador en ambos ejes desde el inicio
    // Offset X de -150px para que el jugador esté más a la izquierda
    // Offset Y de 100px para que la cámara esté más abajo que el centro exacto
    this.cameras.main.startFollow(this.player, false, 0.1, 0.1, -150, 100);
    
    // Configurar zona muerta para mejor control de cámara vertical
    // La cámara solo se mueve cuando el jugador está a 100px del centro
    this.cameras.main.setDeadzone(0, 100);

    cursors = this.input.keyboard.createCursorKeys();
    this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.anims.create({
      key: 'groupS',
      frames: [{ key: 'groupS', frame: 0 }],
      frameRate: 2,
      repeat: -1,
    });
    this.anims.create({
      key: 'blast',
      frames: this.anims.generateFrameNumbers('blast', { start: 3, end: 5 }),
      frameRate: 7,
      repeat: -1,
    });

    this.anims.create({
      key: 'attackD',
      frames: this.anims.generateFrameNumbers('attackD', { start: 1, end: 6 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'dash',
      frames: [{ key: 'dash', frame: 10 }],
      frameRate: 20,
    });
    this.anims.create({
      key: 'turn',
      frames: this.anims.generateFrameNumbers('stand', { start: 47, end: 49 }),
      frameRate: 5,
    });
    this.anims.create({
      key: 'slash',
      frames: this.anims.generateFrameNames('slash', { frames: [1, 2, 3, 4, 5, 6, 7, 8] }),
      frameRate: 10,
    });

    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('walk', { frames: [6, 7, 8, 9, 6, 5, 4, 3] }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNumbers('jump', { start: 39, end: 42 }),
      frameRate: 5,
    });
    this.anims.create({
      key: 'look',
      frames: [{ key: 'dude', frame: 4 }],
      frameRate: 10,
    });
    this.anims.create({
      key: 'dudeleft',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'skullFly',
      frames: 'fireSkull',
      frameRate: 3,
      repeat: -1
  });
    this.teclaE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
  }

  update() {
    // Actualizar coordenadas X e Y del jugador en la UI
    if (this.player && this.positionXText && this.positionYText) {
      const playerX = Math.round(this.player.x);
      const playerY = Math.round(this.player.y);
      this.positionXText.setText(`X: ${playerX}`);
      this.positionYText.setText(`Y: ${playerY}`);
    }
    
    
    const onGround = this.player.body.touching.down || this.player.body.blocked.down;
    this.player.updateJumpState(onGround);
    this.player.update();
    this.allMonsters.forEach(monster => {
      monster.update();
    });
    

    if (gameOver) {
      this.physics.pause();
      LocalStorage.saveScore(this.score);
      this.scene.stop('Game');

      this.scene.start('GameOver');

      gameOver = false;
    }
    if (cursors.left.isDown && onGround) {
      this.player.setVelocityX(-460);

      this.player.flipX = true;
      this.player.setTint(0xFFFFFF);

      this.player.anims.play('walk', true);
    } else if (cursors.right.isDown && onGround) {
      this.player.setVelocityX(460);
      this.player.setTint(0xFFFFFF);
      this.player.flipX = false;
      this.player.anims.play('walk', true);
    } else if (cursors.right.isDown) {
      this.player.setVelocityX(speedX);

      this.player.flipX = false;
      this.player.anims.play('jump', true);
    } else if (cursors.left.isDown) {
      this.player.setVelocityX(-speedX);

      this.player.flipX = true;
      this.player.anims.play('jump', true);
    } else if (cursors.down.isDown) {
      this.player.setVelocityY(550);
    } else if (cursors.down.isDown && onGround) {
      this.player.anims.play('down', true);
    } else if (this.keyW.isDown && this.player.flipX === true) {
      if (timerSlash) {
        this.slashGroup.bladeSlash(this.player.x - 70, this.player.y);
        this.player.flipX = true;
        this.player.setVelocityX(0);
        this.player.anims.play('slash', true);

        this.slashInterval();
      }
    } else if (this.keyW.isDown && this.player.flipX === !true) {
      if (timerSlash) {
        this.slashGroup.bladeSlash(this.player.x, this.player.y);
        this.player.setVelocityX(0);
        this.player.anims.play('slash', true);

        this.slashInterval();
      }
    } else if (Phaser.Input.Keyboard.JustDown(this.teclaE) ) {
      
        const bullet = this.bullets.get();
        if(this.player.flipX === true){

        if (bullet) {
            bullet.fire(this.player.x, this.player.y);
            // Si el jugador está mirando hacia la izquierda, invertir dirección
            
                bullet.setVelocityX(-900);
            
        }}
        else{
          if (bullet) {
            bullet.fire(this.player.x, this.player.y);
            // Si el jugador está mirando hacia la izquierda, invertir dirección
            
                bullet.setVelocityX(900);
            
        }}
        }
      
     else if (onGround) {
      this.player.setVelocityX(0);

      this.player.anims.play('turn', true);
    } else if (!onGround) {
      this.player.setVelocityX(0);

      this.player.anims.play('jump', true);
    }

    // Sistema de doble salto (tecla arriba o espacio)
    if (Phaser.Input.Keyboard.JustDown(cursors.up) || Phaser.Input.Keyboard.JustDown(this.keySpace)) {
      if (this.player.tryJump()) {
        // Salto exitoso
      }
    }

    if (this.keyQ.isDown && this.player.flipX === true) {
      this.player.anims.stop('walk');
      this.player.anims.play('dash', true);
      this.player.setVelocityX(-670 * 3);
    }
    if (this.keyQ.isDown && this.player.flipX === false) {
      this.player.anims.stop('walk');
      this.player.anims.play('dash', true);
      this.player.setVelocityX(670 * 3);
    }

    if (this.player.y > this.scale.height) {
      this.physics.pause();
      this.player.setTint(0xff0000);
      LocalStorage.saveScore(this.score);
      this.scene.stop('Game');
      this.scene.start('GameOver');
    }
  }
}
