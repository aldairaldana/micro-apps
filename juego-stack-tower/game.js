/**
 * 🧱 CORE TO COSMOS — StackTower Evolution (Deluxe Arcade Edition)
 * Características avanzadas:
 * - 8 Niveles con Metas de Pisos y Desbloqueo Progresivo
 * - Texturas Procedurales Deluxe (Oro Metálico con Glint, Magma con Grietas, Slime Elástico, Hielo)
 * - 3D Tumbling Falling Debris: Físicas de escombros rotando en 3D con aceleración gravitacional
 * - Screen Shake: Sacudida háptica de impacto en cortes y caídas
 * - Hit-Stop & Flash Bloom: Micro-pausa de satisfacción en combos perfectos
 * - Números Flotantes Dinámicos: (+25, +50 ¡PERFECTO!, 🪙 +150 ORO)
 * - Lluvia de Confeti / Fuegos Artificiales en Victoria
 * - Sistema de Logros y Medallas Desbloqueables con Toast animado
 * - Récords Semanales de Lunes a Domingo y Salón de la Fama
 */

(() => {
  // --- Elementos del DOM ---
  const gameCanvas = document.getElementById('game-canvas');
  const ctx = gameCanvas.getContext('2d');

  // HUD
  const hud = document.getElementById('hud');
  const biomeIconEl = document.getElementById('biome-icon');
  const levelBadgeNameEl = document.getElementById('level-badge-name');
  const targetCounterEl = document.getElementById('target-counter');
  const layerFillEl = document.getElementById('layer-fill');
  const scoreEl = document.getElementById('score');
  const materialBadgeEl = document.getElementById('material-badge');
  const comboBadgeEl = document.getElementById('combo-badge');
  const comboCountEl = document.getElementById('combo-count');
  const pauseBtn = document.getElementById('pause-btn');
  const hudFullscreenBtn = document.getElementById('hud-fullscreen-btn');
  const navFullscreenBtn = document.getElementById('nav-fullscreen-btn');
  const pwaInstallBtn = document.getElementById('pwa-install-btn');

  // Monedas, Diamantes y Balances
  const navCoinsCount = document.getElementById('nav-coins-count');
  const hudCoinsVal = document.getElementById('hud-coins-val');
  const skinsModalCoins = document.getElementById('skins-modal-coins');
  const navDiamondsCount = document.getElementById('nav-diamonds-count');
  const hudDiamondsVal = document.getElementById('hud-diamonds-val');
  const skinsModalDiamonds = document.getElementById('skins-modal-diamonds');

  // Potenciadores Pre-Partida (Boosters Tácticos)
  const boosterSlowmoToggle = document.getElementById('booster-slowmo-toggle');
  const boosterSlowmoCount = document.getElementById('booster-slowmo-count');
  const boosterTitanToggle = document.getElementById('booster-titan-toggle');
  const boosterTitanCount = document.getElementById('booster-titan-count');
  const boosterReviveToggle = document.getElementById('booster-revive-toggle');
  const boosterReviveCount = document.getElementById('booster-revive-count');

  // Selector de Modos de Juego
  const modeMissionsBtn = document.getElementById('mode-missions-btn');
  const modeEndlessBtn = document.getElementById('mode-endless-btn');

  // Pantallas y Modales
  const startScreen = document.getElementById('start-screen');
  const gameOverScreen = document.getElementById('gameover-screen');
  const levelClearModal = document.getElementById('level-clear-modal');
  const levelSelectModal = document.getElementById('level-select-modal');
  const achievementsModal = document.getElementById('achievements-modal');
  const settingsModal = document.getElementById('settings-modal');
  const leaderboardModal = document.getElementById('leaderboard-modal');
  const skinsModal = document.getElementById('skins-modal');
  const skinsGridContainer = document.getElementById('skins-grid-container');
  const skinsCategoriesContainer = document.getElementById('skins-categories-container');
  const skinsRaritiesContainer = document.getElementById('skins-rarities-container');
  const skinsPrevPageBtn = document.getElementById('skins-prev-page-btn');
  const skinsNextPageBtn = document.getElementById('skins-next-page-btn');
  const skinsPageInfo = document.getElementById('skins-page-info');
  const pauseModal = document.getElementById('pause-modal');
  const closePauseModalBtn = document.getElementById('close-pause-modal-btn');
  const pauseLevelBadge = document.getElementById('pause-level-badge');
  const pauseLevelTarget = document.getElementById('pause-level-target');
  const pauseToggleSound = document.getElementById('pause-toggle-sound');
  const pauseIconSound = document.getElementById('pause-icon-sound');
  const pauseToggleMusic = document.getElementById('pause-toggle-music');
  const pauseIconMusic = document.getElementById('pause-icon-music');
  const pauseToggleVibrate = document.getElementById('pause-toggle-vibrate');
  const pauseIconVibrate = document.getElementById('pause-icon-vibrate');
  const pauseToggleGuide = document.getElementById('pause-toggle-guide');
  const pauseIconGuide = document.getElementById('pause-icon-guide');
  const resumeBtn = document.getElementById('resume-btn');
  const pauseRestartBtn = document.getElementById('pause-restart-btn');
  const pauseMenuBtn = document.getElementById('pause-menu-btn');

  // Elementos de Monetización y Anuncios Recompensados (Google AdMob Ready)
  const reviveAdBtn = document.getElementById('revive-ad-btn');
  const doubleCoinsAdBtn = document.getElementById('double-coins-ad-btn');
  const doubleCoinsAmount = document.getElementById('double-coins-amount');
  const clearDoubleAdBtn = document.getElementById('clear-double-ad-btn');
  const clearDoubleVal = document.getElementById('clear-double-val');
  const shopFreeAdGiftCard = document.getElementById('shop-free-ad-gift-card');
  const shopClaimAdGiftBtn = document.getElementById('shop-claim-ad-gift-btn');
  const shopNoadsCard = document.getElementById('shop-noads-card');
  const shopBuyNoadsBtn = document.getElementById('shop-buy-noads-btn');

  // Modal de Reproductor de Video Anuncio
  const adVideoModal = document.getElementById('ad-video-modal');
  const adCountdownSec = document.getElementById('ad-countdown-sec');
  const adExitBtn = document.getElementById('ad-exit-btn');
  const adProgressBar = document.getElementById('ad-progress-bar');
  const adFooterStatus = document.getElementById('ad-footer-status');
  const adViewportCanvas = document.getElementById('ad-viewport-canvas');

  // Contenedor del Juego (Rotación de Gravedad Invertida)
  const gameContainer = document.getElementById('game-container');

  // Banner Cinemático de Alerta de Jefe (Fase 5)
  const bossIntroBanner = document.getElementById('boss-intro-banner');
  const bossIntroName = document.getElementById('boss-intro-name');
  const bossIntroGoal = document.getElementById('boss-intro-goal');
  let bossBannerTimer = null;

  // Temporizador y Elementos de Combate de Jefe (Fase 6)
  const bossTimerBadge = document.getElementById('boss-timer-badge');
  const bossTimerVal = document.getElementById('boss-timer-val');
  const bossTimerFill = document.getElementById('boss-timer-fill');
  const bossQuakeOverlay = document.getElementById('boss-quake-overlay');
  const quakeTimerEl = document.getElementById('quake-timer');
  const bossSpellBanner = document.getElementById('boss-spell-banner');
  const bossSpellIcon = document.getElementById('boss-spell-icon');
  const bossSpellTitle = document.getElementById('boss-spell-title');
  const bossSpellDesc = document.getElementById('boss-spell-desc');
  const bossSpellCountdown = document.getElementById('boss-spell-countdown');
  const darkEclipseOverlay = document.getElementById('dark-eclipse-overlay');

  // Toast de Logro
  const achievementToast = document.getElementById('achievement-toast');
  const toastAchievementName = document.getElementById('toast-achievement-name');

  // Botones y Navegación
  const mainPlayBtn = document.getElementById('main-play-btn');
  const playBtnText = document.getElementById('play-btn-text');
  const selectLevelsSubbtn = document.getElementById('select-levels-subbtn');
  const openLevelSelectBtn = document.getElementById('open-level-select-btn');
  const openAchievementsBtn = document.getElementById('open-achievements-btn');
  const openLeaderboardBtn = document.getElementById('open-leaderboard-btn');
  const openSettingsBtn = document.getElementById('open-settings-btn');
  const openProfileBtn = document.getElementById('open-profile-btn');
  const openSkinsBtn = document.getElementById('open-skins-btn');
  const nextLevelBtn = document.getElementById('next-level-btn');
  const replayLevelBtn = document.getElementById('replay-level-btn');
  const clearMenuBtn = document.getElementById('clear-menu-btn');
  const restartBtn = document.getElementById('restart-btn');
  const homeBtn = document.getElementById('home-btn');
  const saveSettingsBtn = document.getElementById('save-settings-btn');
  const powerupSlowmoBtn = document.getElementById('powerup-slowmo-btn');
  const powerupTitanBtn = document.getElementById('powerup-titan-btn');
  const slowmoCdOverlay = document.getElementById('slowmo-cd-overlay');
  const currentMissionCard = document.getElementById('current-mission-card');
  const modalFullscreenBtn = document.getElementById('modal-fullscreen-btn');
  const hubTabSettings = document.getElementById('hub-tab-settings');
  const hubTabRecords = document.getElementById('hub-tab-records');
  const hubTabTrophies = document.getElementById('hub-tab-trophies');
  const hubViewSettings = document.getElementById('hub-view-settings');
  const hubViewRecords = document.getElementById('hub-view-records');
  const hubViewTrophies = document.getElementById('hub-view-trophies');

  // Inputs y Campos de Perfil
  const navPlayerName = document.getElementById('nav-player-name');
  const settingPlayerName = document.getElementById('setting-player-name');
  const settingSound = document.getElementById('setting-sound');
  const settingVibrate = document.getElementById('setting-vibrate');
  const settingParticles = document.getElementById('setting-particles');
  const settingMusic = document.getElementById('setting-music');
  const settingGuide = document.getElementById('setting-guide');

  // Campos de Misión en Menú
  const missionLevelNum = document.getElementById('mission-level-num');
  const missionLevelTitle = document.getElementById('mission-level-title');
  const missionLevelDesc = document.getElementById('mission-level-desc');

  // Campos de Victoria
  const clearLevelTitle = document.getElementById('clear-level-title');
  const clearLevelDesc = document.getElementById('clear-level-desc');
  const clearScoreVal = document.getElementById('clear-score-val');
  const clearAccuracyVal = document.getElementById('clear-accuracy-val');
  const star1 = document.getElementById('star-1');
  const star2 = document.getElementById('star-2');
  const star3 = document.getElementById('star-3');

  // Campos de Game Over
  const goBiomeBadge = document.getElementById('go-biome-badge');
  const finalScoreEl = document.getElementById('final-score');
  const finalTargetGoal = document.getElementById('final-target-goal');
  const streakMsgEl = document.getElementById('streak-msg');
  const goCoinsVal = document.getElementById('go-coins-val');

  // Selector de Mundos y Modal de Instalación
  const worldTitleLabel = document.getElementById('world-title-label');
  const worldRangeLabel = document.getElementById('world-range-label');
  const prevWorldBtn = document.getElementById('prev-world-btn');
  const nextWorldBtn = document.getElementById('next-world-btn');
  const installHelpModal = document.getElementById('install-help-modal');

  // Contenedores Dinámicos
  const levelCardsContainer = document.getElementById('level-cards-container');
  const achievementsContainer = document.getElementById('achievements-container');
  const weekDaysContainer = document.getElementById('week-days-container');
  const hallOfFameContainer = document.getElementById('hall-of-fame-container');
  const tabWeek = document.getElementById('tab-week');
  const tabGlobal = document.getElementById('tab-global');
  const viewWeek = document.getElementById('view-week');
  const viewGlobal = document.getElementById('view-global');

  // --- Dimensiones Adaptativas y Motor Isométrico (Mobile & Desktop) ---
  let initialSize = 190;
  let blockHeight = 30;
  let cameraImpactOffset = 0; // Físicas de peso: jolt vertical al impactar bloque
  const ISO_COS = 0.866;
  const ISO_SIN = 0.500;
  let PERFECT_TOLERANCE = 6.0; // Tolerancia amigable y cómoda para celulares

  function updateResponsiveDimensions() {
    const worldTolReduction = (typeof activeLevel !== 'undefined' && activeLevel) ? Math.min(2.0, activeLevel.worldIndex * 0.12) : 0;
    if (width < 500) {
      // Teléfonos móviles: Base amplia, cómoda y descansada para el pulgar (52% del ancho)
      initialSize = Math.min(220, Math.max(175, Math.round(width * 0.52)));
      blockHeight = 30;
      PERFECT_TOLERANCE = Math.max(4.2, 6.5 - worldTolReduction);
      centerX = width / 2;
      centerY = height < 720 ? height * 0.70 : height * 0.66;
    } else if (width < 800) {
      initialSize = 180;
      blockHeight = 28;
      PERFECT_TOLERANCE = Math.max(4.0, 6.0 - worldTolReduction);
      centerX = width / 2;
      centerY = height * 0.66;
    } else {
      initialSize = 195;
      blockHeight = 30;
      PERFECT_TOLERANCE = Math.max(3.8, 5.5 - worldTolReduction);
      centerX = width / 2;
      centerY = height * 0.65;
    }
  }

  // --- 🪐 UNIVERSO DE 20 BLOQUES TEMÁTICOS (168 NIVELES: 16 JEFES + 4 SÚPER JEFES) ---
  const WORLDS = [
    {
      id: 1,
      name: 'Núcleo Magmático',
      icon: '🌋',
      material: 'MAGMA',
      colorAccent: '#ff4500',
      bgGradient: ['#2e0903', '#090302'],
      desc: 'Roca volcánica incandescente del manto terrestre con piscinas de magma líquido.',
      totalLevels: 8,
      isSuperBossWorld: false,
      bossName: 'Golem de Magma Furioso',
      bossIcon: '👹'
    },
    {
      id: 2,
      name: 'Caverna Slime Jade',
      icon: '💎',
      material: 'SLIME',
      colorAccent: '#00ff88',
      bgGradient: ['#052b1b', '#03100b'],
      desc: 'Bloques elásticos de gelatina jade translúcida con rebote procedural amortiguado.',
      totalLevels: 8,
      isSuperBossWorld: false,
      bossName: 'Rey Slime Ámbar Gigante',
      bossIcon: '👑'
    },
    {
      id: 3,
      name: 'Minas de Oro & Cuarzo',
      icon: '🪙',
      material: 'GOLD',
      colorAccent: '#ffcc00',
      bgGradient: ['#302404', '#0d0a02'],
      desc: 'Lingotes pulidos con reflejos dorados, destellos glint y ráfagas de monedas cósmicas.',
      totalLevels: 8,
      isSuperBossWorld: false,
      bossName: 'Coloso Midas Dorado',
      bossIcon: '🪙'
    },
    {
      id: 4,
      name: 'La Metrópolis Cyber',
      icon: '🏙️',
      material: 'CYBER',
      colorAccent: '#38bdf8',
      bgGradient: ['#162a4a', '#081226'],
      desc: 'Rascacielos iluminados en la noche urbana con vistas a la atmósfera terrestre.',
      totalLevels: 8,
      isSuperBossWorld: false,
      bossName: 'Cyber-Titán 2099',
      bossIcon: '🤖'
    },
    {
      id: 5,
      name: 'Templo Titán Ancestral',
      icon: '🗿',
      material: 'TITAN_STONE',
      colorAccent: '#f59e0b',
      bgGradient: ['#3a2206', '#140c02'],
      desc: 'Santuario milenario de monolitos rúnicos y oro arcano. ¡Súper Jefe Titánico!',
      totalLevels: 10,
      isSuperBossWorld: true,
      bossName: 'Rey Titán Primordial',
      bossIcon: '👑'
    },
    {
      id: 6,
      name: 'Cielo Glaciar',
      icon: '❄️',
      material: 'ICE',
      colorAccent: '#00d4ff',
      bgGradient: ['#0d3558', '#061626'],
      desc: 'Inercia gélida: los bloques resbalan sutilmente sobre hielo cristalino al apilarse.',
      totalLevels: 8,
      isSuperBossWorld: false,
      bossName: 'Dragón de Escarcha Polar',
      bossIcon: '🐉'
    },
    {
      id: 7,
      name: 'Océano Abisal & Arrecife',
      icon: '🌊',
      material: 'ABYSS',
      colorAccent: '#06b6d4',
      bgGradient: ['#033345', '#02121b'],
      desc: 'Fosas marinas con corales bio-luminiscentes y presión elástica profunda.',
      totalLevels: 8,
      isSuperBossWorld: false,
      bossName: 'Leviatán de las Profundidades',
      bossIcon: '🦑'
    },
    {
      id: 8,
      name: 'Galeón Fantasma Pirata',
      icon: '🏴‍☠️',
      material: 'WOOD',
      colorAccent: '#a3e635',
      bgGradient: ['#1b3018', '#0a1409'],
      desc: 'Maderas náuticas antiguas de barcos espectrales suspendidos en niebla mística.',
      totalLevels: 8,
      isSuperBossWorld: false,
      bossName: 'Capitán Davy Jones',
      bossIcon: '💀'
    },
    {
      id: 9,
      name: 'Volcán de Fuego Azul',
      icon: '🔥',
      material: 'BLUE_LAVA',
      colorAccent: '#38bdf8',
      bgGradient: ['#0a2a4d', '#031224'],
      desc: 'Cráteres de lava azul de alta temperatura con pulsos térmicos hiperactivos.',
      totalLevels: 8,
      isSuperBossWorld: false,
      bossName: 'Fénix de Plasma Volcánico',
      bossIcon: '🦅'
    },
    {
      id: 10,
      name: 'Nave Nodriza Alienígena',
      icon: '🛸',
      material: 'ALIEN_TECH',
      colorAccent: '#ec4899',
      bgGradient: ['#380c34', '#120211'],
      desc: 'Tecnología extraterrestre biomecánica con escudos energéticos. ¡Súper Jefe Alien!',
      totalLevels: 10,
      isSuperBossWorld: true,
      bossName: 'Nave Reina Nodriza Alien',
      bossIcon: '👾'
    },
    {
      id: 11,
      name: 'Estratósfera Aurora',
      icon: '🌌',
      material: 'AURORA',
      colorAccent: '#c084fc',
      bgGradient: ['#2e0f52', '#0e031a'],
      desc: 'Ondas boreales violetas con campos magnéticos que corrigen desvíos cercanos.',
      totalLevels: 8,
      isSuperBossWorld: false,
      bossName: 'Valkiria Boreal Electromagnética',
      bossIcon: '⚡'
    },
    {
      id: 12,
      name: 'Órbita Lunar & Cráteres',
      icon: '🛰️',
      material: 'LUNAR',
      colorAccent: '#94a3b8',
      bgGradient: ['#121838', '#040714'],
      desc: 'Baja gravedad sobre el manto azul de la Tierra y regolito lunar milenario.',
      totalLevels: 8,
      isSuperBossWorld: false,
      bossName: 'Centinela de Regolito Lunar',
      bossIcon: '🛡️'
    },
    {
      id: 13,
      name: 'Anillos de Saturno',
      icon: '🪐',
      material: 'SATURN_ICE',
      colorAccent: '#38bdf8',
      bgGradient: ['#0d2b44', '#03101c'],
      desc: 'Torrentes de asteroides helados y fragmentos de cometa en rotación orbital.',
      totalLevels: 8,
      isSuperBossWorld: false,
      bossName: 'Titán de Hielo Planetario',
      bossIcon: '❄️'
    },
    {
      id: 14,
      name: 'Nebulosa Solar Radiactiva',
      icon: '☀️',
      material: 'SOLAR_FIRE',
      colorAccent: '#f97316',
      bgGradient: ['#4a1c05', '#160802'],
      desc: 'Corona solar fulgurante con llamaradas que funden cualquier imprecisión.',
      totalLevels: 8,
      isSuperBossWorld: false,
      bossName: 'Bestia de Llamaradas Solares',
      bossIcon: '🦁'
    },
    {
      id: 15,
      name: 'Vórtice Agujero Negro',
      icon: '🌀',
      material: 'BLACK_HOLE',
      colorAccent: '#a855f7',
      bgGradient: ['#280f48', '#0a0216'],
      desc: 'Horizonte de sucesos relativista donde el tiempo y la gravedad colapsan. ¡Súper Jefe!',
      totalLevels: 10,
      isSuperBossWorld: true,
      bossName: 'Vórtice Singularidad Cuántica',
      bossIcon: '🕳️'
    },
    {
      id: 16,
      name: 'Planeta Rojo Marciano',
      icon: '🔴',
      material: 'MARS_ROCK',
      colorAccent: '#ef4444',
      bgGradient: ['#441212', '#140303'],
      desc: 'Cañones colosales de polvo carmesí y ruinas alienígenas enterradas.',
      totalLevels: 8,
      isSuperBossWorld: false,
      bossName: 'Señor de la Guerra Marciano',
      bossIcon: '⚔️'
    },
    {
      id: 17,
      name: 'Galaxia Andrómeda',
      icon: '🌠',
      material: 'ANDROMEDA',
      colorAccent: '#818cf8',
      bgGradient: ['#18124d', '#050417'],
      desc: 'Brazos espirales de miles de millones de soles lejanos y cúmulos abiertos.',
      totalLevels: 8,
      isSuperBossWorld: false,
      bossName: 'Oráculo de Polvo Estelar',
      bossIcon: '🔮'
    },
    {
      id: 18,
      name: 'Dimensión Prisma Espejo',
      icon: '🪞',
      material: 'PRISM',
      colorAccent: '#f43f5e',
      bgGradient: ['#360b29', '#0f020c'],
      desc: 'Espejos dimensionales que refractan la luz de la torre en infinitos prismas.',
      totalLevels: 8,
      isSuperBossWorld: false,
      bossName: 'Espectro Cromático Prisma',
      bossIcon: '💎'
    },
    {
      id: 19,
      name: 'Hiperespacio Warp Taquión',
      icon: '⚡',
      material: 'WARP',
      colorAccent: '#eab308',
      bgGradient: ['#382f04', '#100c01'],
      desc: 'Velocidad superior a la luz; los bloques oscilan al compás de la dilatación temporal.',
      totalLevels: 8,
      isSuperBossWorld: false,
      bossName: 'Guardián del Tiempo Warp',
      bossIcon: '⏳'
    },
    {
      id: 20,
      name: 'Núcleo del Cosmos Primordial',
      icon: '🌌',
      material: 'COSMOS_CORE',
      colorAccent: '#ec4899',
      bgGradient: ['#330542', '#0d0112'],
      desc: 'El mismísimo origen del universo. ¡EL SÚPER JEFE DEFINITIVO Y CLÍMAX FINAL!',
      totalLevels: 10,
      isSuperBossWorld: true,
      bossName: 'Deidad Cósmica Suprema',
      bossIcon: '👑'
    }
  ];

  // Alias para retrocompatibilidad total con referencias antiguas
  const BIOMES = WORLDS;
  const TOTAL_CAMPAIGN_LEVELS = 168;

  function getWorldStartLevel(worldIdx) {
    let sum = 1;
    for (let i = 0; i < worldIdx && i < WORLDS.length; i++) {
      sum += WORLDS[i].totalLevels;
    }
    return sum;
  }

  function getWorldInfoForLevel(lvlNum) {
    const num = Math.max(1, lvlNum);
    let accumulated = 0;
    for (let w = 0; w < WORLDS.length; w++) {
      const worldLevels = WORLDS[w].totalLevels;
      if (num <= accumulated + worldLevels || w === WORLDS.length - 1) {
        const levelInWorld = Math.max(1, num - accumulated);
        return {
          worldIndex: w,
          levelInWorld: Math.min(worldLevels, levelInWorld),
          world: WORLDS[w]
        };
      }
      accumulated += worldLevels;
    }
    return {
      worldIndex: WORLDS.length - 1,
      levelInWorld: 10,
      world: WORLDS[WORLDS.length - 1]
    };
  }

  function getLevelData(levelNum) {
    const num = Math.max(1, levelNum);
    const { worldIndex, levelInWorld, world } = getWorldInfoForLevel(num);
    const isSuperBoss = world.isSuperBossWorld && (levelInWorld === 10);
    const isBoss = !world.isSuperBossWorld && (levelInWorld === 8);
    const isBonusGold = (levelInWorld === 4 && world.id % 2 === 1);

    // Curva de dificultad progresiva estricta:
    // Conforme avanza el nivel global (num del 1 al 168), aumentan gradualmente la meta de bloques y la velocidad.
    const baseProgression = Math.floor((num - 1) * 0.38); // +0.38 por cada nivel superado
    let target = 15 + baseProgression + (levelInWorld - 1);
    if (isBonusGold) target = 18 + baseProgression;
    if (isBoss) target = 26 + baseProgression + 6;
    if (isSuperBoss) target = 35 + baseProgression + 10;

    // Velocidad progresiva monótona: se mueve más rápido gradualmente con cada nivel que pasa
    const speedProgression = (num - 1) * 0.022; // Escala global gradual continua
    const localProgression = (levelInWorld - 1) * 0.035; // Incremento dentro del sector
    const bossBoost = isSuperBoss ? 0.55 : (isBoss ? 0.35 : 0);
    const baseSpeed = 2.18 + speedProgression + localProgression + bossBoost;
    const speed = Number(baseSpeed.toFixed(2));

    // Altura / Profundidad simulada
    let depthStr = '';
    if (worldIndex === 0) {
      const depths = ['-6,371 km', '-5,200 km', '-4,100 km', '-2,800 km', '-1,500 km', '-800 km', '-200 km', '0 km'];
      depthStr = depths[levelInWorld - 1] || '0 km';
    } else {
      const km = 100 + worldIndex * 900 + levelInWorld * 80;
      depthStr = `+${km.toLocaleString()} km`;
    }

    let levelName = `${world.name} - ${levelInWorld}`;
    let icon = world.icon;
    let desc = world.desc;

    if (isSuperBoss) {
      levelName = `👑 SÚPER JEFE: ${world.bossName}`;
      icon = world.bossIcon || '☠️';
      desc = `¡BATALLA DE SÚPER JEFE! Derrota a ${world.bossName} apilando ${target} pisos en este capítulo cumbre (+100 monedas de botín).`;
    } else if (isBoss) {
      levelName = `👹 JEFE: ${world.bossName}`;
      icon = world.bossIcon || '👑';
      desc = `¡JEFE DEL BLOQUE ${world.id}! Supera los ${target} pisos con máxima precisión para reclamar el cofre del mundo (+50 monedas).`;
    } else if (isBonusGold) {
      levelName = `Minas de Oro (${world.name})`;
      icon = '🪙';
      desc = '¡Piso de Bonificación! Apila con precisión y acumula monedas cósmicas para la tienda.';
    }

    return {
      id: num,
      worldIndex: worldIndex,
      levelInWorld: levelInWorld,
      world: world,
      name: levelName,
      icon: icon,
      target: target,
      material: isBonusGold ? 'GOLD' : world.material,
      depth: depthStr,
      speed: speed,
      desc: desc,
      bgGradient: world.bgGradient,
      colorAccent: world.colorAccent,
      isBonusGold: isBonusGold,
      isBoss: isBoss,
      isSuperBoss: isSuperBoss
    };
  }

  // Objeto Proxy para retrocompatibilidad total con cualquier lectura LEVELS[idx]
  const LEVELS = new Proxy([], {
    get(target, prop) {
      if (prop === 'length') return TOTAL_CAMPAIGN_LEVELS;
      if (typeof prop === 'string' && !isNaN(Number(prop))) {
        return getLevelData(Number(prop) + 1);
      }
      return target[prop];
    }
  });

  // --- Sistema de Logros y Medallas ---
  const ACHIEVEMENTS = [
    { id: 'magma_escape', icon: '🌋', name: 'Escapista del Magma', desc: 'Supera el Nivel 1 y sal del centro ardiente de la Tierra.' },
    { id: 'combo_fever', icon: '⚡', name: 'Fiebre de Combos', desc: 'Encadena un combo de 4 o más cortes perfectos seguidos.' },
    { id: 'gold_fever', icon: '🪙', name: 'Toque de Midas', desc: 'Apila 15 bloques de Oro puro en las Minas de Oro.' },
    { id: 'ice_skater', icon: '❄️', name: 'Patinador Glaciar', desc: 'Domina los bloques resbaladizos del Nivel 5 de Hielo.' },
    { id: 'star_collector', icon: '⭐', name: 'Coleccionista Estelar', desc: 'Obtén la calificación máxima de 3 Estrellas (⭐⭐⭐).' },
    { id: 'cosmos_pioneer', icon: '🪐', name: 'Pionero del Cosmos', desc: 'Desbloquea el Nivel 8 en los confines del espacio.' }
  ];

  let unlockedAchievements = {};
  try {
    unlockedAchievements = JSON.parse(localStorage.getItem('c2c_achievements') || '{}');
  } catch (e) { unlockedAchievements = {}; }

  let goldBlocksCount = parseInt(localStorage.getItem('c2c_gold_count') || '0', 10);

  // --- Progreso y Configuración Persistente ---
  let currentLevelIdx = parseInt(localStorage.getItem('c2c_current_level') || '0', 10);
  let unlockedLevelMax = parseInt(localStorage.getItem('c2c_unlocked_level') || '0', 10);
  let levelStars = {};
  try {
    levelStars = JSON.parse(localStorage.getItem('c2c_level_stars') || '{}');
  } catch (e) { levelStars = {}; }

  let lastCompletedLevelIdx = currentLevelIdx;
  let lastPlaceBlockTime = 0;

  const userSettings = {
    playerName: localStorage.getItem('c2c_player_name') || 'Explorador',
    sound: localStorage.getItem('c2c_sound') !== 'false',
    vibrate: localStorage.getItem('c2c_vibrate') !== 'false',
    particles: localStorage.getItem('c2c_particles') !== 'false',
    music: localStorage.getItem('c2c_music') !== 'false',
    guide: localStorage.getItem('c2c_guide') !== 'false',
    soundVolume: parseFloat(localStorage.getItem('c2c_sound_volume') || '0.8'),
    musicVolume: parseFloat(localStorage.getItem('c2c_music_volume') || '0.7')
  };

  // --- Monedas, Diamantes y Tienda de Aspectos (Skins) ---
  // Saldo de Pruebas Cósmico: 999,999 monedas y 9,999 diamantes para comprar y probar libremente
  let coins = parseInt(localStorage.getItem('c2c_coins') || '999999', 10);
  if (isNaN(coins) || coins < 500000) {
    coins = 999999;
    localStorage.setItem('c2c_coins', coins.toString());
  }
  let diamonds = parseInt(localStorage.getItem('c2c_diamonds') || '9999', 10);
  if (isNaN(diamonds) || diamonds < 5000) {
    diamonds = 9999;
    localStorage.setItem('c2c_diamonds', diamonds.toString());
  }
  let equippedSkin = localStorage.getItem('c2c_skin') || 'classic';
  let unlockedSkins = [];
  try {
    unlockedSkins = JSON.parse(localStorage.getItem('c2c_unlocked_skins') || '["classic"]');
  } catch (e) { unlockedSkins = ['classic']; }

  // Inventario de Potenciadores Tácticos Pre-Partida
  let boostersInventory = {
    slowmo: parseInt(localStorage.getItem('c2c_booster_slowmo') || '1', 10),
    titan: parseInt(localStorage.getItem('c2c_booster_titan') || '0', 10),
    revive: parseInt(localStorage.getItem('c2c_booster_revive') || '0', 10)
  };
  let activeEquippedBoosters = {
    slowmo: false,
    titan: false,
    revive: false
  };

  // --- CATÁLOGO CURADO DE 217 ASPECTOS DE ÉLITE CON RAREZA, BLOQUEO POR NIVEL Y PRECIOS ---
  const SKIN_RARITIES = {
    COMMON: { id: 'COMMON', name: 'Común', color: '#94a3b8', currency: 'COINS', basePrice: 350, bonusCoins: 0, tag: 'Estándar', levelMin: 1, levelMax: 5 },
    RARE: { id: 'RARE', name: 'Raro', color: '#38bdf8', currency: 'COINS', basePrice: 1200, bonusCoins: 1, tag: '+1 Moneda/bloque', levelMin: 6, levelMax: 14 },
    EPIC: { id: 'EPIC', name: 'Épico', color: '#a855f7', currency: 'COINS', basePrice: 4000, bonusCoins: 2, tag: '+2 Monedas/bloque', levelMin: 15, levelMax: 29 },
    LEGENDARY: { id: 'LEGENDARY', name: 'Legendario', color: '#fbbf24', currency: 'DIAMONDS', basePrice: 30, bonusCoins: 4, tag: '+4 Monedas/bloque', levelMin: 30, levelMax: 49 },
    MYTHIC: { id: 'MYTHIC', name: 'Mítico', color: '#f43f5e', currency: 'DIAMONDS', basePrice: 75, bonusCoins: 8, tag: '+8 Monedas/bloque', levelMin: 50, levelMax: 80 }
  };

  const SKIN_CATEGORIES = [
    {
      id: 'METALS',
      name: 'Metales Divinos',
      icon: '🪙',
      archetype: 'METALLIC',
      sound: 'METALLIC',
      colors: [
        ['#ffd700', '#fff2a6'], ['#c0c0c0', '#f8fafc'], ['#cd7f32', '#fed7aa'],
        ['#71717a', '#27272a'], ['#f59e0b', '#fef3c7'], ['#38bdf8', '#bae6fd'],
        ['#fb7185', '#ffe4e6'], ['#a855f7', '#f3e8ff'], ['#10b981', '#d1fae5'],
        ['#e2e8f0', '#ffffff'], ['#b45309', '#fde68a'], ['#475569', '#cbd5e1']
      ],
      names: [
        'Oro Imperial', 'Platino Real', 'Bronce Ancestral', 'Titanio Negro', 'Cobre Faraónico',
        'Cromo Galáctico', 'Wolframio Fundido', 'Electrum Divino', 'Paladio Puro', 'Plata Estelar',
        'Acero Valyrio', 'Latón de Alquimista', 'Mercurio Líquido', 'Adamantio Forjado', 'Mithril Enano',
        'Oro Rosa Solar', 'Cobalto Ígneo', 'Níquel Abisal', 'Bismuto Prisma', 'Vibranio Cósmico'
      ]
    },
    {
      id: 'GEMS',
      name: 'Gemas Astrales',
      icon: '💎',
      archetype: 'GEM',
      sound: 'GEM',
      colors: [
        ['#00f0ff', '#7000ff'], ['#e11d48', '#fb7185'], ['#10b981', '#34d399'],
        ['#8b5cf6', '#c084fc'], ['#f59e0b', '#fbbf24'], ['#06b6d4', '#67e8f9'],
        ['#ec4899', '#f472b6'], ['#6366f1', '#a5b4fc'], ['#14b8a6', '#5eead4'],
        ['#d946ef', '#f0abfc'], ['#0284c7', '#38bdf8'], ['#059669', '#6ee7b7']
      ],
      names: [
        'Diamante Iridiscente', 'Zafiro Abisal', 'Rubí Carmesí', 'Esmeralda Mística', 'Amatista Estelar',
        'Ópalo Galáctico', 'Topacio Solar', 'Aguamarina Polar', 'Cuarzo Rosa', 'Jade de Sangre',
        'Turquesa Astral', 'Alejandrita Cuántica', 'Ámbar Prehistórico', 'Lapislázuli Profundo', 'Obsidiana Espejo',
        'Granate de Lava', 'Espinela Violeta', 'Citrino Radiante', 'Tanzanita Cósmica', 'Piedra Lunar'
      ]
    },
    {
      id: 'NEON',
      name: 'Cyber Synthwave',
      icon: '⚡',
      archetype: 'NEON',
      sound: 'NEON',
      colors: [
        ['#00f0ff', '#ff007a'], ['#00ff66', '#00f0ff'], ['#ff0055', '#ffcc00'],
        ['#9d4edd', '#00f0ff'], ['#f72585', '#7209b7'], ['#4cc9f0', '#4361ee'],
        ['#fee440', '#f72585'], ['#06d6a0', '#118ab2'], ['#ff477e', '#ff85a1'],
        ['#7000ff', '#ff007a'], ['#3a0ca3', '#4cc9f0'], ['#7209b7', '#f72585']
      ],
      names: [
        'Láser Ciberpunk', 'Magenta Glitch', 'Matriz Digital', 'Neón Tokyo 2099', 'Holograma Cuántico',
        'Plasma Synthwave', 'Vaporwave Sunset', 'Retrowave Grid', 'Fibra Óptica Neón', 'Circuito Ión',
        'Sobrecarga Eléctrica', 'Hiperespacio Cyan', 'Frecuencia Fucsia', 'Luz de Neón Akihabara', 'Resonador Flux',
        'Megaciudad Nocturna', 'Ciber-Vórtice', 'Bucle de Datos', 'Púlsar Cibernético', 'Espectro Láser'
      ]
    },
    {
      id: 'ELEMENTAL',
      name: 'Fuerzas Elementales',
      icon: '🔥',
      archetype: 'ELEMENTAL',
      sound: 'ELEMENTAL',
      colors: [
        ['#ff4500', '#ffaa00'], ['#00d4ff', '#ffffff'], ['#ffe600', '#ff3300'],
        ['#3b82f6', '#1d4ed8'], ['#10b981', '#047857'], ['#a855f7', '#6b21a8'],
        ['#f97316', '#c2410c'], ['#06b6d4', '#0891b2'], ['#ef4444', '#991b1b'],
        ['#64748b', '#334155'], ['#dc2626', '#fca5a5'], ['#0284c7', '#bae6fd']
      ],
      names: [
        'Magma Volcánico', 'Hielo Glaciar Eterno', 'Rayo de Tormenta', 'Vórtice Tsunami', 'Plasma Estelar',
        'Fuego Azul Subterráneo', 'Arena del Desierto', 'Ceniza Volcánica', 'Tornado Huracanado', 'Furia Sísmica',
        'Llama Solar Corona', 'Escarcha Absoluta', 'Ciclón Atmosférico', 'Geiser Hirviente', 'Maremoto Abisal',
        'Brecha Tectónica', 'Vapor Termal', 'Granizo Ártico', 'Relámpago Blanco', 'Lava Basáltica'
      ]
    },
    {
      id: 'COSMIC',
      name: 'Cosmos & Galaxias',
      icon: '🌌',
      archetype: 'COSMIC',
      sound: 'COSMIC',
      colors: [
        ['#4f46e5', '#818cf8'], ['#7c3aed', '#c084fc'], ['#1e1b4b', '#4338ca'],
        ['#0f172a', '#38bdf8'], ['#312e81', '#a5b4fc'], ['#581c87', '#e879f9'],
        ['#172554', '#60a5fa'], ['#022c22', '#34d399'], ['#450a0a', '#f87171'],
        ['#18181b', '#fb7185'], ['#3b0764', '#c084fc'], ['#082f49', '#38bdf8']
      ],
      names: [
        'Nebulosa Andrómeda', 'Supernova Primordial', 'Agujero Negro Vórtice', 'Materia Oscura', 'Polvo de Estrellas',
        'Cuásar Radiante', 'Púlsar Giratorio', 'Horizonte de Sucesos', 'Vía Láctea Espiral', 'Constelación Orión',
        'Cometa Halley', 'Aurora Boreal Cósmica', 'Singularidad Gravitatoria', 'Galaxia Sombrero', 'Vórtice Intergaláctico',
        'Rayos Cósmicos', 'Dimensión Cuántica', 'Nube de Oort', 'Mareas de Gravedad', 'Eco del Big Bang'
      ]
    },
    {
      id: 'MYTHIC',
      name: 'Reinos & Míticos',
      icon: '👑',
      archetype: 'MYTHIC',
      sound: 'MYTHIC',
      colors: [
        ['#dc2626', '#ffd700'], ['#7c3aed', '#00f0ff'], ['#059669', '#fbbf24'],
        ['#d97706', '#f43f5e'], ['#2563eb', '#ec4899'], ['#4f46e5', '#10b981'],
        ['#9333ea', '#f59e0b'], ['#be123c', '#38bdf8'], ['#047857', '#818cf8'],
        ['#b45309', '#06b6d4'], ['#fef08a', '#ca8a04'], ['#b91c1c', '#7f1d1d']
      ],
      names: [
        'Escama de Dragón Carmesí', 'Aliento de Fénix Divino', 'Ojo de Leviatán', 'Hidra Abisal', 'Alas de Valkiria',
        'Runa Primordial Eterna', 'Garra de Grifo', 'Cuerno de Unicornio', 'Lanza de Odín', 'Espada Excalibur',
        'Martillo de Thor', 'Furia de Kraken', 'Canto de Sirena', 'Trono de Oro Imperial', 'Pluma de Quetzalcóatl',
        'Llama de Prometeo', 'Corona del Rey Sol', 'Lanza del Destino', 'Ojo de Ra Sagrado', 'Aliento de Bahamut'
      ]
    }
  ];

  function generateAllSkins() {
    const list = [
      {
        id: 'classic',
        name: 'Clásico Evolutivo',
        category: 'METALS',
        categoryName: 'Metales Divinos',
        rarity: 'COMMON',
        currency: 'COINS',
        price: 0,
        requiredLevel: 1,
        bonusCoins: 0,
        desc: 'Textura viva que evoluciona dinámicamente según el bioma y nivel.',
        icon: '🧱',
        color: '#ff5722',
        color2: '#ff8a50',
        archetype: 'CLASSIC',
        sound: 'DEFAULT'
      }
    ];

    // Distribución por categoría: 12 Comunes, 10 Raros, 7 Épicos, 4 Legendarios, 3 Míticos = 36 por categoría
    // 6 categorías * 36 + 1 clásico = 217 aspectos
    const rarityTiers = [
      { tier: 'COMMON', count: 12 },
      { tier: 'RARE', count: 10 },
      { tier: 'EPIC', count: 7 },
      { tier: 'LEGENDARY', count: 4 },
      { tier: 'MYTHIC', count: 3 }
    ];

    SKIN_CATEGORIES.forEach(cat => {
      let skinIdxInCat = 0;
      rarityTiers.forEach(rGroup => {
        const rDef = SKIN_RARITIES[rGroup.tier];
        const levelSpan = Math.max(1, rDef.levelMax - rDef.levelMin + 1);
        for (let k = 0; k < rGroup.count; k++) {
          const skinNum = skinIdxInCat + 1;
          const baseName = cat.names[skinIdxInCat % cat.names.length];
          const colorPair = cat.colors[skinIdxInCat % cat.colors.length];

          let skinTitle = baseName;
          if (skinIdxInCat >= 25) {
            skinTitle = `${baseName} (Mítico)`;
          } else if (skinIdxInCat >= 18) {
            skinTitle = `${baseName} (Élite)`;
          } else if (skinIdxInCat >= 10) {
            skinTitle = `${baseName} II`;
          }

          // Nivel requerido progresivo y justo
          const reqLvl = rDef.levelMin + (k % levelSpan);

          // Precio progresivo según rareza
          let calculatedPrice = rDef.basePrice;
          if (rDef.currency === 'COINS') {
            calculatedPrice += k * (rGroup.tier === 'EPIC' ? 600 : (rGroup.tier === 'RARE' ? 180 : 40));
          } else {
            calculatedPrice += k * (rGroup.tier === 'MYTHIC' ? 25 : 8);
          }

          list.push({
            id: `${cat.id.toLowerCase()}_${skinNum}`,
            name: skinTitle,
            category: cat.id,
            categoryName: cat.name,
            rarity: rGroup.tier,
            currency: rDef.currency,
            price: calculatedPrice,
            requiredLevel: reqLvl,
            bonusCoins: rDef.bonusCoins,
            desc: `${rDef.name}: Acabado ${cat.name}. Requiere Nivel ${reqLvl}. Ventaja: ${rDef.tag}.`,
            icon: cat.icon,
            color: colorPair[0],
            color2: colorPair[1],
            archetype: cat.archetype,
            sound: cat.sound
          });

          skinIdxInCat++;
        }
      });
    });

    // Mezclar equitativamente las 6 categorías y rarezas para que la tienda presente una colección variada y dinámica
    const classicSkin = list[0];
    const generated = list.slice(1);
    
    const catBuckets = {};
    SKIN_CATEGORIES.forEach(c => { catBuckets[c.id] = []; });
    generated.forEach(s => { catBuckets[s.category].push(s); });

    const mixedCatalog = [];
    for (let step = 0; step < 36; step++) {
      for (let c = 0; c < SKIN_CATEGORIES.length; c++) {
        const cat = SKIN_CATEGORIES[(c + step) % SKIN_CATEGORIES.length];
        const skinItem = catBuckets[cat.id][step];
        if (skinItem) mixedCatalog.push(skinItem);
      }
    }

    return [classicSkin, ...mixedCatalog];
  }

  const SKINS = generateAllSkins();
  const SKINS_MAP = new Map();
  SKINS.forEach(s => SKINS_MAP.set(s.id, s));

  // Retrocompatibilidad con partidas guardadas previas
  SKINS_MAP.set('neon', SKINS_MAP.get('neon_1') || SKINS[0]);
  SKINS_MAP.set('crystal', SKINS_MAP.get('gems_1') || SKINS[0]);
  SKINS_MAP.set('retro', SKINS_MAP.get('pixel_1') || SKINS[0]);

  function getSkinById(id) {
    if (!id || id === 'classic') return SKINS[0];
    return SKINS_MAP.get(id) || SKINS[0];
  }

  function formatCurrencyCompact(val) {
    if (val >= 1000000) return (val / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (val >= 1000) return (val / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return val.toString();
  }

  function updateCoinsUI() {
    const formatted = formatCurrencyCompact(coins);
    if (navCoinsCount) {
      navCoinsCount.innerText = formatted;
      navCoinsCount.title = coins.toLocaleString() + ' Monedas';
    }
    if (hudCoinsVal) hudCoinsVal.innerText = formatted;
    if (skinsModalCoins) {
      skinsModalCoins.innerText = formatted;
      skinsModalCoins.title = coins.toLocaleString() + ' Monedas';
    }
  }

  function addCoins(amount) {
    coins += amount;
    localStorage.setItem('c2c_coins', coins.toString());
    updateCoinsUI();
  }

  function updateDiamondsUI() {
    const formatted = formatCurrencyCompact(diamonds);
    if (navDiamondsCount) {
      navDiamondsCount.innerText = formatted;
      navDiamondsCount.title = diamonds.toLocaleString() + ' Diamantes';
    }
    if (hudDiamondsVal) hudDiamondsVal.innerText = formatted;
    if (skinsModalDiamonds) {
      skinsModalDiamonds.innerText = formatted;
      skinsModalDiamonds.title = diamonds.toLocaleString() + ' Diamantes';
    }
  }

  function addDiamonds(amount) {
    diamonds += amount;
    localStorage.setItem('c2c_diamonds', diamonds.toString());
    updateDiamondsUI();
  }

  function updateBoostersUI() {
    if (boosterSlowmoCount) {
      boosterSlowmoCount.innerText = `x${boostersInventory.slowmo} ${activeEquippedBoosters.slowmo ? '(ACTIVO)' : '(400 🪙)'}`;
    }
    if (boosterSlowmoToggle) {
      boosterSlowmoToggle.classList.toggle('active', !!activeEquippedBoosters.slowmo);
    }
    if (boosterTitanCount) {
      boosterTitanCount.innerText = `x${boostersInventory.titan} ${activeEquippedBoosters.titan ? '(ACTIVO)' : '(750 🪙)'}`;
    }
    if (boosterTitanToggle) {
      boosterTitanToggle.classList.toggle('active', !!activeEquippedBoosters.titan);
    }
    if (boosterReviveCount) {
      boosterReviveCount.innerText = `x${boostersInventory.revive} ${activeEquippedBoosters.revive ? '(ACTIVO)' : '(15 💎)'}`;
    }
    if (boosterReviveToggle) {
      boosterReviveToggle.classList.toggle('active', !!activeEquippedBoosters.revive);
    }
  }

  // --- Modos de Juego: MISIONES vs INFINITO ---
  let gameMode = 'MISSIONS'; // 'MISSIONS' | 'ENDLESS'
  let currentEndlessWorldIdx = 0;
  let currentEndlessBiomeIdx = 0;

  // --- Power-ups Tácticos con Cooldown ---
  let slowmoActive = false;
  let slowmoDurationFrames = 0;
  let slowmoCdFrames = 0;
  const SLOWMO_CD_TOTAL_FRAMES = 1500; // ~25s a 60 FPS
  let titanUsedThisRound = false;

  // Días de la Semana
  const DAYS_OF_WEEK = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  let weeklyData = {};
  try {
    weeklyData = JSON.parse(localStorage.getItem('c2c_weekly_records') || '{}');
  } catch (e) { weeklyData = {}; }

  let hallOfFame = [
    { name: 'KaelCosmos', floor: 50, layer: 'Nivel 8: Cosmos' },
    { name: 'NovaPioneer', floor: 45, layer: 'Nivel 7: Órbita' },
    { name: 'AstroWolf', floor: 40, layer: 'Nivel 6: Estratósfera' },
    { name: 'FrostQueen', floor: 40, layer: 'Nivel 5: Hielo' },
    { name: 'MinerPro', floor: 35, layer: 'Nivel 3: Oro' }
  ];

  // --- Estado del Juego ---
  let state = 'START'; // 'START' | 'PLAYING' | 'PAUSED' | 'GAMEOVER' | 'VICTORY'
  let dpr = window.devicePixelRatio || 1;
  let width = 0;
  let height = 0;
  let centerX = 0;
  let centerY = 0;

  let stack = [];
  let debrisList = [];
  let particles = [];
  let floatingTexts = [];
  let confettiList = [];
  let currentBlock = null;

  let score = 0;
  let combo = 0;
  let perfectCount = 0;
  let matchCoinsEarned = 0;
  let hasRevivedThisMatch = false;
  let wasAlignedLastFrame = false;
  let activeLevel = LEVELS[currentLevelIdx];
  let cameraY = 0;
  let targetCameraY = 0;
  let shineOffset = 0;

  // --- Mecánicas Adictivas Fase 3 (Modo Fiebre, Bloques Especiales y Botín) ---
  let feverActive = false;
  let feverBlocksRemaining = 0;
  let feverPulseTime = 0;
  let activeLoot = null; // { x, y, z, type: 'COIN' | 'GEM', value: 15, rot: 0, bob: 0, collected: false }

  // Screen Shake & Hit-Stop
  let shakeFrames = 0;
  let shakeIntensity = 0;
  let shakeX = 0;
  let shakeY = 0;
  let hitStopTimer = 0;
  let flashBloom = 0;

  // --- Motor de Combate de Jefes & Hechizos Aleatorios Roguelike ---
  let bossLockRemaining = 0;         // Segundos de bloqueo sísmico inicial (3.0s)
  let bossTimeTotal = 0;             // Tiempo total para completar la batalla
  let bossTimeRemaining = 0;         // Tiempo restante del cronómetro de combate
  let bossActiveSpells = [];         // Pool de hechizos elegidos al azar para esta batalla
  let bossTriggeredThresholds = [];  // Umbrales de progreso activados (25%, 50%, 75%)
  let bossCurrentSpell = null;       // Hechizo actualmente en curso
  let bossSpellTimer = 0;            // Tiempo restante del hechizo actual
  let bossCrosswindForce = 0;        // Viento huracanado activo
  let bossMirageActive = false;      // Espejismo fantasma activo
  let bossFrenzyBlocksLeft = 0;      // Bloques restantes en estado de furia
  let bossFrenzySpeedBoost = 0;      // Incremento de velocidad en furia (+35%)

  // Fondo Dinámico y Partículas Ambientales
  let bgStars = [];
  let bgBubbles = [];
  let bgEmbers = [];
  let bgSnow = [];
  let bgWarpStreaks = [];

  // --- Audio ASMR Sintetizado ---
  let audioCtx = null;
  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTone(freq, type = 'sine', duration = 0.2, gainVal = 0.2) {
    if (!userSettings.sound || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      const effectiveGain = gainVal * (userSettings.soundVolume !== undefined ? userSettings.soundVolume : 0.8);
      gain.gain.setValueAtTime(effectiveGain, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  }

  // --- FÍSICAS DE PESO ACÚSTICAS: SUB-BASS IMPACT THUMP & RESONANCIA DE SKIN ---
  function playThudSound(material, skinObj = null) {
    if (!userSettings.sound || !audioCtx) return;
    try {
      const skinArchetype = skinObj ? skinObj.archetype : null;
      if (skinArchetype === 'METALLIC') {
        playTone(660, 'triangle', 0.12, 0.28);
        setTimeout(() => playTone(1100, 'sine', 0.14, 0.20), 20);
        return;
      } else if (skinArchetype === 'GEM') {
        playTone(980, 'triangle', 0.10, 0.22);
        setTimeout(() => playTone(1480, 'sine', 0.12, 0.18), 20);
        return;
      } else if (skinArchetype === 'NEON') {
        playTone(320, 'sawtooth', 0.10, 0.20);
        setTimeout(() => playTone(640, 'sine', 0.12, 0.16), 25);
        return;
      } else if (skinArchetype === 'PIXEL') {
        playTone(440, 'square', 0.08, 0.22);
        return;
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      // Pulso sub-bajo visceral (72Hz descenciendo rápidamente a 32Hz)
      osc.frequency.setValueAtTime(72, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(32, audioCtx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.38, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.14);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.14);
    } catch (e) {}
  }

  // --- ALERTA ACÚSTICA DE BATALLA DE JEFE (FASE 5) ---
  function playBossAlertSound() {
    if (!userSettings.sound || !audioCtx) return;
    try {
      playTone(180, 'sawtooth', 0.22, 0.35);
      setTimeout(() => playTone(140, 'sawtooth', 0.28, 0.40), 140);
      setTimeout(() => playTone(110, 'sawtooth', 0.45, 0.45), 320);
    } catch (e) {}
  }

  // Sonido de rugido sísmico colosal de jefe
  function playBossRoarSound() {
    if (!userSettings.sound || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(45, audioCtx.currentTime + 0.85);
      gain.gain.setValueAtTime(0.45, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.85);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.85);
    } catch (e) {}
  }

  // Sonido de escudo deflector (cuando se intenta apilar durante el temblor de 3s)
  function playShieldDeflectSound() {
    if (!userSettings.sound || !audioCtx) return;
    try {
      playTone(920, 'triangle', 0.12, 0.25);
      setTimeout(() => playTone(440, 'sawtooth', 0.15, 0.2), 30);
    } catch (e) {}
  }

  // Sonido de invocación de hechizo del jefe
  function playBossSpellSound() {
    if (!userSettings.sound || !audioCtx) return;
    try {
      playTone(280, 'sine', 0.22, 0.3);
      setTimeout(() => playTone(680, 'sawtooth', 0.20, 0.35), 60);
      setTimeout(() => playTone(1050, 'triangle', 0.18, 0.25), 130);
    } catch (e) {}
  }

  function playMaterialSound(material) {
    if (material === 'SLIME') {
      playTone(180, 'sine', 0.25, 0.35);
      setTimeout(() => playTone(320, 'triangle', 0.15, 0.2), 40);
    } else if (material === 'ICE' || material === 'SATURN_ICE' || material === 'PRISM') {
      playTone(700, 'triangle', 0.12, 0.25);
      setTimeout(() => playTone(950, 'sine', 0.15, 0.2), 30);
    } else if (material === 'GOLD') {
      playTone(880, 'triangle', 0.3, 0.3);
      setTimeout(() => playTone(1320, 'sine', 0.4, 0.25), 60);
    } else if (material === 'MAGMA' || material === 'MARS_ROCK') {
      playTone(110, 'sawtooth', 0.3, 0.3);
    } else if (material === 'BLUE_LAVA') {
      playTone(130, 'sawtooth', 0.25, 0.3);
      setTimeout(() => playTone(260, 'sine', 0.2, 0.2), 40);
    } else if (material === 'CYBER') {
      playTone(340, 'square', 0.12, 0.22);
      setTimeout(() => playTone(680, 'sine', 0.18, 0.25), 30);
    } else if (material === 'TITAN_STONE') {
      playTone(95, 'sawtooth', 0.35, 0.35);
      setTimeout(() => playTone(190, 'triangle', 0.2, 0.25), 50);
    } else if (material === 'WOOD') {
      playTone(160, 'triangle', 0.18, 0.32);
      setTimeout(() => playTone(240, 'sine', 0.12, 0.22), 35);
    } else if (material === 'ABYSS') {
      playTone(140, 'sine', 0.35, 0.3);
      setTimeout(() => playTone(280, 'sine', 0.2, 0.2), 50);
    } else if (material === 'LUNAR') {
      playTone(220, 'triangle', 0.2, 0.25);
      setTimeout(() => playTone(440, 'sine', 0.15, 0.18), 35);
    } else if (material === 'ALIEN_TECH') {
      playTone(220, 'sawtooth', 0.25, 0.28);
      setTimeout(() => playTone(550, 'square', 0.15, 0.2), 40);
    } else {
      playTone(260, 'sine', 0.15, 0.25);
    }
  }

  function playSkinSound(skin) {
    if (!userSettings.sound || !audioCtx || !skin) return;
    const soundType = skin.sound || 'DEFAULT';
    try {
      if (soundType === 'METALLIC') {
        playTone(880, 'triangle', 0.2, 0.28);
        setTimeout(() => playTone(1320, 'sine', 0.25, 0.2), 35);
      } else if (soundType === 'GEM') {
        playTone(1046.5, 'triangle', 0.18, 0.25);
        setTimeout(() => playTone(1567.98, 'sine', 0.22, 0.22), 25);
      } else if (soundType === 'NEON') {
        playTone(440, 'sawtooth', 0.15, 0.22);
        setTimeout(() => playTone(880, 'sine', 0.2, 0.18), 30);
      } else if (soundType === 'ELEMENTAL') {
        playTone(160, 'sawtooth', 0.25, 0.28);
        setTimeout(() => playTone(240, 'triangle', 0.15, 0.2), 30);
      } else if (soundType === 'ORGANIC') {
        playTone(280, 'triangle', 0.18, 0.24);
        setTimeout(() => playTone(420, 'sine', 0.15, 0.15), 30);
      } else if (soundType === 'PIXEL') {
        playTone(523.25, 'square', 0.12, 0.2);
        setTimeout(() => playTone(659.25, 'square', 0.14, 0.18), 40);
      } else if (soundType === 'COSMIC') {
        playTone(392, 'sine', 0.3, 0.22);
        setTimeout(() => playTone(587.33, 'triangle', 0.35, 0.2), 35);
      } else if (soundType === 'ROYAL') {
        playTone(523.25, 'triangle', 0.3, 0.28);
        setTimeout(() => playTone(783.99, 'triangle', 0.35, 0.24), 45);
      } else if (soundType === 'TECH') {
        playTone(140, 'sawtooth', 0.18, 0.28);
        setTimeout(() => playTone(280, 'square', 0.12, 0.18), 25);
      } else if (soundType === 'MYTHIC') {
        playTone(659.25, 'triangle', 0.35, 0.3);
        setTimeout(() => playTone(987.77, 'sine', 0.4, 0.25), 40);
        setTimeout(() => playTone(1318.51, 'sine', 0.45, 0.2), 80);
      } else {
        playTone(440, 'triangle', 0.2, 0.25);
      }
    } catch (e) {}
  }

  function playComboChord(comboStep) {
    const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00];
    const baseFreq = scale[Math.min(comboStep - 1, scale.length - 1)];
    playTone(baseFreq, 'triangle', 0.35, 0.35);
    playTone(baseFreq * 1.5, 'sine', 0.45, 0.2);
  }

  function playVictoryFanfare() {
    if (!userSettings.sound || !audioCtx) return;
    const notes = [392, 523.25, 659.25, 783.99];
    notes.forEach((freq, idx) => {
      setTimeout(() => playTone(freq, 'triangle', 0.4, 0.35), idx * 120);
    });
  }

  function playRecoveryChime() {
    if (!userSettings.sound || !audioCtx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => playTone(freq, 'triangle', 0.3, 0.25), idx * 80);
    });
  }

  function playFeverFanfare() {
    if (!userSettings.sound || !audioCtx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((freq, idx) => {
      setTimeout(() => playTone(freq, 'sawtooth', 0.25, 0.22), idx * 55);
    });
  }

  function playLootCollectSound(type) {
    if (!userSettings.sound || !audioCtx) return;
    const notes = type === 'GEM' ? [880, 1174.66, 1567.98, 2093.00] : [783.99, 1046.50, 1567.98];
    notes.forEach((freq, idx) => {
      setTimeout(() => playTone(freq, 'triangle', 0.22, 0.25), idx * 60);
    });
  }


  // --- Música Ambiental Sintetizada Procedural (Web Audio API) ---
  let ambientMusicTimer = null;
  let ambientNoteIdx = 0;

  function startAmbientMusic() {
    if (!userSettings.music || !userSettings.sound) return;
    initAudio();
    if (ambientMusicTimer || !audioCtx) return;
    ambientMusicTimer = setInterval(tickAmbientMusic, 1200);
  }

  function stopAmbientMusic() {
    if (ambientMusicTimer) {
      clearInterval(ambientMusicTimer);
      ambientMusicTimer = null;
    }
  }

  function tickAmbientMusic() {
    if (!userSettings.music || !userSettings.sound || !audioCtx || (state !== 'PLAYING')) return;
    let notes = [130.81, 164.81, 196.00, 246.94]; // Magma
    if (activeLevel.id >= 3 && activeLevel.id <= 5) {
      notes = [196.00, 246.94, 293.66, 329.63]; // Slime/Gold/Hielo
    } else if (activeLevel.id >= 6) {
      notes = [329.63, 392.00, 493.88, 587.33]; // Estratósfera/Cosmos
    }
    const freq = notes[ambientNoteIdx % notes.length];
    const musicVol = userSettings.musicVolume !== undefined ? userSettings.musicVolume : 0.7;
    playTone(freq, 'sine', 0.85, 0.05 * musicVol);
  }

  function triggerVibrate(pattern) {
    if (!userSettings.vibrate) return;
    if (navigator.vibrate) navigator.vibrate(pattern);
  }

  // --- Screen Shake & Hit-Stop Helpers ---
  function triggerScreenShake(intensity = 3, frames = 8) {
    if (!userSettings.particles) return;
    shakeIntensity = intensity;
    shakeFrames = frames;
  }

  function triggerHitStop(frames = 3, bloom = 0.25) {
    hitStopTimer = frames;
    flashBloom = bloom;
  }

  // --- Sistema de Notificación de Logros (Toast) ---
  let toastTimeout = null;
  function unlockAchievement(id) {
    if (unlockedAchievements[id]) return;
    const ach = ACHIEVEMENTS.find(a => a.id === id);
    if (!ach) return;

    unlockedAchievements[id] = {
      unlockedAt: Date.now()
    };
    localStorage.setItem('c2c_achievements', JSON.stringify(unlockedAchievements));

    // Feedback audiovisual
    playTone(523.25, 'triangle', 0.25, 0.3);
    setTimeout(() => playTone(659.25, 'triangle', 0.35, 0.3), 80);
    setTimeout(() => playTone(783.99, 'triangle', 0.5, 0.35), 160);
    triggerVibrate([80, 40, 120]);

    // Mostrar Toast animado
    if (achievementToast && toastAchievementName) {
      toastAchievementName.innerText = `${ach.icon} ${ach.name}`;
      achievementToast.classList.remove('hidden');
      if (toastTimeout) clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => {
        achievementToast.classList.add('hidden');
      }, 3500);
    }
  }

  // --- Textos Flotantes Dinámicos (+25, +50, ¡PERFECTO!) ---
  function spawnFloatingText(text, x, y, z, color = '#ffd700', scale = 1.0) {
    const origin = isoProject(x, y, z);
    // Escalonamiento vertical inteligente: si ya hay textos flotando, subir este para evitar que se tapen
    const staggerOffset = Math.min(floatingTexts.length * 28, 84);
    floatingTexts.push({
      text,
      x: origin.x,
      y: origin.y - 38 - staggerOffset,
      vy: -1.6,
      alpha: 1.0,
      color,
      scale
    });
  }

  // --- Lluvia de Confeti Festivo para Victoria ---
  function spawnVictoryConfetti() {
    if (!userSettings.particles) return;
    confettiList = [];
    const colors = ['#ffd700', '#00ff88', '#00d4ff', '#ff007a', '#c084fc', '#ffffff'];
    for (let i = 0; i < 90; i++) {
      confettiList.push({
        x: Math.random() * width,
        y: -20 - Math.random() * 80,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2.5,
        w: Math.random() * 8 + 6,
        h: Math.random() * 12 + 8,
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.15,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.1 + 0.05,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1.0
      });
    }
  }

  // --- Ajuste de Pantalla y Redimensionamiento HiDPI (Mobile Clamped a 2x) ---
  function resize() {
    // Clamping a máximo 2x DPR para garantizar 60 FPS estables y mínimo consumo de batería en pantallas móviles QuadHD/4K
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;

    // Buffer físico de resolución completa adaptado a pantallas Retina/HiDPI
    gameCanvas.width = Math.round(width * dpr);
    gameCanvas.height = Math.round(height * dpr);
    gameCanvas.style.width = width + 'px';
    gameCanvas.style.height = height + 'px';

    updateResponsiveDimensions();
    initBackgroundObjects();
  }
  window.addEventListener('resize', resize);

  function initBackgroundObjects() {
    bgStars = [];
    for (let i = 0; i < 60; i++) {
      bgStars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.8 + 0.6,
        twinkle: Math.random() * Math.PI * 2
      });
    }

    bgBubbles = [];
    for (let i = 0; i < 20; i++) {
      bgBubbles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 4 + 2,
        vy: Math.random() * 0.7 + 0.3
      });
    }

    bgEmbers = [];
    for (let i = 0; i < 26; i++) {
      bgEmbers.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2.6 + 1.2,
        vy: Math.random() * 1.5 + 0.6,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.04 + 0.02,
        color: Math.random() > 0.4 ? '#ff6600' : (Math.random() > 0.5 ? '#ffcc00' : '#ff3300'),
        alpha: Math.random() * 0.7 + 0.3
      });
    }

    bgSnow = [];
    for (let i = 0; i < 35; i++) {
      bgSnow.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2.2 + 0.8,
        vy: Math.random() * 1.2 + 0.5,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.03 + 0.015
      });
    }

    bgWarpStreaks = [];
    for (let i = 0; i < 45; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * Math.max(width, height) * 0.75;
      bgWarpStreaks.push({
        angle,
        dist,
        speed: Math.random() * 7 + 5,
        length: Math.random() * 30 + 15
      });
    }
  }

  // --- Proyección Isométrica con Físicas de Peso Reactivas ---
  function isoProject(x, y, z) {
    const screenX = centerX + (x - z) * ISO_COS;
    const screenY = centerY + (x + z) * ISO_SIN - (y - cameraY + cameraImpactOffset);
    return { x: screenX, y: screenY };
  }

  // --- Guía Holográfica / Sombra de Contacto Volumétrica (Cero Líneas Ni Puntos Amarillos) ---
  function drawGhostGuide(curr, prev) {
    if (!userSettings.guide || !curr || !prev) return;
    const projY = prev.y + prev.height;
    const p1 = isoProject(curr.x, projY, curr.z);
    const p2 = isoProject(curr.x + curr.width, projY, curr.z);
    const p3 = isoProject(curr.x + curr.width, projY, curr.z + curr.depth);
    const p4 = isoProject(curr.x, projY, curr.z + curr.depth);

    const diff = curr.axis === 'x' ? Math.abs(curr.x - prev.x) : Math.abs(curr.z - prev.z);
    const isPerfect = diff <= PERFECT_TOLERANCE;

    ctx.save();

    if (isPerfect) {
      // 1. Resplandor Áurico Suave en la Base (Sin líneas láser ni brackets amarillos)
      ctx.fillStyle = 'rgba(56, 189, 248, 0.24)';
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y); ctx.lineTo(p4.x, p4.y);
      ctx.closePath();
      ctx.fill();
    } else {
      // 2. Sombra de Contacto Volumétrica Suave Proyectada en la Base (Aporta verdadera profundidad 3D)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.16)';
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y); ctx.lineTo(p4.x, p4.y);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }

  // ==========================================================================
  // 🎨 RENDERIZADO PROCEDURAL VOLUMÉTRICO DE ALTA FIDELIDAD (SIN LÍNEAS FALSAS)
  // ==========================================================================

  // --- SHADER PROCEDURAL PARA ASPECTOS (10 ARQUETIPOS DE TEXTURAS VOLUMÉTRICAS) ---
  function drawProceduralSkin(skin, box, topP1, topP2, topP3, topP4, botP2, botP3, botP4) {
    const c1 = skin.color || '#ff5722';
    const c2 = skin.color2 || '#ff8a50';
    const archetype = skin.archetype || 'METALLIC';

    ctx.save();

    if (archetype === 'METALLIC') {
      // 🪙 METÁLICO: Espejo degradado y destello especular móvil
      const gradLeft = ctx.createLinearGradient(topP4.x, topP4.y, botP3.x, botP3.y);
      gradLeft.addColorStop(0, c1);
      gradLeft.addColorStop(0.5, c2);
      gradLeft.addColorStop(1, '#111827');
      ctx.fillStyle = gradLeft;
      fillQuad(topP4, topP3, botP3, botP4);

      const gradRight = ctx.createLinearGradient(topP3.x, topP3.y, botP2.x, botP2.y);
      gradRight.addColorStop(0, '#111827');
      gradRight.addColorStop(0.5, c1);
      gradRight.addColorStop(1, '#030712');
      ctx.fillStyle = gradRight;
      fillQuad(topP3, topP2, botP2, botP3);

      const gradTop = ctx.createLinearGradient(topP1.x, topP1.y, topP3.x, topP3.y);
      gradTop.addColorStop(0, '#ffffff');
      gradTop.addColorStop(0.3, c2);
      gradTop.addColorStop(0.7, c1);
      gradTop.addColorStop(1, '#ffffff');
      ctx.fillStyle = gradTop;
      fillQuad(topP1, topP2, topP3, topP4);

      // Destello especular animado suave
      clipQuad(topP1, topP2, topP3, topP4);
      const glintX = (topP1.x + topP3.x) / 2 + Math.sin(shineOffset) * 55;
      const glintGrad = ctx.createLinearGradient(glintX - 18, topP1.y, glintX + 18, topP3.y);
      glintGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      glintGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.65)');
      glintGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = glintGrad;
      ctx.fillRect(topP1.x - 40, topP1.y - 20, (topP3.x - topP1.x) + 80, (topP3.y - topP1.y) + 40);
    } else if (archetype === 'GEM') {
      // 💎 GEMA: Facetas prismáticas translúcidas con refracción
      ctx.globalAlpha = 0.92;
      ctx.fillStyle = c1;
      fillQuad(topP4, topP3, botP3, botP4);
      ctx.fillStyle = '#0f172a';
      ctx.globalAlpha = 0.4;
      fillQuad(topP3, topP2, botP2, botP3);
      ctx.globalAlpha = 1.0;

      const gemTop = ctx.createLinearGradient(topP1.x, topP1.y, topP3.x, topP3.y);
      gemTop.addColorStop(0, '#ffffff');
      gemTop.addColorStop(0.3, c2);
      gemTop.addColorStop(0.8, c1);
      gemTop.addColorStop(1, '#ffffff');
      ctx.fillStyle = gemTop;
      fillQuad(topP1, topP2, topP3, topP4);

    } else if (archetype === 'NEON') {
      // ⚡ NEÓN: Cuerpo oscuro con top láser vibrante
      ctx.fillStyle = 'rgba(10, 14, 26, 0.96)';
      fillQuad(topP4, topP3, botP3, botP4);
      ctx.fillStyle = 'rgba(5, 7, 14, 0.98)';
      fillQuad(topP3, topP2, botP2, botP3);

      const neonTop = ctx.createLinearGradient(topP1.x, topP1.y, topP3.x, topP3.y);
      neonTop.addColorStop(0, c1);
      neonTop.addColorStop(1, c2);
      ctx.fillStyle = neonTop;
      fillQuad(topP1, topP2, topP3, topP4);
    } else if (archetype === 'ELEMENTAL') {
      // 🌋 ELEMENTAL: Fuego, hielo o trueno vivo con resplandor
      const elemLeft = ctx.createLinearGradient(topP4.x, topP4.y, botP3.x, botP3.y);
      elemLeft.addColorStop(0, c1);
      elemLeft.addColorStop(1, '#09090b');
      ctx.fillStyle = elemLeft;
      fillQuad(topP4, topP3, botP3, botP4);

      const elemRight = ctx.createLinearGradient(topP3.x, topP3.y, botP2.x, botP2.y);
      elemRight.addColorStop(0, '#18181b');
      elemRight.addColorStop(1, c2);
      ctx.fillStyle = elemRight;
      fillQuad(topP3, topP2, botP2, botP3);

      const elemTop = ctx.createLinearGradient(topP1.x, topP1.y, topP3.x, topP3.y);
      elemTop.addColorStop(0, c2);
      elemTop.addColorStop(0.5, c1);
      elemTop.addColorStop(1, '#ffffff');
      ctx.fillStyle = elemTop;
      fillQuad(topP1, topP2, topP3, topP4);
    } else if (archetype === 'ORGANIC') {
      // 🌿 ORGÁNICO: Tonalidades botánicas/selváticas con bisel suave
      ctx.fillStyle = c2;
      fillQuad(topP4, topP3, botP3, botP4);
      ctx.fillStyle = '#064e3b';
      fillQuad(topP3, topP2, botP2, botP3);

      const orgTop = ctx.createLinearGradient(topP1.x, topP1.y, topP3.x, topP3.y);
      orgTop.addColorStop(0, c1);
      orgTop.addColorStop(1, c2);
      ctx.fillStyle = orgTop;
      fillQuad(topP1, topP2, topP3, topP4);
    } else if (archetype === 'PIXEL') {
      // 👾 RETRO PIXEL: Cel-shaded 8-bit con contornos oscuros
      ctx.fillStyle = c1;
      fillQuad(topP4, topP3, botP3, botP4);
      ctx.fillStyle = c2;
      fillQuad(topP3, topP2, botP2, botP3);

      const pixTop = ctx.createLinearGradient(topP1.x, topP1.y, topP3.x, topP3.y);
      pixTop.addColorStop(0, '#ffffff');
      pixTop.addColorStop(0.2, c1);
      pixTop.addColorStop(1, c2);
      ctx.fillStyle = pixTop;
      fillQuad(topP1, topP2, topP3, topP4);
    } else if (archetype === 'COSMIC') {
      // 🌌 CÓSMICO: Espacio profundo con micro-estrellas brillantes
      ctx.fillStyle = '#090a16';
      fillQuad(topP4, topP3, botP3, botP4);
      ctx.fillStyle = '#03040a';
      fillQuad(topP3, topP2, botP2, botP3);

      const cosTop = ctx.createLinearGradient(topP1.x, topP1.y, topP3.x, topP3.y);
      cosTop.addColorStop(0, c1);
      cosTop.addColorStop(0.6, c2);
      cosTop.addColorStop(1, '#090a16');
      ctx.fillStyle = cosTop;
      fillQuad(topP1, topP2, topP3, topP4);

      // Partículas de polvo de estrellas en la tapa
      clipQuad(topP1, topP2, topP3, topP4);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      const midX = (topP1.x + topP3.x) / 2;
      const midY = (topP1.y + topP3.y) / 2;
      for (let s = -2; s <= 2; s++) {
        ctx.beginPath();
        ctx.arc(midX + s * 14, midY + (s % 2) * 6, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (archetype === 'ROYAL') {
      // 👑 REAL / IMPERIAL: Mármol pulido con filigrana dorada
      ctx.fillStyle = '#1e1b4b';
      fillQuad(topP4, topP3, botP3, botP4);
      ctx.fillStyle = '#0f172a';
      fillQuad(topP3, topP2, botP2, botP3);

      const royTop = ctx.createLinearGradient(topP1.x, topP1.y, topP3.x, topP3.y);
      royTop.addColorStop(0, '#fffbeb');
      royTop.addColorStop(0.4, c1);
      royTop.addColorStop(1, c2);
      ctx.fillStyle = royTop;
      fillQuad(topP1, topP2, topP3, topP4);
    } else if (archetype === 'CARBON') {
      // 🛡️ CARBON HI-TECH: Fibra de carbono mate con acento de aleación
      ctx.fillStyle = '#18181b';
      fillQuad(topP4, topP3, botP3, botP4);
      ctx.fillStyle = '#09090b';
      fillQuad(topP3, topP2, botP2, botP3);

      const carTop = ctx.createLinearGradient(topP1.x, topP1.y, topP3.x, topP3.y);
      carTop.addColorStop(0, '#27272a');
      carTop.addColorStop(0.5, '#18181b');
      carTop.addColorStop(1, '#09090b');
      ctx.fillStyle = carTop;
      fillQuad(topP1, topP2, topP3, topP4);
    } else if (archetype === 'MYTHIC') {
      // 🐉 MÍTICO: Aura radiante con degradado celestial
      ctx.shadowColor = c1;
      ctx.shadowBlur = 18;

      const myLeft = ctx.createLinearGradient(topP4.x, topP4.y, botP3.x, botP3.y);
      myLeft.addColorStop(0, c1);
      myLeft.addColorStop(1, c2);
      ctx.fillStyle = myLeft;
      fillQuad(topP4, topP3, botP3, botP4);

      const myRight = ctx.createLinearGradient(topP3.x, topP3.y, botP2.x, botP2.y);
      myRight.addColorStop(0, c2);
      myRight.addColorStop(1, '#09090b');
      ctx.fillStyle = myRight;
      fillQuad(topP3, topP2, botP2, botP3);

      const myTop = ctx.createLinearGradient(topP1.x, topP1.y, topP3.x, topP3.y);
      myTop.addColorStop(0, '#ffffff');
      myTop.addColorStop(0.3, c1);
      myTop.addColorStop(0.7, c2);
      myTop.addColorStop(1, '#ffd700');
      ctx.fillStyle = myTop;
      fillQuad(topP1, topP2, topP3, topP4);
    } else {
      // Clásico o Fallback
      ctx.fillStyle = c1;
      fillQuad(topP4, topP3, botP3, botP4);
      ctx.fillStyle = c2;
      fillQuad(topP3, topP2, botP2, botP3);
      ctx.fillStyle = '#ffffff';
      fillQuad(topP1, topP2, topP3, topP4);
    }

    ctx.restore();
  }

  let cachedLavaPattern = null;
  function getLavaPattern(targetCtx) {
    if (cachedLavaPattern) return cachedLavaPattern;
    const can = document.createElement('canvas');
    can.width = 128;
    can.height = 128;
    const c = can.getContext('2d');
    const imgData = c.createImageData(128, 128);
    const data = imgData.data;

    for (let y = 0; y < 128; y++) {
      for (let x = 0; x < 128; x++) {
        const nx = x / 128;
        const ny = y / 128;
        const v1 = Math.sin(nx * 14 + Math.cos(ny * 12));
        const v2 = Math.sin(ny * 18 + Math.cos(nx * 16));
        const v3 = Math.sin((nx + ny) * 22 + Math.sin(nx * 28 - ny * 14));
        const n = (v1 + v2 + v3 + 3) / 6;

        let r, g, b;
        if (n > 0.70) {
          const t = (n - 0.70) / 0.30;
          r = 255;
          g = Math.floor(215 + 40 * t);
          b = Math.floor(80 + 130 * t);
        } else if (n > 0.45) {
          const t = (n - 0.45) / 0.25;
          r = 255;
          g = Math.floor(70 + 145 * t);
          b = Math.floor(10 * t);
        } else if (n > 0.25) {
          const t = (n - 0.25) / 0.20;
          r = Math.floor(165 + 90 * t);
          g = Math.floor(15 + 55 * t);
          b = 0;
        } else {
          const t = n / 0.25;
          r = Math.floor(55 + 110 * t);
          g = Math.floor(12 + 15 * t);
          b = 8;
        }

        const idx = (y * 128 + x) * 4;
        data[idx] = r;
        data[idx + 1] = g;
        data[idx + 2] = b;
        data[idx + 3] = 255;
      }
    }
    c.putImageData(imgData, 0, 0);
    cachedLavaPattern = targetCtx.createPattern(can, 'repeat');
    return cachedLavaPattern;
  }

  function drawIsoBox(box) {
    const { x, y, z, width: w, depth: d, height: h, material, springScaleY = 1, springScaleX = 1 } = box;
    if (w <= 0 || d <= 0) return;

    // Físicas de peso: Compresión vertical y ensanchamiento inercial horizontal
    const effH = h * (box.squashY || 1) * springScaleY;
    const effW = w * (box.squashXZ || 1) * springScaleX;
    const effD = d * (box.squashXZ || 1) * springScaleX;

    const topP1 = isoProject(x, y + effH, z);
    const topP2 = isoProject(x + effW, y + effH, z);
    const topP3 = isoProject(x + effW, y + effH, z + effD);
    const topP4 = isoProject(x, y + effH, z + effD);

    const botP2 = isoProject(x + effW, y, z);
    const botP3 = isoProject(x + effW, y, z + effD);
    const botP4 = isoProject(x, y, z + effD);

    // --- Sombra de Contacto y Oclusión Ambiental Inferior (AO Crevice con Aura de Jefe) ---
    ctx.save();
    if (material === 'MAGMA') {
      ctx.shadowColor = 'rgba(255, 60, 0, 0.6)';
      ctx.shadowBlur = 14;
      ctx.fillStyle = 'rgba(70, 12, 0, 0.55)';
    } else if (activeLevel && (activeLevel.isBoss || activeLevel.isSuperBoss)) {
      // Proyección temática de la sombra en bloques durante batalla contra Jefes
      const bWorldId = (activeLevel.world && activeLevel.world.id) || 1;
      if (activeLevel.isSuperBoss || bWorldId >= 15) {
        ctx.shadowColor = 'rgba(168, 85, 247, 0.75)';
        ctx.shadowBlur = 16;
        ctx.fillStyle = 'rgba(40, 10, 60, 0.55)';
      } else if (bWorldId === 2) {
        ctx.shadowColor = 'rgba(0, 255, 136, 0.65)';
        ctx.shadowBlur = 15;
        ctx.fillStyle = 'rgba(0, 45, 20, 0.52)';
      } else if (bWorldId === 6 || bWorldId === 13) {
        ctx.shadowColor = 'rgba(56, 189, 248, 0.7)';
        ctx.shadowBlur = 15;
        ctx.fillStyle = 'rgba(8, 35, 60, 0.52)';
      } else if (bWorldId === 4) {
        ctx.shadowColor = 'rgba(0, 240, 255, 0.7)';
        ctx.shadowBlur = 15;
        ctx.fillStyle = 'rgba(4, 30, 45, 0.52)';
      } else {
        ctx.shadowColor = 'rgba(255, 60, 0, 0.68)';
        ctx.shadowBlur = 15;
        ctx.fillStyle = 'rgba(60, 15, 0, 0.55)';
      }
    } else {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.42)';
    }
    const sh1 = isoProject(x, y - 1.5, z);
    const sh2 = isoProject(x + effW, y - 1.5, z);
    const sh3 = isoProject(x + effW, y - 1.5, z + effD);
    const sh4 = isoProject(x, y - 1.5, z + effD);
    fillQuad(sh1, sh2, sh3, sh4);
    ctx.restore();

    // --- 1. BLOQUE BASE INICIAL: BÁSICO, LIMPIO, ELEGANTE Y DE ALTA VISIBILIDAD ---
    if (box.isBase) {
      // Pedestal arquitectónico estilo arcade moderno: pizarra pulida con biseles claros y borde iluminado
      const baseTopGrad = ctx.createLinearGradient(topP1.x, topP1.y, topP3.x, topP3.y);
      baseTopGrad.addColorStop(0, '#5a687d');
      baseTopGrad.addColorStop(0.5, '#445166');
      baseTopGrad.addColorStop(1, '#333f52');

      // Cara lateral izquierda (sombra media)
      ctx.fillStyle = '#283344'; fillQuad(topP4, topP3, botP3, botP4);
      // Cara lateral derecha (sombra profunda)
      ctx.fillStyle = '#1c2432'; fillQuad(topP3, topP2, botP2, botP3);
      // Cara superior (superficie principal iluminada)
      ctx.fillStyle = baseTopGrad; fillQuad(topP1, topP2, topP3, topP4);

      // Marco de precisión y resplandor sutil para que el jugador distinga claramente los bordes de la base
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(topP1.x, topP1.y);
      ctx.lineTo(topP2.x, topP2.y);
      ctx.lineTo(topP3.x, topP3.y);
      ctx.lineTo(topP4.x, topP4.y);
      ctx.closePath();
      ctx.stroke();

      // Indicador de centro de alineación sutil estilo diana
      ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
      const midX = (topP1.x + topP3.x) / 2;
      const midY = (topP1.y + topP3.y) / 2;
      ctx.beginPath();
      ctx.arc(midX, midY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }

    // --- 2. SKINS PERSONALIZADAS DE LA TIENDA ---
    if (equippedSkin !== 'classic') {
      const activeSkinObj = getSkinById(equippedSkin);
      if (activeSkinObj && activeSkinObj.id !== 'classic') {
        drawProceduralSkin(activeSkinObj, box, topP1, topP2, topP3, topP4, botP2, botP3, botP4);
        return;
      }
    }

    // --- 3. MODO CLÁSICO POR DEFECTO: BLOQUES BÁSICOS SIN EFECTOS TEMÁTICOS ---
    // Si el jugador no tiene skin comprada/equipada, se apilan bloques clásicos limpios y puros
    if (equippedSkin === 'classic') {
      const topHue = box.hue % 360;
      const topGrad = ctx.createLinearGradient(topP1.x, topP1.y, topP3.x, topP3.y);
      topGrad.addColorStop(0, `hsl(${topHue}, 88%, 72%)`);
      topGrad.addColorStop(0.6, `hsl(${topHue}, 82%, 62%)`);
      topGrad.addColorStop(1, `hsl(${topHue}, 78%, 56%)`);

      ctx.fillStyle = `hsl(${topHue}, 74%, 44%)`; fillQuad(topP4, topP3, botP3, botP4);
      ctx.fillStyle = `hsl(${topHue}, 70%, 30%)`; fillQuad(topP3, topP2, botP2, botP3);
      ctx.fillStyle = topGrad; fillQuad(topP1, topP2, topP3, topP4);
      return;
    }

    // --- 1. BLOQUE DE ORO (Metálico pulido con reflejo especular) ---
    if (material === 'GOLD') {
      const gradLeft = ctx.createLinearGradient(topP4.x, topP4.y, botP3.x, botP3.y);
      gradLeft.addColorStop(0, '#e6b800'); gradLeft.addColorStop(0.5, '#ffd700'); gradLeft.addColorStop(1, '#997a00');
      ctx.fillStyle = gradLeft; fillQuad(topP4, topP3, botP3, botP4);

      const gradRight = ctx.createLinearGradient(topP3.x, topP3.y, botP2.x, botP2.y);
      gradRight.addColorStop(0, '#cca300'); gradRight.addColorStop(0.5, '#e6b800'); gradRight.addColorStop(1, '#665200');
      ctx.fillStyle = gradRight; fillQuad(topP3, topP2, botP2, botP3);

      const gradTop = ctx.createLinearGradient(topP1.x, topP1.y, topP3.x, topP3.y);
      gradTop.addColorStop(0, '#fffbe0'); gradTop.addColorStop(0.3, '#ffd700'); gradTop.addColorStop(0.7, '#e6b800'); gradTop.addColorStop(1, '#fff2a6');
      ctx.fillStyle = gradTop; fillQuad(topP1, topP2, topP3, topP4);

      ctx.save();
      clipQuad(topP1, topP2, topP3, topP4);
      const glintX = (topP1.x + topP3.x) / 2 + Math.sin(shineOffset) * 60;
      const glintGrad = ctx.createLinearGradient(glintX - 16, topP1.y, glintX + 16, topP3.y);
      glintGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      glintGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.75)');
      glintGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = glintGrad;
      ctx.fillRect(topP1.x - 40, topP1.y - 20, (topP3.x - topP1.x) + 80, (topP3.y - topP1.y) + 40);
      ctx.restore();
      return;
    }

    // --- 2. BLOQUE DE MAGMA (Textura Orgánica de Lava Volcánica Genuina) ---
    if (material === 'MAGMA') {
      const lavaPat = getLavaPattern(ctx);

      // 1. Cara Izquierda: Textura de Lava con Iluminación Directa
      ctx.save();
      ctx.fillStyle = lavaPat;
      fillQuad(topP4, topP3, botP3, botP4);
      // Sombreado 3D suave (luz superior y base más oscura)
      const leftShade = ctx.createLinearGradient(topP4.x, topP4.y, botP3.x, botP3.y);
      leftShade.addColorStop(0, 'rgba(255, 140, 0, 0.25)');
      leftShade.addColorStop(1, 'rgba(40, 5, 0, 0.65)');
      ctx.fillStyle = leftShade;
      fillQuad(topP4, topP3, botP3, botP4);
      ctx.restore();

      // 2. Cara Derecha: Textura de Lava en Penumbra 3D
      ctx.save();
      ctx.fillStyle = lavaPat;
      fillQuad(topP3, topP2, botP2, botP3);
      // Sombreado profundo en penumbra
      const rightShade = ctx.createLinearGradient(topP3.x, topP3.y, botP2.x, botP2.y);
      rightShade.addColorStop(0, 'rgba(80, 10, 0, 0.45)');
      rightShade.addColorStop(1, 'rgba(20, 2, 0, 0.85)');
      ctx.fillStyle = rightShade;
      fillQuad(topP3, topP2, botP2, botP3);
      ctx.restore();

      // 3. Cara Superior: Océano de Magma Puro Texturizado
      ctx.save();
      ctx.fillStyle = lavaPat;
      fillQuad(topP1, topP2, topP3, topP4);

      // Resplandor térmico sutil que pulsa en la superficie
      clipQuad(topP1, topP2, topP3, topP4);
      const cX = (topP1.x + topP2.x + topP3.x + topP4.x) * 0.25;
      const cY = (topP1.y + topP2.y + topP3.y + topP4.y) * 0.25;
      const t = Date.now() * 0.002;
      const heatG = ctx.createRadialGradient(cX, cY, 5, cX, cY, effW * 0.6);
      heatG.addColorStop(0, 'rgba(255, 240, 150, 0.35)');
      heatG.addColorStop(0.5, 'rgba(255, 100, 0, 0.15)');
      heatG.addColorStop(1, 'rgba(180, 20, 0, 0)');
      ctx.fillStyle = heatG;
      ctx.beginPath();
      ctx.ellipse(cX, cY, effW * 0.6, effD * 0.32, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 4. Borde Incandescente de Precisión Total
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 190, 60, 0.95)';
      ctx.lineWidth = 1.6;
      ctx.shadowColor = '#ff5500';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(topP1.x, topP1.y);
      ctx.lineTo(topP2.x, topP2.y);
      ctx.lineTo(topP3.x, topP3.y);
      ctx.lineTo(topP4.x, topP4.y);
      ctx.closePath();
      ctx.stroke();

      // Arista vertical frontal viva
      ctx.strokeStyle = '#ffa600';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(topP3.x, topP3.y);
      ctx.lineTo(botP3.x, botP3.y);
      ctx.stroke();
      ctx.restore();

      return;
    }

    // --- 3. BLOQUE DE LAVA AZUL (Obsidiana con Plasma Incandescente) ---
    if (material === 'BLUE_LAVA') {
      const stoneLeft = ctx.createLinearGradient(topP4.x, topP4.y, botP3.x, botP3.y);
      stoneLeft.addColorStop(0, '#0a1d30'); stoneLeft.addColorStop(1, '#040b14');
      ctx.fillStyle = stoneLeft; fillQuad(topP4, topP3, botP3, botP4);

      const stoneRight = ctx.createLinearGradient(topP3.x, topP3.y, botP2.x, botP2.y);
      stoneRight.addColorStop(0, '#071524'); stoneRight.addColorStop(1, '#02060a');
      ctx.fillStyle = stoneRight; fillQuad(topP3, topP2, botP2, botP3);

      const stoneTop = ctx.createLinearGradient(topP1.x, topP1.y, topP3.x, topP3.y);
      stoneTop.addColorStop(0, '#0e2944'); stoneTop.addColorStop(1, '#061320');
      ctx.fillStyle = stoneTop; fillQuad(topP1, topP2, topP3, topP4);

      ctx.save();
      clipQuad(topP1, topP2, topP3, topP4);
      const pCenter = isoProject(x + effW * 0.5, y + effH, z + effD * 0.5);
      const pRad = Math.max(10, effW * 0.36);
      const pGrad = ctx.createRadialGradient(pCenter.x, pCenter.y, 2, pCenter.x, pCenter.y, pRad);
      pGrad.addColorStop(0, '#ffffff'); pGrad.addColorStop(0.2, '#67e8f9'); pGrad.addColorStop(0.6, '#0284c7'); pGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');
      ctx.fillStyle = pGrad;
      ctx.beginPath(); ctx.arc(pCenter.x, pCenter.y, pRad, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      return;
    }

    // --- 4. BLOQUE DE SLIME (Gelatina Jade Translúcida) ---
    if (material === 'SLIME') {
      ctx.fillStyle = 'rgba(0, 160, 80, 0.9)'; fillQuad(topP4, topP3, botP3, botP4);
      ctx.fillStyle = 'rgba(0, 115, 55, 0.92)'; fillQuad(topP3, topP2, botP2, botP3);
      const slimeTop = ctx.createLinearGradient(topP1.x, topP1.y, topP3.x, topP3.y);
      slimeTop.addColorStop(0, 'rgba(120, 255, 190, 0.95)'); slimeTop.addColorStop(0.5, 'rgba(0, 255, 136, 0.95)'); slimeTop.addColorStop(1, 'rgba(0, 200, 100, 0.95)');
      ctx.fillStyle = slimeTop; fillQuad(topP1, topP2, topP3, topP4);

      ctx.save();
      clipQuad(topP1, topP2, topP3, topP4);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.beginPath();
      ctx.ellipse((topP1.x + topP2.x) / 2, (topP1.y + topP3.y) / 2 - 2, effW * 0.28, effD * 0.14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }

    // --- 5. BLOQUE DE HIELO & SATURNO (Cristal Glaciar Translúcido) ---
    if (material === 'ICE' || material === 'SATURN_ICE') {
      ctx.fillStyle = 'rgba(70, 185, 235, 0.88)'; fillQuad(topP4, topP3, botP3, botP4);
      ctx.fillStyle = 'rgba(30, 125, 180, 0.88)'; fillQuad(topP3, topP2, botP2, botP3);
      const iceTop = ctx.createLinearGradient(topP1.x, topP1.y, topP3.x, topP3.y);
      iceTop.addColorStop(0, '#ffffff'); iceTop.addColorStop(0.4, 'rgba(215, 248, 255, 0.95)'); iceTop.addColorStop(1, 'rgba(150, 225, 250, 0.9)');
      ctx.fillStyle = iceTop; fillQuad(topP1, topP2, topP3, topP4);
      return;
    }

    // --- 6. BLOQUE CYBER (Aleación de Titanio con Circuitos de Neón y Nodos) ---
    if (material === 'CYBER') {
      const cyLeft = ctx.createLinearGradient(topP4.x, topP4.y, botP3.x, botP3.y);
      cyLeft.addColorStop(0, '#1e293b'); cyLeft.addColorStop(1, '#0f172a');
      ctx.fillStyle = cyLeft; fillQuad(topP4, topP3, botP3, botP4);

      const cyRight = ctx.createLinearGradient(topP3.x, topP3.y, botP2.x, botP2.y);
      cyRight.addColorStop(0, '#0f172a'); cyRight.addColorStop(1, '#020617');
      ctx.fillStyle = cyRight; fillQuad(topP3, topP2, botP2, botP3);

      const cyTop = ctx.createLinearGradient(topP1.x, topP1.y, topP3.x, topP3.y);
      cyTop.addColorStop(0, '#334155'); cyTop.addColorStop(0.5, '#1e293b'); cyTop.addColorStop(1, '#0f172a');
      ctx.fillStyle = cyTop; fillQuad(topP1, topP2, topP3, topP4);

      // Núcleo de microprocesador cuántico y nodos luminosos volumétricos en la tapa
      ctx.save();
      clipQuad(topP1, topP2, topP3, topP4);
      const centerNode = isoProject(x + effW * 0.5, y + effH, z + effD * 0.5);
      const chipGlow = ctx.createRadialGradient(centerNode.x, centerNode.y, 1, centerNode.x, centerNode.y, Math.min(effW, effD) * 0.35);
      chipGlow.addColorStop(0, 'rgba(0, 240, 255, 0.45)');
      chipGlow.addColorStop(0.6, 'rgba(255, 0, 122, 0.18)');
      chipGlow.addColorStop(1, 'rgba(0, 240, 255, 0)');
      ctx.fillStyle = chipGlow;
      ctx.beginPath();
      ctx.arc(centerNode.x, centerNode.y, Math.min(effW, effD) * 0.35, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#00f0ff';
      ctx.beginPath(); ctx.arc(centerNode.x, centerNode.y, 3, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      return;
    }

    // --- 7. BLOQUE TITÁN ANCESTRAL (Cantería de Granito con Runas de Oro Arcano) ---
    if (material === 'TITAN_STONE') {
      const stLeft = ctx.createLinearGradient(topP4.x, topP4.y, botP3.x, botP3.y);
      stLeft.addColorStop(0, '#57534e'); stLeft.addColorStop(1, '#292524');
      ctx.fillStyle = stLeft; fillQuad(topP4, topP3, botP3, botP4);

      const stRight = ctx.createLinearGradient(topP3.x, topP3.y, botP2.x, botP2.y);
      stRight.addColorStop(0, '#44403c'); stRight.addColorStop(1, '#1c1917');
      ctx.fillStyle = stRight; fillQuad(topP3, topP2, botP2, botP3);

      const stTop = ctx.createLinearGradient(topP1.x, topP1.y, topP3.x, topP3.y);
      stTop.addColorStop(0, '#78716c'); stTop.addColorStop(0.5, '#57534e'); stTop.addColorStop(1, '#44403c');
      ctx.fillStyle = stTop; fillQuad(topP1, topP2, topP3, topP4);

      // Medallón de runa arcana dorada volumétrica (sin alambres)
      ctx.save();
      clipQuad(topP1, topP2, topP3, topP4);
      const rCenter = isoProject(x + effW * 0.5, y + effH, z + effD * 0.5);
      const runeGlow = ctx.createRadialGradient(rCenter.x, rCenter.y, 1, rCenter.x, rCenter.y, Math.min(effW, effD) * 0.3);
      runeGlow.addColorStop(0, 'rgba(251, 191, 36, 0.45)');
      runeGlow.addColorStop(1, 'rgba(251, 191, 36, 0)');
      ctx.fillStyle = runeGlow;
      ctx.beginPath(); ctx.arc(rCenter.x, rCenter.y, Math.min(effW, effD) * 0.3, 0, Math.PI * 2); ctx.fill();

      ctx.fillStyle = 'rgba(251, 191, 36, 0.9)';
      ctx.beginPath(); ctx.arc(rCenter.x, rCenter.y, 3.5, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      return;
    }

    // --- 8. BLOQUE DE MADERA (Tablones Náuticos y Remaches Forjados de Galeón) ---
    if (material === 'WOOD') {
      const wLeft = ctx.createLinearGradient(topP4.x, topP4.y, botP3.x, botP3.y);
      wLeft.addColorStop(0, '#78350f'); wLeft.addColorStop(1, '#451a03');
      ctx.fillStyle = wLeft; fillQuad(topP4, topP3, botP3, botP4);

      const wRight = ctx.createLinearGradient(topP3.x, topP3.y, botP2.x, botP2.y);
      wRight.addColorStop(0, '#592207'); wRight.addColorStop(1, '#270e02');
      ctx.fillStyle = wRight; fillQuad(topP3, topP2, botP2, botP3);

      const wTop = ctx.createLinearGradient(topP1.x, topP1.y, topP3.x, topP3.y);
      wTop.addColorStop(0, '#92400e'); wTop.addColorStop(0.5, '#78350f'); wTop.addColorStop(1, '#592207');
      ctx.fillStyle = wTop; fillQuad(topP1, topP2, topP3, topP4);

      // Remaches esquineros de latón forjado en madera (sólidos sin líneas)
      ctx.save();
      clipQuad(topP1, topP2, topP3, topP4);
      const rivetCenter = isoProject(x + effW * 0.5, y + effH, z + effD * 0.5);
      ctx.fillStyle = 'rgba(69, 26, 3, 0.35)';
      ctx.beginPath(); ctx.arc(rivetCenter.x, rivetCenter.y, 3.5, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      return;
    }

    // --- 9. BLOQUE ABISAL (Arrecife Coralino Bioluminiscente) ---
    if (material === 'ABYSS') {
      ctx.fillStyle = '#064e3b'; fillQuad(topP4, topP3, botP3, botP4);
      ctx.fillStyle = '#022c22'; fillQuad(topP3, topP2, botP2, botP3);
      const abTop = ctx.createLinearGradient(topP1.x, topP1.y, topP3.x, topP3.y);
      abTop.addColorStop(0, '#0d9488'); abTop.addColorStop(0.5, '#0f766e'); abTop.addColorStop(1, '#042f2e');
      ctx.fillStyle = abTop; fillQuad(topP1, topP2, topP3, topP4);
      return;
    }

    // --- 10. BLOQUE LUNAR (Regolito de Alta Densidad con Resplandor Plateado) ---
    if (material === 'LUNAR') {
      const lLeft = ctx.createLinearGradient(topP4.x, topP4.y, botP3.x, botP3.y);
      lLeft.addColorStop(0, '#475569'); lLeft.addColorStop(1, '#1e293b');
      ctx.fillStyle = lLeft; fillQuad(topP4, topP3, botP3, botP4);

      const lRight = ctx.createLinearGradient(topP3.x, topP3.y, botP2.x, botP2.y);
      lRight.addColorStop(0, '#334155'); lRight.addColorStop(1, '#0f172a');
      ctx.fillStyle = lRight; fillQuad(topP3, topP2, botP2, botP3);

      const lTop = ctx.createLinearGradient(topP1.x, topP1.y, topP3.x, topP3.y);
      lTop.addColorStop(0, '#cbd5e1'); lTop.addColorStop(0.5, '#94a3b8'); lTop.addColorStop(1, '#64748b');
      ctx.fillStyle = lTop; fillQuad(topP1, topP2, topP3, topP4);
      return;
    }

    // --- 11. BLOQUES CÓSMICOS / ALIENÍGENAS / AURORA / VÓRTICE / MARTE / PRISMA / WARP ---
    let topColor = `hsl(${box.hue}, 85%, 68%)`;
    let leftColor = `hsl(${box.hue}, 75%, 48%)`;
    let rightColor = `hsl(${box.hue}, 70%, 34%)`;

    if (material === 'ALIEN_TECH') {
      topColor = '#f472b6'; leftColor = '#db2777'; rightColor = '#831843';
    } else if (material === 'AURORA' || material === 'MAGNET') {
      topColor = '#e9d5ff'; leftColor = '#a855f7'; rightColor = '#6b21a8';
    } else if (material === 'SOLAR_FIRE') {
      topColor = '#fdba74'; leftColor = '#ea580c'; rightColor = '#9a3412';
    } else if (material === 'BLACK_HOLE') {
      topColor = '#c084fc'; leftColor = '#7e22ce'; rightColor = '#1e1b4b';
    } else if (material === 'MARS_ROCK') {
      topColor = '#fca5a5'; leftColor = '#dc2626'; rightColor = '#7f1d1d';
    } else if (material === 'ANDROMEDA' || material === 'COSMOS_CORE' || material === 'COSMOS') {
      topColor = '#fbcfe8'; leftColor = '#ec4899'; rightColor = '#831843';
    } else if (material === 'PRISM') {
      topColor = '#fed7aa'; leftColor = '#fb7185'; rightColor = '#4f46e5';
    } else if (material === 'WARP') {
      topColor = '#fef08a'; leftColor = '#eab308'; rightColor = '#713f12';
    }

    ctx.fillStyle = leftColor; fillQuad(topP4, topP3, botP3, botP4);
    ctx.fillStyle = rightColor; fillQuad(topP3, topP2, botP2, botP3);
    ctx.fillStyle = topColor; fillQuad(topP1, topP2, topP3, topP4);
    // Bloque 100% volumétrico limpio sin líneas de alambre ni biseles artificiales
  }

  // Función auxiliar de matizado y luminosidad para caras 3D de escombros
  function shadeHexColor(color, percent) {
    if (!color || typeof color !== 'string' || !color.startsWith('#')) return color;
    let hex = color.slice(1);
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const num = parseInt(hex, 16);
    if (isNaN(num)) return color;
    let r = (num >> 16) + Math.round(255 * percent);
    let g = ((num >> 8) & 0x00FF) + Math.round(255 * percent);
    let b = (num & 0x0000FF) + Math.round(255 * percent);
    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  // --- DIBUJADO DE ESCOMBROS EN 3D CON ROTACIÓN (TUMBLING DEBRIS) ---
  function drawDebris(d) {
    if (d.alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, d.alpha));

    const cx = d.x + d.width / 2;
    const cy = d.y + d.height / 2;
    const cz = d.z + d.depth / 2;

    const hw = d.width / 2;
    const hh = d.height / 2;
    const hd = d.depth / 2;

    // Los 8 vértices locales
    const localVerts = [
      [-hw, hh, -hd], [hw, hh, -hd], [hw, hh, hd], [-hw, hh, hd], // Top 4
      [-hw, -hh, -hd], [hw, -hh, -hd], [hw, -hh, hd], [-hw, -hh, hd] // Bot 4
    ];

    const rx = d.rotX || 0;
    const ry = d.rotY || 0;
    const rz = d.rotZ || 0;

    const cosX = Math.cos(rx), sinX = Math.sin(rx);
    const cosY = Math.cos(ry), sinY = Math.sin(ry);
    const cosZ = Math.cos(rz), sinZ = Math.sin(rz);

    // Transformación de rotación 3D Euler
    const screenVerts = localVerts.map(v => {
      let x0 = v[0], y0 = v[1], z0 = v[2];

      // Rotación X
      let y1 = y0 * cosX - z0 * sinX;
      let z1 = y0 * sinX + z0 * cosX;

      // Rotación Y
      let x2 = x0 * cosY + z1 * sinY;
      let z2 = -x0 * sinY + z1 * cosY;

      // Rotación Z
      let x3 = x2 * cosZ - y1 * sinZ;
      let y3 = x2 * sinZ + y1 * cosZ;

      return isoProject(cx + x3, cy + y3, cz + z2);
    });

    const [t1, t2, t3, t4, b1, b2, b3, b4] = screenVerts;

    // Color según aspecto equipado (Skin personalizada) o material base
    let fillL, fillR, fillT;
    if (d.skin && d.skin.id !== 'classic') {
      const c1 = d.skin.color || '#ff007a';
      const c2 = d.skin.color2 || '#ffffff';
      fillT = c2;
      fillL = c1;
      fillR = shadeHexColor(c1, -0.32);
      if (d.skin.archetype === 'NEON') {
        ctx.shadowColor = c1;
        ctx.shadowBlur = 12;
      }
    } else {
      if (d.material === 'GOLD' || d.material === 'TITAN_STONE') {
        fillL = '#cca300'; fillR = '#997a00'; fillT = '#ffd700';
      } else if (d.material === 'MAGMA' || d.material === 'MARS_ROCK') {
        fillL = '#ff4500'; fillR = '#b81600'; fillT = '#ffa800';
        ctx.shadowColor = '#ff6a00';
        ctx.shadowBlur = 8;
      } else if (d.material === 'BLUE_LAVA') {
        fillL = '#0a1d30'; fillR = '#040b14'; fillT = '#38bdf8';
      } else if (d.material === 'SLIME') {
        fillL = '#00a352'; fillR = '#00753b'; fillT = '#00ff88';
      } else if (d.material === 'ICE' || d.material === 'SATURN_ICE') {
        fillL = '#2298c4'; fillR = '#176b8a'; fillT = '#e0f8ff';
      } else if (d.material === 'CYBER') {
        fillL = '#0f2744'; fillR = '#071526'; fillT = '#38bdf8';
      } else if (d.material === 'WOOD') {
        fillL = '#4a2c11'; fillR = '#2d1a08'; fillT = '#854d0e';
      } else if (d.material === 'ABYSS') {
        fillL = '#042f2e'; fillR = '#021817'; fillT = '#2dd4bf';
      } else if (d.material === 'ALIEN_TECH') {
        fillL = '#4a044e'; fillR = '#28022a'; fillT = '#ec4899';
      } else if (d.material === 'AURORA' || d.material === 'BLACK_HOLE') {
        fillL = '#3b0764'; fillR = '#200336'; fillT = '#c084fc';
      } else if (d.material === 'LUNAR') {
        fillL = '#334155'; fillR = '#1e293b'; fillT = '#cbd5e1';
      } else if (d.material === 'SOLAR_FIRE') {
        fillL = '#7c2d12'; fillR = '#431407'; fillT = '#fb923c';
      } else if (d.material === 'ANDROMEDA' || d.material === 'PRISM') {
        fillL = '#312e81'; fillR = '#1e1b4b'; fillT = '#818cf8';
      } else if (d.material === 'WARP') {
        fillL = '#713f12'; fillR = '#422006'; fillT = '#facc15';
      } else {
        fillL = '#475569'; fillR = '#334155'; fillT = '#64748b';
      }
    }

    ctx.fillStyle = fillL; fillQuad(t4, t3, b3, b4);
    ctx.fillStyle = fillR; fillQuad(t3, t2, b2, b3);
    ctx.fillStyle = fillT; fillQuad(t1, t2, t3, t4);

    ctx.restore();
  }

  // Utilidades de dibujo cuadrilátero
  function fillQuad(p1, p2, p3, p4) {
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y); ctx.lineTo(p4.x, p4.y);
    ctx.closePath(); ctx.fill();
  }
  function strokeQuad(p1, p2, p3, p4) {
    // Cero alambres ni líneas artificiales: los bloques son sólidos volumétricos puros
    return;
  }
  function clipQuad(p1, p2, p3, p4) {
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y); ctx.lineTo(p4.x, p4.y);
    ctx.closePath(); ctx.clip();
  }

  // --- Partículas Ambientales y de Impacto ---
  function spawnParticles(x, y, z, materialOrColor, count = 12) {
    if (!userSettings.particles) return;
    const origin = isoProject(x, y, z);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1.5;
      let pColor = '#ffffff';
      if (typeof materialOrColor === 'string' && materialOrColor.startsWith('#')) {
        pColor = materialOrColor;
      } else if (materialOrColor === 'MAGMA' || materialOrColor === 'MARS_ROCK') {
        pColor = '#ff4500';
      } else if (materialOrColor === 'SLIME') {
        pColor = '#00ff88';
      } else if (materialOrColor === 'ICE' || materialOrColor === 'SATURN_ICE') {
        pColor = '#00d4ff';
      } else if (materialOrColor === 'GOLD' || materialOrColor === 'TITAN_STONE') {
        pColor = '#ffd700';
      } else if (materialOrColor === 'CYBER' || materialOrColor === 'BLUE_LAVA') {
        pColor = '#38bdf8';
      } else if (materialOrColor === 'ABYSS') {
        pColor = '#2dd4bf';
      } else if (materialOrColor === 'WOOD') {
        pColor = '#a3e635';
      } else if (materialOrColor === 'ALIEN_TECH' || materialOrColor === 'COSMOS_CORE') {
        pColor = '#ec4899';
      } else if (materialOrColor === 'AURORA' || materialOrColor === 'BLACK_HOLE') {
        pColor = '#c084fc';
      } else if (materialOrColor === 'SOLAR_FIRE') {
        pColor = '#fb923c';
      } else if (materialOrColor === 'WARP') {
        pColor = '#facc15';
      } else if (materialOrColor === 'LUNAR') {
        pColor = '#cbd5e1';
      } else if (materialOrColor === 'ANDROMEDA' || materialOrColor === 'PRISM') {
        pColor = '#818cf8';
      }

      particles.push({
        x: origin.x, y: origin.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        life: 1.0,
        decay: Math.random() * 0.03 + 0.02,
        color: pColor,
        size: Math.random() * 3 + 2
      });
    }
  }

  // --- Renderizado de Botín Flotante Deluxe (Monedas de Oro 3D y Diamantes Cósmicos) ---
  function drawLoot(loot) {
    if (!loot) return;

    // 1. Halo / Anillo de luz en la cara superior del bloque base
    const basePos = isoProject(loot.x, loot.baseY || loot.y, loot.z);
    ctx.save();
    ctx.translate(basePos.x, basePos.y);
    const pulse = 0.5 + 0.5 * Math.sin((loot.rot || 0) * 4);
    const groundGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, 22);
    if (loot.type === 'GEM') {
      groundGrad.addColorStop(0, `rgba(0, 240, 255, ${0.45 + 0.25 * pulse})`);
      groundGrad.addColorStop(0.6, `rgba(0, 114, 255, ${0.2 + 0.15 * pulse})`);
      groundGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');
    } else {
      groundGrad.addColorStop(0, `rgba(255, 215, 0, ${0.5 + 0.25 * pulse})`);
      groundGrad.addColorStop(0.6, `rgba(255, 140, 0, ${0.22 + 0.15 * pulse})`);
      groundGrad.addColorStop(1, 'rgba(255, 215, 0, 0)');
    }
    ctx.fillStyle = groundGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, 20, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 2. Moneda o Diamante Flotante 3D (Elevado 20px sobre el bloque)
    const floatY = (loot.baseY || loot.y) + 20 + (loot.bob || 0);
    const pos = isoProject(loot.x, floatY, loot.z);
    ctx.save();
    ctx.translate(pos.x, pos.y);

    if (loot.type === 'GEM') {
      // 💎 Diamante Octogonal Tridimensional con Refracción de Luz
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 24;

      const size = 18;
      const cosR = Math.cos(loot.rot || 0);
      const w = Math.max(4, size * (0.35 + 0.65 * Math.abs(cosR)));

      // Facetas del Diamante
      const grad = ctx.createLinearGradient(-w, -size, w, size);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.25, '#67e8f9');
      grad.addColorStop(0.65, '#00f0ff');
      grad.addColorStop(1, '#0072ff');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(w, -size * 0.3);
      ctx.lineTo(w * 0.75, size * 0.85);
      ctx.lineTo(0, size);
      ctx.lineTo(-w * 0.75, size * 0.85);
      ctx.lineTo(-w, -size * 0.3);
      ctx.closePath();
      ctx.fill();

      // Aristas cristalinas interiores
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Destello central estelar
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // 🪙 Moneda de Oro 3D Gruesa con Bisel y Sombra de Rotación
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = 20;

      const radius = 17;
      const cosVal = Math.cos(loot.rot || 0);
      const scaleX = Math.abs(cosVal);
      const coinW = Math.max(3.5, radius * scaleX);
      const rimOffset = (cosVal >= 0 ? 1 : -1) * Math.min(3, 3 * (1 - scaleX));

      // Borde / Canto 3D de la moneda (Grosor volumétrico)
      if (scaleX < 0.9) {
        ctx.fillStyle = '#b45309';
        ctx.beginPath();
        ctx.ellipse(rimOffset, 0, coinW, radius, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Cara frontal dorada brillante
      const grad = ctx.createRadialGradient(-coinW * 0.2, -radius * 0.2, 1, 0, 0, radius);
      grad.addColorStop(0, '#fffbeb');
      grad.addColorStop(0.3, '#fde047');
      grad.addColorStop(0.7, '#f59e0b');
      grad.addColorStop(1, '#b45309');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(0, 0, coinW, radius, 0, 0, Math.PI * 2);
      ctx.fill();

      // Borde grabado en relieve
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Grabado de estrella cósmica central
      if (scaleX > 0.4) {
        ctx.fillStyle = '#78350f';
        ctx.font = '900 13px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('★', 0, 0);
      }
    }

    ctx.restore();
  }

  // --- Aura y Viñeta Dinámica de Modo Fiebre ---
  function drawFeverAura() {
    ctx.save();
    const alpha = 0.18 + Math.sin(feverPulseTime * 4) * 0.08;
    const grad = ctx.createRadialGradient(width / 2, height / 2, height * 0.35, width / 2, height / 2, height * 0.78);
    grad.addColorStop(0, 'rgba(255, 0, 122, 0)');
    grad.addColorStop(0.65, `rgba(255, 0, 122, ${alpha * 0.5})`);
    grad.addColorStop(1, `rgba(255, 77, 0, ${alpha * 0.95})`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Borde brillante de aceleración
    ctx.strokeStyle = `rgba(255, 215, 0, ${alpha * 1.5})`;
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, width, height);
    ctx.restore();
  }

  // --- Fondo Ambiental Dinámico y Atmosférico (Mundos Vivos con Profundidad Parallax) ---
  // --- Fondo Ambiental Dinámico y Atmosférico (20 Mundos Temáticos Únicos con Profundidad Parallax) ---
  function drawBackground() {
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, activeLevel.bgGradient[0]);
    grad.addColorStop(0.65, activeLevel.bgGradient[1]);
    grad.addColorStop(1, '#020408');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    const wId = (activeLevel.world && activeLevel.world.id) ? activeLevel.world.id : (activeLevel.worldIndex + 1);

    // 1. MUNDO 1: NÚCLEO MAGMÁTICO (Volcán Basáltico y Manto Ígneo)
    if (wId === 1 || activeLevel.material === 'MAGMA') {
      const volGrad = ctx.createRadialGradient(width / 2, height, 15, width / 2, height, height * 0.75);
      volGrad.addColorStop(0, 'rgba(255, 60, 0, 0.35)');
      volGrad.addColorStop(0.5, 'rgba(200, 30, 0, 0.15)');
      volGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = volGrad;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#140502';
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(0, height - 70);
      ctx.lineTo(width * 0.25, height - 110);
      ctx.lineTo(width * 0.5, height - 60);
      ctx.lineTo(width * 0.75, height - 125);
      ctx.lineTo(width, height - 75);
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();

      bgEmbers.forEach(em => {
        em.y -= em.vy;
        em.wobble += em.wobbleSpeed;
        const curX = em.x + Math.sin(em.wobble) * 14;
        if (em.y < -15) { em.y = height + 15; em.x = Math.random() * width; }
        ctx.save();
        ctx.globalAlpha = em.alpha * (0.6 + 0.4 * Math.sin(em.wobble * 2));
        ctx.fillStyle = em.color;
        ctx.shadowColor = em.color;
        ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.arc(curX, em.y, em.r, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      });
    }

    // 2. MUNDO 2: CAVERNA SLIME JADE (Estalactitas, Niebla Esmeralda y Esporas)
    else if (wId === 2 || activeLevel.material === 'SLIME') {
      const caveGlow = ctx.createRadialGradient(width / 2, height * 0.85, 20, width / 2, height * 0.85, height * 0.65);
      caveGlow.addColorStop(0, 'rgba(0, 255, 136, 0.22)');
      caveGlow.addColorStop(0.6, 'rgba(5, 70, 40, 0.12)');
      caveGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = caveGlow;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#061c12';
      const stCount = 9;
      const stW = width / stCount;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      for (let i = 0; i < stCount; i++) {
        const tipX = (i + 0.5) * stW;
        const tipH = 45 + Math.sin(i * 1.8 + 2) * 25;
        ctx.lineTo(i * stW, 0);
        ctx.lineTo(tipX, tipH);
        ctx.lineTo((i + 1) * stW, 0);
      }
      ctx.lineTo(width, 0);
      ctx.closePath();
      ctx.fill();

      bgBubbles.forEach(sp => {
        sp.y -= sp.vy * 0.8;
        if (sp.y < -10) sp.y = height + 10;
        ctx.save();
        ctx.fillStyle = 'rgba(0, 255, 136, 0.45)';
        ctx.shadowColor = '#00ff88';
        ctx.shadowBlur = 10;
        ctx.beginPath(); ctx.arc(sp.x, sp.y, sp.r * 0.8, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      });
    }

    // 3. MUNDO 3: MINAS DE ORO & CUARZO (Vigas Mineras, Cristales y Polvo Áureo)
    else if (wId === 3 || activeLevel.material === 'GOLD') {
      const goldGlow = ctx.createRadialGradient(width / 2, height * 0.4, 20, width / 2, height * 0.4, height * 0.7);
      goldGlow.addColorStop(0, 'rgba(255, 215, 0, 0.24)');
      goldGlow.addColorStop(0.5, 'rgba(180, 120, 0, 0.10)');
      goldGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = goldGlow;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#423204';
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(35, height - 120);
      ctx.lineTo(55, height);
      ctx.lineTo(width - 45, height);
      ctx.lineTo(width - 25, height - 140);
      ctx.lineTo(width, height - 80);
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();

      bgStars.slice(0, 30).forEach(st => {
        st.twinkle += 0.05;
        const alpha = 0.3 + 0.7 * Math.abs(Math.sin(st.twinkle));
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#ffd700';
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.arc(st.x, st.y, st.r * 1.2, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      });
    }

    // 4. MUNDO 4: LA METRÓPOLIS CYBER (Rascacielos Futuristas, Focos y Señaléticas)
    else if (wId === 4 || activeLevel.material === 'CYBER') {
      ctx.save();
      const sweepX = (width * 0.5) + Math.sin(Date.now() * 0.0008) * (width * 0.4);
      const beamGrad = ctx.createLinearGradient(width * 0.5, height, sweepX, 0);
      beamGrad.addColorStop(0, 'rgba(0, 240, 255, 0.14)');
      beamGrad.addColorStop(0.7, 'rgba(0, 240, 255, 0.04)');
      beamGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');
      ctx.fillStyle = beamGrad;
      ctx.beginPath();
      ctx.moveTo(width * 0.5 - 25, height);
      ctx.lineTo(sweepX - 40, 0);
      ctx.lineTo(sweepX + 40, 0);
      ctx.lineTo(width * 0.5 + 25, height);
      ctx.fill();
      ctx.restore();

      const towerCount = 8;
      const bW = width / (towerCount - 1);
      for (let i = 0; i < towerCount; i++) {
        const bH = 120 + Math.sin(i * 2.3 + 1) * 60;
        const bX = i * (bW * 0.9) - 10;
        const bY = height - bH;
        ctx.fillStyle = i % 2 === 0 ? 'rgba(10, 18, 38, 0.85)' : 'rgba(14, 25, 48, 0.88)';
        ctx.fillRect(bX, bY, bW * 0.85, bH);

        const antX = bX + (bW * 0.42);
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(antX, bY); ctx.lineTo(antX, bY - 18); ctx.stroke();
        const blink = Math.sin(Date.now() * 0.005 + i) > 0;
        if (blink) {
          ctx.fillStyle = '#f43f5e';
          ctx.beginPath(); ctx.arc(antX, bY - 18, 2, 0, Math.PI * 2); ctx.fill();
        }

        for (let row = 0; row < 5; row++) {
          for (let col = 0; col < 3; col++) {
            if ((i + row + col) % 3 === 0) {
              ctx.fillStyle = (row + col) % 2 === 0 ? 'rgba(255, 235, 120, 0.65)' : 'rgba(56, 189, 248, 0.65)';
              ctx.fillRect(bX + 8 + col * 10, bY + 12 + row * 16, 4, 7);
            }
          }
        }
      }
    }

    // 5. MUNDO 5: TEMPLO TITÁN ANCESTRAL (Monolitos Colosales y Runas Divinas)
    else if (wId === 5 || activeLevel.material === 'TITAN_STONE') {
      const titanGlow = ctx.createRadialGradient(width / 2, height * 0.3, 30, width / 2, height * 0.3, height * 0.8);
      titanGlow.addColorStop(0, 'rgba(245, 158, 11, 0.28)');
      titanGlow.addColorStop(0.5, 'rgba(120, 60, 5, 0.12)');
      titanGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = titanGlow;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#261605';
      ctx.fillRect(0, height - 210, width * 0.16, 210);
      ctx.fillRect(width * 0.84, height - 230, width * 0.16, 230);

      const runePulse = 0.5 + 0.5 * Math.sin(Date.now() * 0.003);
      ctx.save();
      ctx.fillStyle = `rgba(255, 215, 0, ${(0.4 + 0.5 * runePulse).toFixed(2)})`;
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = 12;
      ctx.fillRect(width * 0.05, height - 160, 10, 30);
      ctx.fillRect(width * 0.05, height - 110, 10, 18);
      ctx.fillRect(width * 0.89, height - 170, 10, 24);
      ctx.fillRect(width * 0.89, height - 120, 10, 35);
      ctx.restore();
    }

    // 6. MUNDO 6: CIELO GLACIAR (Picos Nevados y Cristales de Nieve)
    else if (wId === 6 || activeLevel.material === 'ICE') {
      ctx.fillStyle = '#0a233c';
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(0, height - 140);
      ctx.lineTo(width * 0.28, height - 210);
      ctx.lineTo(width * 0.55, height - 130);
      ctx.lineTo(width * 0.82, height - 240);
      ctx.lineTo(width, height - 160);
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = 'rgba(224, 248, 255, 0.65)';
      ctx.beginPath();
      ctx.moveTo(width * 0.28, height - 210);
      ctx.lineTo(width * 0.23, height - 180);
      ctx.lineTo(width * 0.33, height - 180);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(width * 0.82, height - 240);
      ctx.lineTo(width * 0.77, height - 205);
      ctx.lineTo(width * 0.87, height - 205);
      ctx.closePath();
      ctx.fill();

      bgSnow.forEach(sn => {
        sn.y += sn.vy;
        sn.wobble += sn.wobbleSpeed;
        const curX = sn.x + Math.sin(sn.wobble) * 8;
        if (sn.y > height + 10) sn.y = -10;
        ctx.save();
        ctx.fillStyle = 'rgba(224, 248, 255, 0.75)';
        ctx.shadowColor = '#00d4ff';
        ctx.shadowBlur = 6;
        ctx.beginPath(); ctx.arc(curX, sn.y, sn.r, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      });
    }

    // 7. MUNDO 7: OCÉANO ABISAL & ARRECIFE (Burbujas Marinas y Profundidades)
    else if (wId === 7 || activeLevel.material === 'ABYSS') {
      const seaGrad = ctx.createLinearGradient(0, 0, 0, height);
      seaGrad.addColorStop(0, 'rgba(6, 182, 212, 0.18)');
      seaGrad.addColorStop(1, 'rgba(2, 20, 30, 0.45)');
      ctx.fillStyle = seaGrad;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#03202b';
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(20, height - 80);
      ctx.lineTo(45, height);
      ctx.lineTo(70, height - 95);
      ctx.lineTo(95, height);
      ctx.lineTo(width - 80, height);
      ctx.lineTo(width - 50, height - 110);
      ctx.lineTo(width, height - 70);
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();

      bgBubbles.forEach(b => {
        b.y -= b.vy * 1.2;
        if (b.y < -15) { b.y = height + 15; b.x = Math.random() * width; }
        ctx.save();
        ctx.strokeStyle = 'rgba(45, 212, 191, 0.6)';
        ctx.fillStyle = 'rgba(45, 212, 191, 0.18)';
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.restore();
      });
    }

    // 8. MUNDO 8: GALEÓN FANTASMA PIRATA (Mástiles Espectrales y Luna Esmeralda)
    else if (wId === 8 || activeLevel.material === 'WOOD') {
      const mistGrad = ctx.createLinearGradient(0, height * 0.4, 0, height);
      mistGrad.addColorStop(0, 'rgba(163, 230, 53, 0.05)');
      mistGrad.addColorStop(0.7, 'rgba(163, 230, 53, 0.16)');
      mistGrad.addColorStop(1, 'rgba(10, 20, 9, 0.7)');
      ctx.fillStyle = mistGrad;
      ctx.fillRect(0, 0, width, height);

      const mx = width * 0.82, my = height * 0.18;
      ctx.save();
      ctx.fillStyle = '#e2fadb';
      ctx.shadowColor = '#a3e635';
      ctx.shadowBlur = 24;
      ctx.beginPath(); ctx.arc(mx, my, 32, 0, Math.PI * 2); ctx.fill();
      ctx.restore();

      ctx.strokeStyle = '#0f1f0e';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(width * 0.2, height);
      ctx.lineTo(width * 0.2, height - 160);
      ctx.moveTo(width * 0.12, height - 120);
      ctx.lineTo(width * 0.28, height - 120);
      ctx.stroke();
    }

    // 9. MUNDO 9: VOLCÁN DE FUEGO AZUL (Caldera de Plasma Cobalto y Llamaradas)
    else if (wId === 9 || activeLevel.material === 'BLUE_LAVA') {
      const bLavaGrad = ctx.createRadialGradient(width / 2, height, 20, width / 2, height, height * 0.75);
      bLavaGrad.addColorStop(0, 'rgba(56, 189, 248, 0.36)');
      bLavaGrad.addColorStop(0.5, 'rgba(14, 116, 144, 0.15)');
      bLavaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = bLavaGrad;
      ctx.fillRect(0, 0, width, height);

      bgEmbers.forEach(em => {
        em.y -= em.vy * 1.2;
        em.wobble += em.wobbleSpeed;
        const curX = em.x + Math.sin(em.wobble) * 14;
        if (em.y < -15) { em.y = height + 15; em.x = Math.random() * width; }
        ctx.save();
        ctx.globalAlpha = em.alpha;
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 10;
        ctx.beginPath(); ctx.arc(curX, em.y, em.r, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      });
    }

    // 10. MUNDO 10: NAVE NODRIZA ALIENÍGENA (Campo Hexagonal, Magenta y Conductos)
    else if (wId === 10 || activeLevel.material === 'ALIEN_TECH') {
      ctx.save();
      ctx.strokeStyle = 'rgba(236, 72, 153, 0.15)';
      ctx.lineWidth = 1;
      const hSize = 40;
      for (let y = 0; y < height; y += hSize * 1.5) {
        ctx.beginPath();
        for (let x = 0; x < width + hSize; x += hSize * 1.73) {
          ctx.arc(x, y, hSize * 0.5, 0, Math.PI * 2);
        }
        ctx.stroke();
      }

      const alienGrad = ctx.createRadialGradient(width / 2, height * 0.25, 10, width / 2, height * 0.25, width * 0.6);
      alienGrad.addColorStop(0, 'rgba(236, 72, 153, 0.28)');
      alienGrad.addColorStop(0.5, 'rgba(112, 10, 80, 0.12)');
      alienGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = alienGrad;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }

    // 11. MUNDO 11: ESTRATÓSFERA AURORA (Ondas Boreales Ondulantes y Estrellas)
    else if (wId === 11 || activeLevel.material === 'AURORA') {
      const time = Date.now() * 0.001;
      ctx.save();
      for (let wave = 0; wave < 3; wave++) {
        const aGrad = ctx.createLinearGradient(0, height * 0.15, width, height * 0.45);
        aGrad.addColorStop(0, wave === 0 ? 'rgba(192, 132, 252, 0.22)' : 'rgba(52, 211, 153, 0.18)');
        aGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = aGrad;
        ctx.beginPath();
        ctx.moveTo(0, height * 0.2 + Math.sin(time + wave) * 30);
        for (let x = 0; x <= width; x += 40) {
          const y = height * 0.25 + Math.sin(x * 0.01 + time + wave) * 45;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height * 0.55);
        ctx.lineTo(0, height * 0.55);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      bgStars.slice(0, 40).forEach(st => {
        st.twinkle += 0.04;
        ctx.save();
        ctx.globalAlpha = 0.3 + 0.7 * Math.abs(Math.sin(st.twinkle));
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      });
    }

    // 12. MUNDO 12: ÓRBITA LUNAR (Planeta Tierra Majestuoso y Cráteres)
    else if (wId === 12 || activeLevel.material === 'LUNAR') {
      const ex = width * 0.8, ey = height * 0.22, er = 46;
      ctx.save();
      const earthGrad = ctx.createRadialGradient(ex - 12, ey - 12, 6, ex, ey, er);
      earthGrad.addColorStop(0, '#bae6fd');
      earthGrad.addColorStop(0.4, '#0284c7');
      earthGrad.addColorStop(0.8, '#0369a1');
      earthGrad.addColorStop(1, '#082f49');
      ctx.fillStyle = earthGrad;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 18;
      ctx.beginPath(); ctx.arc(ex, ey, er, 0, Math.PI * 2); ctx.fill();
      ctx.restore();

      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(width * 0.5, height + width * 0.8, width * 0.95, 0, Math.PI * 2);
      ctx.fill();

      bgStars.forEach(st => {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2); ctx.fill();
      });
    }

    // 13. MUNDO 13: ANILLOS DE SATURNO (Planeta Saturno Gigante y Anillos Inclinados)
    else if (wId === 13 || activeLevel.material === 'SATURN_ICE') {
      const sx = width * 0.75, sy = height * 0.22, sr = 42;
      ctx.save();
      const satGrad = ctx.createRadialGradient(sx - 10, sy - 10, 8, sx, sy, sr);
      satGrad.addColorStop(0, '#fed7aa'); satGrad.addColorStop(0.7, '#ea580c'); satGrad.addColorStop(1, '#431407');
      ctx.fillStyle = satGrad;
      ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2); ctx.fill();

      ctx.strokeStyle = 'rgba(253, 186, 116, 0.75)';
      ctx.lineWidth = 5;
      ctx.beginPath(); ctx.ellipse(sx, sy, 85, 20, Math.PI / -5, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = 'rgba(251, 146, 60, 0.4)';
      ctx.lineWidth = 9;
      ctx.beginPath(); ctx.ellipse(sx, sy, 105, 26, Math.PI / -5, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();

      bgSnow.slice(0, 25).forEach(d => {
        d.x -= 0.6; if (d.x < -10) d.x = width + 10;
        ctx.fillStyle = 'rgba(186, 230, 253, 0.7)';
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); ctx.fill();
      });
    }

    // 14. MUNDO 14: NEBULOSA SOLAR RADIACTIVA (Corona Solar y Arcos de Llamaradas)
    else if (wId === 14 || activeLevel.material === 'SOLAR_FIRE') {
      const solGrad = ctx.createRadialGradient(width * 0.85, 0, 20, width * 0.85, 0, height * 0.75);
      solGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
      solGrad.addColorStop(0.2, 'rgba(249, 115, 22, 0.35)');
      solGrad.addColorStop(0.6, 'rgba(194, 65, 12, 0.15)');
      solGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = solGrad;
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.strokeStyle = 'rgba(254, 215, 170, 0.65)';
      ctx.lineWidth = 4;
      ctx.shadowColor = '#f97316';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(width * 0.85, 0, 110, Math.PI * 0.35, Math.PI * 0.75);
      ctx.stroke();
      ctx.restore();
    }

    // 15. MUNDO 15: VÓRTICE AGUJERO NEGRO (Lente Gravitacional y Disco de Acreción)
    else if (wId === 15 || activeLevel.material === 'BLACK_HOLE') {
      const bx = width * 0.5, by = height * 0.28;
      ctx.save();
      const accGrad = ctx.createRadialGradient(bx, by, 18, bx, by, 110);
      accGrad.addColorStop(0, '#ffffff');
      accGrad.addColorStop(0.2, '#c084fc');
      accGrad.addColorStop(0.5, '#7c3aed');
      accGrad.addColorStop(0.8, '#3b0764');
      accGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = accGrad;
      ctx.beginPath();
      ctx.ellipse(bx, by, 115, 36, Math.PI / -8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#000000';
      ctx.shadowColor = '#c084fc';
      ctx.shadowBlur = 20;
      ctx.beginPath(); ctx.arc(bx, by, 24, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }

    // 16. MUNDO 16: PLANETA ROJO MARCIANO (Cañones Carmesí y Lunas Fobos/Deimos)
    else if (wId === 16 || activeLevel.material === 'MARS_ROCK') {
      const marsHaze = ctx.createLinearGradient(0, height * 0.4, 0, height);
      marsHaze.addColorStop(0, 'rgba(239, 68, 68, 0.08)');
      marsHaze.addColorStop(0.7, 'rgba(185, 28, 28, 0.20)');
      marsHaze.addColorStop(1, 'rgba(20, 3, 3, 0.7)');
      ctx.fillStyle = marsHaze;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#2b0c0c';
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(0, height - 120);
      ctx.lineTo(width * 0.35, height - 70);
      ctx.lineTo(width * 0.7, height - 150);
      ctx.lineTo(width, height - 90);
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#fca5a5';
      ctx.beginPath(); ctx.arc(width * 0.25, height * 0.18, 14, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(width * 0.38, height * 0.14, 8, 0, Math.PI * 2); ctx.fill();
    }

    // 17. MUNDO 17: GALAXIA ANDRÓMEDA (Brazos Espirales Azules y Polvo Estelar)
    else if (wId === 17 || activeLevel.material === 'ANDROMEDA') {
      const andrGrad = ctx.createRadialGradient(width * 0.5, height * 0.26, 12, width * 0.5, height * 0.26, width * 0.65);
      andrGrad.addColorStop(0, 'rgba(224, 231, 255, 0.45)');
      andrGrad.addColorStop(0.3, 'rgba(99, 102, 241, 0.28)');
      andrGrad.addColorStop(0.7, 'rgba(49, 46, 129, 0.12)');
      andrGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = andrGrad;
      ctx.beginPath();
      ctx.ellipse(width * 0.5, height * 0.26, width * 0.45, width * 0.22, Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();

      bgStars.forEach(st => {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2); ctx.fill();
      });
    }

    // 18. MUNDO 18: DIMENSIÓN PRISMA ESPEJO (Prismas Cristalinos y Refracción Arcoíris)
    else if (wId === 18 || activeLevel.material === 'PRISM') {
      ctx.save();
      const beamGrad = ctx.createLinearGradient(0, 0, width, height);
      beamGrad.addColorStop(0, 'rgba(244, 63, 94, 0.14)');
      beamGrad.addColorStop(0.3, 'rgba(56, 189, 248, 0.14)');
      beamGrad.addColorStop(0.6, 'rgba(234, 179, 8, 0.14)');
      beamGrad.addColorStop(1, 'rgba(168, 85, 247, 0.14)');
      ctx.fillStyle = beamGrad;
      ctx.fillRect(0, 0, width, height);

      const px = width * 0.78, py = height * 0.24;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(px, py - 35);
      ctx.lineTo(px + 28, py);
      ctx.lineTo(px, py + 35);
      ctx.lineTo(px - 28, py);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }

    // 19. MUNDO 19: HIPERESPACIO WARP TAQUIÓN (Líneas de Velocidad Luz Radiantes)
    else if (wId === 19 || activeLevel.material === 'WARP') {
      const cx = width / 2, cy = height * 0.45;
      ctx.save();
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.65)';
      ctx.lineWidth = 2;
      bgWarpStreaks.forEach(st => {
        st.dist += st.speed;
        if (st.dist > Math.max(width, height)) st.dist = 10;
        const x1 = cx + Math.cos(st.angle) * st.dist;
        const y1 = cy + Math.sin(st.angle) * st.dist;
        const x2 = cx + Math.cos(st.angle) * (st.dist + st.length);
        const y2 = cy + Math.sin(st.angle) * (st.dist + st.length);
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      });
      ctx.restore();
    }

    // 20. MUNDO 20: NÚCLEO DEL COSMOS PRIMORDIAL (Génesis Universal y Deidad Suprema)
    else {
      const cx = width / 2, cy = height * 0.28;
      const pulse = 0.5 + 0.5 * Math.sin(Date.now() * 0.003);
      ctx.save();
      const coreGrad = ctx.createRadialGradient(cx, cy, 15, cx, cy, width * (0.6 + 0.15 * pulse));
      coreGrad.addColorStop(0, '#ffffff');
      coreGrad.addColorStop(0.25, '#ec4899');
      coreGrad.addColorStop(0.6, '#8b5cf6');
      coreGrad.addColorStop(0.85, '#06b6d4');
      coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = coreGrad;
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = `rgba(255, 255, 255, ${(0.6 + 0.4 * pulse).toFixed(2)})`;
      ctx.lineWidth = 3;
      ctx.shadowColor = '#ec4899';
      ctx.shadowBlur = 25;
      ctx.beginPath(); ctx.arc(cx, cy, 55 + pulse * 12, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    }

    // --- ATMÓSFERA CINEMÁTICA DE COMBATE CONTRA JEFE & SÚPER JEFE ---
    if (activeLevel && (activeLevel.isBoss || activeLevel.isSuperBoss)) {
      const isSuper = !!activeLevel.isSuperBoss;
      const pulse = 0.5 + 0.5 * Math.sin(Date.now() * 0.005);

      // Viñeta perimetral de peligro palpitante (rojo carmesí para jefe / morado cósmico para súper jefe)
      const dangerGrad = ctx.createRadialGradient(
        width / 2, height / 2, Math.min(width, height) * 0.30,
        width / 2, height / 2, Math.max(width, height) * 0.78
      );
      const edgeColor = isSuper ? 'rgba(168, 85, 247, ' : 'rgba(239, 68, 68, ';
      dangerGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      dangerGrad.addColorStop(0.65, `${edgeColor}${(0.16 + 0.12 * pulse).toFixed(3)})`);
      dangerGrad.addColorStop(1, `${edgeColor}${(0.46 + 0.22 * pulse).toFixed(3)})`);
      ctx.fillStyle = dangerGrad;
      ctx.fillRect(0, 0, width, height);

      // --- SOMBRA COLOSAL DEL JEFE (SILUETAS Y OJOS ÚNICOS SEGÚN EL JEFE) ---
      const bossTime = Date.now() * 0.002;
      const breath = Math.sin(bossTime) * 10;
      const shadowCenterY = height * 0.35 + breath;
      const shadowWidth = Math.min(width * 0.88, 380);
      const worldId = (activeLevel.world && activeLevel.world.id) || 1;

      ctx.save();
      // 1. Color de Aura Temática según el Jefe
      let auraColor = 'rgba(239, 68, 68, ';
      let eyeColor = '#f87171';
      let eyeGlow = '#ef4444';
      if (isSuper) {
        auraColor = 'rgba(168, 85, 247, '; eyeColor = '#f0abfc'; eyeGlow = '#c084fc';
      } else if (worldId === 2) {
        auraColor = 'rgba(0, 255, 136, '; eyeColor = '#00ff88'; eyeGlow = '#059669';
      } else if (worldId === 3 || worldId === 5) {
        auraColor = 'rgba(255, 215, 0, '; eyeColor = '#ffd700'; eyeGlow = '#b45309';
      } else if (worldId === 4) {
        auraColor = 'rgba(0, 240, 255, '; eyeColor = '#00f0ff'; eyeGlow = '#0284c7';
      } else if (worldId === 6 || worldId === 13) {
        auraColor = 'rgba(56, 189, 248, '; eyeColor = '#bae6fd'; eyeGlow = '#0284c7';
      } else if (worldId === 7) {
        auraColor = 'rgba(6, 182, 212, '; eyeColor = '#22d3ee'; eyeGlow = '#0891b2';
      } else if (worldId === 8) {
        auraColor = 'rgba(163, 230, 53, '; eyeColor = '#bef264'; eyeGlow = '#65a30d';
      } else if (worldId === 10) {
        auraColor = 'rgba(236, 72, 153, '; eyeColor = '#f472b6'; eyeGlow = '#db2777';
      } else if (worldId === 15 || worldId >= 19) {
        auraColor = 'rgba(192, 132, 252, '; eyeColor = '#e9d5ff'; eyeGlow = '#9333ea';
      }

      // Aura de energía amenazante tras la silueta
      const auraGrad = ctx.createRadialGradient(
        width / 2, shadowCenterY - 20, 20,
        width / 2, shadowCenterY - 20, shadowWidth * 0.75
      );
      auraGrad.addColorStop(0, `${auraColor}0.38)`);
      auraGrad.addColorStop(0.55, `${auraColor}0.14)`);
      auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = auraGrad;
      ctx.fillRect(0, 0, width, height);

      // --- DIBUJADO DE SILUETA ESPECÍFICA SEGÚN EL ARQUETIPO DEL JEFE ---
      const cx = width / 2;

      if (worldId === 2) {
        // --- ARQUETIPO 2: REY SLIME GIGANTE (Domo elástico + Núcleo Radioactivo + Corona) ---
        const slimeW = shadowWidth * 0.44;
        const slimeH = 110 + Math.sin(bossTime * 3) * 8;
        
        ctx.beginPath();
        ctx.moveTo(cx - slimeW * 1.15, height);
        ctx.bezierCurveTo(cx - slimeW * 1.2, shadowCenterY + 40, cx - slimeW * 0.9, shadowCenterY - 30, cx, shadowCenterY - slimeH);
        ctx.bezierCurveTo(cx + slimeW * 0.9, shadowCenterY - 30, cx + slimeW * 1.2, shadowCenterY + 40, cx + slimeW * 1.15, height);
        ctx.closePath();

        const slimeGrad = ctx.createRadialGradient(cx, shadowCenterY, 15, cx, shadowCenterY + 35, slimeW * 1.1);
        slimeGrad.addColorStop(0, 'rgba(0, 190, 85, 0.88)');
        slimeGrad.addColorStop(0.55, 'rgba(0, 80, 35, 0.94)');
        slimeGrad.addColorStop(1, '#021808');
        ctx.fillStyle = slimeGrad;
        ctx.fill();

        // Núcleo palpitante interior de ácido verde fluorescente
        const coreR = 24 + Math.sin(bossTime * 4) * 4;
        const coreGrad = ctx.createRadialGradient(cx, shadowCenterY + 15, 2, cx, shadowCenterY + 15, coreR);
        coreGrad.addColorStop(0, '#ffffff');
        coreGrad.addColorStop(0.35, '#00ff88');
        coreGrad.addColorStop(0.7, 'rgba(0, 255, 136, 0.4)');
        coreGrad.addColorStop(1, 'rgba(0, 255, 136, 0)');
        ctx.fillStyle = coreGrad;
        ctx.beginPath(); ctx.arc(cx, shadowCenterY + 15, coreR, 0, Math.PI * 2); ctx.fill();

        // Burbujas ácidas flotando en el interior
        ctx.fillStyle = 'rgba(0, 255, 170, 0.5)';
        for (let b = 0; b < 5; b++) {
          const bx = cx + Math.sin(bossTime * 2.2 + b * 1.4) * (slimeW * 0.42);
          const by = shadowCenterY + 60 - ((bossTime * 40 + b * 24) % 85);
          ctx.beginPath(); ctx.arc(bx, by, 3 + (b % 3), 0, Math.PI * 2); ctx.fill();
        }

        // Corona regia dorada con resplandor
        ctx.beginPath();
        const crownY = shadowCenterY - slimeH;
        ctx.moveTo(cx - 38, crownY + 12);
        ctx.lineTo(cx - 45, crownY - 32);
        ctx.lineTo(cx - 20, crownY - 14);
        ctx.lineTo(cx, crownY - 42);
        ctx.lineTo(cx + 20, crownY - 14);
        ctx.lineTo(cx + 45, crownY - 32);
        ctx.lineTo(cx + 38, crownY + 12);
        ctx.closePath();
        ctx.fillStyle = '#ffd700';
        ctx.fill();
        ctx.fillStyle = '#00ff88';
        ctx.beginPath(); ctx.arc(cx, crownY - 12, 4, 0, Math.PI * 2); ctx.fill();

      } else if (worldId === 3 || worldId === 5) {
        // --- ARQUETIPO 3 & 5: REY MIDAS DORADO / REY TITÁN (Corona de 5 puntas + Manto real) ---
        ctx.beginPath();
        ctx.moveTo(cx - shadowWidth * 0.52, height);
        ctx.lineTo(cx - shadowWidth * 0.44, shadowCenterY + 120);
        ctx.lineTo(cx - shadowWidth * 0.38, shadowCenterY + 10);
        ctx.lineTo(cx - shadowWidth * 0.22, shadowCenterY + 15);
        ctx.lineTo(cx - shadowWidth * 0.16, shadowCenterY - 30);
        // Corona Imperial de 5 puntas
        ctx.lineTo(cx - 45, shadowCenterY - 50);
        ctx.lineTo(cx - 40, shadowCenterY - 95);
        ctx.lineTo(cx - 20, shadowCenterY - 65);
        ctx.lineTo(cx, shadowCenterY - 115);
        ctx.lineTo(cx + 20, shadowCenterY - 65);
        ctx.lineTo(cx + 40, shadowCenterY - 95);
        ctx.lineTo(cx + 45, shadowCenterY - 50);
        ctx.lineTo(cx + shadowWidth * 0.16, shadowCenterY - 30);
        ctx.lineTo(cx + shadowWidth * 0.22, shadowCenterY + 15);
        ctx.lineTo(cx + shadowWidth * 0.38, shadowCenterY + 10);
        ctx.lineTo(cx + shadowWidth * 0.44, shadowCenterY + 120);
        ctx.lineTo(cx + shadowWidth * 0.52, height);
        ctx.closePath();

        const goldGrad = ctx.createLinearGradient(cx - shadowWidth * 0.4, shadowCenterY, cx + shadowWidth * 0.4, shadowCenterY);
        goldGrad.addColorStop(0, '#261b03');
        goldGrad.addColorStop(0.3, '#5c430c');
        goldGrad.addColorStop(0.5, '#b48a14');
        goldGrad.addColorStop(0.7, '#5c430c');
        goldGrad.addColorStop(1, '#261b03');
        ctx.fillStyle = goldGrad;
        ctx.fill();

        // Filigranas y runas doradas en la armadura
        ctx.strokeStyle = 'rgba(255, 220, 100, 0.6)';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(cx - 48, shadowCenterY + 40); ctx.lineTo(cx, shadowCenterY + 68); ctx.lineTo(cx + 48, shadowCenterY + 40);
        ctx.moveTo(cx - 28, shadowCenterY + 25); ctx.lineTo(cx, shadowCenterY + 45); ctx.lineTo(cx + 28, shadowCenterY + 25);
        ctx.stroke();

      } else if (worldId === 4) {
        // --- ARQUETIPO 4: CYBER GOLIATH 2099 (Mecha poligonal + Circuitos Cian Neón) ---
        ctx.beginPath();
        ctx.moveTo(cx - shadowWidth * 0.48, height);
        ctx.lineTo(cx - shadowWidth * 0.44, shadowCenterY + 80);
        ctx.lineTo(cx - shadowWidth * 0.38, shadowCenterY - 10);
        ctx.lineTo(cx - shadowWidth * 0.24, shadowCenterY - 20);
        ctx.lineTo(cx - shadowWidth * 0.14, shadowCenterY - 45);
        ctx.lineTo(cx - shadowWidth * 0.18, shadowCenterY - 110);
        ctx.lineTo(cx - shadowWidth * 0.10, shadowCenterY - 70);
        ctx.lineTo(cx, shadowCenterY - 80);
        ctx.lineTo(cx + shadowWidth * 0.10, shadowCenterY - 70);
        ctx.lineTo(cx + shadowWidth * 0.18, shadowCenterY - 110);
        ctx.lineTo(cx + shadowWidth * 0.14, shadowCenterY - 45);
        ctx.lineTo(cx + shadowWidth * 0.24, shadowCenterY - 20);
        ctx.lineTo(cx + shadowWidth * 0.38, shadowCenterY - 10);
        ctx.lineTo(cx + shadowWidth * 0.44, shadowCenterY + 80);
        ctx.lineTo(cx + shadowWidth * 0.48, height);
        ctx.closePath();

        const mechaGrad = ctx.createLinearGradient(cx, shadowCenterY - 100, cx, height);
        mechaGrad.addColorStop(0, '#102742');
        mechaGrad.addColorStop(0.5, '#081628');
        mechaGrad.addColorStop(1, '#02070e');
        ctx.fillStyle = mechaGrad;
        ctx.fill();

        // Circuitos cibernéticos de neón cian
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.7)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx - shadowWidth * 0.32, shadowCenterY + 40);
        ctx.lineTo(cx - shadowWidth * 0.18, shadowCenterY + 10);
        ctx.lineTo(cx - shadowWidth * 0.08, shadowCenterY + 30);
        ctx.moveTo(cx + shadowWidth * 0.32, shadowCenterY + 40);
        ctx.lineTo(cx + shadowWidth * 0.18, shadowCenterY + 10);
        ctx.lineTo(cx + shadowWidth * 0.08, shadowCenterY + 30);
        ctx.stroke();

        // Núcleo hexagonal Mecha
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx - 14, shadowCenterY + 48); ctx.lineTo(cx, shadowCenterY + 40);
        ctx.lineTo(cx + 14, shadowCenterY + 48); ctx.lineTo(cx, shadowCenterY + 56);
        ctx.closePath();
        ctx.stroke();

      } else if (worldId === 6 || worldId === 13) {
        // --- ARQUETIPO 6: DRAGÓN DE ESCARCHA POLAR (Alas de dragón + Fracturas de hielo) ---
        ctx.beginPath();
        ctx.moveTo(cx - shadowWidth * 0.54, height);
        ctx.lineTo(cx - shadowWidth * 0.52, shadowCenterY + 40);
        ctx.lineTo(cx - shadowWidth * 0.48, shadowCenterY - 80);
        ctx.lineTo(cx - shadowWidth * 0.32, shadowCenterY - 20);
        ctx.lineTo(cx - shadowWidth * 0.22, shadowCenterY + 20);
        ctx.lineTo(cx - shadowWidth * 0.22, shadowCenterY - 105);
        ctx.lineTo(cx - shadowWidth * 0.08, shadowCenterY - 60);
        ctx.lineTo(cx, shadowCenterY - 75);
        ctx.lineTo(cx + shadowWidth * 0.08, shadowCenterY - 60);
        ctx.lineTo(cx + shadowWidth * 0.22, shadowCenterY - 105);
        ctx.lineTo(cx + shadowWidth * 0.22, shadowCenterY + 20);
        ctx.lineTo(cx + shadowWidth * 0.32, shadowCenterY - 20);
        ctx.lineTo(cx + shadowWidth * 0.48, shadowCenterY - 80);
        ctx.lineTo(cx + shadowWidth * 0.52, shadowCenterY + 40);
        ctx.lineTo(cx + shadowWidth * 0.54, height);
        ctx.closePath();

        const iceGrad = ctx.createLinearGradient(cx, shadowCenterY - 100, cx, height);
        iceGrad.addColorStop(0, '#164366');
        iceGrad.addColorStop(0.5, '#092136');
        iceGrad.addColorStop(1, '#020b14');
        ctx.fillStyle = iceGrad;
        ctx.fill();

        // Fracturas internas de hielo resplandeciente
        ctx.strokeStyle = 'rgba(125, 211, 252, 0.65)';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(cx - shadowWidth * 0.36, shadowCenterY - 35); ctx.lineTo(cx - shadowWidth * 0.20, shadowCenterY);
        ctx.lineTo(cx, shadowCenterY - 20); ctx.lineTo(cx + shadowWidth * 0.20, shadowCenterY);
        ctx.lineTo(cx + shadowWidth * 0.36, shadowCenterY - 35);
        ctx.stroke();

      } else if (worldId === 7) {
        // --- ARQUETIPO 7: KRAKEN LEVIATÁN (Cresta abisal + Tentáculos con ventosas) ---
        const tWave = Math.sin(bossTime * 2.5) * 14;
        ctx.beginPath();
        ctx.moveTo(cx - shadowWidth * 0.5, height);
        ctx.quadraticCurveTo(cx - shadowWidth * 0.55 + tWave, shadowCenterY + 20, cx - shadowWidth * 0.38, shadowCenterY - 40);
        ctx.quadraticCurveTo(cx - shadowWidth * 0.44 - tWave, shadowCenterY - 80, cx - shadowWidth * 0.24, shadowCenterY - 10);
        ctx.lineTo(cx - shadowWidth * 0.16, shadowCenterY - 35);
        ctx.lineTo(cx, shadowCenterY - 95);
        ctx.lineTo(cx + shadowWidth * 0.16, shadowCenterY - 35);
        ctx.quadraticCurveTo(cx + shadowWidth * 0.44 + tWave, shadowCenterY - 80, cx + shadowWidth * 0.38, shadowCenterY - 40);
        ctx.quadraticCurveTo(cx + shadowWidth * 0.55 - tWave, shadowCenterY + 20, cx + shadowWidth * 0.5, height);
        ctx.closePath();

        const krakenGrad = ctx.createRadialGradient(cx, shadowCenterY, 20, cx, shadowCenterY, shadowWidth * 0.6);
        krakenGrad.addColorStop(0, '#063f47');
        krakenGrad.addColorStop(0.65, '#021c21');
        krakenGrad.addColorStop(1, '#000a0d');
        ctx.fillStyle = krakenGrad;
        ctx.fill();

        // Ventosas bioluminiscentes turquesas
        ctx.fillStyle = '#22d3ee';
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 8;
        for (let v = 0; v < 4; v++) {
          const vy = shadowCenterY + 15 + v * 28;
          ctx.beginPath(); ctx.arc(cx - shadowWidth * 0.44 + v * 6, vy, 4, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(cx + shadowWidth * 0.44 - v * 6, vy, 4, 0, Math.PI * 2); ctx.fill();
        }
        ctx.shadowBlur = 0;

      } else if (worldId === 8) {
        // --- ARQUETIPO 8: CAPITÁN FANTASMA (Tricornio Pirata + Ectoplasma) ---
        ctx.beginPath();
        ctx.moveTo(cx - shadowWidth * 0.46, height);
        ctx.lineTo(cx - shadowWidth * 0.38, shadowCenterY + 60);
        ctx.lineTo(cx - shadowWidth * 0.26, shadowCenterY + 15);
        ctx.lineTo(cx - shadowWidth * 0.42, shadowCenterY - 40);
        ctx.lineTo(cx - 25, shadowCenterY - 55);
        ctx.lineTo(cx, shadowCenterY - 105);
        ctx.lineTo(cx + 25, shadowCenterY - 55);
        ctx.lineTo(cx + shadowWidth * 0.42, shadowCenterY - 40);
        ctx.lineTo(cx + shadowWidth * 0.26, shadowCenterY + 15);
        ctx.lineTo(cx + shadowWidth * 0.38, shadowCenterY + 60);
        ctx.lineTo(cx + shadowWidth * 0.46, height);
        ctx.closePath();

        const ghostGrad = ctx.createLinearGradient(cx, shadowCenterY - 100, cx, height);
        ghostGrad.addColorStop(0, '#134728');
        ghostGrad.addColorStop(0.5, '#072412');
        ghostGrad.addColorStop(1, '#010c05');
        ctx.fillStyle = ghostGrad;
        ctx.fill();

        // Calavera pirata verde fósforo en el tricornio
        ctx.fillStyle = '#86efac';
        ctx.shadowColor = '#22c55e';
        ctx.shadowBlur = 10;
        ctx.beginPath(); ctx.arc(cx, shadowCenterY - 70, 7, 0, Math.PI * 2); ctx.fill();
        ctx.fillRect(cx - 5, shadowCenterY - 63, 10, 4);
        ctx.shadowBlur = 0;

      } else if (worldId === 9) {
        // --- ARQUETIPO 9: FÉNIX DE PLASMA VOLCÁNICO (Alas de Fuego Ondeantes) ---
        const fWave = Math.sin(bossTime * 4) * 12;
        ctx.beginPath();
        ctx.moveTo(cx - shadowWidth * 0.52, height);
        ctx.lineTo(cx - shadowWidth * 0.55, shadowCenterY - 40 + fWave);
        ctx.lineTo(cx - shadowWidth * 0.42, shadowCenterY - 95 + fWave);
        ctx.lineTo(cx - shadowWidth * 0.32, shadowCenterY - 40);
        ctx.lineTo(cx - shadowWidth * 0.18, shadowCenterY - 15);
        ctx.lineTo(cx - 24, shadowCenterY - 65);
        ctx.lineTo(cx - 10, shadowCenterY - 110);
        ctx.lineTo(cx, shadowCenterY - 80);
        ctx.lineTo(cx + 10, shadowCenterY - 110);
        ctx.lineTo(cx + 24, shadowCenterY - 65);
        ctx.lineTo(cx + shadowWidth * 0.18, shadowCenterY - 15);
        ctx.lineTo(cx + shadowWidth * 0.32, shadowCenterY - 40);
        ctx.lineTo(cx + shadowWidth * 0.42, shadowCenterY - 95 - fWave);
        ctx.lineTo(cx + shadowWidth * 0.55, shadowCenterY - 40 - fWave);
        ctx.lineTo(cx + shadowWidth * 0.52, height);
        ctx.closePath();

        const phoenixGrad = ctx.createLinearGradient(cx, shadowCenterY - 100, cx, height);
        phoenixGrad.addColorStop(0, '#591607');
        phoenixGrad.addColorStop(0.5, '#2e0a02');
        phoenixGrad.addColorStop(1, '#0d0200');
        ctx.fillStyle = phoenixGrad;
        ctx.fill();

        ctx.strokeStyle = 'rgba(251, 146, 60, 0.7)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx - shadowWidth * 0.35, shadowCenterY - 25); ctx.lineTo(cx - shadowWidth * 0.18, shadowCenterY + 10);
        ctx.moveTo(cx + shadowWidth * 0.35, shadowCenterY - 25); ctx.lineTo(cx + shadowWidth * 0.18, shadowCenterY + 10);
        ctx.stroke();

      } else if (worldId === 10) {
        // --- ARQUETIPO 10: REINA ALIEN NODRIZA (Cráneo alargado xenomorfo + Quitina) ---
        ctx.beginPath();
        ctx.moveTo(cx - shadowWidth * 0.46, height);
        ctx.lineTo(cx - shadowWidth * 0.36, shadowCenterY + 70);
        ctx.lineTo(cx - shadowWidth * 0.28, shadowCenterY - 10);
        ctx.lineTo(cx - shadowWidth * 0.32, shadowCenterY - 90);
        ctx.quadraticCurveTo(cx, shadowCenterY - 120, cx + shadowWidth * 0.32, shadowCenterY - 90);
        ctx.lineTo(cx + shadowWidth * 0.28, shadowCenterY - 10);
        ctx.lineTo(cx + shadowWidth * 0.36, shadowCenterY + 70);
        ctx.lineTo(cx + shadowWidth * 0.46, height);
        ctx.closePath();

        const alienGrad = ctx.createLinearGradient(cx, shadowCenterY - 100, cx, height);
        alienGrad.addColorStop(0, '#3b0d47');
        alienGrad.addColorStop(0.5, '#190421');
        alienGrad.addColorStop(1, '#07010a');
        ctx.fillStyle = alienGrad;
        ctx.fill();

        // Costillas biomecánicas rosa fluorescente
        ctx.strokeStyle = 'rgba(244, 114, 182, 0.65)';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        for (let r = 0; r < 4; r++) {
          const ry = shadowCenterY + 15 + r * 16;
          ctx.moveTo(cx - 35, ry); ctx.lineTo(cx, ry + 6); ctx.lineTo(cx + 35, ry);
        }
        ctx.stroke();

      } else if (worldId === 11) {
        // --- ARQUETIPO 11: VALKIRIA BOREAL (Alas geométricas + Armadura mística) ---
        ctx.beginPath();
        ctx.moveTo(cx - shadowWidth * 0.48, height);
        ctx.lineTo(cx - shadowWidth * 0.42, shadowCenterY + 40);
        ctx.lineTo(cx - shadowWidth * 0.50, shadowCenterY - 85);
        ctx.lineTo(cx - shadowWidth * 0.28, shadowCenterY - 30);
        ctx.lineTo(cx - 28, shadowCenterY - 50);
        ctx.lineTo(cx, shadowCenterY - 115);
        ctx.lineTo(cx + 28, shadowCenterY - 50);
        ctx.lineTo(cx + shadowWidth * 0.28, shadowCenterY - 30);
        ctx.lineTo(cx + shadowWidth * 0.50, shadowCenterY - 85);
        ctx.lineTo(cx + shadowWidth * 0.42, shadowCenterY + 40);
        ctx.lineTo(cx + shadowWidth * 0.48, height);
        ctx.closePath();

        const valkGrad = ctx.createLinearGradient(cx, shadowCenterY - 110, cx, height);
        valkGrad.addColorStop(0, '#162e5c');
        valkGrad.addColorStop(0.5, '#0a1733');
        valkGrad.addColorStop(1, '#02050f');
        ctx.fillStyle = valkGrad;
        ctx.fill();

        ctx.strokeStyle = 'rgba(56, 189, 248, 0.65)';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(cx, shadowCenterY - 105); ctx.lineTo(cx, shadowCenterY + 50);
        ctx.stroke();

      } else if (worldId === 12) {
        // --- ARQUETIPO 12: CENTINELA LUNAR (Domo orbital + Anillo de rotación) ---
        ctx.beginPath();
        ctx.moveTo(cx - shadowWidth * 0.46, height);
        ctx.lineTo(cx - shadowWidth * 0.38, shadowCenterY + 50);
        ctx.lineTo(cx - shadowWidth * 0.35, shadowCenterY - 20);
        ctx.lineTo(cx - shadowWidth * 0.42, shadowCenterY - 90);
        ctx.lineTo(cx - shadowWidth * 0.22, shadowCenterY - 40);
        ctx.arc(cx, shadowCenterY - 40, shadowWidth * 0.20, Math.PI, 0, false);
        ctx.lineTo(cx + shadowWidth * 0.22, shadowCenterY - 40);
        ctx.lineTo(cx + shadowWidth * 0.42, shadowCenterY - 90);
        ctx.lineTo(cx + shadowWidth * 0.35, shadowCenterY - 20);
        ctx.lineTo(cx + shadowWidth * 0.38, shadowCenterY + 50);
        ctx.lineTo(cx + shadowWidth * 0.46, height);
        ctx.closePath();

        const lunarGrad = ctx.createLinearGradient(cx, shadowCenterY - 90, cx, height);
        lunarGrad.addColorStop(0, '#26344d');
        lunarGrad.addColorStop(0.5, '#121b2b');
        lunarGrad.addColorStop(1, '#060a12');
        ctx.fillStyle = lunarGrad;
        ctx.fill();

        ctx.strokeStyle = 'rgba(148, 163, 184, 0.55)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(cx, shadowCenterY - 35, shadowWidth * 0.28, 12, 0, 0, Math.PI * 2);
        ctx.stroke();

      } else if (worldId === 14) {
        // --- ARQUETIPO 14: BESTIA SOLAR (Melena de llamaradas solares) ---
        ctx.beginPath();
        ctx.moveTo(cx - shadowWidth * 0.48, height);
        ctx.lineTo(cx - shadowWidth * 0.40, shadowCenterY + 80);
        ctx.lineTo(cx - shadowWidth * 0.36, shadowCenterY + 10);
        ctx.lineTo(cx - shadowWidth * 0.45, shadowCenterY - 20);
        ctx.lineTo(cx - shadowWidth * 0.32, shadowCenterY - 45);
        ctx.lineTo(cx - shadowWidth * 0.38, shadowCenterY - 85);
        ctx.lineTo(cx - shadowWidth * 0.18, shadowCenterY - 65);
        ctx.lineTo(cx, shadowCenterY - 110);
        ctx.lineTo(cx + shadowWidth * 0.18, shadowCenterY - 65);
        ctx.lineTo(cx + shadowWidth * 0.38, shadowCenterY - 85);
        ctx.lineTo(cx + shadowWidth * 0.32, shadowCenterY - 45);
        ctx.lineTo(cx + shadowWidth * 0.45, shadowCenterY - 20);
        ctx.lineTo(cx + shadowWidth * 0.36, shadowCenterY + 10);
        ctx.lineTo(cx + shadowWidth * 0.40, shadowCenterY + 80);
        ctx.lineTo(cx + shadowWidth * 0.48, height);
        ctx.closePath();

        const solarGrad = ctx.createLinearGradient(cx, shadowCenterY - 110, cx, height);
        solarGrad.addColorStop(0, '#572205');
        solarGrad.addColorStop(0.5, '#2b0e02');
        solarGrad.addColorStop(1, '#0e0400');
        ctx.fillStyle = solarGrad;
        ctx.fill();

      } else if (worldId === 16) {
        // --- ARQUETIPO 16: SEÑOR DE LA GUERRA MARCIANO (Yelmo espartano) ---
        ctx.beginPath();
        ctx.moveTo(cx - shadowWidth * 0.48, height);
        ctx.lineTo(cx - shadowWidth * 0.42, shadowCenterY + 60);
        ctx.lineTo(cx - shadowWidth * 0.36, shadowCenterY);
        ctx.lineTo(cx - shadowWidth * 0.20, shadowCenterY + 10);
        ctx.lineTo(cx - 18, shadowCenterY - 40);
        ctx.lineTo(cx - 14, shadowCenterY - 115);
        ctx.lineTo(cx + 14, shadowCenterY - 115);
        ctx.lineTo(cx + 18, shadowCenterY - 40);
        ctx.lineTo(cx + shadowWidth * 0.20, shadowCenterY + 10);
        ctx.lineTo(cx + shadowWidth * 0.36, shadowCenterY);
        ctx.lineTo(cx + shadowWidth * 0.42, shadowCenterY + 60);
        ctx.lineTo(cx + shadowWidth * 0.48, height);
        ctx.closePath();

        const marsGrad = ctx.createLinearGradient(cx, shadowCenterY - 110, cx, height);
        marsGrad.addColorStop(0, '#4a1712');
        marsGrad.addColorStop(0.5, '#240907');
        marsGrad.addColorStop(1, '#0b0201');
        ctx.fillStyle = marsGrad;
        ctx.fill();

      } else if (worldId === 15 || worldId >= 19) {
        // --- ARQUETIPO 15/20: SINGULARIDAD VACÍO / DEVORADOR CÓSMICO (Cuernos espirales + Vórtice) ---
        ctx.beginPath();
        ctx.moveTo(cx - shadowWidth * 0.46, height);
        ctx.lineTo(cx - shadowWidth * 0.36, shadowCenterY + 80);
        ctx.lineTo(cx - shadowWidth * 0.24, shadowCenterY + 10);
        ctx.bezierCurveTo(cx - shadowWidth * 0.36, shadowCenterY - 50, cx - shadowWidth * 0.18, shadowCenterY - 120, cx - 15, shadowCenterY - 70);
        ctx.lineTo(cx, shadowCenterY - 90);
        ctx.bezierCurveTo(cx + shadowWidth * 0.18, shadowCenterY - 120, cx + shadowWidth * 0.36, shadowCenterY - 50, cx + shadowWidth * 0.24, shadowCenterY + 10);
        ctx.lineTo(cx + shadowWidth * 0.36, shadowCenterY + 80);
        ctx.lineTo(cx + shadowWidth * 0.46, height);
        ctx.closePath();

        const voidGrad = ctx.createRadialGradient(cx, shadowCenterY - 30, 10, cx, shadowCenterY - 30, shadowWidth * 0.5);
        voidGrad.addColorStop(0, '#3b0764');
        voidGrad.addColorStop(0.5, '#1e0538');
        voidGrad.addColorStop(1, '#05000a');
        ctx.fillStyle = voidGrad;
        ctx.fill();

        // Disco de acreción cósmico girando en el centro
        const accAngle = bossTime * 2.2;
        ctx.save();
        ctx.translate(cx, shadowCenterY - 30);
        ctx.rotate(accAngle);
        const accGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, 48);
        accGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        accGrad.addColorStop(0.3, 'rgba(192, 132, 252, 0.85)');
        accGrad.addColorStop(0.7, 'rgba(124, 58, 237, 0.4)');
        accGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = accGrad;
        ctx.beginPath(); ctx.ellipse(0, 0, 52, 15, 0, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

      } else {
        // --- ARQUETIPO 1: GOLEM MAGMÁTICO VOLCÁNICO (Basalto volcánico + Venas de lava) ---
        ctx.beginPath();
        ctx.moveTo(cx - shadowWidth * 0.50, height);
        ctx.lineTo(cx - shadowWidth * 0.45, shadowCenterY + 105);
        ctx.lineTo(cx - shadowWidth * 0.35, shadowCenterY + 5);
        ctx.lineTo(cx - shadowWidth * 0.22, shadowCenterY + 35);
        ctx.lineTo(cx - shadowWidth * 0.15, shadowCenterY - 20);
        ctx.lineTo(cx - shadowWidth * 0.25, shadowCenterY - 95 + breath * 0.4);
        ctx.lineTo(cx - shadowWidth * 0.08, shadowCenterY - 55);
        ctx.lineTo(cx, shadowCenterY - 85 + breath * 0.5);
        ctx.lineTo(cx + shadowWidth * 0.08, shadowCenterY - 55);
        ctx.lineTo(cx + shadowWidth * 0.25, shadowCenterY - 95 + breath * 0.4);
        ctx.lineTo(cx + shadowWidth * 0.15, shadowCenterY - 20);
        ctx.lineTo(cx + shadowWidth * 0.22, shadowCenterY + 35);
        ctx.lineTo(cx + shadowWidth * 0.35, shadowCenterY + 5);
        ctx.lineTo(cx + shadowWidth * 0.45, shadowCenterY + 105);
        ctx.lineTo(cx + shadowWidth * 0.50, height);
        ctx.closePath();

        const magmaGrad = ctx.createLinearGradient(cx, shadowCenterY - 95, cx, height);
        magmaGrad.addColorStop(0, '#36140a');
        magmaGrad.addColorStop(0.55, '#1c0904');
        magmaGrad.addColorStop(1, '#0a0301');
        ctx.fillStyle = magmaGrad;
        ctx.fill();

        // Grietas y venas de magma fundido al rojo vivo
        ctx.strokeStyle = 'rgba(255, 69, 0, 0.75)';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(cx - shadowWidth * 0.28, shadowCenterY + 20);
        ctx.lineTo(cx - shadowWidth * 0.12, shadowCenterY + 50);
        ctx.lineTo(cx, shadowCenterY + 30);
        ctx.lineTo(cx + shadowWidth * 0.12, shadowCenterY + 50);
        ctx.lineTo(cx + shadowWidth * 0.28, shadowCenterY + 20);
        ctx.moveTo(cx - shadowWidth * 0.18, shadowCenterY - 30); ctx.lineTo(cx - shadowWidth * 0.08, shadowCenterY + 10);
        ctx.moveTo(cx + shadowWidth * 0.18, shadowCenterY - 30); ctx.lineTo(cx + shadowWidth * 0.08, shadowCenterY + 10);
        ctx.stroke();

        // Resplandor del núcleo volcánico
        ctx.fillStyle = 'rgba(255, 160, 0, 0.4)';
        ctx.beginPath(); ctx.arc(cx, shadowCenterY + 35, 12 + Math.sin(bossTime * 3) * 3, 0, Math.PI * 2); ctx.fill();
      }

      // --- DIBUJADO DE OJOS Y VISORES ESPECÍFICOS SEGÚN EL JEFE ---
      const eyePulse = 0.75 + 0.25 * Math.sin(bossTime * 2.8);
      ctx.fillStyle = eyeColor;
      ctx.shadowColor = eyeGlow;
      ctx.shadowBlur = 18 * eyePulse;

      if (worldId === 4) {
        // Visor Mecha Horizontal de Cíclope (barrido cibernético)
        const scanOffset = Math.sin(bossTime * 3) * 16;
        const visorY = shadowCenterY - 45 + breath * 0.4;
        ctx.fillRect(cx - 32, visorY - 3, 64, 7);
        // Foco de pulso láser
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(cx + scanOffset, visorY + 0.5, 4.5, 0, Math.PI * 2); ctx.fill();

      } else if (worldId === 7) {
        // Cuatro ojos bioluminiscentes de Leviatán
        const eY = shadowCenterY - 38 + breath * 0.4;
        ctx.beginPath(); ctx.arc(cx - 30, eY, 7 * eyePulse, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + 30, eY, 7 * eyePulse, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx - 14, eY + 12, 5 * eyePulse, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + 14, eY + 12, 5 * eyePulse, 0, Math.PI * 2); ctx.fill();

      } else if (worldId === 3 || worldId === 5) {
        // Ojos Dorados Divinos con destellos en cruz
        const eY = shadowCenterY - 42 + breath * 0.4;
        ctx.beginPath(); ctx.ellipse(cx - 28, eY, 11 * eyePulse, 6 * eyePulse, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(cx + 28, eY, 11 * eyePulse, 6 * eyePulse, 0, 0, Math.PI * 2); ctx.fill();
        // Destello de cruz dorada
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx - 28, eY - 9); ctx.lineTo(cx - 28, eY + 9);
        ctx.moveTo(cx - 36, eY); ctx.lineTo(cx - 20, eY);
        ctx.moveTo(cx + 28, eY - 9); ctx.lineTo(cx + 28, eY + 9);
        ctx.moveTo(cx + 20, eY); ctx.lineTo(cx + 36, eY);
        ctx.stroke();

      } else {
        // Ojos Demoníacos/Fierce angulados
        const eyeY = shadowCenterY - 42 + breath * 0.4;
        ctx.beginPath();
        ctx.ellipse(cx - 28, eyeY, 13 * eyePulse, 6 * eyePulse, -0.22, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(cx + 28, eyeY, 13 * eyePulse, 6 * eyePulse, 0.22, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Relámpago ambiental o destello cósmico de combate de fondo
      if (Math.random() < (isSuper ? 0.045 : 0.025)) {
        ctx.fillStyle = isSuper ? 'rgba(236, 72, 153, 0.14)' : 'rgba(255, 69, 0, 0.12)';
        ctx.fillRect(0, 0, width, height);
      }
    }
  }

  // ==========================================================================
  // 🚀 LÓGICA DE JUEGO & PROGRESIÓN POR MISIONES
  // ==========================================================================

  function loadLevel(idx) {
    currentLevelIdx = Math.max(0, Math.min(idx, LEVELS.length - 1));
    activeLevel = LEVELS[currentLevelIdx];
    localStorage.setItem('c2c_current_level', currentLevelIdx.toString());

    cleanupBossMechanics();
    confettiList = [];

    missionLevelNum.innerText = `NIVEL ${activeLevel.id} • META: ${activeLevel.target} PISOS`;
    missionLevelTitle.innerText = `${activeLevel.icon} ${activeLevel.name}`;
    missionLevelDesc.innerText = activeLevel.desc;
    if (activeLevel.isSuperBoss) {
      playBtnText.innerText = `👑 ENFRENTAR SÚPER JEFE`;
    } else if (activeLevel.isBoss) {
      playBtnText.innerText = `⚔️ ENFRENTAR JEFE`;
    } else {
      playBtnText.innerText = `JUGAR NIVEL ${activeLevel.id}`;
    }
  }

  // --- MOTOR DE HECHIZOS ALEATORIOS DE JEFE (POOL ROGUELIKE) ---
  const BOSS_SPELL_POOL = [
    {
      id: 'GRAVITY_FLIP',
      icon: '🔄',
      name: '¡GRAVEDAD INVERTIDA!',
      desc: '¡Pantalla de cabeza! Voltea tu celular para poder apilar.',
      duration: 7.0,
      apply() {
        if (gameContainer) gameContainer.classList.add('screen-upside-down');
        triggerScreenShake(3.5, 12);
        triggerVibrate([80, 50, 80]);
      },
      cleanup() {
        if (gameContainer) gameContainer.classList.remove('screen-upside-down');
      }
    },
    {
      id: 'SEISMIC_QUAKE',
      icon: '🌋',
      name: '¡TERREMOTO SORPRESA!',
      desc: 'El suelo retumba violentamente desviando tu puntería.',
      duration: 4.5,
      apply() {
        triggerScreenShake(6.0, 30);
        triggerVibrate([100, 60, 100, 60, 100]);
        if (currentBlock) {
          currentBlock.direction *= -1;
        }
      },
      cleanup() {}
    },
    {
      id: 'DARK_ECLIPSE',
      icon: '🌑',
      name: '¡ECLIPSE OSCURO!',
      desc: 'Niebla cósmica densa bloquea el centro de la torre.',
      duration: 6.0,
      apply() {
        if (darkEclipseOverlay) darkEclipseOverlay.classList.add('active-eclipse');
      },
      cleanup() {
        if (darkEclipseOverlay) darkEclipseOverlay.classList.remove('active-eclipse');
      }
    },
    {
      id: 'CROSSWIND',
      icon: '🌪️',
      name: '¡VIENTO HURACANADO!',
      desc: 'Ráfagas laterales empujan el bloque con inercia irregular.',
      duration: 6.0,
      apply() {
        bossCrosswindForce = (Math.random() < 0.5 ? -1 : 1) * 1.5;
      },
      cleanup() {
        bossCrosswindForce = 0;
      }
    },
    {
      id: 'PHANTOM_MIRAGE',
      icon: '👻',
      name: '¡ESPEJISMO FANTASMA!',
      desc: 'Un bloque clon holográfico intenta engañar tus ojos.',
      duration: 6.0,
      apply() {
        bossMirageActive = true;
      },
      cleanup() {
        bossMirageActive = false;
      }
    },
    {
      id: 'BOSS_FRENZY',
      icon: '🔥',
      name: '¡FURIA SALVAJE!',
      desc: '¡El jefe entra en cólera! Velocidad acelerada un +35%.',
      duration: 5.5,
      apply() {
        bossFrenzySpeedBoost = 0.35;
        bossFrenzyBlocksLeft = 4;
        triggerScreenShake(4.0, 15);
      },
      cleanup() {
        bossFrenzySpeedBoost = 0;
        bossFrenzyBlocksLeft = 0;
      }
    }
  ];

  function cleanupBossMechanics() {
    bossLockRemaining = 0;
    bossTimeRemaining = 0;
    bossTimeTotal = 0;
    bossTriggeredThresholds = [];
    if (bossCurrentSpell) {
      bossCurrentSpell.cleanup();
      bossCurrentSpell = null;
    }
    bossCrosswindForce = 0;
    bossMirageActive = false;
    bossFrenzyBlocksLeft = 0;
    bossFrenzySpeedBoost = 0;

    if (gameContainer) gameContainer.classList.remove('screen-upside-down');
    if (darkEclipseOverlay) darkEclipseOverlay.classList.remove('active-eclipse');
    if (bossQuakeOverlay) bossQuakeOverlay.classList.add('hidden');
    if (bossSpellBanner) bossSpellBanner.classList.add('hidden');
    if (bossTimerBadge) bossTimerBadge.classList.add('hidden');
  }

  function activateBossSpell(spell) {
    if (!spell || state !== 'PLAYING') return;
    if (bossCurrentSpell) {
      bossCurrentSpell.cleanup();
    }
    bossCurrentSpell = spell;
    bossSpellTimer = spell.duration;

    if (bossSpellBanner) {
      if (bossSpellIcon) bossSpellIcon.innerText = spell.icon;
      if (bossSpellTitle) bossSpellTitle.innerText = spell.name;
      if (bossSpellDesc) bossSpellDesc.innerText = spell.desc;
      if (bossSpellCountdown) bossSpellCountdown.innerText = `${Math.ceil(spell.duration)}s`;
      bossSpellBanner.classList.remove('hidden');
    }

    playBossSpellSound();
    triggerScreenShake(4.5, 14);
    spawnFloatingText(`⚠️ ${spell.name}`, 0, (stack.length + 1) * blockHeight + 15, 0, '#ec4899', 1.6);
    spell.apply();
  }

  function startBossBattleSession() {
    cleanupBossMechanics();

    // 1. Bloqueo Sísmico Inicial de 3 Segundos
    bossLockRemaining = 3.0;
    triggerScreenShake(7.0, 180);
    triggerVibrate([100, 50, 100, 50, 150]);
    playBossRoarSound();
    if (bossQuakeOverlay) {
      bossQuakeOverlay.classList.remove('hidden');
      if (quakeTimerEl) quakeTimerEl.innerText = '3.0s';
    }

    // 2. Temporizador de Combate (Meta en segundos con margen tenso de batalla)
    bossTimeTotal = Math.max(38, Math.floor(activeLevel.target * 2.1));
    bossTimeRemaining = bossTimeTotal;
    if (bossTimerBadge) {
      bossTimerBadge.classList.remove('hidden', 'timer-danger');
      if (bossTimerVal) bossTimerVal.innerText = `${Math.ceil(bossTimeRemaining)}s`;
      if (bossTimerFill) bossTimerFill.style.width = '100%';
    }

    // 3. Pool Aleatorio de Hechizos (Roguelike: Nunca la misma combinación al perder y reintentar)
    const shuffled = [...BOSS_SPELL_POOL].sort(() => Math.random() - 0.5);
    bossActiveSpells = shuffled.slice(0, activeLevel.isSuperBoss ? 3 : 2);
    bossTriggeredThresholds = [];
  }

  // --- CINEMÁTICA Y ALERTA DE JEFE DE SECTOR / SÚPER JEFE (FASE 5) ---
  function triggerBossIntro(lvl) {
    if (!bossIntroBanner || !lvl) return;
    if (!lvl.isBoss && !lvl.isSuperBoss) {
      bossIntroBanner.classList.add('hidden');
      return;
    }
    const isSuper = !!lvl.isSuperBoss;
    const hazardEl = bossIntroBanner.querySelector('.boss-banner-hazard');
    if (hazardEl) {
      hazardEl.innerText = isSuper ? '☠️ ¡ALERTA DE SÚPER JEFE CÓSMICO! ☠️' : '⚠️ ¡ALERTA DE JEFE DE SECTOR! ⚠️';
    }
    if (bossIntroName) {
      bossIntroName.innerText = lvl.name.toUpperCase();
    }
    if (bossIntroGoal) {
      bossIntroGoal.innerText = `META: ${lvl.target} PISOS • RECOMPENSA COFRE: +${isSuper ? 100 : 50} 🪙`;
    }
    bossIntroBanner.classList.remove('hidden');
    playBossAlertSound();
    triggerScreenShake(4, 12);
    triggerVibrate([80, 50, 120]);

    if (bossBannerTimer) clearTimeout(bossBannerTimer);
    bossBannerTimer = setTimeout(() => {
      bossIntroBanner.classList.add('hidden');
    }, 2800);
  }

  function startMissionGame() {
    initAudio();
    requestScreenWakeLock();
    state = 'PLAYING';
    score = 0;
    combo = 0;
    perfectCount = 0;
    matchCoinsEarned = 0;
    hasRevivedThisMatch = false;
    wasAlignedLastFrame = false;
    cameraY = 0;
    targetCameraY = 0;

    // Reset de Power-Ups Tácticos
    slowmoActive = false;
    slowmoDurationFrames = 0;
    slowmoCdFrames = 0;
    if (powerupSlowmoBtn) powerupSlowmoBtn.classList.remove('active-powerup', 'on-cooldown');
    if (slowmoCdOverlay) slowmoCdOverlay.style.height = '0%';
    titanUsedThisRound = false;
    if (powerupTitanBtn) powerupTitanBtn.classList.remove('on-cooldown');

    // Reset de Modo Fiebre y Botín Flotante
    feverActive = false;
    feverBlocksRemaining = 0;
    activeLoot = null;
    if (comboBadgeEl) comboBadgeEl.classList.remove('fever-pulse');

    // Configuración según Modo de Juego
    if (gameMode === 'ENDLESS') {
      currentEndlessWorldIdx = 0;
      currentEndlessBiomeIdx = 0;
      activeLevel = getLevelData(1);
    } else {
      activeLevel = LEVELS[currentLevelIdx];
    }

    stack = [];
    debrisList = [];
    particles = [];
    floatingTexts = [];
    confettiList = [];

    if (startScreen) startScreen.classList.add('hidden');
    if (gameOverScreen) gameOverScreen.classList.add('hidden');
    if (levelClearModal) levelClearModal.classList.add('hidden');
    if (levelSelectModal) levelSelectModal.classList.add('hidden');
    if (achievementsModal) achievementsModal.classList.add('hidden');
    if (settingsModal) settingsModal.classList.add('hidden');
    if (leaderboardModal) leaderboardModal.classList.add('hidden');
    if (skinsModal) skinsModal.classList.add('hidden');
    if (pauseModal) pauseModal.classList.add('hidden');
    if (pauseBtn) pauseBtn.innerText = '⏸️';
    if (comboBadgeEl) comboBadgeEl.classList.add('hidden');
    if (hud) hud.classList.remove('hidden');

    scoreEl.innerText = '0';
    updateHUD();
    updateCoinsUI();
    startAmbientMusic();

    updateResponsiveDimensions();

    // Refrescar y regenerar de inmediato partículas y fondo para el mundo actual
    initBackgroundObjects();

    // Disparar Alerta Cinemática y Sesión de Jefe si es nivel 8 o 10 (Fase 5 y 6)
    if (activeLevel.isBoss || activeLevel.isSuperBoss) {
      triggerBossIntro(activeLevel);
      startBossBattleSession();
    } else {
      cleanupBossMechanics();
      // Indicador dinámico de entrada a nivel
      spawnFloatingText(`${activeLevel.icon} ${activeLevel.name.toUpperCase()}`, 0, blockHeight * 2, 0, activeLevel.colorAccent || '#ffffff', 1.5);
    }

    // Bloque Base (Si Titan Booster está activo, expande 25% el tamaño inicial)
    let startSize = initialSize;
    if (activeEquippedBoosters.titan && (boostersInventory.titan || 0) > 0) {
      startSize = Math.round(initialSize * 1.25);
      boostersInventory.titan--;
      localStorage.setItem('c2c_booster_titan', boostersInventory.titan.toString());
      spawnFloatingText('🧱 ¡BASE TITÁN (+25%) ACTIVADA!', 0, blockHeight * 3, 0, '#00f0ff', 1.4);
    }
    if (activeEquippedBoosters.slowmo && (boostersInventory.slowmo || 0) > 0) {
      boostersInventory.slowmo--;
      localStorage.setItem('c2c_booster_slowmo', boostersInventory.slowmo.toString());
      slowmoActive = true;
      spawnFloatingText('⏱️ ¡CHRONO ACTIVADO (-35% VELOCIDAD)!', 0, blockHeight * 4, 0, '#ffd700', 1.4);
    }
    updateBoostersUI();

    const baseBlock = {
      x: -startSize / 2,
      z: -startSize / 2,
      y: 0,
      width: startSize,
      depth: startSize,
      height: blockHeight,
      material: 'STANDARD',
      hue: (activeLevel.id * 35) % 360,
      isBase: true
    };
    stack.push(baseBlock);

    spawnNextBlock();
  }

  function spawnNextBlock() {
    const prev = stack[stack.length - 1];
    const layer = stack.length;
    // Aceleración de Dificultad Dinámica: la velocidad aumenta con el nivel y conforme sube la torre
    const levelSpeed = 2.85 + (activeLevel.id - 1) * 0.045 + ((activeLevel.worldIndex || 0) * 0.15);
    const stackClimbBoost = Math.min(2.2, (layer - 1) * 0.065);
    const rawSpeed = (levelSpeed + stackClimbBoost) * (slowmoActive ? 0.65 : 1.0);
    const speed = Number((Math.min(7.5, Math.max(2.85, rawSpeed))).toFixed(2));

    // Garantiza que el bloque NUNCA se corte ni salga de la pantalla en celulares
    const maxSafeRange = (width / (ISO_COS * 2)) * 0.82;
    const range = Math.min(initialSize * 1.4, maxSafeRange);

    // Sistema de 4 Lados Activo en Todos los Niveles: Los bloques vienen de todas las direcciones
    // 0 = Izquierda (-X hacia +X), 1 = Frente (-Z hacia +Z), 2 = Derecha (+X hacia -X), 3 = Fondo (+Z hacia -Z)
    const sideMode = (layer - 1) % 4;

    let axis, dir, startX, startZ;
    if (sideMode === 0) {
      // Izquierda (-X hacia +X)
      axis = 'x'; dir = 1;
      startX = prev.x - range;
      startZ = prev.z;
    } else if (sideMode === 1) {
      // Frente (-Z hacia +Z)
      axis = 'z'; dir = 1;
      startX = prev.x;
      startZ = prev.z - range;
    } else if (sideMode === 2) {
      // Derecha (+X hacia -X)
      axis = 'x'; dir = -1;
      startX = prev.x + range;
      startZ = prev.z;
    } else {
      // Fondo (+Z hacia -Z)
      axis = 'z'; dir = -1;
      startX = prev.x;
      startZ = prev.z + range;
    }

    currentBlock = {
      axis: axis,
      x: startX,
      z: startZ,
      y: layer * blockHeight,
      width: prev.width,
      depth: prev.depth,
      height: blockHeight,
      material: activeLevel.material,
      hue: (activeLevel.id * 40 + layer * 3) % 360,
      speed: speed,
      direction: dir,
      range: range,
      centerRef: axis === 'x' ? prev.x : prev.z,
      sideMode: sideMode,
      isPendulum: false,
      pendulumTime: 0
    };

    // Botín Flotante: Moneda de Oro 3D o Diamante Cósmico centrado sobre el nuevo piso
    if (!activeLoot && layer > 2 && prev.width >= 40 && prev.depth >= 40 && Math.random() < 0.35) {
      const isGem = (Math.random() < 0.15);
      activeLoot = {
        x: prev.x + prev.width / 2,
        y: prev.y + prev.height,
        baseY: prev.y + prev.height,
        z: prev.z + prev.depth / 2,
        type: isGem ? 'GEM' : 'COIN',
        value: isGem ? 1 : 50,
        rot: 0,
        bob: 0,
        collected: false
      };
    }

    updateHUD();
  }

  function updateHUD() {
    biomeIconEl.innerText = activeLevel.icon;
    if (gameMode === 'ENDLESS') {
      const currentCampaignMaxWorld = getWorldInfoForLevel(unlockedLevelMax + 1).worldIndex;
      const isSneakPeek = currentEndlessWorldIdx > currentCampaignMaxWorld;
      const worldTitle = activeLevel.world ? activeLevel.world.name.toUpperCase() : activeLevel.name.toUpperCase();
      levelBadgeNameEl.innerText = `${isSneakPeek ? '👀 SNEAK-PEEK • ' : 'ODISEA • '}${worldTitle}`;
      targetCounterEl.innerText = `${score} pisos`;
      const progress = ((score % 15) / 15) * 100;
      layerFillEl.style.width = `${progress}%`;
      layerFillEl.classList.remove('boss-hp-glow');
    } else {
      // HUD DINÁMICO DE JEFE & SÚPER JEFE (FASE 5)
      if (activeLevel.isSuperBoss) {
        levelBadgeNameEl.innerText = `👑 SÚPER JEFE: ${activeLevel.world.bossName.toUpperCase()}`;
        targetCounterEl.innerText = `❤️ HP JEFE: ${Math.max(0, activeLevel.target - score)} / ${activeLevel.target}`;
        layerFillEl.classList.add('boss-hp-glow');
        layerFillEl.style.background = 'linear-gradient(90deg, #a855f7, #ec4899, #ffd700)';
      } else if (activeLevel.isBoss) {
        levelBadgeNameEl.innerText = `👹 JEFE: ${activeLevel.world.bossName.toUpperCase()}`;
        targetCounterEl.innerText = `❤️ HP JEFE: ${Math.max(0, activeLevel.target - score)} / ${activeLevel.target}`;
        layerFillEl.classList.add('boss-hp-glow');
        layerFillEl.style.background = 'linear-gradient(90deg, #ef4444, #f59e0b, #ffd700)';
      } else {
        levelBadgeNameEl.innerText = `N${activeLevel.id} • ${activeLevel.name.toUpperCase()}`;
        targetCounterEl.innerText = `${score} / ${activeLevel.target}`;
        layerFillEl.classList.remove('boss-hp-glow');
        layerFillEl.style.background = `linear-gradient(90deg, ${activeLevel.colorAccent}, #ffffff)`;
      }
      const progress = Math.min(100, (score / activeLevel.target) * 100);
      layerFillEl.style.width = `${progress}%`;
    }

    materialBadgeEl.className = '';
    const activeSkinHUD = getSkinById(equippedSkin);
    if (equippedSkin !== 'classic' && activeSkinHUD && activeSkinHUD.id !== 'classic') {
      materialBadgeEl.innerText = `${activeSkinHUD.icon || '✨'} ${activeSkinHUD.name.toUpperCase()}`;
      materialBadgeEl.style.borderColor = activeSkinHUD.color || '#ff007a';
      materialBadgeEl.style.color = '#ffffff';
      materialBadgeEl.style.boxShadow = `0 0 10px ${activeSkinHUD.color || '#ff007a'}66`;
    } else {
      materialBadgeEl.style.borderColor = '';
      materialBadgeEl.style.color = '';
      materialBadgeEl.style.boxShadow = '';
      materialBadgeEl.innerText = activeLevel.material;
      if (activeLevel.material === 'MAGMA') materialBadgeEl.classList.add('badge-magma');
      else if (activeLevel.material === 'SLIME') materialBadgeEl.classList.add('badge-slime');
      else if (activeLevel.material === 'GOLD') materialBadgeEl.classList.add('badge-gold');
      else if (activeLevel.material === 'ICE') materialBadgeEl.classList.add('badge-ice');
      else if (activeLevel.material === 'COSMOS') materialBadgeEl.classList.add('badge-cosmos');
      else if (activeLevel.material === 'MAGNET') materialBadgeEl.classList.add('badge-magnet');
      else materialBadgeEl.classList.add('badge-normal');
    }
  }

  // --- Acción de Apilar (TAP) ---
  function placeBlock() {
    if (state !== 'PLAYING' || !currentBlock) return;

    // Protección Anti-Doble Toque Táctil / Ghost Clicks en Móviles
    const now = performance.now();
    if (now - lastPlaceBlockTime < 130) return;
    lastPlaceBlockTime = now;

    // Si el terremoto inicial de 3s está activo, bloquear apilamiento con escudo deflector
    if (bossLockRemaining > 0) {
      triggerScreenShake(2.5, 8);
      triggerVibrate(40);
      playShieldDeflectSound();
      spawnFloatingText('🛡️ ¡ESCUDO SÍSMICO ACTIVO! ESPERA...', 0, blockHeight * 2, 0, '#f43f5e', 1.25);
      return;
    }

    const prev = stack[stack.length - 1];
    const curr = currentBlock;
    const axis = curr.axis;

    // EFECTO MAGNET / ASISTENCIA MAGNÉTICA DE MODO FIEBRE
    if (curr.material === 'MAGNET' || feverActive) {
      const diff = axis === 'x' ? curr.x - prev.x : curr.z - prev.z;
      if (Math.abs(diff) <= 14) {
        if (axis === 'x') curr.x = prev.x;
        else curr.z = prev.z;
        if (feverActive) {
          spawnParticles(curr.x + curr.width / 2, curr.y + curr.height, curr.z + curr.depth / 2, 'GOLD', 5);
        }
      }
    }

    if (axis === 'x') {
      let diff = curr.x - prev.x;

      if (Math.abs(diff) <= PERFECT_TOLERANCE) {
        curr.x = prev.x;
        handlePerfectPlacement(curr);
      } else {
        combo = 0;
        feverActive = false;
        feverBlocksRemaining = 0;
        comboBadgeEl.classList.add('hidden');
        comboBadgeEl.classList.remove('fever-pulse');
        comboBadgeEl.innerHTML = '¡PERFECTO! x<span id="combo-count">1</span>';

        // EFECTO HIELO: Inercia deslizante
        if (curr.material === 'ICE') {
          const slide = curr.direction * 4.0;
          curr.x += slide;
          diff += slide;
          triggerScreenShake(2, 5);
        }

        const skinObjX = (equippedSkin !== 'classic') ? getSkinById(equippedSkin) : null;
        if (diff > 0) {
          const overlap = prev.width - diff;
          if (overlap < 12) { triggerGameOver(curr); return; }
          createDebris(prev.x + prev.width, curr.y, curr.z, diff, curr.depth, curr.height, curr.material, 'x', 1, skinObjX);
          curr.width = overlap;
        } else {
          const overlap = curr.width + diff;
          if (overlap < 12) { triggerGameOver(curr); return; }
          createDebris(curr.x, curr.y, curr.z, -diff, curr.depth, curr.height, curr.material, 'x', -1, skinObjX);
          curr.x = prev.x;
          curr.width = overlap;
        }

        triggerScreenShake(2.5, 6);
        if (skinObjX && skinObjX.id !== 'classic') {
          playSkinSound(skinObjX);
        } else {
          playMaterialSound(curr.material);
        }
        triggerVibrate(25);
        const partColorX = (skinObjX && skinObjX.id !== 'classic') ? skinObjX.color : curr.material;
        spawnParticles(curr.x + curr.width, curr.y + curr.height, curr.z, partColorX, 8);
        
        // Daño a Jefe en Colocación Estándar
        if (activeLevel.isBoss || activeLevel.isSuperBoss) {
          const isSuper = !!activeLevel.isSuperBoss;
          triggerScreenShake(3.2, 8);
          try { playTone(95, 'sawtooth', 0.16, 0.35); } catch (e) {}
          spawnFloatingText('⚔️ ¡DAÑO! -1 HP', curr.x + curr.width / 2, curr.y + 12, curr.z + curr.depth / 2, isSuper ? '#ec4899' : '#ef4444', 1.3);
        } else {
          spawnFloatingText('+25', curr.x + curr.width / 2, curr.y, curr.z + curr.depth / 2, '#94a3b8', 0.9);
        }
      }
    } else {
      let diff = curr.z - prev.z;

      if (Math.abs(diff) <= PERFECT_TOLERANCE) {
        curr.z = prev.z;
        handlePerfectPlacement(curr);
      } else {
        combo = 0;
        feverActive = false;
        feverBlocksRemaining = 0;
        comboBadgeEl.classList.add('hidden');
        comboBadgeEl.classList.remove('fever-pulse');
        comboBadgeEl.innerHTML = '¡PERFECTO! x<span id="combo-count">1</span>';

        if (curr.material === 'ICE') {
          const slide = curr.direction * 4.0;
          curr.z += slide;
          diff += slide;
          triggerScreenShake(2, 5);
        }

        const skinObjZ = (equippedSkin !== 'classic') ? getSkinById(equippedSkin) : null;
        if (diff > 0) {
          const overlap = prev.depth - diff;
          if (overlap < 12) { triggerGameOver(curr); return; }
          createDebris(curr.x, curr.y, prev.z + prev.depth, curr.width, diff, curr.height, curr.material, 'z', 1, skinObjZ);
          curr.depth = overlap;
        } else {
          const overlap = curr.depth + diff;
          if (overlap < 12) { triggerGameOver(curr); return; }
          createDebris(curr.x, curr.y, curr.z, curr.width, -diff, curr.height, curr.material, 'z', -1, skinObjZ);
          curr.z = prev.z;
          curr.depth = overlap;
        }

        triggerScreenShake(2.5, 6);
        if (skinObjZ && skinObjZ.id !== 'classic') {
          playSkinSound(skinObjZ);
        } else {
          playMaterialSound(curr.material);
        }
        triggerVibrate(25);
        const partColorZ = (skinObjZ && skinObjZ.id !== 'classic') ? skinObjZ.color : curr.material;
        spawnParticles(curr.x, curr.y + curr.height, curr.z, partColorZ, 8);
        
        // Daño a Jefe en Colocación Estándar
        if (activeLevel.isBoss || activeLevel.isSuperBoss) {
          const isSuper = !!activeLevel.isSuperBoss;
          triggerScreenShake(3.2, 8);
          try { playTone(95, 'sawtooth', 0.16, 0.35); } catch (e) {}
          spawnFloatingText('⚔️ ¡DAÑO! -1 HP', curr.x + curr.width / 2, curr.y + 12, curr.z + curr.depth / 2, isSuper ? '#ec4899' : '#ef4444', 1.3);
        } else {
          spawnFloatingText('+25', curr.x + curr.width / 2, curr.y, curr.z + curr.depth / 2, '#94a3b8', 0.9);
        }
      }
    }

    // EFECTO SLIME: Activar resorte elástico
    if (curr.material === 'SLIME') {
      curr.springTime = 0;
    }

    // Acumulador de Oro para Logro
    if (curr.material === 'GOLD') {
      goldBlocksCount++;
      localStorage.setItem('c2c_gold_count', goldBlocksCount.toString());
      if (goldBlocksCount >= 15) unlockAchievement('gold_fever');
    }

    // RECOGIDA DE BOTÍN FLOTANTE (Catch the Loot) 🪙 / 💎
    if (activeLoot && !activeLoot.collected) {
      playLootCollectSound(activeLoot.type);
      triggerVibrate([40, 25, 60]);
      if (activeLoot.type === 'GEM') {
        const diaVal = activeLoot.value;
        addDiamonds(diaVal);
        spawnFloatingText(`💎 +${diaVal} DIAMANTE CÓSMICO!`, curr.x + curr.width / 2, curr.y + curr.height + 25, curr.z + curr.depth / 2, '#00f0ff', 1.4);
        spawnParticles(curr.x + curr.width / 2, curr.y + curr.height, curr.z + curr.depth / 2, 'CYBER', 22);
      } else {
        const lootVal = activeLoot.value * (feverActive ? 3 : 1);
        addCoins(lootVal);
        matchCoinsEarned += lootVal;
        spawnFloatingText(`🪙 +${lootVal} ORO CÓSMICO!`, curr.x + curr.width / 2, curr.y + curr.height + 25, curr.z + curr.depth / 2, '#ffd700', 1.4);
        spawnParticles(curr.x + curr.width / 2, curr.y + curr.height, curr.z + curr.depth / 2, 'GOLD', 22);
      }
      activeLoot = null;
    }

    // Si el modo fiebre está activo, decrementar contador de bloques restantes
    if (feverActive) {
      feverBlocksRemaining--;
      if (feverBlocksRemaining <= 0 && combo < 5) {
        feverActive = false;
        comboBadgeEl.classList.remove('fever-pulse');
        comboBadgeEl.innerHTML = `¡PERFECTO! x<span id="combo-count">${combo}</span>`;
      }
    }

    // FÍSICAS DE PESO: Compresión elástica de impacto vertical y choque de masa
    curr.squashY = 0.74;
    curr.squashXZ = 1.14;
    if (prev) {
      prev.squashY = 0.88;
    }
    cameraImpactOffset = 5.2;
    const activeSkinImpact = (equippedSkin !== 'classic') ? getSkinById(equippedSkin) : null;
    playThudSound(curr.material, activeSkinImpact);

    stack.push(curr);
    score++;
    scoreEl.innerText = score;
    scoreEl.classList.add('bump');
    setTimeout(() => scoreEl.classList.remove('bump'), 150);

    targetCameraY = score * blockHeight;

    // Recompensa de Monedas Cósmicas por colocar bloque (Multiplicador x3 en Fiebre + Ventaja Pasiva de Aspecto)
    const activeSkin = getSkinById(equippedSkin);
    const skinBonus = (activeSkin && activeSkin.bonusCoins) ? activeSkin.bonusCoins : 0;
    const placeCoins = (feverActive ? 6 : 2) + skinBonus;
    addCoins(placeCoins);
    matchCoinsEarned += placeCoins;

    // ¿SE COMPLETÓ LA META DEL NIVEL O AVANCE EN MODO INFINITO? 🎉
    if (gameMode === 'MISSIONS') {
      if (score >= activeLevel.target) {
        if (activeLevel.isBoss || activeLevel.isSuperBoss) {
          triggerScreenShake(8.0, 20);
          triggerHitStop(10, 0.6);
          const defeatCoins = activeLevel.isSuperBoss ? 200 : 100;
          addCoins(defeatCoins);
          matchCoinsEarned += defeatCoins;
          spawnFloatingText(activeLevel.isSuperBoss ? '👑 ¡SÚPER JEFE ANIQUILADO!' : '💀 ¡JEFE DERROTADO!', curr.x + curr.width / 2, curr.y + 25, curr.z + curr.depth / 2, '#ffd700', 1.8);
        } else {
          addCoins(50);
          matchCoinsEarned += 50;
        }
        triggerLevelClear();
        return;
      } else if (activeLevel.isBoss || activeLevel.isSuperBoss) {
        // Disparo de Hechizos Aleatorios de Jefe según Progreso de Pisos (25%, 50%, 75%)
        const progress = score / activeLevel.target;
        if (progress >= 0.25 && !bossTriggeredThresholds.includes(0.25) && bossActiveSpells[0]) {
          bossTriggeredThresholds.push(0.25);
          activateBossSpell(bossActiveSpells[0]);
        } else if (progress >= 0.50 && !bossTriggeredThresholds.includes(0.50) && bossActiveSpells[1]) {
          bossTriggeredThresholds.push(0.50);
          activateBossSpell(bossActiveSpells[1]);
        } else if (progress >= 0.75 && !bossTriggeredThresholds.includes(0.75) && bossActiveSpells[2]) {
          bossTriggeredThresholds.push(0.75);
          activateBossSpell(bossActiveSpells[2]);
        }
      }
    } else if (gameMode === 'ENDLESS') {
      // Recompensa de monedas cada 10 pisos en Modo Infinito para la tienda
      if (score > 0 && score % 10 === 0) {
        addCoins(30);
        matchCoinsEarned += 30;
        spawnFloatingText('🪙 +30 MONEDAS CÓSMICAS!', curr.x + curr.width / 2, curr.y, curr.z + curr.depth / 2, '#ffcc00', 1.4);
      }
      // Rotación Aleatoria de Biomas cada 15 pisos (Sneak-Peek de los 20 mundos)
      if (score > 0 && score % 15 === 0) {
        let nextWorldIdx = Math.floor(Math.random() * WORLDS.length);
        while (nextWorldIdx === currentEndlessWorldIdx && WORLDS.length > 1) {
          nextWorldIdx = Math.floor(Math.random() * WORLDS.length);
        }
        currentEndlessWorldIdx = nextWorldIdx;
        currentEndlessBiomeIdx = nextWorldIdx;

        const chosenWorld = WORLDS[currentEndlessWorldIdx];
        const randomLvlInWorld = Math.floor(Math.random() * chosenWorld.totalLevels) + 1;
        const targetLvlNum = getWorldStartLevel(currentEndlessWorldIdx) + randomLvlInWorld - 1;
        activeLevel = getLevelData(targetLvlNum);

        const currentCampaignMaxWorld = getWorldInfoForLevel(unlockedLevelMax + 1).worldIndex;
        const isSneakPeek = currentEndlessWorldIdx > currentCampaignMaxWorld;

        updateHUD();
        spawnVictoryConfetti();
        triggerScreenShake(5, 12);
        playRecoveryChime();
        initBackgroundObjects();

        if (isSneakPeek) {
          addCoins(50);
          matchCoinsEarned += 50;
          spawnFloatingText(`👀 ¡SNEAK-PEEK: ${chosenWorld.name.toUpperCase()}!`, curr.x + curr.width / 2, curr.y, curr.z + curr.depth / 2, '#f43f5e', 1.5);
          setTimeout(() => {
            spawnFloatingText(`🔓 ¡MUNDO BLOQUEADO DESCUBIERTO! (+50 🪙)`, curr.x + curr.width / 2, curr.y - 25, curr.z + curr.depth / 2, '#ffd700', 1.25);
          }, 350);
        } else {
          addCoins(30);
          matchCoinsEarned += 30;
          spawnFloatingText(`🚀 ¡BIOMA: ${chosenWorld.name.toUpperCase()}!`, curr.x + curr.width / 2, curr.y, curr.z + curr.depth / 2, '#00f0ff', 1.4);
        }
      }
    }

    spawnNextBlock();
  }

  function handlePerfectPlacement(curr) {
    combo++;
    perfectCount++;
    playComboChord(combo);
    const skinObjPerf = getSkinById(equippedSkin);
    if (equippedSkin !== 'classic' && skinObjPerf && skinObjPerf.id !== 'classic') {
      setTimeout(() => playSkinSound(skinObjPerf), 60);
    }
    triggerVibrate([30, 20, 40]);

    // Activación / Mantenimiento de Modo Fiebre (Fever Mode a partir de 5 combos)
    if (combo >= 5) {
      if (!feverActive) {
        feverActive = true;
        feverBlocksRemaining = 5;
        playFeverFanfare();
        triggerScreenShake(4.5, 12);
        triggerHitStop(4, 0.45);
        spawnFloatingText('🔥 ¡MODO FIEBRE ACTIVADO! (x3 🪙)', curr.x + curr.width / 2, curr.y - 20, curr.z + curr.depth / 2, '#ff007a', 1.5);
      } else {
        feverBlocksRemaining = Math.max(feverBlocksRemaining, 5);
      }
    }

    const perfectCoins = feverActive ? 30 : 10;
    addCoins(perfectCoins);
    matchCoinsEarned += perfectCoins;

    // Hit-stop & Flash Bloom táctil en combos
    if (combo >= 2) {
      triggerHitStop(3, combo >= 4 ? 0.35 : 0.2);
    }

    // Feedback de Daño Crítico a Jefe en combo perfecto
    if (activeLevel.isBoss || activeLevel.isSuperBoss) {
      triggerScreenShake(5.2, 14);
      triggerHitStop(5, 0.45);
      try {
        playTone(130, 'sawtooth', 0.22, 0.4);
        setTimeout(() => playTone(540, 'square', 0.12, 0.25), 40);
      } catch (e) {}
      spawnFloatingText('💥 ¡CRÍTICO AL JEFE! -2 HP', curr.x + curr.width / 2, curr.y + 14, curr.z + curr.depth / 2, '#fbbf24', 1.6);
    }

    // Logro de Combo
    if (combo >= 4) {
      unlockAchievement('combo_fever');
    }

    // Ketchapp Combo Recovery: Expansión de bloque tras 4+ combos consecutivos
    if (combo >= 4) {
      let expanded = false;
      if (curr.width < initialSize) {
        curr.width = Math.min(initialSize, curr.width + 8);
        expanded = true;
      }
      if (curr.depth < initialSize) {
        curr.depth = Math.min(initialSize, curr.depth + 8);
        expanded = true;
      }
      if (expanded) {
        playRecoveryChime();
        triggerScreenShake(3, 8);
        const expCoins = feverActive ? 15 : 5;
        addCoins(expCoins);
        matchCoinsEarned += expCoins;
        spawnFloatingText('✨ ¡EXPANSIÓN! (+8px)', curr.x + curr.width / 2, curr.y, curr.z + curr.depth / 2, '#ffcc00', 1.3);
      }
    }

    if (feverActive) {
      comboBadgeEl.classList.add('fever-pulse');
      comboBadgeEl.innerHTML = `🔥 FIEBRE x<span id="combo-count">${combo}</span> (x3 🪙)`;
    } else {
      comboBadgeEl.classList.remove('fever-pulse');
      comboBadgeEl.innerHTML = `¡PERFECTO! x<span id="combo-count">${combo}</span>`;
    }
    comboBadgeEl.classList.remove('hidden');

    spawnParticles(curr.x + curr.width / 2, curr.y + curr.height, curr.z + curr.depth / 2, feverActive ? 'GOLD' : curr.material, feverActive ? 30 : 20);

    // Texto flotante de impacto
    const pts = feverActive
      ? `🔥 +${150 * combo} ¡FIEBRE x${combo}!`
      : (combo >= 3 ? `+${50 * combo} COMBO x${combo}!` : '+50 ¡PERFECTO!');
    const col = feverActive ? '#ffd700' : (combo >= 3 ? '#ff007a' : '#00ff88');
    spawnFloatingText(pts, curr.x + curr.width / 2, curr.y, curr.z + curr.depth / 2, col, feverActive ? 1.45 : (combo >= 3 ? 1.3 : 1.1));
  }

  function createDebris(x, y, z, w, d, h, material, cutAxis = 'x', cutDir = 1, skinObj = null) {
    const latSpeed = 3.2;
    const resolvedSkin = skinObj || (equippedSkin !== 'classic' ? getSkinById(equippedSkin) : null);
    debrisList.push({
      x, y, z,
      width: w, depth: d, height: h,
      material,
      skin: resolvedSkin,
      vy: -1.2,
      gravity: 0.85,
      vx: cutAxis === 'x' ? (cutDir > 0 ? latSpeed : -latSpeed) : (Math.random() - 0.5) * 1.5,
      vz: cutAxis === 'z' ? (cutDir > 0 ? latSpeed : -latSpeed) : (Math.random() - 0.5) * 1.5,
      rotX: 0, rotY: 0, rotZ: 0,
      vRotX: (Math.random() - 0.5) * 0.16,
      vRotY: (Math.random() - 0.5) * 0.12,
      vRotZ: (Math.random() - 0.5) * 0.16,
      alpha: 1.0
    });
  }

  // --- 🎉 VICTORIA: NIVEL COMPLETADO CON ESTRELLAS ---
  function triggerLevelClear() {
    state = 'VICTORY';
    currentBlock = null;
    cleanupBossMechanics();
    feverActive = false;
    feverBlocksRemaining = 0;
    activeLoot = null;
    if (comboBadgeEl) { comboBadgeEl.classList.remove('fever-pulse'); comboBadgeEl.classList.add('hidden'); }
    releaseScreenWakeLock();
    playVictoryFanfare();
    triggerVibrate([100, 50, 100, 50, 200]);

    // Guardar referencia exacta del nivel que se acaba de ganar
    const completedLevel = activeLevel;
    const completedIdx = currentLevelIdx;
    lastCompletedLevelIdx = completedIdx;

    // Lanzar confeti festivo
    spawnVictoryConfetti();

    // Calcular Estrellas según porcentaje de aciertos perfectos
    const accuracy = Math.round((perfectCount / completedLevel.target) * 100);
    let stars = 1;
    if (accuracy >= 45) stars = 3;
    else if (accuracy >= 25) stars = 2;

    levelStars[completedLevel.id] = Math.max(levelStars[completedLevel.id] || 0, stars);
    localStorage.setItem('c2c_level_stars', JSON.stringify(levelStars));

    // Desbloquear Logros pertinentes
    if (completedLevel.id === 1) unlockAchievement('magma_escape');
    if (completedLevel.id === 5) unlockAchievement('ice_skater');
    if (stars === 3) unlockAchievement('star_collector');

    // Desbloquear y avanzar al siguiente nivel en el progreso guardado
    const nextIdx = Math.min(completedIdx + 1, LEVELS.length - 1);
    if (nextIdx > unlockedLevelMax) {
      unlockedLevelMax = nextIdx;
      localStorage.setItem('c2c_unlocked_level', unlockedLevelMax.toString());
      if (unlockedLevelMax >= 7) unlockAchievement('cosmos_pioneer');
    }

    // Actualizar progreso persistente al siguiente nivel desbloqueado
    currentLevelIdx = nextIdx;
    localStorage.setItem('c2c_current_level', currentLevelIdx.toString());

    // Recompensas épicas para Jefes y Súper Jefes (+ Monedas y + Diamantes)
    if (completedLevel.isSuperBoss) {
      addCoins(250);
      addDiamonds(12);
      matchCoinsEarned += 250;
      clearLevelTitle.innerText = completedLevel.id >= TOTAL_CAMPAIGN_LEVELS ? '🌌 ¡UNIVERSO CONQUISTADO!' : '👑 ¡SÚPER JEFE DERROTADO!';
      clearLevelDesc.innerText = completedLevel.id >= TOTAL_CAMPAIGN_LEVELS
        ? `¡HAS DERROTADO AL SÚPER JEFE FINAL Y ALCANZADO EL NÚCLEO DEL COSMOS! Botín Supremo (+250 🪙, +12 💎).`
        : `¡Has aniquilado a ${completedLevel.world.bossName} en ${completedLevel.world.name}! Botín Legendario (+250 🪙, +12 💎).`;
      triggerScreenShake(6, 20);
    } else if (completedLevel.isBoss) {
      addCoins(100);
      addDiamonds(5);
      matchCoinsEarned += 100;
      clearLevelTitle.innerText = '👹 ¡JEFE DE BLOQUE DERROTADO!';
      clearLevelDesc.innerText = `¡Superaste el Bloque ${completedLevel.world.id} derrotando a ${completedLevel.world.bossName}! Botín de Jefe (+100 🪙, +5 💎).`;
      triggerScreenShake(4, 14);
    } else {
      if (stars === 3) {
        addDiamonds(1);
      }
      clearLevelTitle.innerText = `¡NIVEL ${completedLevel.id} SUPERADO!`;
      clearLevelDesc.innerText = `Completaste la meta de ${completedLevel.target} pisos en ${completedLevel.name}.${stars === 3 ? ' ¡Bono 3 Estrellas: +1 💎!' : ''}`;
    }

    clearScoreVal.innerText = score;
    clearAccuracyVal.innerText = `${accuracy}%`;

    star1.innerText = stars >= 1 ? '⭐' : '🖤';
    star2.innerText = stars >= 2 ? '⭐' : '🖤';
    star3.innerText = stars >= 3 ? '⭐' : '🖤';

    // Récord semanal actualizado
    const todayName = DAYS_OF_WEEK[new Date().getDay()];
    weeklyData[todayName] = Math.max(weeklyData[todayName] || 0, score);
    localStorage.setItem('c2c_weekly_records', JSON.stringify(weeklyData));

    // Configurar Botón de Duplicar Recompensa de Nivel (AdMob Rewarded Video)
    if (clearDoubleAdBtn) {
      const clearBonus = completedLevel.isSuperBoss ? 250 : (completedLevel.isBoss ? 100 : 50);
      if (clearDoubleVal) clearDoubleVal.innerText = clearBonus;
      clearDoubleAdBtn.innerHTML = `
        <span class="ad-icon">🎬</span>
        <div class="ad-btn-copy">
          <span class="ad-btn-heading">DUPLICAR RECOMPENSA (x2)</span>
          <span class="ad-btn-sub">Recibe +<span id="clear-double-val">${clearBonus}</span> 🪙 extras viendo un video</span>
        </div>
        <span class="ad-badge-bonus">x2</span>
      `;
      clearDoubleAdBtn.disabled = false;
      clearDoubleAdBtn.classList.remove('hidden');
    }

    setTimeout(() => {
      hud.classList.add('hidden');
      levelClearModal.classList.remove('hidden');
    }, 700);
  }

  // --- 💀 GAME OVER: NIVEL FALLIDO / FIN DE PARTIDA ---
  function triggerGameOver(fallingBlock) {
    // Si el Seguro Revivir está equipado y disponible, salvar al jugador!
    if (activeEquippedBoosters.revive && (boostersInventory.revive || 0) > 0) {
      boostersInventory.revive--;
      activeEquippedBoosters.revive = false;
      localStorage.setItem('c2c_booster_revive', boostersInventory.revive.toString());
      updateBoostersUI();
      playVictoryFanfare();
      triggerScreenShake(7, 25);
      const prev = stack[stack.length - 1];
      spawnFloatingText('💖 ¡SEGUNDA OPORTUNIDAD ACTIVADA!', 0, (prev ? prev.y : 0) + 40, 0, '#ff007a', 1.8);
      if (prev) {
        state = 'PLAYING';
        spawnNextBlock();
        return;
      }
    }

    state = 'GAMEOVER';
    currentBlock = null;
    cleanupBossMechanics();
    feverActive = false;
    feverBlocksRemaining = 0;
    activeLoot = null;
    if (comboBadgeEl) { comboBadgeEl.classList.remove('fever-pulse'); comboBadgeEl.classList.add('hidden'); }
    confettiList = [];
    releaseScreenWakeLock();
    triggerVibrate([80, 40, 120]);
    triggerScreenShake(5, 14);


    if (fallingBlock) {
      createDebris(fallingBlock.x, fallingBlock.y, fallingBlock.z, fallingBlock.width, fallingBlock.depth, fallingBlock.height, fallingBlock.material, 'x', 1);
    }

    if (gameMode === 'ENDLESS') {
      goBiomeBadge.innerText = `🌌 MODO INFINITO • ASCENSO ILIMITADO`;
      finalScoreEl.innerText = score;
      const best = parseInt(localStorage.getItem('c2c_endless_best') || '0', 10);
      finalTargetGoal.innerText = `RÉCORD: ${Math.max(score, best)}`;
      if (score > best) {
        localStorage.setItem('c2c_endless_best', score.toString());
      }
      streakMsgEl.innerText = `¡Alcanzaste ${score} pisos y ganaste ${matchCoinsEarned} monedas cósmicas para la tienda!`;
    } else {
      if (activeLevel.isSuperBoss) {
        goBiomeBadge.innerText = `☠️ SÚPER JEFE: ${activeLevel.name.toUpperCase()}`;
      } else if (activeLevel.isBoss) {
        goBiomeBadge.innerText = `👹 JEFE: ${activeLevel.name.toUpperCase()}`;
      } else {
        goBiomeBadge.innerText = `${activeLevel.icon} NIVEL ${activeLevel.id}: ${activeLevel.name.toUpperCase()}`;
      }
      finalScoreEl.innerText = score;
      finalTargetGoal.innerText = activeLevel.target;

      const remaining = activeLevel.target - score;
      streakMsgEl.innerText = `Te faltaron solo ${remaining} pisos para superar este desafío. ¡Prueba otra vez!`;
    }

    // Monedas ganadas en la partida (Index.html ya provee el + y el emoji de moneda)
    if (goCoinsVal) {
      goCoinsVal.innerText = `${matchCoinsEarned}`;
    }

    // Actualizar récord semanal
    const todayName = DAYS_OF_WEEK[new Date().getDay()];
    weeklyData[todayName] = Math.max(weeklyData[todayName] || 0, score);
    localStorage.setItem('c2c_weekly_records', JSON.stringify(weeklyData));

    // Configurar Botones de Monetización con Anuncios (Game Over)
    if (reviveAdBtn) {
      if (hasRevivedThisMatch) {
        reviveAdBtn.classList.add('hidden');
      } else {
        reviveAdBtn.classList.remove('hidden');
      }
    }
    if (doubleCoinsAdBtn) {
      const extraCoins = Math.max(25, matchCoinsEarned);
      if (doubleCoinsAmount) doubleCoinsAmount.innerText = extraCoins;
      doubleCoinsAdBtn.innerHTML = `
        <span class="ad-icon">🪙</span>
        <div class="ad-btn-copy">
          <span class="ad-btn-heading">DUPLICAR MONEDAS x2</span>
          <span class="ad-btn-sub">Gana +<span id="double-coins-amount">${extraCoins}</span> monedas extras viendo un video</span>
        </div>
        <span class="ad-badge-bonus">x2</span>
      `;
      doubleCoinsAdBtn.disabled = false;
      doubleCoinsAdBtn.classList.remove('hidden');
    }

    setTimeout(() => {
      hud.classList.add('hidden');
      gameOverScreen.classList.remove('hidden');
    }, 600);
  }

  // --- Bucle de Actualización (60 FPS) ---
  // --- Bucle de Actualización (Escalado por Delta Time para 60Hz, 90Hz y 120Hz) ---
  function update(ts = 1.0) {
    shineOffset += 0.04 * ts;

    // Control de Hit-Stop
    if (hitStopTimer > 0) {
      hitStopTimer -= ts;
      return; // Congela la física durante el micro-impacto
    }

    // Control de Screen Shake
    if (shakeFrames > 0) {
      shakeX = (Math.random() - 0.5) * shakeIntensity * 2;
      shakeY = (Math.random() - 0.5) * shakeIntensity * 2;
      shakeFrames -= ts;
      shakeIntensity *= Math.pow(0.88, ts);
    } else {
      shakeX = 0;
      shakeY = 0;
    }

    // Amortiguación reactiva del sacudón de peso de la cámara (Físicas de impacto)
    if (cameraImpactOffset > 0) {
      cameraImpactOffset *= Math.pow(0.76, ts);
      if (cameraImpactOffset < 0.05) cameraImpactOffset = 0;
    }

    // Amortiguación elástica de compresión (Squash & Stretch) de los bloques de la torre
    stack.forEach(b => {
      if (b.squashY !== undefined && b.squashY < 0.999) {
        b.squashY += (1.0 - b.squashY) * (0.28 * ts);
        if (Math.abs(1.0 - b.squashY) < 0.01) b.squashY = 1.0;
      }
      if (b.squashXZ !== undefined && b.squashXZ > 1.001) {
        b.squashXZ += (1.0 - b.squashXZ) * (0.28 * ts);
        if (Math.abs(1.0 - b.squashXZ) < 0.01) b.squashXZ = 1.0;
      }
    });

    // Control de Jefe: Terremoto y Bloqueo Sísmico de 3 segundos
    if (bossLockRemaining > 0 && state === 'PLAYING') {
      bossLockRemaining -= ts / 60;
      shakeIntensity = Math.max(shakeIntensity, 6.0);
      shakeFrames = Math.max(shakeFrames, 6);
      if (Math.random() < 0.18) triggerVibrate(50);
      if (quakeTimerEl) {
        quakeTimerEl.innerText = `${Math.max(0, bossLockRemaining).toFixed(1)}s`;
      }
      if (bossLockRemaining <= 0) {
        bossLockRemaining = 0;
        if (bossQuakeOverlay) bossQuakeOverlay.classList.add('hidden');
        playTone(520, 'square', 0.22, 0.3);
        spawnFloatingText('⚔️ ¡A APILAR! ¡EL ESCUDO CAYÓ!', 0, blockHeight * 2, 0, '#fef08a', 1.5);
      }
    }

    // Control de Jefe: Cronómetro de Combate
    if (bossTimeRemaining > 0 && bossLockRemaining <= 0 && state === 'PLAYING' && (activeLevel.isBoss || activeLevel.isSuperBoss)) {
      bossTimeRemaining -= ts / 60;
      const pct = Math.max(0, (bossTimeRemaining / bossTimeTotal) * 100);
      if (bossTimerFill) bossTimerFill.style.width = `${pct}%`;
      if (bossTimerVal) bossTimerVal.innerText = `${Math.max(0, Math.ceil(bossTimeRemaining))}s`;

      if (bossTimeRemaining <= 10) {
        if (bossTimerBadge) bossTimerBadge.classList.add('timer-danger');
      } else {
        if (bossTimerBadge) bossTimerBadge.classList.remove('timer-danger');
      }

      if (bossTimeRemaining <= 0) {
        bossTimeRemaining = 0;
        triggerGameOver(currentBlock);
        if (streakMsgEl) {
          streakMsgEl.innerText = `⏰ ¡SE AGOTÓ EL TIEMPO! ${activeLevel.world.bossName} aniquiló tu torre con su poder cósmico. ¡Sé más rápido la próxima vez!`;
        }
        return;
      }
    }

    // Control de Hechizo Dinámico de Jefe
    if (bossCurrentSpell && state === 'PLAYING') {
      bossSpellTimer -= ts / 60;
      if (bossSpellCountdown) {
        bossSpellCountdown.innerText = `${Math.max(0, Math.ceil(bossSpellTimer))}s`;
      }
      if (bossSpellTimer <= 0) {
        bossCurrentSpell.cleanup();
        bossCurrentSpell = null;
        if (bossSpellBanner) bossSpellBanner.classList.add('hidden');
      }
    }

    if (state === 'PLAYING' && currentBlock) {
      const b = currentBlock;
      let effectiveSpeed = slowmoActive ? b.speed * 0.45 : b.speed;
      if (bossFrenzySpeedBoost > 0) {
        effectiveSpeed *= (1 + bossFrenzySpeedBoost);
      }

      // Movimiento lineal nítido y preciso para móvil escalado por Delta Time (Consistente a 60/90/120Hz)
      if (b.axis === 'x') {
        b.x += (effectiveSpeed * b.direction + bossCrosswindForce) * ts;
        if (b.x > b.centerRef + b.range) { b.x = b.centerRef + b.range; b.direction = -1; }
        else if (b.x < b.centerRef - b.range) { b.x = b.centerRef - b.range; b.direction = 1; }
      } else {
        b.z += (effectiveSpeed * b.direction + bossCrosswindForce) * ts;
        if (b.z > b.centerRef + b.range) { b.z = b.centerRef + b.range; b.direction = -1; }
        else if (b.z < b.centerRef - b.range) { b.z = b.centerRef - b.range; b.direction = 1; }
      }
    }

    // Actualización de Animaciones de Botín Flotante y Modo Fiebre
    if (activeLoot) {
      if (stack.length > 0) {
        const topBlock = stack[stack.length - 1];
        if (topBlock && (topBlock.width < 50 || topBlock.depth < 50)) {
          activeLoot = null;
        }
      }
      if (activeLoot) {
        activeLoot.rot += 0.05 * ts;
        activeLoot.bob = Math.sin(Date.now() * 0.005) * 6;
      }
    }
    if (feverActive) {
      feverPulseTime += 0.06 * ts;
    }

    // Actualización de Timers de Power-Ups
    if (slowmoActive) {
      slowmoDurationFrames -= ts;
      if (slowmoDurationFrames <= 0) {
        slowmoActive = false;
        if (powerupSlowmoBtn) powerupSlowmoBtn.classList.remove('active-powerup');
      }
    }

    if (slowmoCdFrames > 0) {
      slowmoCdFrames -= ts;
      if (slowmoCdOverlay) {
        slowmoCdOverlay.style.height = `${Math.max(0, slowmoCdFrames / SLOWMO_CD_TOTAL_FRAMES) * 100}%`;
      }
      if (slowmoCdFrames <= 0 && powerupSlowmoBtn) {
        powerupSlowmoBtn.classList.remove('on-cooldown');
      }
    }

    // Rebote elástico de Slime
    stack.forEach(b => {
      if (b.material === 'SLIME' && b.springTime !== undefined && b.springTime < 1.0) {
        b.springTime += 0.05 * ts;
        const decay = Math.exp(-b.springTime * 5);
        b.springScaleY = 1 - 0.25 * decay * Math.cos(b.springTime * 15);
        b.springScaleX = 1 + 0.15 * decay * Math.cos(b.springTime * 15);
      }
    });

    // Actualización de Escombros 3D
    for (let i = debrisList.length - 1; i >= 0; i--) {
      const d = debrisList[i];
      d.vy += d.gravity * ts;
      d.y -= d.vy * ts;
      d.x += d.vx * ts;
      d.z += d.vz * ts;
      d.rotX += d.vRotX * ts;
      d.rotY += d.vRotY * ts;
      d.rotZ += d.vRotZ * ts;

      if (d.y < cameraY - 120) {
        d.alpha -= 0.035 * ts;
      }
      if (d.alpha <= 0 || d.y < cameraY - 550) {
        debrisList.splice(i, 1);
      }
    }

    // Actualización de Partículas
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx * ts; p.y += p.vy * ts;
      p.life -= p.decay * ts;
      if (p.life <= 0) particles.splice(i, 1);
    }

    // Textos Flotantes
    for (let i = floatingTexts.length - 1; i >= 0; i--) {
      const t = floatingTexts[i];
      t.y += t.vy * ts;
      t.alpha -= 0.024 * ts;
      if (t.alpha <= 0) floatingTexts.splice(i, 1);
    }

    // Confeti Festivo con amortiguación y desvanecimiento
    for (let i = confettiList.length - 1; i >= 0; i--) {
      const c = confettiList[i];
      c.y += c.vy * ts;
      c.x += Math.sin(c.wobble) * 1.5 + c.vx * ts;
      c.vx *= Math.pow(0.98, ts);
      c.wobble += c.wobbleSpeed * ts;
      c.rot += c.vRot * ts;
      c.alpha -= 0.005 * ts;
      if (c.y > height + 30 || c.alpha <= 0) confettiList.splice(i, 1);
    }

    // Suavizado de Cámara (Lerp Camera)
    cameraY += (targetCameraY - cameraY) * (0.085 * ts);
  }

  function draw() {
    // 1. Limpieza Total del Buffer Físico (1:1 Hardware Pixels) para prevenir residuos fantasma
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    // 2. Establecer Transformación HiDPI / DPR exacta para todo el dibujado del juego
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // 3. Fondo Ambiental Dinámico Unificado (Cubre 100% de la pantalla)
    drawBackground();

    // 4. Screen Shake (Sacudida háptica de impacto)
    ctx.save();
    if (shakeX !== 0 || shakeY !== 0) {
      ctx.translate(shakeX, shakeY);
    }

    // Dibujado de Bloques Apilados, Guía Holográfica y Bloque Actual
    for (let i = 0; i < stack.length; i++) drawIsoBox(stack[i]);

    // Botín Flotante (Catch the Loot) sobre la torre
    if (activeLoot && (state === 'PLAYING' || state === 'PAUSED')) {
      drawLoot(activeLoot);
    }

    if (userSettings.guide && currentBlock && (state === 'PLAYING' || state === 'PAUSED') && stack.length > 0) {
      drawGhostGuide(currentBlock, stack[stack.length - 1]);
    }
    if (currentBlock && (state === 'PLAYING' || state === 'PAUSED')) drawIsoBox(currentBlock);

    // Espejismo Fantasma de Jefe: Dibuja un clon holográfico para desafiar los reflejos
    if (bossMirageActive && currentBlock && (state === 'PLAYING' || state === 'PAUSED')) {
      const b = currentBlock;
      const mirageX = (b.axis === 'x') ? (b.centerRef - (b.x - b.centerRef)) : b.x;
      const mirageZ = (b.axis === 'z') ? (b.centerRef - (b.z - b.centerRef)) : b.z;
      ctx.save();
      ctx.globalAlpha = 0.42;
      drawIsoBox({
        axis: b.axis,
        x: mirageX,
        z: mirageZ,
        y: b.y,
        width: b.width,
        depth: b.depth,
        height: b.height,
        material: 'CYBER'
      });
      ctx.restore();
    }

    // Dibujado de Escombros Cayendo en 3D
    for (let i = 0; i < debrisList.length; i++) drawDebris(debrisList[i]);

    // Partículas
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    // Textos Flotantes (+25, +50 ¡PERFECTO!) con borde protector anti-solapamiento
    floatingTexts.forEach(t => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, t.alpha));
      ctx.font = `900 ${Math.round(18 * t.scale)}px 'Space Grotesk', 'Outfit', sans-serif`;
      ctx.textAlign = 'center';
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.9)';
      ctx.lineWidth = 4;
      ctx.strokeText(t.text, t.x, t.y);
      ctx.fillStyle = t.color;
      ctx.shadowColor = t.color;
      ctx.shadowBlur = 10;
      ctx.fillText(t.text, t.x, t.y);
      ctx.restore();
    });

    ctx.restore(); // Termina Screen Shake

    // Aura y Viñeta Dinámica de Modo Fiebre (Fever Glow)
    if (feverActive && state === 'PLAYING') {
      drawFeverAura();
    }


    // Destello Flash Bloom de Hit-Stop
    if (flashBloom > 0.01) {
      ctx.fillStyle = `rgba(255, 255, 255, ${flashBloom})`;
      ctx.fillRect(0, 0, width, height);
      flashBloom *= 0.8;
    }

    // Lluvia de Confeti (Frente a la interfaz) con opacidad suave
    if (confettiList.length > 0) {
      confettiList.forEach(c => {
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rot);
        ctx.fillStyle = c.color;
        ctx.globalAlpha = Math.max(0, Math.min(1, c.alpha));
        ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
        ctx.restore();
      });
      ctx.globalAlpha = 1.0;
    }
  }

  let lastFrameTime = performance.now();
  let timeScale = 1.0;

  function loop(currentTime) {
    if (!currentTime) currentTime = performance.now();
    const dtMs = currentTime - lastFrameTime;
    lastFrameTime = currentTime;
    // Clamping de dt entre 5ms (200 FPS) y 80ms (12 FPS) para evitar saltos o teletransportes
    const clampedDt = Math.max(0.005, Math.min(0.080, dtMs / 1000));
    // A 60 FPS => 1.0; a 90 FPS => 0.67; a 120 FPS => 0.50 (Movimiento 100% idéntico y equilibrado en todos los celulares)
    timeScale = clampedDt * 60;

    update(timeScale);
    draw();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  // --- Renderizado del Selector de Niveles con Navegador de 20 Mundos (168 Niveles) ---
  let selectedWorldIdx = 0;

  function renderLevelSelectModal() {
    const info = getWorldInfoForLevel(currentLevelIdx + 1);
    selectedWorldIdx = info.worldIndex;
    updateWorldSelectorUI();
  }

  function updateWorldSelectorUI() {
    if (!levelCardsContainer) return;
    const world = WORLDS[selectedWorldIdx] || WORLDS[0];
    const startLvl = getWorldStartLevel(selectedWorldIdx);
    const endLvl = startLvl + world.totalLevels - 1;

    const currentInfo = getWorldInfoForLevel(unlockedLevelMax + 1);
    const maxUnlockedWorld = currentInfo.worldIndex;

    const blockTypeTitle = world.isSuperBossWorld ? `⭐ CAPÍTULO ${selectedWorldIdx + 1}` : `BLOQUE ${selectedWorldIdx + 1}`;
    if (worldTitleLabel) worldTitleLabel.innerText = `${blockTypeTitle}: ${world.name.toUpperCase()}`;
    if (worldRangeLabel) {
      const bossDesc = world.isSuperBossWorld ? `👑 SÚPER JEFE EN NIVEL ${endLvl}` : `👹 JEFE EN NIVEL ${endLvl}`;
      worldRangeLabel.innerText = `NIVELES ${startLvl} - ${endLvl} • ${bossDesc}`;
    }

    if (prevWorldBtn) prevWorldBtn.disabled = (selectedWorldIdx === 0);
    if (nextWorldBtn) nextWorldBtn.disabled = (selectedWorldIdx >= WORLDS.length - 1 || selectedWorldIdx > maxUnlockedWorld);

    levelCardsContainer.innerHTML = '';
    for (let l = startLvl; l <= endLvl; l++) {
      const lvl = getLevelData(l);
      const idx = l - 1;
      const isUnlocked = idx <= unlockedLevelMax;
      const isCurrent = idx === currentLevelIdx;
      const starsCount = levelStars[lvl.id] || 0;
      let starsTxt = '☆☆☆';
      if (starsCount === 3) starsTxt = '⭐⭐⭐';
      else if (starsCount === 2) starsTxt = '⭐⭐☆';
      else if (starsCount === 1) starsTxt = '⭐☆☆';

      let cardClass = `level-card-btn ${isCurrent ? 'active-current' : ''} ${!isUnlocked ? 'locked' : ''}`;
      if (lvl.isSuperBoss) cardClass += ' superboss-card';
      else if (lvl.isBoss) cardClass += ' boss-card';
      else if (lvl.isBonusGold) cardClass += ' bonus-gold-card';

      const card = document.createElement('div');
      card.className = cardClass;
      card.innerHTML = `
        <span class="lvl-icon">${isUnlocked ? lvl.icon : '🔒'}</span>
        <span class="lvl-num">${lvl.isSuperBoss ? '👑 SÚPER JEFE' : (lvl.isBoss ? '👹 JEFE' : `NIVEL ${lvl.id}`)}</span>
        <span class="lvl-name">${lvl.name}</span>
        <span class="lvl-goal">Meta: ${lvl.target} pisos</span>
        <span class="lvl-stars">${isUnlocked ? starsTxt : 'Bloqueado'}</span>
      `;

      if (isUnlocked) {
        card.addEventListener('click', () => {
          loadLevel(idx);
          levelSelectModal.classList.add('hidden');
        });
      }
      levelCardsContainer.appendChild(card);
    }
  }

  if (prevWorldBtn) {
    prevWorldBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (selectedWorldIdx > 0) {
        selectedWorldIdx--;
        updateWorldSelectorUI();
      }
    });
  }
  if (nextWorldBtn) {
    nextWorldBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const currentInfo = getWorldInfoForLevel(unlockedLevelMax + 1);
      const maxUnlockedWorld = currentInfo.worldIndex;
      if (selectedWorldIdx < WORLDS.length - 1 && selectedWorldIdx <= maxUnlockedWorld) {
        selectedWorldIdx++;
        updateWorldSelectorUI();
      }
    });
  }

  // --- Renderizado del Modal de Logros ---
  function renderAchievementsModal() {
    if (!achievementsContainer) return;
    achievementsContainer.innerHTML = '';

    ACHIEVEMENTS.forEach(ach => {
      const isUnlocked = !!unlockedAchievements[ach.id];
      const card = document.createElement('div');
      card.className = `achievement-card ${isUnlocked ? 'ach-unlocked' : 'ach-locked'}`;
      card.innerHTML = `
        <div class="ach-icon-box">${ach.icon}</div>
        <div class="ach-info">
          <span class="ach-title">${ach.name}</span>
          <span class="ach-desc">${ach.desc}</span>
        </div>
        <span class="ach-badge-status">${isUnlocked ? 'CONSEGUIDO 🏆' : 'BLOQUEADO 🔒'}</span>
      `;
      achievementsContainer.appendChild(card);
    });
  }

  // --- Renderizado de Leaderboard Semanal ---
  function renderLeaderboard() {
    const todayIndex = new Date().getDay();
    const todayName = DAYS_OF_WEEK[todayIndex];

    weekDaysContainer.innerHTML = '';
    const order = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    order.forEach(day => {
      const scoreDay = weeklyData[day] || 0;
      const isToday = day === todayName;
      const row = document.createElement('div');
      row.className = `day-record-row ${isToday ? 'today' : ''}`;
      row.innerHTML = `
        <span class="day-name">${day} ${isToday ? '⭐ (Hoy)' : ''}</span>
        <span class="day-score">${scoreDay} pisos</span>
      `;
      weekDaysContainer.appendChild(row);
    });

    hallOfFameContainer.innerHTML = '';
    hallOfFame.forEach((player, idx) => {
      const row = document.createElement('div');
      row.className = 'hof-row';
      row.innerHTML = `
        <span class="hof-rank">#${idx + 1}</span>
        <div class="hof-info">
          <span class="hof-name">${player.name}</span>
          <span class="hof-layer">${player.layer}</span>
        </div>
        <span class="hof-score">${player.floor} pisos</span>
      `;
      hallOfFameContainer.appendChild(row);
    });
  }

  // --- Eventos Táctiles y Controles ---
  window.addEventListener('pointerdown', (e) => {
    // Si no estamos jugando activamente, no interceptar toques de menú ni llamadas a placeBlock
    if (state !== 'PLAYING') return;

    // Si estamos jugando y se toca un botón, input o modal, permitir interacción UI sin colocar bloque
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('.modal-card') || e.target.closest('.overlay:not(.hidden)')) {
      return;
    }

    e.preventDefault();
    placeBlock();
  }, { passive: false });

  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      if (state === 'PLAYING') {
        e.preventDefault();
        placeBlock();
      }
    } else if (e.code === 'Escape') {
      if (state === 'PLAYING') {
        openPauseModal();
      } else if (state === 'PAUSED') {
        resumeGame();
      }
    }
  });

  // Botones de Misión
  mainPlayBtn.addEventListener('click', startMissionGame);
  restartBtn.addEventListener('click', startMissionGame);
  replayLevelBtn.addEventListener('click', () => {
    levelClearModal.classList.add('hidden');
    loadLevel(lastCompletedLevelIdx);
    startMissionGame();
  });

  nextLevelBtn.addEventListener('click', () => {
    levelClearModal.classList.add('hidden');
    loadLevel(Math.min(lastCompletedLevelIdx + 1, LEVELS.length - 1));
    startMissionGame();
  });

  if (clearMenuBtn) {
    clearMenuBtn.addEventListener('click', () => {
      if (levelClearModal) levelClearModal.classList.add('hidden');
      loadLevel(Math.min(lastCompletedLevelIdx + 1, LEVELS.length - 1));
      exitToMainMenu();
    });
  }

  if (homeBtn) {
    homeBtn.addEventListener('click', () => {
      if (gameOverScreen) gameOverScreen.classList.add('hidden');
      exitToMainMenu();
    });
  }

  // Selector de Niveles (Desde el Chip de Nivel o Tarjeta de Misión)
  if (openLevelSelectBtn) {
    openLevelSelectBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      renderLevelSelectModal();
      levelSelectModal.classList.remove('hidden');
    });
  }

  if (currentMissionCard) {
    currentMissionCard.addEventListener('click', () => {
      if (gameMode === 'MISSIONS') {
        renderLevelSelectModal();
        levelSelectModal.classList.remove('hidden');
      }
    });
  }

  if (selectLevelsSubbtn) {
    selectLevelsSubbtn.addEventListener('click', () => {
      renderLevelSelectModal();
      levelSelectModal.classList.remove('hidden');
    });
  }

  // Pestañas del Menú Unificado (Ajustes, Récords, Logros)
  function switchHubTab(tabName) {
    if (hubTabSettings) hubTabSettings.classList.toggle('active', tabName === 'settings');
    if (hubTabRecords) hubTabRecords.classList.toggle('active', tabName === 'records');
    if (hubTabTrophies) hubTabTrophies.classList.toggle('active', tabName === 'trophies');

    if (hubViewSettings) hubViewSettings.classList.toggle('active', tabName === 'settings');
    if (hubViewRecords) hubViewRecords.classList.toggle('active', tabName === 'records');
    if (hubViewTrophies) hubViewTrophies.classList.toggle('active', tabName === 'trophies');

    if (tabName === 'records') {
      renderLeaderboard();
    } else if (tabName === 'trophies') {
      renderAchievementsModal();
    }
  }

  if (hubTabSettings) hubTabSettings.addEventListener('click', () => switchHubTab('settings'));
  if (hubTabRecords) hubTabRecords.addEventListener('click', () => switchHubTab('records'));
  if (hubTabTrophies) hubTabTrophies.addEventListener('click', () => switchHubTab('trophies'));

  if (modalFullscreenBtn) {
    modalFullscreenBtn.addEventListener('click', () => {
      toggleFullScreen();
      setTimeout(() => {
        if (modalFullscreenBtn) {
          modalFullscreenBtn.innerText = document.fullscreenElement ? 'SALIR ⛶' : 'ACTIVAR ⛶';
        }
      }, 100);
    });
  }

  // Modal de Logros (integrado al Menú Unificado)
  if (openAchievementsBtn) {
    openAchievementsBtn.addEventListener('click', () => {
      switchHubTab('trophies');
      if (settingsModal) settingsModal.classList.remove('hidden');
    });
  }

  // Récords y Leaderboard (integrado al Menú Unificado)
  if (openLeaderboardBtn) {
    openLeaderboardBtn.addEventListener('click', () => {
      switchHubTab('records');
      if (settingsModal) settingsModal.classList.remove('hidden');
    });
  }

  if (openSettingsBtn) {
    openSettingsBtn.addEventListener('click', () => {
      switchHubTab('settings');
      settingsModal.classList.remove('hidden');
    });
  }

  if (openProfileBtn) {
    openProfileBtn.addEventListener('click', () => {
      switchHubTab('settings');
      settingsModal.classList.remove('hidden');
    });
  }

  document.querySelectorAll('.close-modal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-close');
      const m = document.getElementById(modalId);
      if (m) m.classList.add('hidden');
      if (modalId === 'pause-modal') {
        resumeGame();
      }
    });
  });

  saveSettingsBtn.addEventListener('click', () => {
    const newName = settingPlayerName.value.trim() || 'Explorador';
    userSettings.playerName = newName;
    userSettings.sound = settingSound.checked;
    userSettings.vibrate = settingVibrate.checked;
    userSettings.particles = settingParticles.checked;
    userSettings.music = settingMusic ? settingMusic.checked : true;
    userSettings.guide = settingGuide ? settingGuide.checked : true;

    localStorage.setItem('c2c_player_name', newName);
    localStorage.setItem('c2c_sound', userSettings.sound);
    localStorage.setItem('c2c_vibrate', userSettings.vibrate);
    localStorage.setItem('c2c_particles', userSettings.particles);
    localStorage.setItem('c2c_music', userSettings.music);
    localStorage.setItem('c2c_guide', userSettings.guide);

    if (userSettings.music && state === 'PLAYING') startAmbientMusic();
    else stopAmbientMusic();

    navPlayerName.innerText = newName;
    settingsModal.classList.add('hidden');
  });

  tabWeek.addEventListener('click', () => {
    tabWeek.classList.add('active'); tabGlobal.classList.remove('active');
    viewWeek.classList.add('active'); viewGlobal.classList.remove('active');
  });

  tabGlobal.addEventListener('click', () => {
    tabGlobal.classList.add('active'); tabWeek.classList.remove('active');
    viewGlobal.classList.add('active'); viewWeek.classList.remove('active');
  });

  // --- Selector de Modo de Juego (Misiones vs Infinito) ---
  function setGameMode(mode) {
    gameMode = mode;
    if (mode === 'MISSIONS') {
      modeMissionsBtn.classList.add('active');
      modeEndlessBtn.classList.remove('active');
      selectLevelsSubbtn.classList.remove('hidden');
      loadLevel(currentLevelIdx);
    } else {
      modeEndlessBtn.classList.add('active');
      modeMissionsBtn.classList.remove('active');
      selectLevelsSubbtn.classList.add('hidden');
      missionLevelNum.innerText = 'MODO INFINITO • ASCENSO ILIMITADO';
      missionLevelTitle.innerText = '🌌 Odisea Cósmica';
      missionLevelDesc.innerText = 'Apila sin límite atravesando los 8 biomas cada 20 pisos. ¡Bate el récord mundial!';
      playBtnText.innerText = 'JUGAR MODO INFINITO';
    }
  }

  if (modeMissionsBtn) modeMissionsBtn.addEventListener('click', () => setGameMode('MISSIONS'));
  if (modeEndlessBtn) modeEndlessBtn.addEventListener('click', () => setGameMode('ENDLESS'));

  // --- Control y Paginación de la Tienda de Aspectos (Pantalla Completa) ---
  let selectedSkinCategory = 'ALL';
  let selectedSkinRarity = 'ALL';
  let currentSkinsPage = 0;
  const SKINS_PER_PAGE = 24;

  // Generador de Miniatura 3D Isométrica Vectorial para cada Aspecto
  function createIsoCubeSVG(color1, color2, archetype) {
    const c1 = color1 || '#ff5722';
    const c2 = color2 || '#ff8a50';
    const gradId = `topG_${c1.replace(/[^a-zA-Z0-9]/g, '')}_${c2.replace(/[^a-zA-Z0-9]/g, '')}`;
    return `
      <svg class="iso-cube-svg" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${c2}"/>
            <stop offset="100%" stop-color="${c1}"/>
          </linearGradient>
        </defs>
        <!-- Cara Izquierda (Sombra Media) -->
        <path d="M 7 18 L 27 29 L 27 46 L 7 35 Z" fill="${c1}" opacity="0.84"/>
        <!-- Cara Derecha (Sombra Profunda) -->
        <path d="M 27 29 L 47 18 L 47 35 L 27 46 Z" fill="${c1}" opacity="0.55"/>
        <!-- Cara Superior (Gradiente Iluminado) -->
        <path d="M 27 7 L 47 18 L 27 29 L 7 18 Z" fill="url(#${gradId})"/>
        <!-- Bisel Especular Superior -->
        <path d="M 27 9 L 43 18 L 27 27 L 11 18 Z" fill="#ffffff" opacity="0.22"/>
        <!-- Punto de Brillo Central -->
        <circle cx="27" cy="18" r="2.2" fill="#ffffff" opacity="0.6"/>
      </svg>
    `;
  }

  function renderSkinsModal() {
    updateCoinsUI();
    updateDiamondsUI();
    updateShopMonetizationUI();
    if (!skinsGridContainer) return;

    // Nivel máximo alcanzado por el jugador (1-based)
    const maxLevelReached = Math.max(1, unlockedLevelMax + 1);

    // Colección 100% Mezclada (Sin filtros de categoría ni rareza según lo solicitado)
    const filteredSkins = SKINS;

    // 4. Paginación Ágil
    const totalPages = Math.max(1, Math.ceil(filteredSkins.length / SKINS_PER_PAGE));
    if (currentSkinsPage >= totalPages) currentSkinsPage = totalPages - 1;
    if (currentSkinsPage < 0) currentSkinsPage = 0;

    const startIdx = currentSkinsPage * SKINS_PER_PAGE;
    const pageSkins = filteredSkins.slice(startIdx, startIdx + SKINS_PER_PAGE);

    if (skinsPageInfo) {
      skinsPageInfo.innerText = `Página ${currentSkinsPage + 1} de ${totalPages} (${filteredSkins.length} aspectos)`;
    }
    if (skinsPrevPageBtn) skinsPrevPageBtn.disabled = (currentSkinsPage === 0);
    if (skinsNextPageBtn) skinsNextPageBtn.disabled = (currentSkinsPage >= totalPages - 1);

    // 5. Renderizar Tarjetas de la Tienda
    skinsGridContainer.innerHTML = '';
    pageSkins.forEach(skin => {
      const isEquipped = (equippedSkin === skin.id);
      const isUnlocked = unlockedSkins.includes(skin.id);
      const isLevelLocked = (maxLevelReached < skin.requiredLevel);
      const rDef = SKIN_RARITIES[skin.rarity] || SKIN_RARITIES.COMMON;

      const card = document.createElement('div');
      card.className = `shop-card ${isEquipped ? 'equipped' : ''}`;

      // Etiqueta de Nivel y Bloqueo compacta
      const levelBadgeHtml = isLevelLocked
        ? `<span class="shop-card-level-gate locked">🔒 N${skin.requiredLevel}</span>`
        : `<span class="shop-card-level-gate unlocked">⭐ N${skin.requiredLevel}</span>`;

      // Botón de Acción según estado (el botón es el precio directo y acción)
      let actionBtnHtml = '';

      if (isEquipped) {
        actionBtnHtml = `<button class="shop-card-btn btn-equipped" type="button">✓ EN USO</button>`;
      } else if (isUnlocked) {
        actionBtnHtml = `<button class="shop-card-btn btn-equip" type="button">EQUIPAR</button>`;
      } else if (isLevelLocked) {
        actionBtnHtml = `<button class="shop-card-btn btn-locked" type="button">🔒 Nivel ${skin.requiredLevel}</button>`;
      } else {
        if (skin.currency === 'DIAMONDS') {
          actionBtnHtml = `<button class="shop-card-btn btn-buy-diamonds" type="button">💎 ${skin.price}</button>`;
        } else {
          actionBtnHtml = `<button class="shop-card-btn btn-buy-coins" type="button">🪙 ${skin.price.toLocaleString()}</button>`;
        }
      }

      card.innerHTML = `
        <div class="shop-card-header">
          <span class="shop-card-rarity rarity-${skin.rarity.toLowerCase()}">${rDef.name.toUpperCase()}</span>
          ${levelBadgeHtml}
        </div>
        <div class="shop-card-cube-preview">
          ${createIsoCubeSVG(skin.color, skin.color2, skin.archetype)}
        </div>
        <div class="shop-card-details">
          <span class="shop-card-title" title="${skin.name}">${skin.name}</span>
          <div class="shop-card-meta">
            <span class="shop-card-category-label">${skin.icon} ${skin.categoryName}</span>
            ${skin.bonusCoins > 0 ? `<span class="shop-card-perk">+${skin.bonusCoins}🪙</span>` : ''}
          </div>
        </div>
        <div class="shop-card-actions">
          ${actionBtnHtml}
        </div>
      `;

      const btn = card.querySelector('.shop-card-btn');
      card.addEventListener('click', (e) => {
        if (!e.target.closest('.shop-card-btn')) {
          btn.click();
        }
      });

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isEquipped) return;

        if (isUnlocked) {
          equippedSkin = skin.id;
          localStorage.setItem('c2c_skin', equippedSkin);
          playSkinSound(skin);
          updateHUD();
          renderSkinsModal();
          return;
        }

        // Si está bloqueado por progreso de nivel
        if (isLevelLocked) {
          playTone(160, 'sawtooth', 0.25, 0.3);
          alert(`🔒 ¡Nivel ${skin.requiredLevel} Requerido!\nDebes superar el Nivel ${skin.requiredLevel} para desbloquear este aspecto.\nActualmente tu nivel máximo es el Nivel ${maxLevelReached}.`);
          return;
        }

        // Proceso de Compra con Diamantes o Monedas
        if (skin.currency === 'DIAMONDS') {
          if (diamonds >= skin.price) {
            diamonds -= skin.price;
            localStorage.setItem('c2c_diamonds', diamonds.toString());
            unlockedSkins.push(skin.id);
            localStorage.setItem('c2c_unlocked_skins', JSON.stringify(unlockedSkins));
            equippedSkin = skin.id;
            localStorage.setItem('c2c_skin', equippedSkin);
            playVictoryFanfare();
            playSkinSound(skin);
            spawnVictoryConfetti();
            updateHUD();
            updateDiamondsUI();
            renderSkinsModal();
          } else {
            playTone(160, 'sawtooth', 0.3, 0.3);
            alert(`💎 Te faltan ${skin.price - diamonds} diamantes para adquirir ${skin.name}.\n¡Derrota a los Jefes de Bloque en la campaña o logra combos para ganarlos!`);
          }
        } else {
          if (coins >= skin.price) {
            coins -= skin.price;
            localStorage.setItem('c2c_coins', coins.toString());
            unlockedSkins.push(skin.id);
            localStorage.setItem('c2c_unlocked_skins', JSON.stringify(unlockedSkins));
            equippedSkin = skin.id;
            localStorage.setItem('c2c_skin', equippedSkin);
            playVictoryFanfare();
            playSkinSound(skin);
            spawnVictoryConfetti();
            updateHUD();
            updateCoinsUI();
            renderSkinsModal();
          } else {
            playTone(160, 'sawtooth', 0.3, 0.3);
            alert(`🪙 Te faltan ${(skin.price - coins).toLocaleString()} monedas para adquirir ${skin.name}.\n¡Sigue apilando pisos con combos en la torre para acumular más oro!`);
          }
        }
      });

      skinsGridContainer.appendChild(card);
    });
  }

  // Controles de Paginación de la Tienda
  if (skinsPrevPageBtn) {
    skinsPrevPageBtn.onclick = (e) => {
      e.stopPropagation();
      if (currentSkinsPage > 0) {
        currentSkinsPage--;
        renderSkinsModal();
        if (skinsGridContainer) skinsGridContainer.scrollTop = 0;
      }
    };
  }

  if (skinsNextPageBtn) {
    skinsNextPageBtn.onclick = (e) => {
      e.stopPropagation();
      currentSkinsPage++;
      renderSkinsModal();
      if (skinsGridContainer) skinsGridContainer.scrollTop = 0;
    };
  }

  // Botón Volver de la Tienda Fullscreen
  const closeSkinsShopBtn = document.getElementById('close-skins-shop-btn');
  if (closeSkinsShopBtn) {
    closeSkinsShopBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (skinsModal) skinsModal.classList.add('hidden');
    });
  }

  // ==========================================================================
  // 🎬 ADMANAGER — INTEGRACIÓN GOOGLE PLAY STORE & ADMOB REWARDED ADS
  // ==========================================================================
  let adAnimFrameId = null;
  let adSimCountdownTimer = null;

  const AdManager = {
    isNoAds() {
      return localStorage.getItem('c2c_no_ads') === 'true';
    },

    setNoAds(active = true) {
      localStorage.setItem('c2c_no_ads', active ? 'true' : 'false');
    },

    showRewarded(placement, onReward, onDismiss) {
      // Si el jugador posee el Pase VIP "Sin Anuncios" (excepto cofre voluntario de tienda)
      if (this.isNoAds() && placement !== 'shop_free_chest') {
        if (onReward) onReward();
        return;
      }

      // 1. Detección de Bridge Nativo Google AdMob (TWA / Android WebView / Bubblewrap)
      if (window.Android && typeof window.Android.showRewardedAd === 'function') {
        window.onAdMobReward = () => {
          if (onReward) onReward();
        };
        window.onAdMobDismiss = () => {
          if (onDismiss) onDismiss();
        };
        try {
          window.Android.showRewardedAd(placement);
          return;
        } catch (e) {
          console.warn('Native AdMob fallback:', e);
        }
      }

      // 2. Simulador Visual Interactivo Google AdMob (Web, PWA y pruebas móviles)
      startAdVideoSimulation(placement, onReward, onDismiss);
    }
  };

  function startAdVideoSimulation(placement, onReward, onDismiss) {
    if (!adVideoModal) {
      if (onReward) onReward();
      return;
    }

    adVideoModal.classList.remove('hidden');
    if (adExitBtn) adExitBtn.classList.add('hidden');
    if (adProgressBar) adProgressBar.style.width = '0%';
    if (adFooterStatus) adFooterStatus.innerText = 'Mira los 5 segundos para recibir tu recompensa...';

    let countdown = 5;
    if (adCountdownSec) adCountdownSec.innerText = `${countdown}s`;

    // Inicializar Canvas Visual del Anuncio (Cubo Holográfico Hi-Tech & Constelación)
    if (adViewportCanvas) {
      const adCtx = adViewportCanvas.getContext('2d');
      const cw = adViewportCanvas.width;
      const ch = adViewportCanvas.height;
      let angle = 0;
      const particlesAd = [];
      for (let i = 0; i < 24; i++) {
        particlesAd.push({
          x: Math.random() * cw,
          y: Math.random() * ch,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          r: Math.random() * 2 + 1,
          color: i % 2 === 0 ? '#00f0ff' : '#a855f7'
        });
      }

      if (adAnimFrameId) cancelAnimationFrame(adAnimFrameId);

      function renderAdCanvas() {
        if (adVideoModal.classList.contains('hidden')) return;
        adCtx.fillStyle = '#060814';
        adCtx.fillRect(0, 0, cw, ch);

        // Fondo de niebla radial
        const rad = adCtx.createRadialGradient(cw / 2, ch / 2, 10, cw / 2, ch / 2, cw / 2);
        rad.addColorStop(0, 'rgba(56, 189, 248, 0.22)');
        rad.addColorStop(1, 'rgba(6, 8, 20, 0.95)');
        adCtx.fillStyle = rad;
        adCtx.fillRect(0, 0, cw, ch);

        // Partículas en órbita
        particlesAd.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = cw;
          if (p.x > cw) p.x = 0;
          if (p.y < 0) p.y = ch;
          if (p.y > ch) p.y = 0;
          adCtx.fillStyle = p.color;
          adCtx.beginPath();
          adCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          adCtx.fill();
        });

        // Cubo Isométrico 3D Giratorio Holográfico
        angle += 0.035;
        const cx = cw / 2;
        const cy = ch / 2 - 10;
        const size = 32 + Math.sin(angle * 1.5) * 3;

        adCtx.save();
        adCtx.translate(cx, cy);

        // Cara Superior
        adCtx.beginPath();
        adCtx.moveTo(0, -size);
        adCtx.lineTo(size * Math.cos(Math.PI / 6), -size * Math.sin(Math.PI / 6));
        adCtx.lineTo(0, 0);
        adCtx.lineTo(-size * Math.cos(Math.PI / 6), -size * Math.sin(Math.PI / 6));
        adCtx.closePath();
        adCtx.fillStyle = 'rgba(0, 240, 255, 0.65)';
        adCtx.fill();
        adCtx.strokeStyle = '#ffffff';
        adCtx.lineWidth = 1.5;
        adCtx.stroke();

        // Cara Izquierda
        adCtx.beginPath();
        adCtx.moveTo(-size * Math.cos(Math.PI / 6), -size * Math.sin(Math.PI / 6));
        adCtx.lineTo(0, 0);
        adCtx.lineTo(0, size);
        adCtx.lineTo(-size * Math.cos(Math.PI / 6), size * (1 - Math.sin(Math.PI / 6)));
        adCtx.closePath();
        adCtx.fillStyle = 'rgba(168, 85, 247, 0.7)';
        adCtx.fill();
        adCtx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        adCtx.stroke();

        // Cara Derecha
        adCtx.beginPath();
        adCtx.moveTo(0, 0);
        adCtx.lineTo(size * Math.cos(Math.PI / 6), -size * Math.sin(Math.PI / 6));
        adCtx.lineTo(size * Math.cos(Math.PI / 6), size * (1 - Math.sin(Math.PI / 6)));
        adCtx.lineTo(0, size);
        adCtx.closePath();
        adCtx.fillStyle = 'rgba(244, 63, 94, 0.7)';
        adCtx.fill();
        adCtx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        adCtx.stroke();

        adCtx.restore();

        // Texto Promocional Dinámico en Canvas
        adCtx.fillStyle = '#ffffff';
        adCtx.font = 'bold 12px sans-serif';
        adCtx.textAlign = 'center';
        adCtx.fillText('★ CORE TO COSMOS • ARCADE DELUXE ★', cw / 2, ch - 22);

        adAnimFrameId = requestAnimationFrame(renderAdCanvas);
      }
      renderAdCanvas();
    }

    if (adSimCountdownTimer) clearInterval(adSimCountdownTimer);

    let adFinished = false;

    adSimCountdownTimer = setInterval(() => {
      countdown--;
      if (adCountdownSec) adCountdownSec.innerText = `${Math.max(0, countdown)}s`;
      if (adProgressBar) {
        const pct = Math.min(100, ((5 - countdown) / 5) * 100);
        adProgressBar.style.width = `${pct}%`;
      }

      // Beep suave de temporizador
      if (countdown > 0) {
        try { playTone(820, 'sine', 0.05, 0.08); } catch (e) {}
      }

      if (countdown <= 0) {
        clearInterval(adSimCountdownTimer);
        adSimCountdownTimer = null;
        adFinished = true;

        if (adProgressBar) adProgressBar.style.width = '100%';
        if (adCountdownSec) adCountdownSec.innerText = '0s';
        if (adExitBtn) adExitBtn.classList.remove('hidden');
        if (adFooterStatus) {
          adFooterStatus.innerHTML = '<span style="color: #4ade80; font-weight: 900;">✅ ¡RECOMPENSA CONCEDIDA!</span> Toca ✕ o pulsa la pantalla para reclamar.';
        }

        // Chime triunfal de recompensa concedida
        try {
          playTone(523.25, 'triangle', 0.12, 0.25);
          setTimeout(() => playTone(659.25, 'triangle', 0.14, 0.25), 80);
          setTimeout(() => playTone(783.99, 'triangle', 0.3, 0.3), 160);
        } catch (e) {}
      }
    }, 1000);

    // Cierre del Anuncio y Entrega de Recompensa
    function closeAndReward(e) {
      if (e) e.stopPropagation();
      if (!adFinished) return; // Forzar vista completa de 5 segundos

      if (adAnimFrameId) cancelAnimationFrame(adAnimFrameId);
      if (adSimCountdownTimer) clearInterval(adSimCountdownTimer);
      adVideoModal.classList.add('hidden');

      if (adExitBtn) adExitBtn.removeEventListener('click', closeAndReward);
      adVideoModal.removeEventListener('click', modalClickFallback);

      if (onReward) onReward();
    }

    function modalClickFallback(e) {
      if (!adFinished) return;
      closeAndReward(e);
    }

    if (adExitBtn) {
      adExitBtn.addEventListener('click', closeAndReward);
    }
    adVideoModal.addEventListener('click', modalClickFallback);
  }

  // --- Monetización de la Tienda Cósmica (Cofre Gratis y VIP) ---
  function updateShopMonetizationUI() {
    if (!shopClaimAdGiftBtn) return;
    const lastClaim = parseInt(localStorage.getItem('c2c_free_chest_cooldown') || '0', 10);
    const now = Date.now();

    if (now < lastClaim) {
      const remainingSec = Math.ceil((lastClaim - now) / 1000);
      const m = Math.floor(remainingSec / 60);
      const s = remainingSec % 60;
      shopClaimAdGiftBtn.innerHTML = `<span>⏱️ ${m}:${s < 10 ? '0' : ''}${s}</span>`;
      shopClaimAdGiftBtn.disabled = true;
    } else {
      shopClaimAdGiftBtn.innerHTML = `<span>🎬 ABRIR</span>`;
      shopClaimAdGiftBtn.disabled = false;
    }

    if (shopBuyNoadsBtn) {
      if (AdManager.isNoAds()) {
        shopBuyNoadsBtn.innerHTML = `<span>✅ ACTIVO</span>`;
        shopBuyNoadsBtn.disabled = true;
      } else {
        shopBuyNoadsBtn.innerHTML = `<span>$1.99</span>`;
        shopBuyNoadsBtn.disabled = false;
      }
    }
  }

  // Temporizador para refrescar cuenta atrás del cofre en la tienda
  setInterval(() => {
    if (skinsModal && !skinsModal.classList.contains('hidden')) {
      updateShopMonetizationUI();
    }
  }, 1000);

  // Click: Reclamar Cofre Gratis con Anuncio
  if (shopClaimAdGiftBtn) {
    shopClaimAdGiftBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const lastClaim = parseInt(localStorage.getItem('c2c_free_chest_cooldown') || '0', 10);
      if (Date.now() < lastClaim) return;

      AdManager.showRewarded('shop_free_chest', () => {
        addCoins(150);
        addDiamonds(10);
        localStorage.setItem('c2c_free_chest_cooldown', (Date.now() + 180 * 1000).toString());
        spawnVictoryConfetti();
        playVictoryFanfare();
        updateShopMonetizationUI();
        spawnFloatingText('🎁 ¡COFRE ABIERTO! (+150 🪙, +10 💎)', width / 2, centerY, 0, '#ffd700', 1.5);
      });
    });
  }

  // Click: Comprar Pase VIP Sin Anuncios
  if (shopBuyNoadsBtn) {
    shopBuyNoadsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (AdManager.isNoAds()) return;

      if (confirm('⭐ ¿Adquirir PASE VIP permanente por $1.99?\n\n• Sin Anuncios para siempre\n• +500 Monedas Cósmicas de bienvenida\n• +25 Diamantes Astrales')) {
        AdManager.setNoAds(true);
        addCoins(500);
        addDiamonds(25);
        playVictoryFanfare();
        spawnVictoryConfetti();
        updateShopMonetizationUI();
        alert('👑 ¡ENHORABUENA! Eres Miembro VIP Oficial.\nAnuncios eliminados permanentemente.');
      }
    });
  }

  // Click: Revivir y Continuar con Video Recompensado (Segunda Oportunidad)
  if (reviveAdBtn) {
    reviveAdBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (hasRevivedThisMatch) return;

      AdManager.showRewarded('revive_match', () => {
        hasRevivedThisMatch = true;
        if (gameOverScreen) gameOverScreen.classList.add('hidden');
        if (hud) hud.classList.remove('hidden');
        state = 'PLAYING';
        playVictoryFanfare();
        triggerScreenShake(6, 18);
        triggerVibrate([80, 50, 150]);

        const topBlock = stack[stack.length - 1];
        if (topBlock) {
          topBlock.width = Math.min(initialSize, topBlock.width + 12);
          topBlock.depth = Math.min(initialSize, topBlock.depth + 12);
          spawnFloatingText('💖 ¡REVIVIDO! SEGUNDA OPORTUNIDAD', topBlock.x + topBlock.width / 2, topBlock.y + 25, topBlock.z + topBlock.depth / 2, '#ff007a', 1.8);
          spawnParticles(topBlock.x + topBlock.width / 2, topBlock.y + topBlock.height, topBlock.z + topBlock.depth / 2, 'COSMOS', 25);
        }

        spawnNextBlock();
        requestScreenWakeLock();
      });
    });
  }

  // Click: Duplicar Monedas en Game Over
  if (doubleCoinsAdBtn) {
    doubleCoinsAdBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const extra = Math.max(25, matchCoinsEarned);

      AdManager.showRewarded('double_coins_gameover', () => {
        addCoins(extra);
        matchCoinsEarned += extra;
        if (goCoinsVal) goCoinsVal.innerText = `${matchCoinsEarned} (x2!)`;
        spawnVictoryConfetti();
        playVictoryFanfare();
        doubleCoinsAdBtn.innerHTML = '<span>✅ ¡MONEDAS DUPLICADAS!</span>';
        doubleCoinsAdBtn.disabled = true;
      });
    });
  }

  // Click: Duplicar Recompensa en Nivel Completado
  if (clearDoubleAdBtn) {
    clearDoubleAdBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const clearBonus = activeLevel.isSuperBoss ? 250 : (activeLevel.isBoss ? 100 : 50);

      AdManager.showRewarded('double_coins_clear', () => {
        addCoins(clearBonus);
        matchCoinsEarned += clearBonus;
        spawnVictoryConfetti();
        playVictoryFanfare();
        clearDoubleAdBtn.innerHTML = `<span>✅ ¡RECOMPENSA DUPLICADA! (+${clearBonus} 🪙)</span>`;
        clearDoubleAdBtn.disabled = true;
      });
    });
  }

  // Comportamiento de Potenciadores Pre-Partida
  if (boosterSlowmoToggle) {
    boosterSlowmoToggle.onclick = (e) => {
      e.stopPropagation();
      if (boostersInventory.slowmo > 0) {
        activeEquippedBoosters.slowmo = !activeEquippedBoosters.slowmo;
        playTone(activeEquippedBoosters.slowmo ? 580 : 320, 'triangle', 0.15, 0.2);
      } else {
        if (coins >= 400) {
          coins -= 400;
          localStorage.setItem('c2c_coins', coins.toString());
          boostersInventory.slowmo = (boostersInventory.slowmo || 0) + 1;
          localStorage.setItem('c2c_booster_slowmo', boostersInventory.slowmo.toString());
          activeEquippedBoosters.slowmo = true;
          playTone(620, 'sine', 0.25, 0.25);
          updateCoinsUI();
        } else {
          playTone(160, 'sawtooth', 0.25, 0.3);
          alert('Necesitas 400 monedas para adquirir Chrono -40%.');
        }
      }
      updateBoostersUI();
    };
  }

  if (boosterTitanToggle) {
    boosterTitanToggle.onclick = (e) => {
      e.stopPropagation();
      if (boostersInventory.titan > 0) {
        activeEquippedBoosters.titan = !activeEquippedBoosters.titan;
        playTone(activeEquippedBoosters.titan ? 580 : 320, 'triangle', 0.15, 0.2);
      } else {
        if (coins >= 750) {
          coins -= 750;
          localStorage.setItem('c2c_coins', coins.toString());
          boostersInventory.titan = (boostersInventory.titan || 0) + 1;
          localStorage.setItem('c2c_booster_titan', boostersInventory.titan.toString());
          activeEquippedBoosters.titan = true;
          playTone(620, 'sine', 0.25, 0.25);
          updateCoinsUI();
        } else {
          playTone(160, 'sawtooth', 0.25, 0.3);
          alert('Necesitas 750 monedas para adquirir Base Titán (+25%).');
        }
      }
      updateBoostersUI();
    };
  }

  if (boosterReviveToggle) {
    boosterReviveToggle.onclick = (e) => {
      e.stopPropagation();
      if (boostersInventory.revive > 0) {
        activeEquippedBoosters.revive = !activeEquippedBoosters.revive;
        playTone(activeEquippedBoosters.revive ? 580 : 320, 'triangle', 0.15, 0.2);
      } else {
        if (diamonds >= 15) {
          diamonds -= 15;
          localStorage.setItem('c2c_diamonds', diamonds.toString());
          boostersInventory.revive = (boostersInventory.revive || 0) + 1;
          localStorage.setItem('c2c_booster_revive', boostersInventory.revive.toString());
          activeEquippedBoosters.revive = true;
          playTone(740, 'triangle', 0.25, 0.3);
          updateDiamondsUI();
        } else {
          playTone(160, 'sawtooth', 0.25, 0.3);
          alert('Necesitas 15 diamantes para adquirir Seguro Revivir.');
        }
      }
      updateBoostersUI();
    };
  }

  if (openSkinsBtn) {
    openSkinsBtn.addEventListener('click', () => {
      renderSkinsModal();
      if (skinsModal) skinsModal.classList.remove('hidden');
    });
  }

  // --- Power-ups Tácticos con Cooldown en HUD ---
  if (powerupSlowmoBtn) {
    powerupSlowmoBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (state !== 'PLAYING' || slowmoCdFrames > 0 || slowmoActive) return;
      slowmoActive = true;
      slowmoDurationFrames = 300; // ~5 segundos a 60 FPS
      slowmoCdFrames = SLOWMO_CD_TOTAL_FRAMES; // 25s de recarga
      powerupSlowmoBtn.classList.add('active-powerup', 'on-cooldown');
      playTone(440, 'sine', 0.35, 0.3);
      triggerHitStop(4, 0.3);
      spawnFloatingText('⏱️ ¡CHRONO ACTIVADO! (Cámara Lenta)', width / 2, centerY - 60, '#00f0ff', 1.25);
    });
  }

  if (powerupTitanBtn) {
    powerupTitanBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (state !== 'PLAYING' || titanUsedThisRound || !currentBlock) return;
      titanUsedThisRound = true;
      currentBlock.width = initialSize;
      currentBlock.depth = initialSize;
      powerupTitanBtn.classList.add('on-cooldown');
      playRecoveryChime();
      triggerScreenShake(4, 10);
      spawnFloatingText('🧱 ¡TITÁN: TAMAÑO RESTAURADO!', width / 2, centerY - 60, '#ffcc00', 1.35);
    });
  }

  function updatePauseTogglesUI() {
    if (pauseToggleSound) {
      pauseToggleSound.classList.toggle('active', !!userSettings.sound);
      pauseToggleSound.classList.toggle('muted', !userSettings.sound);
      if (pauseIconSound) pauseIconSound.innerText = userSettings.sound ? '🔊' : '🔇';
    }
    if (pauseToggleMusic) {
      pauseToggleMusic.classList.toggle('active', !!userSettings.music);
      pauseToggleMusic.classList.toggle('muted', !userSettings.music);
      if (pauseIconMusic) pauseIconMusic.innerText = userSettings.music ? '🎵' : '🔇';
    }
    if (pauseToggleVibrate) {
      pauseToggleVibrate.classList.toggle('active', !!userSettings.vibrate);
      pauseToggleVibrate.classList.toggle('muted', !userSettings.vibrate);
      if (pauseIconVibrate) pauseIconVibrate.innerText = userSettings.vibrate ? '📳' : '📴';
    }
    if (pauseToggleGuide) {
      pauseToggleGuide.classList.toggle('active', !!userSettings.guide);
      pauseToggleGuide.classList.toggle('muted', !userSettings.guide);
      if (pauseIconGuide) pauseIconGuide.innerText = userSettings.guide ? '🎯' : '⭕';
    }
  }

  function openPauseModal() {
    if (state !== 'PLAYING') return;
    state = 'PAUSED';
    pauseBtn.innerText = '▶️';
    stopAmbientMusic();

    if (pauseLevelBadge) {
      if (gameMode === 'ENDLESS') {
        pauseLevelBadge.innerText = `ODISEA CÓSMICA • ${activeLevel.name.toUpperCase()}`;
      } else {
        pauseLevelBadge.innerText = `${activeLevel.icon} NIVEL ${activeLevel.id}: ${activeLevel.name}`;
      }
    }
    if (pauseLevelTarget) {
      if (gameMode === 'ENDLESS') {
        pauseLevelTarget.innerText = `Pisos: ${score}`;
      } else {
        pauseLevelTarget.innerText = `Pisos: ${score} / ${activeLevel.target}`;
      }
    }

    updatePauseTogglesUI();

    if (pauseModal) {
      pauseModal.classList.remove('hidden');
    }
  }

  function resumeGame() {
    if (pauseModal) {
      pauseModal.classList.add('hidden');
    }
    if (state === 'PAUSED') {
      state = 'PLAYING';
      pauseBtn.innerText = '⏸️';
      if (userSettings.music) startAmbientMusic();
    }
  }

  function exitToMainMenu() {
    releaseScreenWakeLock();
    stopAmbientMusic();
    cleanupBossMechanics();

    // Ocultar absolutamente todos los modales, pantallas secundarias y overlays
    if (pauseModal) pauseModal.classList.add('hidden');
    if (levelClearModal) levelClearModal.classList.add('hidden');
    if (gameOverScreen) gameOverScreen.classList.add('hidden');
    if (levelSelectModal) levelSelectModal.classList.add('hidden');
    if (achievementsModal) achievementsModal.classList.add('hidden');
    if (settingsModal) settingsModal.classList.add('hidden');
    if (leaderboardModal) leaderboardModal.classList.add('hidden');
    if (skinsModal) skinsModal.classList.add('hidden');
    if (adVideoModal) adVideoModal.classList.add('hidden');
    if (hud) hud.classList.add('hidden');

    // Mostrar menú principal garantizando visibilidad y z-index
    if (startScreen) {
      startScreen.classList.remove('hidden');
      startScreen.style.display = 'flex';
    }
    state = 'START';
    if (pauseBtn) pauseBtn.innerText = '⏸️';

    // Limpiar estado de partida y entidades en pantalla
    stack = [];
    currentBlock = null;
    activeLoot = null;
    debrisList = [];
    particles = [];
    floatingTexts = [];
    confettiList = [];
    feverActive = false;
    feverBlocksRemaining = 0;
    shakeIntensity = 0;
    shakeFrames = 0;

    updateCoinsUI();
    loadLevel(currentLevelIdx);
  }

  pauseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (state === 'PLAYING') {
      openPauseModal();
    } else if (state === 'PAUSED') {
      resumeGame();
    }
  });

  if (resumeBtn) {
    resumeBtn.addEventListener('click', resumeGame);
  }

  if (closePauseModalBtn) {
    closePauseModalBtn.addEventListener('click', resumeGame);
  }

  if (pauseRestartBtn) {
    pauseRestartBtn.addEventListener('click', () => {
      if (pauseModal) pauseModal.classList.add('hidden');
      startMissionGame();
    });
  }

  if (pauseMenuBtn) {
    pauseMenuBtn.addEventListener('click', exitToMainMenu);
  }

  if (pauseModal) {
    pauseModal.addEventListener('click', (e) => {
      if (e.target === pauseModal) {
        resumeGame();
      }
    });
  }

  if (pauseToggleSound) {
    pauseToggleSound.addEventListener('click', (e) => {
      e.stopPropagation();
      userSettings.sound = !userSettings.sound;
      if (settingSound) settingSound.checked = userSettings.sound;
      localStorage.setItem('c2c_sound', userSettings.sound);
      if (!userSettings.sound) stopAmbientMusic();
      else if (userSettings.music && state === 'PLAYING') startAmbientMusic();
      updatePauseTogglesUI();
      if (userSettings.sound) playPlacementPop(1);
    });
  }

  if (pauseToggleMusic) {
    pauseToggleMusic.addEventListener('click', (e) => {
      e.stopPropagation();
      userSettings.music = !userSettings.music;
      if (settingMusic) settingMusic.checked = userSettings.music;
      localStorage.setItem('c2c_music', userSettings.music);
      if (userSettings.music && state === 'PLAYING') startAmbientMusic();
      else stopAmbientMusic();
      updatePauseTogglesUI();
    });
  }

  if (pauseToggleVibrate) {
    pauseToggleVibrate.addEventListener('click', (e) => {
      e.stopPropagation();
      userSettings.vibrate = !userSettings.vibrate;
      if (settingVibrate) settingVibrate.checked = userSettings.vibrate;
      localStorage.setItem('c2c_vibrate', userSettings.vibrate);
      if (userSettings.vibrate) triggerVibrate(40);
      updatePauseTogglesUI();
    });
  }

  if (pauseToggleGuide) {
    pauseToggleGuide.addEventListener('click', (e) => {
      e.stopPropagation();
      userSettings.guide = !userSettings.guide;
      if (settingGuide) settingGuide.checked = userSettings.guide;
      localStorage.setItem('c2c_guide', userSettings.guide);
      updatePauseTogglesUI();
    });
  }

  // --- Screen Wake Lock API (Evita que la pantalla del móvil se apague en partida) ---
  let wakeLockSentinel = null;
  async function requestScreenWakeLock() {
    try {
      if ('wakeLock' in navigator && !wakeLockSentinel) {
        wakeLockSentinel = await navigator.wakeLock.request('screen');
        wakeLockSentinel.addEventListener('release', () => {
          wakeLockSentinel = null;
        });
      }
    } catch (e) {}
  }

  function releaseScreenWakeLock() {
    if (wakeLockSentinel) {
      try {
        wakeLockSentinel.release();
      } catch (e) {}
      wakeLockSentinel = null;
    }
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && state === 'PLAYING') {
      requestScreenWakeLock();
    } else if (document.visibilityState === 'hidden') {
      releaseScreenWakeLock();
    }
  });

  // --- Pantalla Completa Inmersiva para Móvil y Desktop ---
  function toggleFullscreen() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      const docEl = document.documentElement;
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen().catch(() => {});
      } else if (docEl.webkitRequestFullscreen) {
        docEl.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }

  function updateFullscreenIcons() {
    const isFs = Boolean(document.fullscreenElement || document.webkitFullscreenElement);
    const icon = isFs ? '✕' : '⛶';
    if (hudFullscreenBtn) hudFullscreenBtn.textContent = icon;
    if (navFullscreenBtn) navFullscreenBtn.textContent = icon;
  }

  document.addEventListener('fullscreenchange', updateFullscreenIcons);
  document.addEventListener('webkitfullscreenchange', updateFullscreenIcons);

  if (hudFullscreenBtn) {
    hudFullscreenBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFullscreen();
    });
  }
  if (navFullscreenBtn) {
    navFullscreenBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFullscreen();
    });
  }

  // --- Instalación PWA Directa (WebAPK en Android) ---
  let deferredInstallPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    if (pwaInstallBtn) {
      pwaInstallBtn.classList.remove('hidden');
    }
  });

  if (pwaInstallBtn) {
    pwaInstallBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        const choiceResult = await deferredInstallPrompt.userChoice;
        if (choiceResult && choiceResult.outcome === 'accepted') {
          pwaInstallBtn.classList.add('hidden');
        }
        deferredInstallPrompt = null;
      } else {
        // Muestra la guía visual de instalación paso a paso en celular (Android e iOS)
        if (installHelpModal) {
          installHelpModal.classList.remove('hidden');
        }
      }
    });
  }

  window.addEventListener('appinstalled', () => {
    if (pwaInstallBtn) pwaInstallBtn.classList.add('hidden');
    deferredInstallPrompt = null;
  });

  // --- Desbloqueo de AudioContext en Móviles en el Primer Toque ---
  window.addEventListener('pointerdown', () => {
    initAudio();
  }, { once: true });

  // --- Limpieza Agresiva de Caché Stale y Registro de SW ---
  const CURRENT_APP_BUILD = '20261014-v3-classic-bosses';
  if (localStorage.getItem('c2c_app_build') !== CURRENT_APP_BUILD) {
    localStorage.setItem('c2c_app_build', CURRENT_APP_BUILD);
    if ('caches' in window) {
      caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k)))).catch(() => {});
    }
  }

  // --- Registro de Service Worker para Modo Offline y Google Play Store (TWA) ---
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js?v=20261014-v3-classic-bosses').then((reg) => {
        reg.update();
      }).catch((err) => {
        console.warn('SW:', err);
      });
    });
  }

  // Exposición para puentes nativos Android y depuración
  window.AdManager = AdManager;
  window.triggerGameOver = triggerGameOver;
  window.triggerLevelClear = triggerLevelClear;

  console.log('%c🚀 CORE TO COSMOS v2.6 — ADMOB MONETIZATION INTEGRATED', 'color: #00f0ff; font-weight: bold; font-size: 14px; background: #0b0f19; padding: 4px 8px; border-radius: 4px;');

  // Inicialización
  resize();
  loadLevel(currentLevelIdx);
  navPlayerName.innerText = userSettings.playerName;
  settingPlayerName.value = userSettings.playerName;
  settingSound.checked = userSettings.sound;
  settingVibrate.checked = userSettings.vibrate;
  settingParticles.checked = userSettings.particles;
  if (settingMusic) settingMusic.checked = userSettings.music;
  // Sliders de Volumen y Botón de Reinicio Clásico
  const settingSoundVolume = document.getElementById('setting-sound-volume');
  const valSoundVolume = document.getElementById('val-sound-volume');
  const settingMusicVolume = document.getElementById('setting-music-volume');
  const valMusicVolume = document.getElementById('val-music-volume');
  const btnResetGameData = document.getElementById('btn-reset-game-data');

  if (settingSoundVolume && valSoundVolume) {
    const sVal = Math.round((userSettings.soundVolume !== undefined ? userSettings.soundVolume : 0.8) * 100);
    settingSoundVolume.value = sVal;
    valSoundVolume.innerText = `${sVal}%`;
    settingSoundVolume.addEventListener('input', () => {
      valSoundVolume.innerText = `${settingSoundVolume.value}%`;
      userSettings.soundVolume = parseInt(settingSoundVolume.value, 10) / 100;
      localStorage.setItem('c2c_sound_volume', userSettings.soundVolume.toString());
    });
  }

  if (settingMusicVolume && valMusicVolume) {
    const mVal = Math.round((userSettings.musicVolume !== undefined ? userSettings.musicVolume : 0.7) * 100);
    settingMusicVolume.value = mVal;
    valMusicVolume.innerText = `${mVal}%`;
    settingMusicVolume.addEventListener('input', () => {
      valMusicVolume.innerText = `${settingMusicVolume.value}%`;
      userSettings.musicVolume = parseInt(settingMusicVolume.value, 10) / 100;
      localStorage.setItem('c2c_music_volume', userSettings.musicVolume.toString());
    });
  }

  if (btnResetGameData) {
    btnResetGameData.addEventListener('click', () => {
      if (confirm('⚠️ ¿Estás seguro de que deseas restablecer todo tu progreso? Se reiniciarán tus niveles y récords locales.')) {
        localStorage.clear();
        location.reload();
      }
    });
  }

  updateCoinsUI();
  updateDiamondsUI();
  updateBoostersUI();
  renderSkinsModal();
})();
