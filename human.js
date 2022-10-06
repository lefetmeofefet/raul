import Vector from "./vector.js";

class Human {
    constructor(position, radius, velocity, color) {
        this.radius = radius;
        this.velocity = velocity;
        this.susceptible = true;

        this.graphics = new PIXI.Graphics();
        this.graphics.lineStyle(0);
        this.graphics.beginFill(0xffffff, 0.7);
        this.graphics.drawCircle(0, 0, radius);
        this.graphics.endFill();

        this.graphics.beginFill(0xffffff, 0.3);
        this.graphics.drawCircle(0, 0, radius + 0.3);
        this.graphics.endFill();

        this.graphics.beginFill(0xffffff, 0.2);
        this.graphics.drawCircle(0, 0, radius + 0.6);
        this.graphics.endFill();

        this.color = color;
        this.graphics.tint = this.color

        app.stage.addChild(this.graphics);

        this.setPosition(position)
    }

    move(simulationDimensions) {
        let newPosition = Vector.Add(this.position, this.velocity);
        if (newPosition.x - this.radius < simulationDimensions.x) {
            newPosition.x = simulationDimensions.x + this.radius;
            this.velocity.x *= -1
        }
        if (newPosition.x + this.radius > simulationDimensions.x + simulationDimensions.width) {
            newPosition.x = simulationDimensions.x + simulationDimensions.width - this.radius;
            this.velocity.x *= -1
        }
        if (newPosition.y - this.radius < simulationDimensions.y) {
            newPosition.y = simulationDimensions.y + this.radius;
            this.velocity.y *= -1
        }
        if (newPosition.y + this.radius > simulationDimensions.y + simulationDimensions.height) {
            newPosition.y = simulationDimensions.y + simulationDimensions.height - this.radius;
            this.velocity.y *= -1
        }

        this.setPosition(newPosition);
    }

    setPosition(position) {
        this.position = position

        this.graphics.position.x = position.x
        this.graphics.position.y = position.y
    }

    infect(variant, frame) {
        window.Simulation.numSusceptible -= 1
        variant.numIncubating += 1
        this.susceptible = false
        this.variant = variant
        this.infectionFrame = frame
        this.graphics.tint = variant.colorInt;

        this.incubating = true
        this.infectious = false
        this.immune = false
    }

    // Starts infectiousness
    finishIncubation() {
        this.variant.numIncubating -= 1
        this.variant.numInfectious += 1
        this.incubating = false
        this.infectious = true
    }

    // Starts immunity
    finishInfectiousness(immuneColor) {
        this.variant.numInfectious -= 1
        window.Simulation.numImmune += 1
        this.infectious = false
        this.immune = true
        this.graphics.tint = immuneColor;
    }

    // Starts susceptibility
    finishImmunity() {
        window.Simulation.numImmune -= 1
        window.Simulation.numSusceptible += 1
        this.immune = false
        this.susceptible = true
        this.variant = null
        this.infectionFrame = null
        this.graphics.tint = this.color;
    }
}

export {Human}