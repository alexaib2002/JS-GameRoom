class SpaceInvaders extends Game {

	static BG = 30;

	constructor(size) {
		super(size);

		this.initBullets();
		this.initShip();
		this.initEnemies();
		this.updateScreen = true;
	}

	show() {
		background(SpaceInvaders.BG);
		this.ship.show();
		for (let enemy of this.enemies) {
			enemy.show();
		}
		for (let bullet of this.bullets) {
			bullet.show();
		}
		super.show();
	}

	initBullets() {
		Bullet.SIZE = new p5.Vector(8, 20);

		this.bullets = [];
	}

	initShip() {
		Ship.SIZE = new p5.Vector(50, 50);

		let offsetV = this.size.y / 50;
		let shipPos = new p5.Vector((this.size.x - Ship.SIZE.x) / 2, this.size.y - offsetV - Ship.SIZE.y);
		this.ship = new Ship(shipPos, 0);
	}

	initEnemies() {
		this.enemies = [];
		let basicSize = new p5.Vector(50, 50);

		let enemies = ["Beholder", "Emissary", "basic1", "basic2", "basic3", "basic4", "basic5"]

		for (let j = 0; j < 3; j++) {
			for (let i = 0; i < enemies.length; i++) {
				this.enemies.push(new BasicEnemy(
					new p5.Vector(-100, 0),
					basicSize.copy(),
					enemies[i % enemies.length]
					// enemies[2]
				));
				this.addAnimation(new EnemySpawnAnimation(
					this.enemies[j * enemies.length + i],
					new p5.Vector(this.size.x / 4 * (0.8 + 0.4 * i), this.size.y / 4 * (0.4 + 0.4 * j)),
					j * enemies.length + i
				));
			}
		}
	}

	tick() {
		super.tick();
		if (keyIsDown(LEFT_ARROW) || keyIsDown(65))
			this.moveShip(-1, 0);
		if (keyIsDown(RIGHT_ARROW) || keyIsDown(68))
			this.moveShip(1, 0);
		if (keyIsDown(UP_ARROW) || keyIsDown(87))
			this.moveShip(0, -1);
		if (keyIsDown(DOWN_ARROW) || keyIsDown(83))
			this.moveShip(0, 1);
		if (keyIsDown(32))
			this.fire();

		this.ship.tick();
		let bullet;
		for (let i = 0; i < this.bullets.length; i++) {
			bullet = this.bullets[i];
			bullet.move();
			this.updateScreen = true;
		}
		this.checkCollisions();

		if (this.updateScreen || this.animations.length > 0) {
			this.show();
			this.updateScreen = false;
		}
	}

	keypress(keyCode) {
		super.keypress(keyCode);
		if (keyCode === LEFT_ARROW || keyCode === 65)
			this.moveShip(-1, 0);
		if (keyCode === RIGHT_ARROW || keyCode === 68)
			this.moveShip(1, 0);
		if (keyCode === UP_ARROW || keyCode === 87)
			this.moveShip(0, -1);
		if (keyCode === DOWN_ARROW || keyCode === 83)
			this.moveShip(0, 1);
		this.updateScreen = true;
	}

	checkCollisions() {
		let bullet;
		for (let i = 0, j; i < this.bullets.length; i++) {
			bullet = this.bullets[i];
			if (bullet.outOfBounds(this.size)) {
				this.destroyBullet(...this.bullets.splice(i--, 1));
				continue;
			}
			for (j = 0; j < this.enemies.length; j++) {
				if (bullet.collides(this.enemies[j])) {
					this.enemies[j].destroy();
					this.enemies.splice(j--, 1);
					this.destroyBullet(...this.bullets.splice(i--, 1));
					break;
				}
			}
		}

		// TODO check collisions with ship

		// for (let j = 0, enemy; j < this.enemies.length; j++) {
		// 	enemy = this.enemies[j];
		// 	if (enemy.collides(this.ship)) {
		// 		this.enemies[j].destroy();
		// 		this.enemies.splice(j--, 1);
		// 		// TODO
		// 		continue;
		// 	}
		// }
	}

	destroyBullet(bullet) {
		bullet.destroy();
		if (bullet instanceof PlayerBullet)
			this.ship.bulletDestroyed();
	}

	moveShip(x, y) {
		if (!this.ship.canMove(x, y, this.size))
			return;
		this.ship.move(x, y);
		this.updateScreen = true;
	}

	fire() {
		if (this.ship.canFire()) {
			let bullet = this.ship.fire();
			this.bullets.push(bullet);
			this.updateScreen = true;
		}
	}
}