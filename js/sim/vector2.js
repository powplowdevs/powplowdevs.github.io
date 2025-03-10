class Vector2{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }

    normalize(){
        let length = this.length();
        this.x /= length;
        this.y /= length;
    }

    length(){
        return Math.sqrt(this.x*this.x + this.y*this.y);
    }
    
    lengthSquared() {
        return this.x * this.x + this.y * this.y;
    }

    getNormal(){
        return new Vector2(this.y, -this.x);
    }

    dot(vec){
        return this.x * vec.x + this.y * vec.y;
    }

    log(){
        console.log("Vector2: ", this.x, this.y);
    }

    copy(){
        return new Vector2(this.x, this.y);
    }

    static zero(){
        return new Vector2(0,0);
    }
}

function add(vecA, vecB){
    return new Vector2(vecA.x + vecB.x, vecA.y + vecB.y)
}

function sub(vecA, vecB){
    return new Vector2(vecA.x - vecB.x, vecA.y - vecB.y)
}

function scale(vec, scalar){
    return new Vector2(vec.x * scalar, vec.y * scalar);
}