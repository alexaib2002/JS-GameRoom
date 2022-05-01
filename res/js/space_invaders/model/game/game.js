class Game {
	constructor(size) {
		this._size = size;
		this.animations = [];
	}

	show() {
		for (let i = 0; i < this.animations.length; i++) {
			this.animations[i].show();
			if (this.animations[i].ended()) {
				this.animations[i].destroy();
				this.animations.splice(i--, 1);
			}
			else if (this.animations[i].obj.destroyed) {
				this.animations[i].destroy();
				this.animations.splice(i--, 1);
			}
		}
	}

	addAnimation(animation) {
		if (!animation instanceof SpcInvAnimation)
			throw new Error("Animation must be an instance of Animation");
		this.animations.push(animation);
	}

	get size() {
		return this._size;
	}

	tick() {
		for (let animation of this.animations) {
			animation.tick();
		}
	}

	keypress(keyCode) {
		// console.log("Pressed: " + keyCode);
	}
}