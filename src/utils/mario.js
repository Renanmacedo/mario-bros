export default function mario() {
    return {
      id: "mario",
      require: ["body", "area", "sprite", "bump"],
      smallAnimation: "Running",
      bigAnimation: "RunningBig",
      smallStopFrame: 0,
      bigStopFrame: 8,
      smallJumpFrame: 5,
      bigJumpFrame: 13,
      isBig: false,
      isFrozen: false,
      isAlive: true,
      update() {
        if (this.isFrozen) {
          this.standing();
          return;
        }

        if (!this.grounded()) {
          this.jumping();
        } else {
          if (keyIsDown("left") || keyIsDown("right")) {
            this.running();
          } else if(isKeyDown('down')){
            this.lower()
          }else {
			this.standing();
		  }
        }
      },
      bigger() {
        this.isBig = true;
        this.area.width = 24;
        this.area.height = 32;
      },
      smaller() {
        this.isBig = false;
        this.area.width = 16;
        this.area.height = 16;
      },
      standing() {
        this.stop();
        this.frame = this.isBig ? this.bigStopFrame : this.smallStopFrame;
      },
      jumping() {
        this.stop();
        this.frame = this.isBig ? this.bigJumpFrame : this.smallJumpFrame;
      },
      running() {
        const animation = this.isBig ? this.bigAnimation : this.smallAnimation;
        if (this.curAnim() !== animation) {
          this.play(animation);
        }
      },
	  lower() {
		  this.stop();
		  if(this.isBig) {
			  this.frame = 14;
		  }
	  },
      freeze() {
        this.isFrozen = true;
      },
      die() {
        this.unuse("body");
        this.bump();
        this.isAlive = false;
        this.freeze();
        this.use(lifespan(5, { fade: .8 }));
      }
    }
  }