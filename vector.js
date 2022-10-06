class Vector {
    static Add(v1, v2) {
        return v1.plus(v2);
    }

    static Plus(v1, v2) {
        return {
            x: v1.x + v2.x,
            y: v1.y + v2.y
        }
    }

    static Substract(v1, v2) {
        return v1.minus(v2);
    }

    static Angle(v1, v2) {
        return v1.angle(v2);
    }

    static Distance(v1, v2) {
        return Math.sqrt((v1.x - v2.x) * (v1.x - v2.x) + (v1.y - v2.y) * (v1.y - v2.y));
    }

    static Minus(v1, v2) {
        return new Vector(v1.x - v2.x, v1.y - v2.y)
    }

    static Magnitude(v) {
        return Math.sqrt(v.x * v.x + v.y * v.y);
    }

    constructor(x, y) {
        this.set(x, y)
    }

    set(x, y) {
        if (x != null && y != null) {
            this.x = x;
            this.y = y;
        }
        else {
            this.x = 0;
            this.y = 0;
        }
    }

    plus(v) {
        return new Vector(this.x + v.x, this.y + v.y);
    }

    minus(v) {
        return new Vector(this.x - v.x, this.y - v.y);
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
    }

    multiply(n) {
        return new Vector(this.x * n, this.y * n);
    }

    direction() {
        return Math.atan2(this.y, this.x);
    }

    angle(v) {
        return this.minus(v).direction();
    }

    rotated(angleDelta) {
        let newDirection = this.direction() + angleDelta;
        let magnitude = this.magnitude();
        return new Vector(Math.cos(newDirection) * magnitude, Math.sin(newDirection) * magnitude);
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    distance(v) {
        return this.minus(v).magnitude();
    }

    normalized() {
        const direction = this.direction();
        return new Vector(Math.cos(direction), Math.sin(direction));
    }

    setMagnitude(magnitude) {
        const direction = this.direction();
        this.x = Math.cos(direction) * magnitude;
        this.y = Math.sin(direction) * magnitude;
    }

    resized(magnitude) {
        const direction = this.direction();
        return new Vector(Math.cos(direction) * magnitude, Math.sin(direction) * magnitude);
    }

    normalize() {
        this.setMagnitude(1)
    }
}


export default Vector