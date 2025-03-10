class FluidHashGrid {
    constructor(cellSize, ir) {
        this.cellSize = cellSize;
        this.hashMap = new Map();
        this.hashMapSize = 10_000_000;
        this.prime1 = 73856093;
        this.prime2 = 19349663;
        this.particles = [];
        this.INTERACTION_RADIUS = ir;
    }

    initialize(particles) {
        this.particles = particles;
    }

    clearGrid() {
        this.hashMap.clear();
    }

    getHashIdFromPos(pos) {
        let x = pos.x / this.cellSize | 0;
        let y = pos.y / this.cellSize | 0;
        return this.gridIndexToHash(x, y);
    }

    gridIndexToHash(x, y) {
        let hash = ((x * this.prime1) ^ (y * this.prime2)) % this.hashMapSize;
        return hash < 0 ? hash + this.hashMapSize : hash;
    }

    getNeighbourOfParticleIdx(i) {
        let neighbours = [];
        let pos = this.particles[i].pos;

        let particleGridx = pos.x / this.cellSize | 0;
        let particleGridy = pos.y / this.cellSize | 0;
        
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                let hash = this.gridIndexToHash(particleGridx + dx, particleGridy + dy);
                let content = this.hashMap.get(hash);
                if (content) {
                    neighbours.push(...content);
                }
            }
        }

        return neighbours;
    }

    getDistance(pos1, pos2) {
        let dx = pos1.x - pos2.x;
        let dy = pos1.y - pos2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }


    mapParticleToCell() {
        for (let i = 0; i < this.particles.length; i++) {
            let pos = this.particles[i].pos;
            let hash = this.getHashIdFromPos(pos);
            let cell = this.hashMap.get(hash);
            if (!cell) {
                cell = [];
                this.hashMap.set(hash, cell);
            }
            cell.push(this.particles[i]);
        }
    }

    drawGrid(ctx) {
        ctx.strokeStyle = "rgba(255,255,255,0.2)";
        ctx.lineWidth = 1;
        ctx.beginPath();

        for (let particles of this.hashMap.values()) {
            if (particles.length === 0) continue;
            let sampleParticle = particles[0];
            let x = (sampleParticle.pos.x / this.cellSize | 0) * this.cellSize;
            let y = (sampleParticle.pos.y / this.cellSize | 0) * this.cellSize;

            ctx.rect(x, y, this.cellSize, this.cellSize);
        }

        ctx.stroke();
    }
}
