export class ResultScene extends Phaser.Scene {
  constructor() {
    super('ResultScene');
  }

  init(data) {
    this.result = data.result; // 'success' | 'fail' | 'secret'
    this.level = data.level;
    this.hitObject = data.hitObject;
  }

  create() {
    const { width, height } = this.cameras.main;

    // Фон
    this.add.rectangle(0, 0, width, height, 0x1a1a2e).setOrigin(0);

    // Декор
    for (let i = 0; i < 30; i++) {
      this.add.circle(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height),
        Phaser.Math.Between(1, 3),
        0xFFFFFF,
        Phaser.Math.FloatBetween(0.2, 0.7)
      );
    }

    const brotherNames = { 1: 'Старший брат', 2: 'Средний брат', 3: 'Иван-царевич' };
    const brideNames = { 1: 'Боярская дочка', 2: 'Купеческая дочка', 3: 'Царевна-лягушка' };

    if (this.result === 'success') {
      this.showSuccess(width, height, brotherNames, brideNames);
    } else if (this.result === 'fail') {
      this.showFail(width, height, brotherNames);
    } else {
      this.showSecret(width, height, brotherNames);
    }

    // Кнопки
    this.time.delayedCall(1800, () => {
      this.createButtons(width, height);
    });
  }

  showSuccess(width, height, brotherNames, brideNames) {
    this.add.text(width / 2, 80, 'СВАДЬБА!', {
      fontFamily: 'Courier New',
      fontSize: '56px',
      color: '#F1C40F',
      stroke: '#000',
      strokeThickness: 6
    }).setOrigin(0.5);

    this.add.text(width / 2, 160, `${brotherNames[this.level]} + ${brideNames[this.level]}`, {
      fontFamily: 'Courier New',
      fontSize: '28px',
      color: '#2ECC71'
    }).setOrigin(0.5);

    // Простая анимация "персонажей"
    const brother = this.add.image(width / 2 - 100, height / 2 + 20, `brother${this.level}`).setScale(2.2);
    let brideKey = this.level === 3 ? 'frog' : (this.level === 1 ? 'house_boyar' : 'house_merchant');
    
    // Для лягушки — превращаем в "царевну" (просто меняем цвет и текст)
    if (this.level === 3) {
      const princess = this.add.rectangle(width / 2 + 100, height / 2 + 10, 60, 90, 0xE91E63);
      this.add.circle(width / 2 + 100, height / 2 - 50, 28, 0xFFE4C4);
      this.add.text(width / 2 + 100, height / 2 + 80, 'Царевна', {
        fontFamily: 'Courier New', fontSize: '16px', color: '#FFF'
      }).setOrigin(0.5);
    } else {
      this.add.image(width / 2 + 100, height / 2 + 20, brideKey).setScale(0.9);
    }

    // Сердечки
    for (let i = 0; i < 8; i++) {
      const heart = this.add.text(
        Phaser.Math.Between(width / 2 - 200, width / 2 + 200),
        Phaser.Math.Between(height / 2 - 80, height / 2 + 100),
        '♥',
        { fontSize: '24px', color: '#E74C3C' }
      );
      this.tweens.add({
        targets: heart,
        y: heart.y - 40,
        alpha: 0,
        duration: 2000,
        delay: i * 200,
        repeat: -1
      });
    }

    this.add.text(width / 2, height - 160, 'Жили они долго и счастливо!', {
      fontFamily: 'Courier New',
      fontSize: '20px',
      color: '#ECF0F1'
    }).setOrigin(0.5);
  }

  showFail(width, height, brotherNames) {
    this.add.text(width / 2, 70, 'СВАДЬБА...?', {
      fontFamily: 'Courier New',
      fontSize: '48px',
      color: '#E74C3C',
      stroke: '#000',
      strokeThickness: 5
    }).setOrigin(0.5);

    const hitName = this.hitObject ? this.hitObject.name : 'Неизвестно';

    this.add.text(width / 2, 140, `${brotherNames[this.level]} + ${hitName}`, {
      fontFamily: 'Courier New',
      fontSize: '26px',
      color: '#F39C12'
    }).setOrigin(0.5);

    // Брат
    this.add.image(width / 2 - 120, height / 2 + 10, `brother${this.level}`).setScale(2);

    // "Невеста" — то, во что попали (с огромными глазами)
    const enemyKey = this.getSpriteForHit(hitName);
    const bride = this.add.image(width / 2 + 120, height / 2 + 10, enemyKey).setScale(2.2);

    // Большие удивлённые глаза поверх
    const eyeL = this.add.circle(width / 2 + 100, height / 2 - 30, 14, 0xFFFFFF);
    const eyeR = this.add.circle(width / 2 + 140, height / 2 - 30, 14, 0xFFFFFF);
    const pupilL = this.add.circle(width / 2 + 100, height / 2 - 30, 6, 0x000000);
    const pupilR = this.add.circle(width / 2 + 140, height / 2 - 30, 6, 0x000000);

    // Лёгкое дрожание глаз
    this.tweens.add({
      targets: [eyeL, eyeR, pupilL, pupilR],
      x: '+=3',
      duration: 80,
      yoyo: true,
      repeat: -1
    });

    this.add.text(width / 2, height - 150, 'Все гости в шоке смотрят на камеру...', {
      fontFamily: 'Courier New',
      fontSize: '18px',
      color: '#AAAAAA'
    }).setOrigin(0.5);
  }

  showSecret(width, height, brotherNames) {
    this.add.text(width / 2, 80, 'СЕКРЕТНАЯ КОНЦОВКА', {
      fontFamily: 'Courier New',
      fontSize: '42px',
      color: '#9B59B6',
      stroke: '#000',
      strokeThickness: 5
    }).setOrigin(0.5);

    this.add.text(width / 2, 160, `${brotherNames[this.level]} ускакал дальше...`, {
      fontFamily: 'Courier New',
      fontSize: '24px',
      color: '#ECF0F1'
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 - 20, 'На коне он отправился\nбиться со Змеем Горынычем!', {
      fontFamily: 'Courier New',
      fontSize: '26px',
      color: '#F1C40F',
      align: 'center'
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 80, 'А дальше была совсем другая история...', {
      fontFamily: 'Courier New',
      fontSize: '18px',
      color: '#AAAAAA'
    }).setOrigin(0.5);

    // Уровень всё равно считается пройденным
    if (!window.gameState.completedLevels.includes(this.level)) {
      window.gameState.completedLevels.push(this.level);
    }
  }

  getSpriteForHit(name) {
    const map = {
      'Дерево': 'tree',
      'Камень': 'rock',
      'Заяц': 'hare',
      'Волк': 'wolf',
      'Медведь': 'bear',
      'Птица': 'bird',
      'Баба-Яга': 'baba_yaga',
      'Кощей': 'koschei',
      'Леший': 'leshy',
      'Избушка': 'izba',
      'Водяной': 'vodyanoy',
      'Кикимора': 'kikimora',
      'Соловей-Разбойник': 'solovey',
      'Морозко': 'morozko',
      'Земля': 'rock',
      'Дерево Лешего': 'tree'
    };
    return map[name] || 'rock';
  }

  createButtons(width, height) {
    // Ещё раз
    const retry = this.add.rectangle(width / 2 - 140, height - 70, 220, 50, 0xE74C3C)
      .setInteractive({ useHandCursor: true })
      .setStrokeStyle(2, 0xFFFFFF);

    this.add.text(width / 2 - 140, height - 70, 'Ещё раз', {
      fontFamily: 'Courier New', fontSize: '22px', color: '#FFF'
    }).setOrigin(0.5);

    retry.on('pointerdown', () => {
      this.scene.start('AimScene');
    });

    // В меню
    const menu = this.add.rectangle(width / 2 + 140, height - 70, 220, 50, 0x3498DB)
      .setInteractive({ useHandCursor: true })
      .setStrokeStyle(2, 0xFFFFFF);

    this.add.text(width / 2 + 140, height - 70, 'В меню', {
      fontFamily: 'Courier New', fontSize: '22px', color: '#FFF'
    }).setOrigin(0.5);

    menu.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });
  }
}
