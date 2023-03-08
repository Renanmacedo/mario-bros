export default function patrol(distance = 100, speed = 50, dir = 1, position = 'x') {
    return {
      id: "patrol",
      require: ["pos", "area",],
      startingPos: vec2(0, 0),
      add() {
        this.startingPos = this.pos;
        this.on("collide", (obj, side) => {
          if (side === "left" || side === "right") {
            dir = -dir;
          }
        });
      },
      update() {
        
        
        if (Math.abs(this.pos.x - this.startingPos.x) >= distance) {
           dir = -dir;
        }
        if(position == 'x') {
          this.move(speed * dir, 0);
        }else {
          this.move(0, speed * dir);
        }
        
        
      },
    };
  }