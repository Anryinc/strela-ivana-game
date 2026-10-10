export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    this.createTextures();
  }

  createTextures() {
    this.createArrow();
    this.createBrother('brother1', 0x3A7BD5, 0x1E4A8C);
    this.createBrother('brother2', 0x2E8B57, 0x1A5C3A);
    this.createBrother('brother3', 0xC0392B, 0x7B241C);

    this.createBoyarHouse();
    this.createMerchantHouse();
    this.createFrog();

    this.createTree();
    this.createRock();

    this.createHare();
    this.createWolf();
    this.createBear();
    this.createBird();

    this.createBabaYaga();
    this.createKoschei();
    this.createLeshy();
    this.createIzba();
    this.createVodyanoy();
    this.createKikimora();
    this.createSolovey();
    this.createMorozko();

    this.createBoost('boost_shield', 0x3498DB, 'shield');
    this.createBoost('boost_dash', 0xE74C3C, 'dash');
    this.createBoost('boost_slowmo', 0x9B59B6, 'slow');

    this.createBackground();
    this.createGround();
  }

  createArrow() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0x8B5A2B, 1);
    g.fillRect(4, 7, 38, 5);
    g.fillStyle(0xA0522D, 1);
    g.fillRect(4, 8, 38, 2);
    g.fillStyle(0xB0B0B0, 1);
    g.fillTriangle(42, 5, 58, 9.5, 42, 14);
    g.fillStyle(0xE0E0E0, 1);
    g.fillTriangle(42, 7, 54, 9.5, 42, 12);
    g.fillStyle(0xE74C3C, 1);
    g.fillTriangle(0, 4, 8, 9.5, 0, 9);
    g.fillTriangle(0, 10, 8, 9.5, 0, 15);
    g.fillStyle(0xF5D76E, 1);
    g.fillTriangle(1, 5, 6, 9.5, 1, 8.5);
    g.generateTexture('arrow', 60, 20);
  }

  createBrother(key, coat, coatDark) {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0x2C3E50, 1);
    g.fillRect(16, 58, 9, 18);
    g.fillRect(29, 58, 9, 18);
    g.fillStyle(0x1A252F, 1);
    g.fillRect(14, 72, 12, 6);
    g.fillRect(28, 72, 12, 6);
    g.fillStyle(coat, 1);
    g.fillRoundedRect(12, 28, 30, 34, 4);
    g.fillStyle(coatDark, 1);
    g.fillRect(12, 42, 30, 4);
    g.fillStyle(coat, 1);
    g.fillRoundedRect(2, 30, 12, 10, 3);
    g.fillRoundedRect(40, 30, 12, 10, 3);
    g.fillStyle(0xF5CBA7, 1);
    g.fillCircle(6, 42, 5);
    g.fillCircle(48, 42, 5);
    g.fillStyle(0xF5CBA7, 1);
    g.fillCircle(27, 18, 14);
    g.fillStyle(0x5D4037, 1);
    g.fillEllipse(27, 10, 28, 14);
    g.fillStyle(0x8B0000, 1);
    g.fillRoundedRect(12, 2, 30, 12, 4);
    g.fillStyle(0xF1C40F, 1);
    g.fillRect(24, 0, 6, 6);
    g.fillStyle(0x2C3E50, 1);
    g.fillCircle(22, 17, 2.5);
    g.fillCircle(32, 17, 2.5);
    g.fillStyle(0xFFFFFF, 1);
    g.fillCircle(21.5, 16, 1);
    g.fillCircle(31.5, 16, 1);
    g.lineStyle(2, 0x5D4037, 1);
    g.lineBetween(22, 24, 32, 24);
    g.generateTexture(key, 54, 80);
  }

  createBoyarHouse() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0x6D4C41, 1);
    g.fillRect(10, 70, 160, 70);
    g.fillStyle(0x8D6E63, 1);
    g.fillRect(15, 45, 150, 55);
    g.fillStyle(0xB71C1C, 1);
    g.fillTriangle(5, 50, 90, 5, 175, 50);
    g.fillStyle(0xC62828, 1);
    g.fillTriangle(15, 50, 90, 12, 165, 50);
    g.fillStyle(0x5D4037, 1);
    g.fillRect(130, 15, 22, 30);
    g.fillStyle(0x3E2723, 1);
    g.fillRect(126, 12, 30, 8);
    g.fillStyle(0xFFF59D, 1);
    g.fillRect(35, 55, 28, 24);
    g.fillRect(117, 55, 28, 24);
    g.lineStyle(2, 0x5D4037, 1);
    g.strokeRect(35, 55, 28, 24);
    g.strokeRect(117, 55, 28, 24);
    g.lineBetween(49, 55, 49, 79);
    g.lineBetween(35, 67, 63, 67);
    g.lineBetween(131, 55, 131, 79);
    g.lineBetween(117, 67, 145, 67);
    g.fillStyle(0x4E342E, 1);
    g.fillRect(72, 70, 36, 45);
    g.fillStyle(0xF1C40F, 1);
    g.fillCircle(100, 92, 4);
    g.fillStyle(0x5D4037, 1);
    g.fillRect(65, 112, 50, 8);
    g.generateTexture('house_boyar', 180, 140);
  }

  createMerchantHouse() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0x795548, 1);
    g.fillRect(10, 50, 110, 50);
    g.fillStyle(0xA1887F, 1);
    g.fillRect(15, 40, 100, 45);
    g.fillStyle(0xD84315, 1);
    g.fillTriangle(5, 45, 65, 5, 125, 45);
    g.fillStyle(0xFFF59D, 1);
    g.fillRect(30, 50, 22, 18);
    g.fillRect(78, 50, 22, 18);
    g.lineStyle(2, 0x5D4037, 1);
    g.strokeRect(30, 50, 22, 18);
    g.strokeRect(78, 50, 22, 18);
    g.fillStyle(0x4E342E, 1);
    g.fillRect(52, 60, 26, 35);
    g.fillStyle(0xF1C40F, 1);
    g.fillCircle(72, 77, 3);
    g.generateTexture('house_merchant', 130, 100);
  }

  createFrog() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0x5D4037, 1);
    g.fillEllipse(32, 42, 58, 22);
    g.fillStyle(0x6D4C41, 1);
    g.fillRect(10, 32, 44, 18);
    g.fillStyle(0x8D6E63, 1);
    g.fillEllipse(32, 32, 50, 12);
    g.lineStyle(1, 0x4E342E, 0.6);
    g.strokeEllipse(32, 32, 36, 8);
    g.strokeEllipse(32, 32, 22, 5);
    g.fillStyle(0x27AE60, 1);
    g.fillEllipse(32, 20, 34, 24);
    g.fillStyle(0x2ECC71, 1);
    g.fillEllipse(32, 18, 26, 16);
    g.fillStyle(0xFFFFFF, 1);
    g.fillCircle(22, 12, 8);
    g.fillCircle(42, 12, 8);
    g.fillStyle(0x2C3E50, 1);
    g.fillCircle(22, 12, 4);
    g.fillCircle(42, 12, 4);
    g.fillStyle(0xFFFFFF, 1);
    g.fillCircle(20, 10, 1.5);
    g.fillCircle(40, 10, 1.5);
    g.fillStyle(0x27AE60, 1);
    g.fillEllipse(14, 28, 12, 8);
    g.fillEllipse(50, 28, 12, 8);
    g.generateTexture('frog', 64, 52);
  }

  createTree() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0x5D4037, 1);
    g.fillRect(22, 50, 16, 55);
    g.fillStyle(0x6D4C41, 1);
    g.fillRect(24, 50, 6, 55);
    g.fillStyle(0x1B5E20, 1);
    g.fillCircle(30, 40, 32);
    g.fillStyle(0x2E7D32, 1);
    g.fillCircle(18, 48, 22);
    g.fillCircle(42, 48, 22);
    g.fillStyle(0x43A047, 1);
    g.fillCircle(30, 28, 24);
    g.fillStyle(0x66BB6A, 1);
    g.fillCircle(22, 36, 14);
    g.fillCircle(38, 34, 12);
    g.generateTexture('tree', 60, 105);
  }

  createRock() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0x78909C, 1);
    g.fillEllipse(24, 20, 46, 32);
    g.fillStyle(0x90A4AE, 1);
    g.fillEllipse(20, 16, 28, 20);
    g.fillStyle(0xB0BEC5, 1);
    g.fillEllipse(16, 12, 14, 10);
    g.generateTexture('rock', 48, 36);
  }

  createHare() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0xECEFF1, 1);
    g.fillEllipse(22, 22, 32, 22);
    g.fillEllipse(10, 14, 18, 16);
    g.fillStyle(0xCFD8DC, 1);
    g.fillEllipse(4, 2, 8, 18);
    g.fillEllipse(14, 2, 8, 18);
    g.fillStyle(0xF8BBD0, 1);
    g.fillEllipse(4, 4, 4, 10);
    g.fillEllipse(14, 4, 4, 10);
    g.fillStyle(0x2C3E50, 1);
    g.fillCircle(6, 12, 2.5);
    g.fillStyle(0xE91E63, 1);
    g.fillCircle(2, 16, 2);
    g.fillStyle(0xECEFF1, 1);
    g.fillEllipse(16, 32, 10, 6);
    g.fillEllipse(30, 32, 10, 6);
    g.generateTexture('hare', 40, 38);
  }

  createWolf() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0x607D8B, 1);
    g.fillEllipse(28, 20, 40, 24);
    g.fillEllipse(8, 14, 22, 18);
    g.fillTriangle(0, 4, 6, 14, 12, 4);
    g.fillTriangle(8, 4, 14, 14, 20, 4);
    g.fillStyle(0x90A4AE, 1);
    g.fillEllipse(2, 16, 12, 10);
    g.fillStyle(0xFFEB3B, 1);
    g.fillCircle(6, 12, 3);
    g.fillStyle(0x000000, 1);
    g.fillCircle(6, 12, 1.5);
    g.fillStyle(0x607D8B, 1);
    g.fillEllipse(48, 18, 14, 8);
    g.generateTexture('wolf', 56, 34);
  }

  createBear() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0x5D4037, 1);
    g.fillEllipse(30, 24, 48, 32);
    g.fillEllipse(10, 16, 24, 22);
    g.fillCircle(2, 6, 7);
    g.fillCircle(18, 6, 7);
    g.fillStyle(0x8D6E63, 1);
    g.fillCircle(2, 6, 3);
    g.fillCircle(18, 6, 3);
    g.fillEllipse(4, 20, 14, 12);
    g.fillStyle(0x000000, 1);
    g.fillCircle(6, 14, 2.5);
    g.fillCircle(14, 14, 2.5);
    g.fillStyle(0x3E2723, 1);
    g.fillCircle(2, 20, 3);
    g.generateTexture('bear', 56, 42);
  }

  createBird() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0x42A5F5, 1);
    g.fillEllipse(18, 14, 28, 16);
    g.fillStyle(0x1E88E5, 1);
    g.fillEllipse(18, 12, 20, 10);
    g.fillStyle(0x42A5F5, 1);
    g.fillCircle(6, 10, 8);
    g.fillStyle(0xFF9800, 1);
    g.fillTriangle(0, 10, 6, 8, 6, 12);
    g.fillStyle(0x000000, 1);
    g.fillCircle(5, 9, 2);
    g.fillStyle(0x1E88E5, 1);
    g.fillTriangle(30, 10, 40, 6, 40, 18);
    g.generateTexture('bird', 42, 24);
  }

  createBabaYaga() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0x5D4037, 1);
    g.fillEllipse(28, 48, 48, 20);
    g.fillStyle(0x6D4C41, 1);
    g.fillRect(10, 28, 36, 28);
    g.fillStyle(0x7E57C2, 1);
    g.fillRoundedRect(16, 12, 24, 28, 4);
    g.fillStyle(0xF5CBA7, 1);
    g.fillCircle(28, 8, 12);
    g.fillStyle(0xE91E63, 1);
    g.fillTriangle(28, 8, 40, 12, 28, 14);
    g.fillStyle(0xFFFFFF, 1);
    g.fillCircle(23, 6, 4);
    g.fillCircle(33, 6, 4);
    g.fillStyle(0xE74C3C, 1);
    g.fillCircle(23, 6, 2);
    g.fillCircle(33, 6, 2);
    g.fillStyle(0x37474F, 1);
    g.fillEllipse(28, 0, 30, 10);
    g.fillStyle(0x8D6E63, 1);
    g.fillRect(44, 20, 4, 30);
    g.fillStyle(0xFFEB3B, 1);
    g.fillTriangle(40, 48, 52, 48, 46, 58);
    g.generateTexture('baba_yaga', 56, 62);
  }

  createKoschei() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0x263238, 1);
    g.fillTriangle(8, 20, 28, 58, 48, 20);
    g.fillStyle(0xECEFF1, 1);
    g.fillRect(20, 22, 16, 28);
    g.lineStyle(1, 0x90A4AE, 1);
    for (let i = 0; i < 4; i++) g.lineBetween(22, 28 + i * 5, 34, 28 + i * 5);
    g.fillStyle(0xFAFAFA, 1);
    g.fillCircle(28, 12, 12);
    g.fillStyle(0x000000, 1);
    g.fillCircle(23, 10, 4);
    g.fillCircle(33, 10, 4);
    g.fillStyle(0xE74C3C, 1);
    g.fillCircle(23, 10, 1.5);
    g.fillCircle(33, 10, 1.5);
    g.fillStyle(0xF1C40F, 1);
    g.fillTriangle(16, 4, 28, -4, 40, 4);
    g.generateTexture('koschei', 56, 62);
  }

  createLeshy() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0x5D4037, 1);
    g.fillRect(18, 20, 20, 40);
    g.fillStyle(0x6D4C41, 1);
    g.fillTriangle(8, 28, 18, 32, 10, 42);
    g.fillTriangle(48, 28, 38, 32, 46, 42);
    g.fillStyle(0x2E7D32, 1);
    g.fillCircle(28, 16, 22);
    g.fillStyle(0x43A047, 1);
    g.fillCircle(20, 12, 12);
    g.fillCircle(36, 12, 12);
    g.fillStyle(0xFFEB3B, 1);
    g.fillCircle(22, 14, 5);
    g.fillCircle(34, 14, 5);
    g.fillStyle(0x000000, 1);
    g.fillCircle(22, 14, 2);
    g.fillCircle(34, 14, 2);
    g.fillStyle(0x66BB6A, 1);
    g.fillEllipse(28, 30, 18, 10);
    g.generateTexture('leshy', 56, 64);
  }

  createIzba() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0xF5CBA7, 1);
    g.fillRect(12, 42, 8, 22);
    g.fillRect(44, 42, 8, 22);
    g.fillStyle(0xE0E0E0, 1);
    g.fillCircle(16, 64, 8);
    g.fillCircle(48, 64, 8);
    g.fillStyle(0x8D6E63, 1);
    g.fillRect(8, 18, 48, 32);
    g.fillStyle(0xD84315, 1);
    g.fillTriangle(2, 22, 32, 2, 62, 22);
    g.fillStyle(0xFFF59D, 1);
    g.fillRect(24, 26, 16, 14);
    g.lineStyle(2, 0x5D4037, 1);
    g.strokeRect(24, 26, 16, 14);
    g.fillStyle(0xFFFFFF, 1);
    g.fillCircle(32, 32, 5);
    g.fillStyle(0x000000, 1);
    g.fillCircle(32, 32, 2.5);
    g.generateTexture('izba', 64, 70);
  }

  createVodyanoy() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0x00897B, 1);
    g.fillEllipse(26, 28, 40, 32);
    g.fillEllipse(26, 12, 28, 22);
    g.fillStyle(0x004D40, 1);
    g.fillTriangle(10, 2, 16, 14, 22, 2);
    g.fillTriangle(22, 0, 28, 12, 34, 0);
    g.fillTriangle(30, 2, 36, 14, 42, 2);
    g.fillStyle(0xFFFFFF, 1);
    g.fillCircle(18, 10, 5);
    g.fillCircle(34, 10, 5);
    g.fillStyle(0x000000, 1);
    g.fillCircle(18, 10, 2.5);
    g.fillCircle(34, 10, 2.5);
    g.fillStyle(0x004D40, 1);
    g.fillEllipse(26, 18, 12, 6);
    g.generateTexture('vodyanoy', 52, 48);
  }

  createKikimora() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0x6A1B9A, 1);
    g.fillTriangle(8, 50, 28, 18, 48, 50);
    g.fillStyle(0xF5CBA7, 1);
    g.fillCircle(28, 14, 12);
    g.fillStyle(0x4A148C, 1);
    g.fillEllipse(28, 6, 28, 14);
    g.fillStyle(0xFFFFFF, 1);
    g.fillCircle(22, 12, 6);
    g.fillCircle(34, 12, 6);
    g.fillStyle(0x000000, 1);
    g.fillCircle(22, 12, 3);
    g.fillCircle(34, 12, 3);
    g.fillStyle(0xF5CBA7, 1);
    g.fillRect(4, 28, 10, 6);
    g.fillRect(42, 28, 10, 6);
    g.generateTexture('kikimora', 56, 54);
  }

  createSolovey() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0xEF6C00, 1);
    g.fillEllipse(24, 20, 36, 24);
    g.fillCircle(8, 12, 12);
    g.fillStyle(0xFFEB3B, 1);
    g.fillTriangle(0, 12, 8, 8, 8, 16);
    g.fillStyle(0xC62828, 1);
    g.fillTriangle(4, 2, 10, 10, 16, 2);
    g.fillStyle(0x000000, 1);
    g.fillCircle(6, 10, 2.5);
    g.fillStyle(0xE65100, 1);
    g.fillEllipse(28, 18, 18, 12);
    g.fillTriangle(40, 16, 52, 8, 52, 28);
    g.generateTexture('solovey', 54, 36);
  }

  createMorozko() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0xE3F2FD, 1);
    g.fillRoundedRect(10, 22, 36, 36, 6);
    g.fillStyle(0xBBDEFB, 1);
    g.fillRect(10, 38, 36, 6);
    g.fillStyle(0xF5CBA7, 1);
    g.fillCircle(28, 14, 13);
    g.fillStyle(0xECEFF1, 1);
    g.fillEllipse(28, 26, 24, 16);
    g.fillStyle(0x0277BD, 1);
    g.fillCircle(22, 12, 3);
    g.fillCircle(34, 12, 3);
    g.fillStyle(0x1565C0, 1);
    g.fillRoundedRect(14, 0, 28, 12, 4);
    g.fillStyle(0xFFFFFF, 1);
    g.fillRect(14, 10, 28, 4);
    g.fillStyle(0x90CAF9, 1);
    g.fillRect(48, 10, 4, 44);
    g.fillCircle(50, 8, 6);
    g.generateTexture('morozko', 58, 60);
  }

  createBoost(key, color, type) {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(color, 0.3);
    g.fillCircle(18, 18, 17);
    g.fillStyle(color, 1);
    g.fillCircle(18, 18, 13);
    g.lineStyle(2, 0xFFFFFF, 0.9);
    g.strokeCircle(18, 18, 13);
    g.fillStyle(0xFFFFFF, 1);
    if (type === 'shield') {
      g.fillTriangle(18, 8, 10, 26, 26, 26);
      g.fillStyle(color, 1);
      g.fillTriangle(18, 12, 13, 23, 23, 23);
    } else if (type === 'dash') {
      g.fillTriangle(10, 12, 10, 24, 28, 18);
    } else {
      g.fillRect(13, 9, 10, 4);
      g.fillRect(13, 23, 10, 4);
      g.fillTriangle(13, 13, 23, 13, 18, 18);
      g.fillTriangle(13, 23, 23, 23, 18, 18);
    }
    g.generateTexture(key, 36, 36);
  }

  createBackground() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillGradientStyle(0x87CEEB, 0x87CEEB, 0xB3E5FC, 0x81D4FA, 1);
    g.fillRect(0, 0, 1280, 420);
    g.fillStyle(0x81C784, 1);
    g.fillEllipse(200, 400, 500, 120);
    g.fillEllipse(700, 390, 600, 140);
    g.fillEllipse(1100, 410, 450, 100);
    g.fillStyle(0x66BB6A, 1);
    g.fillEllipse(100, 450, 400, 100);
    g.fillEllipse(500, 440, 500, 110);
    g.fillEllipse(950, 460, 450, 90);
    g.fillStyle(0x43A047, 1);
    g.fillRect(0, 480, 1280, 240);
    g.generateTexture('bg_field', 1280, 720);
  }

  createGround() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0x33691E, 1);
    g.fillRect(0, 0, 1280, 80);
    g.fillStyle(0x558B2F, 1);
    for (let i = 0; i < 80; i++) {
      const x = i * 16 + (i % 3) * 4;
      g.fillTriangle(x, 0, x + 4, 12, x + 8, 0);
    }
    g.generateTexture('ground', 1280, 80);
  }

  create() {
    this.scene.start('MenuScene');
  }
}
