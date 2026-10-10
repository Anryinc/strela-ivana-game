export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // Создаём простые procedural-текстуры вместо реальных спрайтов (пока)
    this.createTextures();
  }

  createTextures() {
    // === Стрела ===
    const arrowGfx = this.make.graphics({ x: 0, y: 0, add: false });
    arrowGfx.fillStyle(0x8B4513, 1);
    arrowGfx.fillRect(0, 6, 40, 4);           // древко
    arrowGfx.fillStyle(0xC0C0C0, 1);
    arrowGfx.fillTriangle(40, 4, 52, 8, 40, 12); // наконечник
    arrowGfx.fillStyle(0xFFD700, 1);
    arrowGfx.fillTriangle(0, 4, -8, 8, 0, 12);   // оперение
    arrowGfx.generateTexture('arrow', 60, 16);

    // === Братья (простые пиксельные силуэты) ===
    this.createBrotherTexture('brother1', 0x4A90D9); // старший - синий
    this.createBrotherTexture('brother2', 0x50C878); // средний - зелёный
    this.createBrotherTexture('brother3', 0xE74C3C); // Иван - красный

    // === Цели ===
    this.createHouseTexture('house_boyar', 180, 140, 0x8B4513, true);   // большой
    this.createHouseTexture('house_merchant', 130, 100, 0xA0522D, false);
    this.createFrogTexture();

    // === Статика ===
    this.createTreeTexture();
    this.createRockTexture();

    // === Животные ===
    this.createAnimalTexture('hare', 0xFFFFFF, 24, 18);
    this.createAnimalTexture('wolf', 0x696969, 36, 22);
    this.createAnimalTexture('bear', 0x8B4513, 44, 30);
    this.createAnimalTexture('bird', 0x87CEEB, 20, 14);

    // === Сказочные персонажи ===
    this.createFairyTexture('baba_yaga', 0x9B59B6, 48, 48);
    this.createFairyTexture('koschei', 0x2C3E50, 40, 56);
    this.createFairyTexture('leshy', 0x27AE60, 44, 50);
    this.createFairyTexture('izba', 0xD35400, 60, 50);
    this.createFairyTexture('vodyanoy', 0x1ABC9C, 42, 40);
    this.createFairyTexture('kikimora', 0x8E44AD, 36, 44);
    this.createFairyTexture('solovey', 0xE67E22, 38, 32);
    this.createFairyTexture('morozko', 0x3498DB, 40, 48);

    // === Бусты ===
    this.createBoostTexture('boost_shield', 0x3498DB);
    this.createBoostTexture('boost_dash', 0xE74C3C);
    this.createBoostTexture('boost_slowmo', 0x9B59B6);

    // === Фон ===
    const bg = this.make.graphics({ x: 0, y: 0, add: false });
    bg.fillGradientStyle(0x87CEEB, 0x87CEEB, 0x90EE90, 0x228B22, 1);
    bg.fillRect(0, 0, 1280, 720);
    bg.generateTexture('bg_field', 1280, 720);

    // Земля
    const ground = this.make.graphics({ x: 0, y: 0, add: false });
    ground.fillStyle(0x3D5C2E, 1);
    ground.fillRect(0, 0, 1280, 80);
    ground.generateTexture('ground', 1280, 80);
  }

  createBrotherTexture(key, color) {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    // тело
    g.fillStyle(color, 1);
    g.fillRect(12, 20, 24, 36);
    // голова
    g.fillStyle(0xFFE4C4, 1);
    g.fillRect(14, 4, 20, 18);
    // шапка
    g.fillStyle(0x8B0000, 1);
    g.fillRect(12, 0, 24, 8);
    // руки
    g.fillStyle(color, 1);
    g.fillRect(4, 24, 10, 8);
    g.fillRect(34, 24, 10, 8);
    // ноги
    g.fillStyle(0x2C3E50, 1);
    g.fillRect(14, 56, 8, 16);
    g.fillRect(26, 56, 8, 16);
    g.generateTexture(key, 48, 72);
  }

  createHouseTexture(key, w, h, color, big) {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    // стены
    g.fillStyle(color, 1);
    g.fillRect(0, h * 0.35, w, h * 0.65);
    // крыша
    g.fillStyle(0x8B0000, 1);
    g.fillTriangle(0, h * 0.35, w / 2, 0, w, h * 0.35);
    // дверь
    g.fillStyle(0x4A3728, 1);
    g.fillRect(w * 0.4, h * 0.6, w * 0.2, h * 0.4);
    // окна
    g.fillStyle(0xF1C40F, 1);
    g.fillRect(w * 0.15, h * 0.5, w * 0.15, h * 0.15);
    g.fillRect(w * 0.7, h * 0.5, w * 0.15, h * 0.15);
    if (big) {
      g.fillRect(w * 0.42, h * 0.45, w * 0.16, h * 0.12);
    }
    g.generateTexture(key, w, h);
  }

  createFrogTexture() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    // пень
    g.fillStyle(0x5D4037, 1);
    g.fillRect(8, 28, 40, 20);
    g.fillStyle(0x795548, 1);
    g.fillRect(4, 24, 48, 8);
    // лягушка
    g.fillStyle(0x27AE60, 1);
    g.fillEllipse(28, 18, 28, 20);
    // глаза
    g.fillStyle(0xFFFFFF, 1);
    g.fillCircle(20, 12, 6);
    g.fillCircle(36, 12, 6);
    g.fillStyle(0x000000, 1);
    g.fillCircle(20, 12, 3);
    g.fillCircle(36, 12, 3);
    g.generateTexture('frog', 56, 48);
  }

  createTreeTexture() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0x5D4037, 1);
    g.fillRect(18, 40, 12, 50);
    g.fillStyle(0x2E7D32, 1);
    g.fillCircle(24, 30, 28);
    g.fillCircle(10, 40, 18);
    g.fillCircle(38, 40, 18);
    g.generateTexture('tree', 48, 90);
  }

  createRockTexture() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0x7F8C8D, 1);
    g.fillEllipse(20, 18, 40, 28);
    g.fillStyle(0x95A5A6, 1);
    g.fillEllipse(16, 14, 20, 14);
    g.generateTexture('rock', 40, 30);
  }

  createAnimalTexture(key, color, w, h) {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(color, 1);
    g.fillEllipse(w / 2, h / 2, w, h);
    // глаза
    g.fillStyle(0x000000, 1);
    g.fillCircle(w * 0.35, h * 0.35, 3);
    g.fillCircle(w * 0.65, h * 0.35, 3);
    g.generateTexture(key, w, h);
  }

  createFairyTexture(key, color, w, h) {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    // тело
    g.fillStyle(color, 1);
    g.fillRect(w * 0.25, h * 0.3, w * 0.5, h * 0.55);
    // голова
    g.fillStyle(0xFFE4C4, 1);
    g.fillCircle(w / 2, h * 0.22, w * 0.22);
    // глаза (большие, злые)
    g.fillStyle(0xFFFFFF, 1);
    g.fillCircle(w * 0.38, h * 0.2, 5);
    g.fillCircle(w * 0.62, h * 0.2, 5);
    g.fillStyle(0xE74C3C, 1);
    g.fillCircle(w * 0.38, h * 0.2, 2.5);
    g.fillCircle(w * 0.62, h * 0.2, 2.5);
    // шапка/корона
    g.fillStyle(0xF1C40F, 1);
    g.fillTriangle(w * 0.25, h * 0.12, w / 2, 0, w * 0.75, h * 0.12);
    g.generateTexture(key, w, h);
  }

  createBoostTexture(key, color) {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(color, 1);
    g.fillCircle(16, 16, 14);
    g.lineStyle(3, 0xFFFFFF, 1);
    g.strokeCircle(16, 16, 14);
    // иконка внутри
    g.fillStyle(0xFFFFFF, 1);
    if (key === 'boost_shield') {
      g.fillTriangle(16, 6, 8, 22, 24, 22);
    } else if (key === 'boost_dash') {
      g.fillTriangle(8, 10, 8, 22, 26, 16);
    } else {
      // песочные часы
      g.fillRect(12, 8, 8, 4);
      g.fillRect(12, 20, 8, 4);
      g.fillTriangle(12, 12, 20, 12, 16, 16);
      g.fillTriangle(12, 20, 20, 20, 16, 16);
    }
    g.generateTexture(key, 32, 32);
  }

  create() {
    this.scene.start('MenuScene');
  }
}
