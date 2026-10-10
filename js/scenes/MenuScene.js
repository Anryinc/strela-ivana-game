export class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    const { width, height } = this.cameras.main;

    // Фон
    this.add.rectangle(0, 0, width, height, 0x1a1a2e).setOrigin(0);

    // Декоративные звёзды
    for (let i = 0; i < 40; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(0, height);
      const size = Phaser.Math.Between(1, 3);
      this.add.circle(x, y, size, 0xFFFFFF, Phaser.Math.FloatBetween(0.3, 0.9));
    }

    // Заголовок
    this.add.text(width / 2, 100, 'СТРЕЛА ИВАНА', {
      fontFamily: 'Courier New',
      fontSize: '64px',
      color: '#F1C40F',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5);

    this.add.text(width / 2, 170, 'Царевна-лягушка', {
      fontFamily: 'Courier New',
      fontSize: '28px',
      color: '#ECF0F1'
    }).setOrigin(0.5);

    // Кнопки уровней
    const levels = [
      { id: 1, name: 'Старший брат', desc: 'Дом боярской дочки', color: 0x4A90D9 },
      { id: 2, name: 'Средний брат', desc: 'Дом купеческой дочки', color: 0x50C878 },
      { id: 3, name: 'Иван-царевич', desc: 'Царевна-лягушка', color: 0xE74C3C }
    ];

    levels.forEach((lvl, i) => {
      const y = 280 + i * 90;
      const unlocked = lvl.id === 1 || window.gameState.completedLevels.includes(lvl.id - 1);

      const btn = this.add.rectangle(width / 2, y, 420, 70, unlocked ? lvl.color : 0x555555)
        .setInteractive({ useHandCursor: unlocked })
        .setStrokeStyle(3, 0xFFFFFF);

      const label = this.add.text(width / 2, y - 12, lvl.name, {
        fontFamily: 'Courier New',
        fontSize: '26px',
        color: '#FFFFFF'
      }).setOrigin(0.5);

      this.add.text(width / 2, y + 16, unlocked ? lvl.desc : '???', {
        fontFamily: 'Courier New',
        fontSize: '16px',
        color: '#DDDDDD'
      }).setOrigin(0.5);

      if (unlocked) {
        btn.on('pointerover', () => btn.setScale(1.05));
        btn.on('pointerout', () => btn.setScale(1));
        btn.on('pointerdown', () => {
          window.gameState.currentLevel = lvl.id;
          this.scene.start('AimScene');
        });
      }
    });

    // Подсказка
    this.add.text(width / 2, height - 40, 'WASD / Стрелки — управление | Q — щит | E — рывок | Q+E — замедление', {
      fontFamily: 'Courier New',
      fontSize: '14px',
      color: '#AAAAAA'
    }).setOrigin(0.5);
  }
}
