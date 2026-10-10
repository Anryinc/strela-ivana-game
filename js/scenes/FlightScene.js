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

    this.levelLength = 4500 + this.level * 800;
    this.scrollSpeed = 0;

    this.bg1 = this.add.tileSprite(0, 0, this.levelLength + 400, height, 'bg_field').setOrigin(0);
    this.ground = this.add.tileSprite(0, height - 80, this.levelLength + 400, 80, 'ground').setOrigin(0);

    this.statics = this.physics.add.staticGroup();
    this.animals = this.physics.add.group();
    this.fairies = this.physics.add.group();
    this.boosts = this.physics.add.group();
    this.targetGroup = this.physics.add.staticGroup();

    this.arrow = this.physics.add.sprite(200, height - 200, 'arrow');
    this.arrow.setCollideWorldBounds(false);
    this.arrow.body.setAllowGravity(false);
    this.arrow.setVelocity(this.startVx, this.startVy);
    this.arrow.setDepth(10);
    this.arrow.body.setSize(36, 10);
    this.arrow.body.setOffset(12, 5);
    this.arrow.isAlive = true;
    this.arrow.hasShield = false;
    this.arrow.isFrozen = false;
    this.arrow.isBlinded = false;

    this.cameras.main.startFollow(this.arrow, true, 0.08, 0.08);
    this.cameras.main.setBounds(0, 0, this.levelLength + 300, height);

    this.generateLevel();

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });
    this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    this.boostState = {
      shieldCharges: 0,
      dashCharges: 0,
      slowmoCharges: 0,
      shieldTimer: 0,
      slowmoTimer: 0,
      isSlowmo: false
    };

    this.createHUD();

    this.physics.add.overlap(this.arrow, this.statics, this.hitStatic, null, this);
    this.physics.add.overlap(this.arrow, this.animals, this.hitAnimal, null, this);
    this.physics.add.overlap(this.arrow, this.fairies, this.hitFairy, null, this);
    this.physics.add.overlap(this.arrow, this.boosts, this.collectBoost, null, this);
    this.physics.add.overlap(this.arrow, this.targetGroup, this.hitTarget, null, this);

    this.fairyAbilityUsed = new Set();
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
    const groundY = height - 80;
    const density = this.level;

    const staticCount = 14 + density * 8;
    for (let i = 0; i < staticCount; i++) {
      const x = 450 + i * (this.levelLength / staticCount) + Phaser.Math.Between(-60, 60);
      const key = Math.random() > 0.35 ? 'tree' : 'rock';
      const scale = key === 'tree' ? 1.3 : 1.5;
      const y = key === 'tree' ? groundY - 50 : groundY - 18;
      const obj = this.statics.create(x, y, key);
      obj.setScale(scale);
      obj.setOrigin(0.5, 1);
      obj.refreshBody();
      if (key === 'tree') {
        obj.body.setSize(28, 70);
        obj.body.setOffset(16, 20);
      } else {
        obj.body.setSize(36, 24);
        obj.body.setOffset(6, 6);
      }
      obj.obstacleType = 'static';
      obj.displayName = key === 'tree' ? 'Дерево' : 'Камень';
    }

    const animalTypes = [
      { key: 'hare', name: 'Заяц', canFly: false },
      { key: 'wolf', name: 'Волк', canFly: false },
      { key: 'bear', name: 'Медведь', canFly: false },
      { key: 'bird', name: 'Птица', canFly: true }
    ];
    const animalCount = 7 + density * 5;
    for (let i = 0; i < animalCount; i++) {
      const x = 550 + i * (this.levelLength / animalCount) + Phaser.Math.Between(-80, 80);
      const type = Phaser.Utils.Array.GetRandom(animalTypes);
      let y, vx, vy;
      if (type.canFly) {
        y = Phaser.Math.Between(140, 320);
        vx = Phaser.Math.Between(-40, 40);
        vy = Phaser.Math.Between(-25, 25);
      } else {
        y = groundY - 20;
        vx = Phaser.Math.Between(-50, 50) || 30;
        vy = 0;
      }
      const animal = this.animals.create(x, y, type.key);
      animal.setScale(1.4);
      animal.setOrigin(0.5, 1);
      animal.body.setAllowGravity(false);
      animal.setVelocity(vx, vy);
      animal.setBounce(0);
      animal.obstacleType = 'animal';
      animal.displayName = type.name;
      animal.canFly = type.canFly;
      animal.groundY = groundY - 20;
      animal.body.setSize(animal.width * 0.7, animal.height * 0.7);
    }

    const fairyList = this.getFairiesForLevel();
    fairyList.forEach((f, idx) => {
      const x = 850 + idx * ((this.levelLength - 1100) / Math.max(fairyList.length, 1)) + Phaser.Math.Between(-40, 40);
      const y = Phaser.Math.Between(180, groundY - 100);
      const fairy = this.fairies.create(x, y, f.key);
      fairy.setScale(1.6);
      fairy.setOrigin(0.5, 0.5);
      fairy.body.setAllowGravity(false);
      fairy.setVelocity(Phaser.Math.Between(-35, 35), Phaser.Math.Between(-15, 15));
      fairy.setBounce(0.6);
      fairy.obstacleType = 'fairy';
      fairy.displayName = f.name;
      fairy.ability = f.ability;
      fairy.abilityUsed = false;
      fairy.originX = x;
      fairy.originY = y;
      fairy.body.setSize(fairy.width * 0.65, fairy.height * 0.65);
    });

    const boostCount = 5 + density * 2;
    for (let i = 0; i < boostCount; i++) {
      const x = 650 + i * (this.levelLength / boostCount);
      const y = Phaser.Math.Between(120, groundY - 150);
      const types = ['boost_shield', 'boost_dash', 'boost_slowmo'];
      const key = Phaser.Utils.Array.GetRandom(types);
      const boost = this.boosts.create(x, y, key);
      boost.setScale(1.3);
      boost.boostType = key.replace('boost_', '');
      this.tweens.add({
        targets: boost,
        y: y - 18,
        duration: 1400,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }

    const targetX = this.levelLength - 180;
    let targetKey, targetName, targetScale, targetY;

    if (this.level === 1) {
      targetKey = 'house_boyar';
      targetName = 'Боярская дочка';
      targetScale = 1.15;
      targetY = groundY - 10;
    } else if (this.level === 2) {
      targetKey = 'house_merchant';
      targetName = 'Купеческая дочка';
      targetScale = 1.05;
      targetY = groundY - 5;
    } else {
      targetKey = 'frog';
      targetName = 'Лягушка';
      targetScale = 1.5;
      targetY = groundY - 5;
    }

    const target = this.targetGroup.create(targetX, targetY, targetKey);
    target.setScale(targetScale);
    target.setOrigin(0.5, 1);
    target.refreshBody();
    target.body.setSize(target.width * 0.7, target.height * 0.8);
    target.isTarget = true;
    target.displayName = targetName;

    this.finishLine = targetX + 300;
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

    if (this.level === 1) return Phaser.Utils.Array.Shuffle(all).slice(0, 1);
    if (this.level === 2) return Phaser.Utils.Array.Shuffle(all).slice(0, 3);
    return Phaser.Utils.Array.Shuffle(all).slice(0, 6);
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
    this.levelText = this.add.text(this.cameras.main.width - 20, 20, `Уровень ${this.level}`, style).setScrollFactor(0).setDepth(100).setOrigin(1, 0);
  }

  update(time, delta) {
    if (!this.arrow.isAlive) return;

    if (!this.arrow.isFrozen) {
      const accel = 8;
      if (this.cursors.up.isDown || this.wasd.up.isDown) this.arrow.setVelocityY(this.arrow.body.velocity.y - accel);
      if (this.cursors.down.isDown || this.wasd.down.isDown) this.arrow.setVelocityY(this.arrow.body.velocity.y + accel);
      if (this.cursors.left.isDown || this.wasd.left.isDown) this.arrow.setVelocityX(Math.max(this.arrow.body.velocity.x - accel * 0.7, 80));
      if (this.cursors.right.isDown || this.wasd.right.isDown) this.arrow.setVelocityX(this.arrow.body.velocity.x + accel * 0.9);
    }

    this.arrow.body.velocity.x = Phaser.Math.Clamp(this.arrow.body.velocity.x, 60, 520);
    this.arrow.body.velocity.y = Phaser.Math.Clamp(this.arrow.body.velocity.y, -280, 280);
    this.arrow.setVelocityY(this.arrow.body.velocity.y + 3);

    const angle = Math.atan2(this.arrow.body.velocity.y, this.arrow.body.velocity.x);
    this.arrow.setRotation(angle);

    this.handleBoosts(time, delta);

    this.animals.getChildren().forEach(a => {
      if (a.canFly) {
        if (a.y < 100 || a.y > 380) a.setVelocityY(-a.body.velocity.y);
        if (Math.abs(a.x - this.arrow.x) < 350) a.setVelocityX(a.body.velocity.x + Math.sign(this.arrow.x - a.x) * 0.4);
      } else {
        a.y = a.groundY;
        a.setVelocityY(0);
        if (Math.abs(a.body.velocity.x) < 15) a.setVelocityX(Phaser.Math.Between(30, 50) * (Math.random() > 0.5 ? 1 : -1));
        if (Math.abs(a.x - this.arrow.x) < 280) a.setVelocityX(Math.sign(this.arrow.x - a.x) * 45);
      }
    });

    this.fairies.getChildren().forEach(f => {
      if (Math.abs(f.x - f.originX) > 160) f.setVelocityX(-Math.sign(f.x - f.originX) * Math.abs(f.body.velocity.x || 30));
      if (Math.abs(f.y - f.originY) > 90) f.setVelocityY(-Math.sign(f.y - f.originY) * Math.abs(f.body.velocity.y || 20));
      if (Math.abs(f.x - this.arrow.x) < 320) {
        f.setVelocityX(f.body.velocity.x + Math.sign(this.arrow.x - f.x) * 0.25);
        f.setVelocityY(f.body.velocity.y + Math.sign(this.arrow.y - f.y) * 0.15);
      }
      if (!f.abilityUsed && Math.abs(f.x - this.arrow.x) < 260 && Math.abs(f.y - this.arrow.y) < 140) this.useFairyAbility(f);
    });

    if (this.arrow.x > this.finishLine + 100) this.endLevel('secret');
    if (this.arrow.y > this.cameras.main.height - 70) this.endLevel('fail', { displayName: 'Земля', obstacleType: 'static' });

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
    } else if (qDown && !eDown && Phaser.Input.Keyboard.JustDown(this.keyQ) && this.boostState.shieldCharges > 0 && this.boostState.shieldTimer <= 0) {
      this.boostState.shieldCharges--;
      this.boostState.shieldTimer = 2000;
      this.arrow.hasShield = true;
      this.arrow.setTint(0x3498DB);
    } else if (eDown && !qDown && Phaser.Input.Keyboard.JustDown(this.keyE) && this.boostState.dashCharges > 0) {
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
        this.time.delayedCall(1200, () => { this.cameras.main.fadeIn(400); this.arrow.isBlinded = false; });
        break;
      case 'freeze':
        this.showMessage(`${name}: «Замри!»`);
        this.arrow.isFrozen = true;
        this.arrow.setTint(0x87CEEB);
        this.time.delayedCall(1100, () => { this.arrow.isFrozen = false; if (!this.arrow.hasShield) this.arrow.clearTint(); });
        break;
      case 'spawn':
        this.showMessage(`${name}: «Деревья, растите!»`);
        for (let i = 0; i < 3; i++) {
          const tx = this.arrow.x + 180 + i * 70;
          const ty = this.cameras.main.height - 100 - Phaser.Math.Between(0, 60);
          const tree = this.statics.create(tx, ty, 'tree');
          tree.setScale(1.1);
          tree.setOrigin(0.5, 1);
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

    if (result === 'success' && !window.gameState.completedLevels.includes(this.level)) {
      window.gameState.completedLevels.push(this.level);
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
    this.time.delayedCall(2200, () => { if (this.msgText) this.msgText.destroy(); });
  }
}
