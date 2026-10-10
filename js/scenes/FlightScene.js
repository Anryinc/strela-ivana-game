export class FlightScene extends Phaser.Scene {
  constructor() {
    super('FlightScene');
  }

  init(data) {
    this.startVx = data.velocityX || 350;
    this.startVy = data.velocityY || -80;
    this.level = data.level || 1;
  }

  create() {
    const { width, height } = this.cameras.main;

    // === Параметры уровня ===
    this.levelLength = 4500 + this.level * 800;
    this.scrollSpeed = 0;

    // === Фон (параллакс) ===
    this.bg1 = this.add.tileSprite(0, 0, this.levelLength + 400, height, 'bg_field').setOrigin(0);
    this.ground = this.add.tileSprite(0, height - 80, this.levelLength + 400, 80, 'ground').setOrigin(0);

    // === Группы ===
    this.statics = this.physics.add.staticGroup();
    this.animals = this.physics.add.group();
    this.fairies = this.physics.add.group();
    this.boosts = this.physics.add.group();
    this.targetGroup = this.physics.add.staticGroup();

    // === Стрела ===
    this.arrow = this.physics.add.sprite(200, height - 200, 'arrow');
    this.arrow.setCollideWorldBounds(false);
    this.arrow.body.setAllowGravity(false);
    this.arrow.setVelocity(this.startVx, this.startVy);
    this.arrow.setDepth(10);
    this.arrow.isAlive = true;
    this.arrow.hasShield = false;
    this.arrow.isFrozen = false;
    this.arrow.isBlinded = false;

    // === Камера ===
    this.cameras.main.startFollow(this.arrow, true, 0.08, 0.08);
    this.cameras.main.setBounds(0, 0, this.levelLength + 300, height);

    // === Генерация уровня ===
    this.generateLevel();

    // === Управление ===
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });
    this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    // === Бусты (состояние) ===
    this.boostState = {
      shieldCharges: 0,
      dashCharges: 0,
      slowmoCharges: 0,
      shieldTimer: 0,
      slowmoTimer: 0,
      isSlowmo: false
    };

    // === HUD ===
    this.createHUD();

    // === Коллизии ===
    this.physics.add.overlap(this.arrow, this.statics, this.hitStatic, null, this);
    this.physics.add.overlap(this.arrow, this.animals, this.hitAnimal, null, this);
    this.physics.add.overlap(this.arrow, this.fairies, this.hitFairy, null, this);
    this.physics.add.overlap(this.arrow, this.boosts, this.collectBoost, null, this);
    this.physics.add.overlap(this.arrow, this.targetGroup, this.hitTarget, null, this);

    // === Таймеры способностей врагов ===
    this.fairyAbilityUsed = new Set();

    // Сообщение
    this.showMessage(this.getLevelIntro());
  }

  getLevelIntro() {
    const texts = {
      1: 'Поле и лес... Уворачивайся от зайцев и деревьев!',
      2: 'Купеческие земли. Здесь уже водятся сказочные твари!',
      3: 'Царство Кощея... Держись, Иван!'
    };
    return texts[this.level] || '';
  }

  generateLevel() {
    const height = this.cameras.main.height;
    const density = this.level;

    // Статика
    const staticCount = 18 + density * 10;
    for (let i = 0; i < staticCount; i++) {
      const x = 500 + i * (this.levelLength / staticCount) + Phaser.Math.Between(-80, 80);
      const y = height - 80 - Phaser.Math.Between(20, 120);
      const key = Math.random() > 0.4 ? 'tree' : 'rock';
      const obj = this.statics.create(x, y, key);
      obj.setScale(key === 'tree' ? 1.2 : 1.4);
      obj.refreshBody();
      obj.obstacleType = 'static';
      obj.displayName = key === 'tree' ? 'Дерево' : 'Камень';
    }

    // Животные
    const animalTypes = ['hare', 'wolf', 'bear', 'bird'];
    const animalCount = 8 + density * 6;
    for (let i = 0; i < animalCount; i++) {
      const x = 600 + i * (this.levelLength / animalCount) + Phaser.Math.Between(-100, 100);
      const y = Phaser.Math.Between(120, height - 160);
      const type = Phaser.Utils.Array.GetRandom(animalTypes);
      const animal = this.animals.create(x, y, type);
      animal.setScale(1.3);
      animal.setBounce(1);
      animal.setCollideWorldBounds(false);
      animal.setVelocity(Phaser.Math.Between(-60, 60), Phaser.Math.Between(-40, 40));
      animal.obstacleType = 'animal';
      animal.displayName = { hare: 'Заяц', wolf: 'Волк', bear: 'Медведь', bird: 'Птица' }[type];
      animal.originY = y;
    }

    // Сказочные персонажи
    const fairyList = this.getFairiesForLevel();
    fairyList.forEach((f, idx) => {
      const x = 900 + idx * ((this.levelLength - 1200) / Math.max(fairyList.length, 1)) + Phaser.Math.Between(-50, 50);
      const y = Phaser.Math.Between(150, height - 200);
      const fairy = this.fairies.create(x, y, f.key);
      fairy.setScale(1.5);
      fairy.setBounce(0.8);
      fairy.setVelocity(Phaser.Math.Between(-30, 30), Phaser.Math.Between(-20, 20));
      fairy.obstacleType = 'fairy';
      fairy.displayName = f.name;
      fairy.ability = f.ability;
      fairy.abilityUsed = false;
      fairy.originX = x;
      fairy.originY = y;
    });

    // Бусты
    const boostCount = 5 + density * 2;
    for (let i = 0; i < boostCount; i++) {
      const x = 700 + i * (this.levelLength / boostCount);
      const y = Phaser.Math.Between(100, height - 180);
      const types = ['boost_shield', 'boost_dash', 'boost_slowmo'];
      const key = Phaser.Utils.Array.GetRandom(types);
      const boost = this.boosts.create(x, y, key);
      boost.setScale(1.2);
      boost.boostType = key.replace('boost_', '');
      this.tweens.add({
        targets: boost,
        y: y - 15,
        duration: 1200,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }

    // Цель в конце
    const targetX = this.levelLength - 150;
    const targetY = height - 160;
    let targetKey, targetName, targetScale;

    if (this.level === 1) {
      targetKey = 'house_boyar';
      targetName = 'Боярская дочка';
      targetScale = 1.1;
    } else if (this.level === 2) {
      targetKey = 'house_merchant';
      targetName = 'Купеческая дочка';
      targetScale = 1.0;
    } else {
      targetKey = 'frog';
      targetName = 'Лягушка';
      targetScale = 1.4;
    }

    const target = this.targetGroup.create(targetX, targetY, targetKey);
    target.setScale(targetScale);
    target.refreshBody();
    target.isTarget = true;
    target.displayName = targetName;

    this.finishLine = targetX + 280;
  }

  getFairiesForLevel() {
    const all = [
      { key: 'baba_yaga', name: 'Баба-Яга', ability: 'blind' },
      { key: 'koschei', name: 'Кощей', ability: 'freeze' },
      { key: 'leshy', name: 'Леший', ability: 'spawn' },
      { key: 'izba', name: 'Избушка', ability: 'stomp' },
      { key: 'vodyanoy', name: 'Водяной', ability: 'slow' },
      { key: 'kikimora', name: 'Кикимора', ability: 'confuse' },
      { key: 'solovey', name: 'Соловей-Разбойник', ability: 'whistle' },
      { key: 'morozko', name: 'Морозко', ability: 'freeze' }
    ];

    if (this.level === 1) {
      return Phaser.Utils.Array.Shuffle(all).slice(0, 1);
    } else if (this.level === 2) {
      return Phaser.Utils.Array.Shuffle(all).slice(0, 3);
    } else {
      return Phaser.Utils.Array.Shuffle(all).slice(0, 6);
    }
  }

  createHUD() {
    const style = { fontFamily: 'Courier New', fontSize: '18px', color: '#FFFFFF', stroke: '#000', strokeThickness: 3 };

    this.hudShield = this.add.text(20, 20, 'Щит (Q): 0', style).setScrollFactor(0).setDepth(100);
    this.hudDash = this.add.text(20, 48, 'Рывок (E): 0', style).setScrollFactor(0).setDepth(100);
    this.hudSlow = this.add.text(20, 76, 'Замедл. (Q+E): 0', style).setScrollFactor(0).setDepth(100);

    this.shieldBarBg = this.add.rectangle(160, 28, 100, 12, 0x333333).setScrollFactor(0).setDepth(100).setOrigin(0, 0.5);
    this.shieldBar = this.add.rectangle(160, 28, 0, 10, 0x3498DB).setScrollFactor(0).setDepth(101).setOrigin(0, 0.5);

    this.slowBarBg = this.add.rectangle(200, 84, 100, 12, 0x333333).setScrollFactor(0).setDepth(100).setOrigin(0, 0.5);
    this.slowBar = this.add.rectangle(200, 84, 0, 10, 0x9B59B6).setScrollFactor(0).setDepth(101).setOrigin(0, 0.5);

    this.levelText = this.add.text(this.cameras.main.width - 20, 20, `Уровень ${this.level}`, style)
      .setScrollFactor(0).setDepth(100).setOrigin(1, 0);
  }

  update(time, delta) {
    if (!this.arrow.isAlive) return;

    const dt = this.boostState.isSlowmo ? delta * 0.35 : delta;

    if (!this.arrow.isFrozen) {
      const accel = 8;
      if (this.cursors.up.isDown || this.wasd.up.isDown) {
        this.arrow.setVelocityY(this.arrow.body.velocity.y - accel);
      }
      if (this.cursors.down.isDown || this.wasd.down.isDown) {
        this.arrow.setVelocityY(this.arrow.body.velocity.y + accel);
      }
      if (this.cursors.left.isDown || this.wasd.left.isDown) {
        this.arrow.setVelocityX(Math.max(this.arrow.body.velocity.x - accel * 0.7, 80));
      }
      if (this.cursors.right.isDown || this.wasd.right.isDown) {
        this.arrow.setVelocityX(this.arrow.body.velocity.x + accel * 0.9);
      }
    }

    this.arrow.body.velocity.x = Phaser.Math.Clamp(this.arrow.body.velocity.x, 60, 520);
    this.arrow.body.velocity.y = Phaser.Math.Clamp(this.arrow.body.velocity.y, -280, 280);

    this.arrow.setVelocityY(this.arrow.body.velocity.y + 3);

    const angle = Math.atan2(this.arrow.body.velocity.y, this.arrow.body.velocity.x);
    this.arrow.setRotation(angle);

    this.handleBoosts(time, delta);

    this.animals.getChildren().forEach(a => {
      if (a.y < 80 || a.y > this.cameras.main.height - 100) {
        a.setVelocityY(-a.body.velocity.y);
      }
      if (Math.abs(a.x - this.arrow.x) < 400) {
        a.setVelocityX(a.body.velocity.x + Math.sign(this.arrow.x - a.x) * 0.3);
      }
    });

    this.fairies.getChildren().forEach(f => {
      if (Math.abs(f.x - f.originX) > 180) {
        f.setVelocityX(-f.body.velocity.x);
      }
      if (Math.abs(f.y - f.originY) > 100) {
        f.setVelocityY(-f.body.velocity.y);
      }

      if (!f.abilityUsed && Math.abs(f.x - this.arrow.x) < 280 && Math.abs(f.y - this.arrow.y) < 160) {
        this.useFairyAbility(f);
      }
    });

    if (this.arrow.x > this.finishLine + 100) {
      this.endLevel('secret');
    }

    if (this.arrow.y > this.cameras.main.height - 70) {
      this.endLevel('fail', { displayName: 'Земля', obstacleType: 'static' });
    }

    this.updateHUD();
  }

  handleBoosts(time, delta) {
    const qDown = this.keyQ.isDown;
    const eDown = this.keyE.isDown;

    if (qDown && eDown && this.boostState.slowmoCharges > 0 && !this.boostState.isSlowmo) {
      this.boostState.slowmoCharges--;
      this.boostState.isSlowmo = true;
      this.boostState.slowmoTimer = 2500;
      this.applySlowmoVisual(true);
    }
    else if (qDown && !eDown && Phaser.Input.Keyboard.JustDown(this.keyQ) && this.boostState.shieldCharges > 0 && this.boostState.shieldTimer <= 0) {
      this.boostState.shieldCharges--;
      this.boostState.shieldTimer = 2000;
      this.arrow.hasShield = true;
      this.arrow.setTint(0x3498DB);
    }
    else if (eDown && !qDown && Phaser.Input.Keyboard.JustDown(this.keyE) && this.boostState.dashCharges > 0) {
      this.boostState.dashCharges--;
      this.arrow.x += 220;
      this.arrow.setVelocityX(this.arrow.body.velocity.x + 180);
      this.cameras.main.flash(80, 255, 100, 100);
    }

    if (this.boostState.shieldTimer > 0) {
      this.boostState.shieldTimer -= delta;
      if (this.boostState.shieldTimer <= 0) {
        this.arrow.hasShield = false;
        this.arrow.clearTint();
      }
    }

    if (this.boostState.isSlowmo) {
      this.boostState.slowmoTimer -= delta;
      if (this.boostState.slowmoTimer <= 0) {
        this.boostState.isSlowmo = false;
        this.applySlowmoVisual(false);
      }
    }
  }

  applySlowmoVisual(active) {
    if (active) {
      this.cameras.main.setBackgroundColor(0x2C1654);
      this.bg1.setTint(0x9B59B6);
      this.ground.setTint(0x6C3483);
    } else {
      this.cameras.main.setBackgroundColor(0x2d3436);
      this.bg1.clearTint();
      this.ground.clearTint();
    }
  }

  useFairyAbility(fairy) {
    fairy.abilityUsed = true;
    this.fairyAbilityUsed.add(fairy);

    const name = fairy.displayName;
    switch (fairy.ability) {
      case 'blind':
        this.showMessage(`${name}: «Ослеплю тебя!»`);
        this.arrow.isBlinded = true;
        this.cameras.main.fade(300, 0, 0, 0);
        this.time.delayedCall(1200, () => {
          this.cameras.main.fadeIn(400);
          this.arrow.isBlinded = false;
        });
        break;
      case 'freeze':
        this.showMessage(`${name}: «Замри!»`);
        this.arrow.isFrozen = true;
        this.arrow.setTint(0x87CEEB);
        this.time.delayedCall(1100, () => {
          this.arrow.isFrozen = false;
          if (!this.arrow.hasShield) this.arrow.clearTint();
        });
        break;
      case 'spawn':
        this.showMessage(`${name}: «Деревья, растите!»`);
        for (let i = 0; i < 3; i++) {
          const tx = this.arrow.x + 180 + i * 70;
          const ty = this.cameras.main.height - 100 - Phaser.Math.Between(0, 60);
          const tree = this.statics.create(tx, ty, 'tree');
          tree.setScale(1.1);
          tree.refreshBody();
          tree.obstacleType = 'static';
          tree.displayName = 'Дерево Лешего';
        }
        break;
      case 'stomp':
        this.showMessage(`${name}: «Топ-топ!»`);
        this.cameras.main.shake(400, 0.02);
        this.arrow.setVelocityY(this.arrow.body.velocity.y + 120);
        break;
      case 'slow':
        this.showMessage(`${name}: «Вода...»`);
        this.arrow.setVelocityX(this.arrow.body.velocity.x * 0.4);
        break;
      case 'confuse':
        this.showMessage(`${name}: «Запутаю!»`);
        this.arrow.setVelocityY(-this.arrow.body.velocity.y * 1.5);
        break;
      case 'whistle':
        this.showMessage(`${name}: «Свист!»`);
        this.cameras.main.shake(500, 0.015);
        this.arrow.setVelocityX(this.arrow.body.velocity.x * 0.5);
        this.arrow.setVelocityY(Phaser.Math.Between(-150, 150));
        break;
    }
  }

  collectBoost(arrow, boost) {
    const type = boost.boostType;
    if (type === 'shield') this.boostState.shieldCharges++;
    else if (type === 'dash') this.boostState.dashCharges++;
    else if (type === 'slowmo') this.boostState.slowmoCharges++;

    boost.destroy();
    this.showMessage(`+1 ${type === 'shield' ? 'Щит' : type === 'dash' ? 'Рывок' : 'Замедление'}!`);
  }

  hitStatic(arrow, obj) {
    if (arrow.hasShield) {
      arrow.hasShield = false;
      this.boostState.shieldTimer = 0;
      arrow.clearTint();
      obj.destroy();
      this.showMessage('Щит спас!');
      return;
    }
    this.endLevel('fail', obj);
  }

  hitAnimal(arrow, obj) {
    if (arrow.hasShield) {
      arrow.hasShield = false;
      this.boostState.shieldTimer = 0;
      arrow.clearTint();
      obj.destroy();
      this.showMessage('Щит спас!');
      return;
    }
    this.endLevel('fail', obj);
  }

  hitFairy(arrow, obj) {
    if (arrow.hasShield) {
      arrow.hasShield = false;
      this.boostState.shieldTimer = 0;
      arrow.clearTint();
      obj.destroy();
      this.showMessage('Щит спас от ' + obj.displayName + '!');
      return;
    }
    this.endLevel('fail', obj);
  }

  hitTarget(arrow, target) {
    this.endLevel('success', target);
  }

  endLevel(result, hitObject = null) {
    if (!this.arrow.isAlive) return;
    this.arrow.isAlive = false;
    this.arrow.setVelocity(0, 0);

    window.gameState.lastResult = result;
    window.gameState.lastHitObject = hitObject ? {
      name: hitObject.displayName || 'Неизвестно',
      type: hitObject.obstacleType || 'unknown'
    } : null;

    if (result === 'success') {
      if (!window.gameState.completedLevels.includes(this.level)) {
        window.gameState.completedLevels.push(this.level);
      }
    }

    this.time.delayedCall(400, () => {
      this.scene.start('ResultScene', {
        result,
        level: this.level,
        hitObject: window.gameState.lastHitObject
      });
    });
  }

  updateHUD() {
    this.hudShield.setText(`Щит (Q): ${this.boostState.shieldCharges}`);
    this.hudDash.setText(`Рывок (E): ${this.boostState.dashCharges}`);
    this.hudSlow.setText(`Замедл. (Q+E): ${this.boostState.slowmoCharges}`);

    const shieldPct = Math.max(0, this.boostState.shieldTimer / 2000);
    this.shieldBar.width = shieldPct * 100;
    this.shieldBarBg.setVisible(this.boostState.shieldTimer > 0);
    this.shieldBar.setVisible(this.boostState.shieldTimer > 0);

    const slowPct = Math.max(0, this.boostState.slowmoTimer / 2500);
    this.slowBar.width = slowPct * 100;
    this.slowBarBg.setVisible(this.boostState.isSlowmo);
    this.slowBar.setVisible(this.boostState.isSlowmo);
  }

  showMessage(text) {
    if (this.msgText) this.msgText.destroy();
    this.msgText = this.add.text(this.cameras.main.width / 2, 120, text, {
      fontFamily: 'Courier New',
      fontSize: '22px',
      color: '#F1C40F',
      stroke: '#000',
      strokeThickness: 4,
      backgroundColor: '#000000AA',
      padding: { x: 12, y: 6 }
    }).setScrollFactor(0).setDepth(200).setOrigin(0.5);

    this.time.delayedCall(2200, () => {
      if (this.msgText) this.msgText.destroy();
    });
  }
}
