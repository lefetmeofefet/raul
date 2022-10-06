import {html,  createYoffeeElement} from "./libs/yoffee/yoffee.min.js"
import {Human} from "./human.js"
import Vector from "./vector.js";

let borderWidth = 2;
window.Simulation = {
    dimensions: {
        x: borderWidth,
        y: borderWidth,
        width: 500,
        height: 500
    },
    numHumans: 200,
    humanRadius: 6,
    humanVelocity: 2,
    variants: [{
        name: "Variant 1",
        infectionRate: 0.2,
        incubationDuration: 120,
        infectiousDuration: 300,
        immunityDuration: 300,
        numIncubating: 0,
        numInfectious: 0,
        color: "#ff0080",
        colorInt: 0xff0080
    }, {
        name: "Variant 2",
        infectionRate: 0.1,
        incubationDuration: 60,
        infectiousDuration: 300,
        immunityDuration: 300,
        numIncubating: 0,
        numInfectious: 0,
        color: "#ff8000",
        colorInt: 0xff8000
    }],

    frame: 0,
    avgContactsPerFrameElement: 0,
    numSusceptible: 0,
    numImmune: 0,
    susceptibleColor: "#666666",
    susceptibleColorInt: 0x666666,
    immuneColor: "#30ff03",
    immuneColorInt: 0x30ff03,
}

createYoffeeElement("infection-simulation", (props, self) => {

    self.onConnect = () => startSimulation()

    return html(Simulation)`
    <style>
        :host {
            display: flex;
            /*align-items: center;*/
            justify-content: center;
            height: -webkit-fill-available;
        }
        
        #graphics-container {
            padding-top: 20px;
        }
        
        #graph {
            background-color: #eeeeee;
            display: flex;
        }
        
        .graph-column {
            width: 3px;
            height: 100px;
            display: flex;
            flex-direction: column;
        }
        
        #side-view {
            padding: 20px;
            display: flex;
            flex-direction: column;
            width: 300px;
            min-width: 300px;
            font-size: 12px;
        }
    
        .category {
            margin-bottom: 30px;
            display: flex;
            flex-direction: column;
        }
    
        .category-name {
            font-size: 24px;
            opacity: 0.8;
            margin-bottom: 15px;
        }
    
        .category-body {
            display: flex;
            flex-direction: column;
        }
    
        .field {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }
    
        .field-name {
            margin-right: 7px;
            font-weight: bold;
            display: flex;
        }
        
        .field-value {
            display: flex;
        }
        
    </style>
    <div id="side-view">
        <div class="category">
            <div class="category-name">Simulation Constants</div>
            <div class="category-body">
                <div class="field">
                    <div class="field-name">FPS (Frames per second): </div>
                    <div class="field-value">60</div>
                </div>
                <div class="field">
                    <div class="field-name">Human radius: </div>
                    <div class="field-value">${Simulation.humanRadius}</div>
                </div>
                <div class="field">
                    <div class="field-name">Velocity: </div>
                    <div class="field-value">${Simulation.humanVelocity}</div>
                </div>
                ${() => Simulation.variants.map(variant => html()`
                <div class="field">
                    <div class="field-name">
                        <div style="margin-right: 3px; color: ${variant.color}">${variant.name}</div>
                        infection rate: 
                    </div>
                    <div class="field-value">${variant.infectionRate}</div>
                </div>
                <div class="field">
                    <div class="field-name">
                        <div style="margin-right: 3px; color: ${variant.color}">${variant.name}</div> 
                        incubation duration: 
                    </div>
                    <div class="field-value">${variant.incubationDuration}
                </div>
                </div>
                <div class="field">
                    <div class="field-name">
                        <div style="margin-right: 3px; color: ${variant.color}">${variant.name}</div>
                        infectious duration: 
                    </div>
                    <div class="field-value">${variant.infectiousDuration}</div>
                </div>
                <div class="field">
                    <div class="field-name">
                        <div style="margin-right: 3px; color: ${variant.color}">${variant.name}</div> 
                        immunity duration: 
                    </div>
                    <div class="field-value">${variant.immunityDuration}</div>
                </div>
                `)}
            </div>
        </div>


        <div class="category">
            <div class="category-name">Stats</div>
            <div class="category-body">
                <div class="field">
                    <div class="field-name">Avg. contacts per frame: </div>
                    <div class="field-value">${() => Simulation.avgContactsPerFrameElement.toString().substring(0, 5)}</div>
                </div>
                <div class="field">
                    <div class="field-name">Num susceptible: </div>
                    <div class="field-value">${() => Simulation.numSusceptible}</div>
                </div>
                <div class="field">
                    <div class="field-name">
                        Num 
                        <div style="margin-left: 3px; color: ${Simulation.immuneColor}">immune</div>
                        : 
                    </div>
                    <div class="field-value">${() => Simulation.numImmune}</div>
                </div>
                ${() => Simulation.variants.map(variant => html(variant)`
                <div class="field">
                    <div class="field-name">
                        Num infected 
                        <div style="margin-left: 3px; color: ${variant.color}">${variant.name}</div>
                        : 
                    </div>
                    <div class="field-value">
                        ${() => variant.numInfectious + variant.numIncubating}
                        <div style="margin-left: 3px">(${() => variant.numIncubating} incubating)</div>
                    </div>
                </div>
                `)}
                
            </div>
        </div>
    </div>
    <div id="graphics-container">
        <div id="simulation"></div>
        <div id="graph">
            
        </div>
    </div>
    `

    function startSimulation() {
        const app = new PIXI.Application({
            width: Simulation.dimensions.width + borderWidth * 2,
            height: Simulation.dimensions.height + borderWidth * 2,
            backgroundColor: 0xffffff,
        });

        window.app = app
        let simulationDiv = self.shadowRoot.querySelector("#simulation")
        simulationDiv.style.width = Simulation.dimensions.width + borderWidth * 2
        simulationDiv.style.height = Simulation.dimensions.height + borderWidth * 2
        simulationDiv.appendChild(app.view)

        createSimulationBorder(app)

        let pressedKeys = new Set();
        window.onkeyup = e => pressedKeys.delete(e.key)
        window.onkeydown = e => pressedKeys.add(e.key)


        let humans = new Array(Simulation.numHumans).fill(0).map(() => new Human(
            new Vector(
                Simulation.dimensions.x + Simulation.humanRadius + (Simulation.dimensions.width - 2 * Simulation.humanRadius) * Math.random(),
                Simulation.dimensions.y + Simulation.humanRadius + (Simulation.dimensions.height - 2 * Simulation.humanRadius) * Math.random()
            ),
            Simulation.humanRadius,
            new Vector(Simulation.humanVelocity, 0).rotated(Math.random() * 2 * Math.PI),
            Simulation.susceptibleColorInt
        ))
        Simulation.numSusceptible = Simulation.numHumans

        humans.forEach(h => {
            if (Math.random() < 0.1) {
                h.infect(Simulation.variants[Math.floor(Math.random() * Simulation.variants.length)], Simulation.frame)
            }
        })

        window.simulating = true

        let sumCollisions = 0
        app.ticker.add(() => {
            if (pressedKeys.has("ArrowLeft")) {
                app.stage.pivot.x -= 10
            }
            if (pressedKeys.has("ArrowRight")) {
                app.stage.pivot.x += 10
            }


            if (window.simulating) {
                Simulation.frame += 1;
                for (let human of humans) {
                    human.move(Simulation.dimensions)
                    if (!human.susceptible) {
                        if (human.incubating && Simulation.frame > human.infectionFrame + human.variant.incubationDuration) {
                            human.finishIncubation()
                        }
                        if (human.infectious && Simulation.frame > human.infectionFrame + human.variant.incubationDuration + human.variant.infectiousDuration) {
                            human.finishInfectiousness(Simulation.immuneColorInt)
                        }
                        if (human.immune && Simulation.frame > human.infectionFrame + human.variant.incubationDuration + human.variant.infectiousDuration + human.variant.immunityDuration) {
                            human.finishImmunity()
                        }
                    }
                }

                // Collision Detection
                let numCollisions = 0
                for (let i = 0; i < humans.length - 1; i += 1) {
                    for (let j = i + 1; j < humans.length; j += 1) {
                        if (humans[i].position.distance(humans[j].position) <= Simulation.humanRadius * 2) {
                            numCollisions += 1
                            let infectiousHuman = null;
                            let susceptibleHuman = null;
                            if (humans[i].infectious && humans[j].susceptible) {
                                infectiousHuman = humans[i]
                                susceptibleHuman = humans[j]
                            }
                            if (humans[j].infectious && humans[i].susceptible) {
                                infectiousHuman = humans[j]
                                susceptibleHuman = humans[i]
                            }
                            if (infectiousHuman != null && susceptibleHuman != null) {
                                if (Math.random() < infectiousHuman.variant.infectionRate) {
                                    susceptibleHuman.infect(infectiousHuman.variant, Simulation.frame)
                                }
                            }
                        }
                    }
                }
                sumCollisions += numCollisions
                Simulation.avgContactsPerFrameElement = sumCollisions / Simulation.frame

                if (Simulation.frame % 10 === 0) {
                    let newElement = document.createElement("div")
                    newElement.classList.add("graph-column")
                    newElement.innerHTML = `
                    <div class="graph-column">
                        <div class="bar susceptible-bar" style="flex: ${Simulation.numSusceptible}; background-color: ${Simulation.susceptibleColor};"></div>
                        <div class="bar immune-bar" style="flex: ${Simulation.numImmune}; background-color: ${Simulation.immuneColor};"></div>
                        ${Simulation.variants.map(variant => `
                        <div class="bar" style="flex: ${variant.numInfectious + variant.numIncubating}; background-color: ${variant.color};"></div>
                        `).join("\n")}
                    </div>
                    `
                    self.shadowRoot.querySelector("#graph").appendChild(newElement)
                }
            }
        });

        window.stop = () => {
            window.simulating = false;
        }

        window.onresize = () => {
            app.renderer.resize(window.innerWidth, window.innerHeight)
        }
    }

    function createSimulationBorder(app) {
        let floorGraphics = new PIXI.Graphics();
        floorGraphics.beginFill(0x000000);
        floorGraphics.drawRect(Simulation.dimensions.x, Simulation.dimensions.y, borderWidth, Simulation.dimensions.height);
        floorGraphics.endFill();

        floorGraphics.beginFill(0x000000);
        floorGraphics.drawRect(Simulation.dimensions.x, Simulation.dimensions.y, Simulation.dimensions.width, borderWidth);
        floorGraphics.endFill();

        floorGraphics.beginFill(0x000000);
        floorGraphics.drawRect(Simulation.dimensions.x + Simulation.dimensions.width, Simulation.dimensions.y, borderWidth, Simulation.dimensions.height);
        floorGraphics.endFill();

        floorGraphics.beginFill(0x000000);
        floorGraphics.drawRect(Simulation.dimensions.x, Simulation.dimensions.y + Simulation.dimensions.height, Simulation.dimensions.width, borderWidth);
        floorGraphics.endFill();

        app.stage.addChild(floorGraphics)
    }
})
