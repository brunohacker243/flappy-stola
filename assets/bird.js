class Bird {
    constructor(x,y,width,height,birdAnim) {
        //this.body = Bodies.rectangle(x,y,width,height);
        // this.x = x;
        // this.y = y;
        this.body = Bodies.rectangle(x,y,width,height);
        this.width = width;
        this.height = height;
        this.animation = birdAnim;
        this.speed = 0.05;
        
        World.add(world,this.body);
    }
    show() {
        let pos = this.body.position;
        let index = floor(this.speed % this.animation.length);
        let angle = this.body.angle;
        // fill("yellow");
        // stroke("black");
        // strokeWeight(2);
        push();
        translate(pos.x,pos.y);
        rotate(angle);
        imageMode(CENTER);
        image(this.animation[index],0,0,this.width,this.height);
        pop();
    }
    
    fly() {
        Matter.Body.setVelocity(this.body,{x:0,y:-0.08});
        Matter.Body.applyForce(this.body,this.body.position,{x:0,y:-0.08});
    }
    animate() {
        this.speed += 0.25;
    }
}
