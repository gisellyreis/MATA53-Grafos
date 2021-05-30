let canvas;
let inputbox;
let labelbuffer;
let dropdownmenu;
let runbutton;
let clearbutton;
let warning;
let algoBox;
let oldgraph;
let ggraph;
const MS_PER_STEP = 500;
let multiplier = 1;
let oldp;
function setup() {
    ggraph = new graph();
    setcanvas();
    setsidebar();
    setAlgorithmBox();

    ellipseMode(RADIUS);
    frameRate(30);
    colorMode(HSL);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textFont("Courier New");
    textSize(20);
    oldp = {x: 500, y: 500};
}

function warn(message) {
    warning.innerHTML = message;
}

function draw() {
    background("#1f1f1f");

    // noFill(); stroke(100); strokeWeight(2);
    // arc(500, 500, 50, 10, Math.PI, 0);

    // let cx = 500;
    // let cy = 500;
    // let w = 100;
    // let h = 200;
    // for (let i = 0; i < 1 * Math.PI; i += 0.1) {
    //     ex = w * Math.cos(i);
    //     ey = h * Math.sin(i);
    //     push();
    //     // rotate(frameCount / 100);
    //     point(cx + ex, cy + ey);
    //     pop();
    // }
    // push();
    // rotate(frameCount / 100);
    // line(0, 0, 100, 0);
    // pop();

    // point(oldp.x, oldp.y);
    // let c = {x: 550, y: 500};
    // oldp = rotateonpoint(oldp, c, 0.1);

    if (!ggraph.locked) {
        if (ggraph.selectedelement == element.node) {
            inputbox.value = ggraph.nodes[ggraph.selectedindex].label;
        } else if (ggraph.selectedelement == element.edge) {
            inputbox.value = ggraph.edges[ggraph.selectedindex].label;
        } else {
            inputbox.value = "";
        }

        if (ggraph.selectedelement == element.node && mouseIsPressed) {
            stroke(0, 95, 60); strokeWeight(1);
            let dx = mouseX;
            let dy = mouseY;
            let nodemouseisin = -1;
            for (let i = ggraph.nodes.length - 1; i >= 0; i--) {
                if (ggraph.nodes[i].contains(mouseX, mouseY)) {
                    dx = ggraph.nodes[i].x;
                    dy = ggraph.nodes[i].y;
                    nodemouseisin = i;
                    break;
                }
            }
            if (keyIsDown(SHIFT)) {
                line(dx, dy, ggraph.nodes[ggraph.selectedindex].x, ggraph.nodes[ggraph.selectedindex].y);
            } else if (keyIsDown(CONTROL)) {
                line(dx, dy, ggraph.nodes[ggraph.selectedindex].x, ggraph.nodes[ggraph.selectedindex].y);
                if (ggraph.selectedindex != nodemouseisin) {
                    lineangle = (xa, ya, xb, yb) => {return Math.atan2((ya - yb), (xa - xb));};
                    let angle = lineangle(dx, dy, ggraph.nodes[ggraph.selectedindex].x, ggraph.nodes[ggraph.selectedindex].y);
                    let arrowpoint = {};
                    if (nodemouseisin == -1) {
                        arrowpoint.x = dx;
                        arrowpoint.y = dy;
                    } else {
                        arrowpoint.x = ggraph.nodes[nodemouseisin].x - Math.cos(angle) * ggraph.nodes[nodemouseisin].r;
                        arrowpoint.y = ggraph.nodes[nodemouseisin].y - Math.sin(angle) * ggraph.nodes[nodemouseisin].r;
                    }
                    line(arrowpoint.x, arrowpoint.y, arrowpoint.x - Math.cos(angle + Math.PI / 6) * 15, arrowpoint.y - Math.sin(angle + Math.PI / 6) * 15);
                    line(arrowpoint.x, arrowpoint.y, arrowpoint.x - Math.cos(angle - Math.PI / 6) * 15, arrowpoint.y - Math.sin(angle - Math.PI / 6) * 15);
                }
            }
        }
    }

    ggraph.draw();
}

function setcanvas() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.elt.style.zIndex = -1;

    const x = (windowWidth - width) / 2;
    const y = (windowHeight - height) / 2;
    canvas.position(x, y);

    window.addEventListener("keydown", (event) => {
        if (!ggraph.locked) {
            if (event.code == "Delete") {
                ggraph.removeselected();
            }
        }
    });

    canvas.elt.addEventListener("dblclick", () => {
        if (!ggraph.locked) {
            if (mouseX <= windowWidth * 0.17) return;
            if (ggraph.selectedelement == element.none) {
                ggraph.addnode(mouseX, mouseY, 20);
            }
        }
    });

    canvas.elt.addEventListener("click", () => {
        if (!ggraph.locked || ggraph.allow_select) {
            if (mouseX <= windowWidth * 0.17) return;
            ggraph.select(mouseX, mouseY);
            if (ggraph.selectedelement != element.none) {
                inputbox.focus();
            }
        }
    });

    canvas.elt.addEventListener("mousedown", () => {
        if (!ggraph.locked) {
            if (mouseX <= windowWidth * 0.17) return;
            ggraph.select(mouseX, mouseY);
            if (ggraph.selectedelement == element.edge) {
                if (keyIsDown(CONTROL)) {
                    ggraph.edges[ggraph.selectedindex].toggledirection();
                }
            }
        }
    });

    canvas.elt.addEventListener("mouseup", () => {
        if (!ggraph.locked) {
            if (mouseX <= windowWidth * 0.17) return;
            if (ggraph.selectedelement != element.none) {
                if (keyIsDown(SHIFT)) {
                    for (let i = ggraph.nodes.length - 1; i >= 0; i--) {
                        if (ggraph.nodes[i].contains(mouseX, mouseY)) {
                            ggraph.addegde(ggraph.nodes[ggraph.selectedindex], ggraph.nodes[i]);
                            break;
                        }
                    }
                } else if (keyIsDown(CONTROL)) {
                    for (let i = ggraph.nodes.length - 1; i >= 0; i--) {
                        if (ggraph.nodes[i].contains(mouseX, mouseY)) {
                            ggraph.adddirectedegde(ggraph.nodes[ggraph.selectedindex], ggraph.nodes[i]);
                            break;
                        }
                    }
                }
            }
        }
    });

    canvas.elt.addEventListener("mousemove", () => {
        if (!ggraph.locked) {
            if (mouseX <= windowWidth * 0.17) return;
            if (mouseIsPressed) {
                if (ggraph.selectedelement == element.node) {
                    if (!keyIsDown(SHIFT) && !keyIsDown(CONTROL)) {
                        ggraph.nodes[ggraph.selectedindex].update(mouseX, mouseY);
                    }
                }
                if (ggraph.selectedelement == element.edge) {
                    if (!keyIsDown(SHIFT) && !keyIsDown(CONTROL)) {
                        ggraph.edges[ggraph.selectedindex].update(mouseX, mouseY);
                    }
                }
            }
        }
    });
}

function windowResized() {
    canvas.resize(windowWidth, windowHeight);
    const x = (windowWidth - width) / 2;
    const y = (windowHeight - height) / 2;
    canvas.position(x, y);
    draw();
}

function setsidebar() {
    let sidebardiv = document.createElement("div");
    document.body.appendChild(sidebardiv);
    sidebardiv.style.boxSizing = "border-box";
    sidebardiv.style.position = "absolute";
    sidebardiv.style.top = "5%";
    sidebardiv.style.bottom = "5%";
    sidebardiv.style.left = "20px";
    sidebardiv.style.right = "80%";
    sidebardiv.style.zIndex = 1;
    sidebardiv.style.flexDirection = "column";
    sidebardiv.style.paddingRight = '2%';
    sidebardiv.style.borderRight = '1px solid white';

    //instructions
    let instructions = document.createElement("p");
    sidebardiv.appendChild(instructions);
    instructions.style.color = "white";
    instructions.style.userSelect = "none";
    instructions.innerHTML = `
    CONTROLS: <br/> <br/>
    - add node: double click <br/> <br/>
    - move node: click + drag <br/> <br/>
    - add undirected edge: shift + drag <br/> <br/>
    - add directed edge: ctrl + drag <br/> <br/>
    - toggle edge direction: crtl + click <br/> <br/>
    - select element: click <br/> <br/>
    - edit label: select + type <br/> <br/>
    - delete element: select + DEL
    `;

    //inputbox
    inputbox = document.createElement("input");
    sidebardiv.appendChild(inputbox);
    inputbox.type = "text";
    inputbox.id = "inputbox";
    inputbox.placeholder = "edit label";
    inputbox.addEventListener("input", (e) => {
        if (ggraph.selectedelement == element.node) {
            ggraph.nodes[ggraph.selectedindex].setlabel(inputbox.value);
        } else if (ggraph.selectedelement == element.edge) {
            ggraph.edges[ggraph.selectedindex].setlabel(inputbox.value);
        }
    });

    //algorithmselect
    const algorithmselect = document.createElement("select");
    sidebardiv.appendChild(algorithmselect);
    const placeholderoption = document.createElement("option");
    placeholderoption.value = "";
    placeholderoption.innerHTML = "Select an algorithm";
    placeholderoption.disabled = true;
    placeholderoption.defaultSelected = true;
    algorithmselect.appendChild(placeholderoption);
    const boruvkaoption = document.createElement("option");
    algorithmselect.appendChild(boruvkaoption);
    boruvkaoption.value = "boruvka";
    boruvkaoption.innerHTML = "Borůvka's algorithm";
    const johnsonsoption = document.createElement("option");
    algorithmselect.appendChild(johnsonsoption);
    johnsonsoption.value = "johnsons";
    johnsonsoption.innerHTML = "Johnson's algorithm";
    const topologicalsortoption = document.createElement("option");
    algorithmselect.appendChild(topologicalsortoption);
    topologicalsortoption.value = "topologicalsort";
    topologicalsortoption.innerHTML = "Topological sorting";

    //speed of algorithm
    let label = document.createElement("label");
    label.innerHTML = `Speed: 1x`;
    sidebardiv.appendChild(label);
    label.htmlFor = "speedmult";
    label.style.color = "white";

    let speedmult = document.createElement("input");
    sidebardiv.appendChild(speedmult);
    speedmult.addEventListener("input", (e) => {
        multiplier = speedmult.value;
        label.innerHTML = `Speed: ${speedmult.value}x`;
    });
    speedmult.type = "range";
    speedmult.min = 0.25;
    speedmult.max = 2;
    speedmult.step = 0.25;
    speedmult.value = 1;
    speedmult.id = speedmult.name = "speedmult";

    //runbutton
    runbutton = document.createElement("button");
    sidebardiv.appendChild(runbutton);
    runbutton.innerHTML = "run algorithm";
    runbutton.addEventListener("click", async (e) => {
        if (!ggraph.locked) {
            // console.log(algorithmselect.value);
            oldgraph = new graph(ggraph);
            switch (algorithmselect.value) {
                case "boruvka":
                    warn("");
                    ggraph.lock();
                    ggraph.unselect();
                    algoBox.style.visibility = "visible";
                    await boruvka();
                    algoBox.style.visibility = "hidden";
                    ggraph.unlock();
                    break;
                case "johnsons":
                    ggraph.lock();
                    ggraph.allow_select = true;
                    algoBox.style.visibility = "visible";

                    ggraph.unselect();
                    warn("primeiro escolha o nó de partida");
                    while (ggraph.selectedelement != element.node) await sleep(50);
                    let source = ggraph.selectedindex;
                    ggraph.unselect();

                    warn("agora escolha o nó de destino");
                    while (ggraph.selectedelement != element.node || source == ggraph.selectedindex) await sleep(50);
                    let target = ggraph.selectedindex;
                    ggraph.unselect();

                    warn("");
                    console.log(source, target);

                    await Johnsons(source, target);

                    algoBox.style.visibility = "hidden";
                    ggraph.allow_select = false;
                    ggraph.unlock();
                    break;
                case "topologicalsort":
                    warn("");
                    ggraph.lock();
                    ggraph.unselect();

                    let oldnodes = ggraph.nodes.slice();
                    algoBox.style.visibility = "visible";
                    await topologicalsort();
                    algoBox.style.visibility = "hidden";
                    ggraph.nodes = oldnodes;

                    ggraph.unlock();
                    break;
                default:
                    warn("no algorithm selected");
                    break;
            }
        }
    });

    //savebutton
    let savebutton = document.createElement("button");
    sidebardiv.appendChild(savebutton);
    savebutton.innerHTML = "save current graph";
    savebutton.addEventListener("click", (e) => {
        if (!ggraph.locked) {
            oldgraph = new graph(ggraph);
        }
    });

    //loadbutton
    let loadbutton = document.createElement("button");
    sidebardiv.appendChild(loadbutton);
    loadbutton.innerHTML = "load last saved graph";
    loadbutton.addEventListener("click", (e) => {
        if (!ggraph.locked) {
            ggraph = oldgraph;
        }
    });

    //warningbox
    warning = document.createElement("p");
    sidebardiv.appendChild(warning);
    warning.style.color = "red";
    warning.style.overflowY = "auto";
    warning.style.flexGrow = "2";
    warning.style.userSelect = "none";
    warning.style.border = "5px solid #120a8f";
    warning.style.backgroundColor = "snow";
    warning.innerHTML = "";

    //clearbutton
    clearbutton = document.createElement("button");
    sidebardiv.appendChild(clearbutton);
    clearbutton.innerHTML = "clear all nodes";
    clearbutton.addEventListener("click", (e) => {
        if (!ggraph.locked) {
            ggraph.clear();
        }
    });
}

function setAlgorithmBox() {
    algoBox = document.createElement('div');
    algoBox.style.position = "absolute";
    algoBox.style.bottom = "15px";
    algoBox.style.right = "15px";
    algoBox.style.padding = "10px 15px 10px 15px";
    algoBox.style.backgroundColor = "#2f2f2f";
    algoBox.style.color = "white";
    algoBox.style.opacity = "0.65";
    algoBox.style.border = "3px solid white";
    algoBox.style.visibility = "hidden";
    document.body.appendChild(algoBox);
}
