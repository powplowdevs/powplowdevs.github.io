class ParticleEmitter{
    constructor(pos, direction, size, spawnInterval, amt, velMin, velMax){
        this.pos = pos;
        this.direction = direction;
        this.size = size;
        this.spawnInterval = spawnInterval;
        this.amt = amt;
        this.velMin = velMin;
        this.velMax = velMax;
        this.state = false;

        this.time = 0;   
    }

    spawn(dt, particles, size){
        if(!this.state) return;
        let offset = (this.size*2) / this.amt;
        this.time += dt;

        if(this.time > this.spawnInterval){
            this.time = 0;

            for(let i=0; i<this.amt; i++){
                let normal = this.direction.getNormal();
                normal.normalize();
                let plane = scale(normal, -this.size);
                let planeStart = add(this.pos, plane);
                let pos = add(planeStart, scale(normal, offset*i));

                let particle = new Particle(pos, size);
                let normalizedDirection = this.direction.copy();
                normalizedDirection.normalize();

                particle.vel = scale(normalizedDirection, Math.floor(Math.random() * (this.velMax - this.velMin + 1)) + this.velMin);
                particles.push(particle);


            }
        }
    }

    draw(){
        let dir = this.direction.copy();
        dir.normalize();
        //drawUtils.drawLine(this.pos, add(this.pos, scale(dir, 30)), "orange", 5);

        //Spawning
        let normal = dir.getNormal();
        let plane = scale(normal, -this.size);
        let planeStart = add(this.pos, plane);
        let planeEnd = sub(this.pos, plane);

        drawUtils.drawLine(planeStart, planeEnd, "orange");
        let offset = (this.size*2) / this.amt;
        for(let i=0; i<this.amt; i++){
            let circlePos = add(planeStart, scale(normal, offset*i));
            drawUtils.drawPoint(circlePos, 5, "orange");
        }
    }

    setState(s){
        this.state = s;
    }

}