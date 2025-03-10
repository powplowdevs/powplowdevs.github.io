class Playground {
    constructor(){
        
        this.simulation = new Simulation();
        this.mousePos = Vector2.zero();
    }
    
    update(dt){
        this.simulation.update(.7);
    }

    draw(){
        this.simulation.draw();
    }

    onMouseMove(pos){
        //pos.log();
        this.mousePos = pos;
        this.simulation.mousePos = pos;
    }

    onMouseDown(button){
        console.log("Moue button pressed: " + button)
    }

    onMouseUp(button){
        console.log("Moue button released: " + button)
    }

    startSpout(){
        this.simulation.startSpout();
    }
}