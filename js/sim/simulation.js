class Simulation{
    constructor(){
        this.particles = [];
        this.particleEmitters = [];
        this.GRAVITY = new Vector2(0,1)
        this.mousePos = Vector2.zero();

        this.REST_DENSITY = 5;
        this.K_NEAR = 5;
        this.K = 0.15;
        this.INTERACTION_RADIUS = 45;
        this.MAX_VELOCITY = 50;

        this.AMT_PARTICLES = 4000;
        this.PARTICLES_SIZE = 2.5;
        this.POS_OFFSET = new Vector2(100,1000)
        this.OFFSET = 20;

        this.VEL_DAMPING = .99;

        this.SIGMA = 0.5;
        this.BETA = 0.1;

        this.fluidHashGrid = new FluidHashGrid(45, this.INTERACTION_RADIUS*2);
        this.fluidHashGrid.initialize(this.particles);

        this.TRAPDOOR_OPEN = false;
        this.TRAPDOOR_POS = new Vector2(canvas.width - 95, canvas.height - 35);
        this.TRAPDOOR_SIZE = new Vector2(80, 20);
        this.TRAPDOORTIMEOPEN = 20000
        this.TRAPDOORTIMECLOSED = 95000
        this.lastToggleTime = performance.now();
        this.lastTrapdoorTime = performance.now();
        this.trapdoorStateDuration = this.TRAPDOORTIMEOPEN;

        this.emitter = this.createParicleEmitter(
            new Vector2(250, 50), //pos
            new Vector2(0,1), //direction
            45, //size
            2, //speed
            5, //amt
            15, //vel min
            35 //vel max
        );

        // FPS variables
        this.lastTime = 0;
        this.frameCount = 0;
        this.fps = 0;

        this.totalCalculations = 0;
        this.calculationsPerParticle = 0;

        this.mouseParticle = new Particle(new Vector2(0, 0), this.PARTICLES_SIZE*10);
        this.mouseParticle.color = "#80808080";
        this.particles.push(this.mouseParticle);
        this.MOUSE_IR = 3;

        this.debugTimings = {};

        this.instantiateparticles();

        
    }

    createParicleEmitter(pos, direction, size, spawnInterval, amt, velMin, velMax){
        let emitter = new ParticleEmitter(pos, direction, size, spawnInterval, amt, velMin, velMax)
        this.particleEmitters.push(emitter);
        return emitter;
    }

    calculateParticleDensity() {
        const totalArea = canvas.width * canvas.height;
        const numParticles = this.particles.length;
        return numParticles / totalArea;
    }

    startSpout(){
        this.emitter.setState(true);
    }

    instantiateparticles(){
        for(let x=0; x < Math.sqrt(this.AMT_PARTICLES); x++){
            for(let y=0; y < Math.sqrt(this.AMT_PARTICLES); y++){
                let pos = new Vector2(x*this.OFFSET+this.POS_OFFSET.x,y*this.OFFSET+this.POS_OFFSET.y);
                let particle = new Particle(pos, this.PARTICLES_SIZE);
                this.particles.push(particle);
            }
        }

        
    }
    
    neighbourSearch(){
        this.fluidHashGrid.clearGrid();
        this.fluidHashGrid.mapParticleToCell();
    
        for (let i = 0; i < this.particles.length; i++){
            let particle = this.particles[i];
            let neighbours = this.fluidHashGrid.getNeighbourOfParticleIdx(i);
            
            let density = neighbours.length;
            let speed = particle.vel.length();
            const maxDensity = 50; 
            const maxSpeed = this.MAX_VELOCITY;
    
            let normDensity = Math.min(density / maxDensity, 1);
            let normSpeed = Math.min(speed / maxSpeed, 1);
    
            let weight = (normDensity + normSpeed) / 2;
    
            particle.color = this.interpolateColor({r:0, g:0, b:255}, {r:255, g:0, b:0}, weight);
        }
    }
    
    interpolateColor(color1, color2, t){
        let r = Math.round(color1.r + (color2.r - color1.r) * t);
        let g = Math.round(color1.g + (color2.g - color1.g) * t);
        let b = Math.round(color1.b + (color2.b - color1.b) * t);
        return `rgb(${r}, ${g}, ${b})`;
    }

    getColorFromHash(hash) {
        const hue = hash % 360;
        return `hsl(${hue}, 100%, 50%)`;
    }

    update(dt){
        this.mouseParticle.pos = this.mousePos.copy();
        this.totalCalculations = 0;
        let startTime, elapsed;

        if(!this.TRAPDOOR_OPEN) {
            startTime = performance.now();
            this.emitter.spawn(dt, this.particles, this.PARTICLES_SIZE);
            this.emitter.AMT_PARTICLES = 0;
            elapsed = performance.now() - startTime;
            this.debugTimings.emitterSpawn = elapsed;
        }

        // Gravity
        startTime = performance.now();
        this.applyGravity(dt);
        this.debugTimings.gravity = performance.now() - startTime;

        // Viscosity
        startTime = performance.now();
        this.viscosity(dt);
        this.debugTimings.viscosity = performance.now() - startTime;

        // Predict positions
        startTime = performance.now();
        this.predictPositions(dt);
        this.debugTimings.predictPositions = performance.now() - startTime;

        // Neighbour search
        startTime = performance.now();
        this.neighbourSearch();
        this.debugTimings.neighbourSearch = performance.now() - startTime;

        // Double Density Relaxation (DDR)
        startTime = performance.now();
        this.doubleDensityRelaxation(dt);
        this.debugTimings.ddr = performance.now() - startTime;

        // World boundaries
        startTime = performance.now();
        this.worldBound();
        this.debugTimings.worldBound = performance.now() - startTime;

        // Compute next velocity
        startTime = performance.now();
        this.computeNextVelocity(dt);
        this.debugTimings.computeNextVelocity = performance.now() - startTime;

        // Trapdoor check
        startTime = performance.now();
        this.checkTrapdoor();
        this.debugTimings.checkTrapdoor = performance.now() - startTime;
        
        // FPS calculation
        this.frameCount++;
        let currentTime = performance.now();
        if (currentTime - this.lastTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastTime = currentTime;
        }

        this.calculationsPerParticle = this.totalCalculations / this.particles.length;
        this.mouseParticle.pos = add(this.mousePos.copy(), new Vector2(0, this.MOUSE_IR));
    }


    viscosity(dt) {
        for (let i = 0; i < this.particles.length; i++) {
            let particleA = this.particles[i];
            let neighbours = this.fluidHashGrid.getNeighbourOfParticleIdx(i);
            this.totalCalculations += neighbours.length;
    
            let ir = (particleA === this.mouseParticle) ? this.INTERACTION_RADIUS * this.MOUSE_IR : this.INTERACTION_RADIUS;
    
            for (let j = 0; j < neighbours.length; j++) {
                let particleB = neighbours[j];
                if (particleA === particleB) continue;
    
                let rij = sub(particleB.pos, particleA.pos);
                let distSquared = rij.lengthSquared();
                if (distSquared >= ir * ir) continue;
    
                let q = Math.sqrt(distSquared) / ir;
                let velDiff = sub(particleA.vel, particleB.vel);
    
                if (q < 1) {
                    //rij.normalize();
                    let len = Math.sqrt(distSquared);
                    let invLen = len > 0 ? 1 / len : 0;
                    rij.x *= invLen;
                    rij.y *= invLen;
                    let u = velDiff.dot(rij);
                    if (u > 0) {
                        let impulseTerm = dt * (1 - q) * (this.SIGMA * u + this.BETA * u * u);
                        let impulse = scale(rij, impulseTerm);
    
                        if (particleA !== this.mouseParticle) {
                            particleA.vel = this.clampVelocity(sub(particleA.vel, scale(impulse, 0.5)));
                        }
                        if (particleB !== this.mouseParticle) {
                            particleB.vel = this.clampVelocity(add(particleB.vel, scale(impulse, 0.5)));
                        }
                    }
                }
            }
        }
    }
    
    doubleDensityRelaxation(dt){
        let totalFirstLoopTime = 0;
        let totalPressureTime = 0;
        let totalSecondLoopTime = 0;
        let numParticles = this.particles.length;

        for (let i = 0; i < numParticles; i++) {
            let density = 0;
            let densityNear = 0;
            let neighbours = this.fluidHashGrid.getNeighbourOfParticleIdx(i);
            let particleA = this.particles[i];

            let ir = this.INTERACTION_RADIUS;
            if (particleA === this.mouseParticle) {
                ir = this.INTERACTION_RADIUS * this.MOUSE_IR;
            }

            this.totalCalculations += neighbours.length;

            let storedNeighbours = [];

            let startFirstLoop = performance.now();
            for (let j = 0; j < neighbours.length; j++) {
                let particleB = neighbours[j];
                if (particleA === particleB) continue;

                let rij = sub(particleB.pos, particleA.pos);
                let r = rij.length();
                let q = r / ir;

                if (q < 1) {
                    let oneMinusQ = 1 - q;
                    density += oneMinusQ * oneMinusQ;
                    densityNear += oneMinusQ * oneMinusQ * oneMinusQ;

                    storedNeighbours.push({
                        particleB: particleB,
                        rij: rij,
                        q: q,
                        oneMinusQ: oneMinusQ
                    });
                }
            }
            totalFirstLoopTime += performance.now() - startFirstLoop;

            let startPressure = performance.now();
            let pressure = this.K * (density - this.REST_DENSITY);
            let pressureNear = this.K_NEAR * densityNear;
            totalPressureTime += performance.now() - startPressure;

            let startSecondLoop = performance.now();
            let particleADisplacement = Vector2.zero();
            for (let j = 0; j < storedNeighbours.length; j++) {
                let { particleB, rij, oneMinusQ } = storedNeighbours[j];

                let normalizedRij = rij.copy();
                normalizedRij.normalize();

                let displacementTerm = Math.pow(dt, 2) * (pressure * oneMinusQ + pressureNear * oneMinusQ * oneMinusQ);
                let D = scale(normalizedRij, displacementTerm);

                particleB.pos = add(particleB.pos, scale(D, 0.5));
                particleADisplacement = sub(particleADisplacement, scale(D, 0.5));
            }
            totalSecondLoopTime += performance.now() - startSecondLoop;

            if (particleA !== this.mouseParticle) {
                particleA.pos = add(particleA.pos, particleADisplacement);
            }
        }

    this.debugTimings.ddrFirstLoop = totalFirstLoopTime;
    this.debugTimings.ddrPressure = totalPressureTime;
    this.debugTimings.ddrSecondLoop = totalSecondLoopTime;
    }   
 
    clampVelocity(vel) {
        vel.x = Math.max(-this.MAX_VELOCITY, Math.min(this.MAX_VELOCITY, vel.x));
        vel.y = Math.max(-this.MAX_VELOCITY, Math.min(this.MAX_VELOCITY, vel.y));
        return vel;
    }

    applyGravity(dt) {
        for (let i = 0; i < this.particles.length; i++) {
            
            this.particles[i].vel = this.clampVelocity(add(this.particles[i].vel, scale(this.GRAVITY, dt)));
            
        }
    }
    
    predictPositions(dt) {
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].prevPos = this.particles[i].pos.copy();
            let posDelta = scale(this.particles[i].vel, dt * this.VEL_DAMPING);
            this.particles[i].pos = add(this.particles[i].pos, posDelta);
        }
    }
    
    computeNextVelocity(dt) {
        for (let i = 0; i < this.particles.length; i++) {
            let vel = scale(sub(this.particles[i].pos, this.particles[i].prevPos), 1 / dt);
            this.particles[i].vel = this.clampVelocity(vel);
        }
    }

    worldBound() {
        for (let i = 0; i < this.particles.length; i++) {
            let pos = this.particles[i].pos;
            if(this.particles[i] == this.mouseParticle) continue;

            if (pos.y > canvas.height + 100 || pos.y < -100 || pos.x > canvas.width + 100 || pos.x < -100) {
                this.particles.splice(i, 1);
                i--;
                console.log("kill")
                continue;
            }            

            if (pos.x < 0) {
                this.particles[i].pos.x = 0 + this.PARTICLES_SIZE;
                this.particles[i].vel.x *= -1;
            }
    
            if (pos.y < 0) {
                this.particles[i].pos.y = 0 + this.PARTICLES_SIZE;
                this.particles[i].vel.y *= -1;
            }

            if (this.TRAPDOOR_OPEN && pos.x > canvas.width - 300) {
                continue;
            }
            else if (pos.x > canvas.width) {
                this.particles[i].pos.x = canvas.width - this.PARTICLES_SIZE;
                this.particles[i].vel.x *= 0;
            }

            if (pos.y > canvas.height) {
                this.particles[i].pos.y = canvas.height - this.PARTICLES_SIZE;
                this.particles[i].vel.y *= -1;
            }
           

        }
    }
    
    checkTrapdoor() {
        let currentTime = performance.now();
        if (currentTime - this.lastTrapdoorTime > this.trapdoorStateDuration) {
            this.TRAPDOOR_OPEN = !this.TRAPDOOR_OPEN;
            this.lastTrapdoorTime = currentTime;
            this.trapdoorStateDuration = this.TRAPDOOR_OPEN ? this.TRAPDOORTIMEOPEN : this.TRAPDOORTIMECLOSED;
        }
    }

    
    draw(){
        for(let i=0; i < this.particles.length; i++){
            drawUtils.drawPoint(this.particles[i].pos, this.particles[i].size, this.particles[i].color);
        }
        for(let i=0; i < this.particleEmitters.length; i++){
            this.particleEmitters[i].draw();
        }   

        let trapdoorColor = this.TRAPDOOR_OPEN ? "red" : "green";
        drawUtils.drawRect(this.TRAPDOOR_POS, this.TRAPDOOR_SIZE, trapdoorColor);

        //this.fluidHashGrid.drawGrid(ctx);
        
        // drawUtils.drawText(new Vector2(10, 20), 20, "white", `MPOS: ${this.mouseParticle.pos.x} ${this.mouseParticle.pos.y} vel: ${this.mouseParticle.vel.x} ${this.mouseParticle.vel.y}`);
        // let canvasHeight = canvas.height;
        // let startY = canvasHeight - 200;
        
        // drawUtils.drawText(new Vector2(10, startY), 20, "white", `FPS: ${this.fps}`);
        // drawUtils.drawText(new Vector2(10, startY + 20), 20, "white", `AMT: ${this.particles.length}`);
        // drawUtils.drawText(new Vector2(10, startY + 40), 20, "white", `Calc: ${this.totalCalculations}`);
        // drawUtils.drawText(new Vector2(10, startY + 60), 20, "white", `Calc/Particle: ${this.calculationsPerParticle.toFixed(2)}`);
        // drawUtils.drawText(new Vector2(10, startY + 80), 20, "white", `pos: ${this.mousePos.x}, ${this.mousePos.y}`);
        
        // let timingY = startY - 280;
        // if (this.debugTimings) {
        //     let offset = 0;
        //     for (let key in this.debugTimings) {
        //         let timeVal = this.debugTimings[key];
        //         drawUtils.drawText(new Vector2(10, timingY + offset), 20, "white", `${key}: ${timeVal.toFixed(2)} ms`);
        //         offset += 20;
        //     }
        // }
        

    }
}
