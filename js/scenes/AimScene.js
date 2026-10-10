export class AimScene extends Phaser.Scene {
  constructor() {
    super('AimScene');
  }

  create() {
    const { width, height } = this.cameras.main;
    const level = window.gameState.currentLevel;

    // Фон
    this.add.image(0, 0, 'bg_field').setOrigin(0).setDisplaySize(width, height);
    this.add.image(0, height - 80, 'ground').setOrigin(0);

    // Брат
    const brotherKey = `brother${level}`;
    this.brother = this.add.image(180, height - 140, brotherKey).setScale(1.6);

    // Лук (линия)
    this.bowLine = this.add.graphics();
    this.powerBarBg = this.add.rectangle(180, height - 220, 120, 16, 0x333333).setOrigin(0.5);
    this.powerBar = this.add.rectangle(180 - 58, height - 220, 4, 12, 0xE74C3C).setOrigin(0, 0.5);

    // Информация
    const titles = {
      1: 'Старший брат целится в дом боярской дочки',
      2: 'Средний брат целится в дом купеческой дочки',
      3: 'Иван-царевич целится в лягушку'
    };

    this.add.text(width / 2, 40, titles[level], {
      fontFamily: 'Courier New',
      fontSize: '24px',
      color: '#FFFFFF',
      stroke: '#000',
      strokeThickness: 4
    }).setOrigin(0.5);

    this.add.text(width / 2, 80, 'Зажми ЛКМ или ПРОБЕЛ, чтобы натянуть лук. Отпусти — выстрел.', {
      fontFamily: 'Courier New',
      fontSize: '16px',
      color: '#ECF0F1'
    }).setOrigin(0.5);

    // Состояние прицеливания
    this.angle = -0.4; // радианы
    this.power = 0;
    this.isCharging = false;
    this.maxPower = 100;

    // Управление
    this.input.on('pointerdown', () => { this.isCharging = true; });
    this.input.on('pointerup', () => this.shoot());

    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S
    });

    // Предпросмотр траектории
    this.trajectory = this.add.graphics();
  }

  update(time, delta) {
    // Управление углом
    if (this.cursors.up.isDown || this.wasd.up.isDown) {
      this.angle = Phaser.Math.Clamp(this.angle - 0.015, -1.3, 0.1);
    }
    if (this.cursors.down.isDown || this.wasd.down.isDown) {
      this.angle = Phaser.Math.Clamp(this.angle + 0.015, -1.3, 0.1);
    }

    // Зарядка
    if (this.spaceKey.isDown) this.isCharging = true;
    if (Phaser.Input.Keyboard.JustUp(this.spaceKey)) this.shoot();

    if (this.isCharging) {
      this.power = Math.min(this.power + delta * 0.08, this.maxPower);
    }

    // Визуализация
    this.drawBow();
    this.drawTrajectory();
    this.powerBar.width = (this.power / this.maxPower) * 116;
  }

  drawBow() {
    this.bowLine.clear();
    const startX = 210;
    const startY = this.cameras.main.height - 160;

    // Тетива
    this.bowLine.lineStyle(3, 0x8B4513, 1);
    const pull = this.power * 0.4;
    const endX = startX + Math.cos(this.angle) * 50;
    const endY = startY + Math.sin(this.angle) * 50;

    this.bowLine.lineBetween(startX, startY - 25, startX - pull * Math.cos(this.angle), startY - pull * Math.sin(this.angle));
    this.bowLine.lineBetween(startX, startY + 25, startX - pull * Math.cos(this.angle), startY - pull * Math.sin(this.angle));

    // Направление
    this.bowLine.lineStyle(2, 0xF1C40F, 0.8);
    this.bowLine.lineBetween(startX, startY, endX, endY);
  }

  drawTrajectory() {
    this.trajectory.clear();
    if (this.power < 5) return;

    const startX = 210;
    const startY = this.cameras.main.height - 160;
    const speed = this.power * 4.5;
    let vx = Math.cos(this.angle) * speed;
    let vy = Math.sin(this.angle) * speed;

    this.trajectory.fillStyle(0xFFFFFF, 0.5);
    let x = startX;
    let y = startY;

    for (let i = 0; i < 25; i++) {
      x += vx * 0.08;
      y += vy * 0.08;
      vy += 12; // гравитация для превью
      this.trajectory.fillCircle(x, y, 3);
      if (y > this.cameras.main.height - 80) break;
    }
  }

  shoot() {
    if (this.power < 8) {
      this.isCharging = false;
      this.power = 0;
      return;
    }

    const speed = this.power * 4.5;
    const vx = Math.cos(this.angle) * speed;
    const vy = Math.sin(this.angle) * speed;

    this.scene.start('FlightScene', {
      velocityX: vx,
      velocityY: vy,
      level: window.gameState.currentLevel
    });
  }
}
