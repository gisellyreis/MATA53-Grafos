let ggraph = new graph();
let canvas;
let inputbox;
let labelbuffer;
let dropdownmenu;
let runbutton;
let clearbutton;
function setup() {
    setcanvas();
    setsidebar();

    ellipseMode(RADIUS);
    frameRate(30);
    colorMode(HSL);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textFont("Courier New");
    textSize(20);
}

function draw() {
    background("#1f1f1f");

    noFill(); stroke(100); strokeWeight(1);
    line(windowWidth * 0.17, windowHeight * 0.05, windowWidth * 0.17, windowHeight * 0.95);

    if (!ggraph.locked) {
        if (ggraph.selectedelement == 0) {
            inputbox.value = ggraph.nodes[ggraph.selectedindex].label;
        } else if (ggraph.selectedelement == 1) {
            inputbox.value = ggraph.edges[ggraph.selectedindex].label;
        } else {
            inputbox.value = "";
        }

        if (ggraph.selectedelement == 0 && mouseIsPressed) {
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
        if (event.code == "Delete") {
            ggraph.removeselected();
        }
    });

    canvas.elt.addEventListener("dblclick", () => {
        if (mouseX <= windowWidth * 0.17) return;
        if (!ggraph.locked) {
            if (ggraph.selectedelement == -1) {
                ggraph.addnode(mouseX, mouseY, 20);
            }
        }
    });

    canvas.elt.addEventListener("click", () => {
        if (mouseX <= windowWidth * 0.17) return;
        ggraph.select(mouseX, mouseY);
        if (ggraph.selectedelement != -1) {
            inputbox.focus();
        }
    });

    canvas.elt.addEventListener("mousedown", () => {
        if (mouseX <= windowWidth * 0.17) return;
        if (!ggraph.locked) {
            ggraph.select(mouseX, mouseY);
            if (ggraph.selectedelement == 1) {
                if (keyIsDown(CONTROL)) {
                    ggraph.edges[ggraph.selectedindex].toggledirection();
                }
            }
        }
    });

    canvas.elt.addEventListener("mouseup", () => {
        if (mouseX <= windowWidth * 0.17) return;
        if (!ggraph.locked) {
            if (keyIsDown(SHIFT)) {
                for (let i = ggraph.nodes.length - 1; i >= 0; i--) {
                    if (ggraph.nodes[i].contains(mouseX, mouseY)) {
                        ggraph.addegde(ggraph.nodes[ggraph.selectedindex], ggraph.nodes[i]);
                        // console.log("added edge");
                        break;
                    }
                }
            } else if (keyIsDown(CONTROL)) {
                for (let i = ggraph.nodes.length - 1; i >= 0; i--) {
                    if (ggraph.nodes[i].contains(mouseX, mouseY)) {
                        ggraph.adddirectedegde(ggraph.nodes[ggraph.selectedindex], ggraph.nodes[i]);
                        // console.log("added edge");
                        break;
                    }
                }
            }
        }
    });

    canvas.elt.addEventListener("mousemove", () => {
        if (mouseX <= windowWidth * 0.17) return;
        if (!ggraph.locked) {
            if (mouseIsPressed) {
                if (ggraph.selectedelement == 0) {
                    if (!keyIsDown(SHIFT) && !keyIsDown(CONTROL)) {
                        ggraph.nodes[ggraph.selectedindex].update(mouseX, mouseY);
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
    sidebardiv.style.position = "absolute";
    sidebardiv.style.top = "5%";
    sidebardiv.style.bottom = "5%";
    sidebardiv.style.left = "20px";
    sidebardiv.style.right = "85%";
    sidebardiv.style.zIndex = 1;
    sidebardiv.style.flexDirection = "column";

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
        if (ggraph.selectedelement == 0) {
            ggraph.nodes[ggraph.selectedindex].setlabel(inputbox.value);
        } else if (ggraph.selectedelement == 1) {
            ggraph.edges[ggraph.selectedindex].setlabel(inputbox.value);
        }
    });

    //algorithmselect
    const algorithmselect = document.createElement("select");
    sidebardiv.appendChild(algorithmselect);
    algorithmselect.addEventListener("change", (e) => {
        runbutton.addEventListener("click", (e) => {
            switch (algorithmselect.value) {
                case "topologicalsort":
                    if (!isempty() && isdirected() && !hascycle()) {
                        topologicalsort();
                    }
                    break;
            }
        });
    });
    const placeholderoption = document.createElement("option");
    placeholderoption.value = "";
    placeholderoption.innerHTML = "select algorithm";
    placeholderoption.disabled = "";
    placeholderoption.selected = "";
    algorithmselect.appendChild(placeholderoption);
    const topologicalsortoption = document.createElement("option");
    topologicalsortoption.value = "topologicalsort";
    topologicalsortoption.innerHTML = "topological sort";
    algorithmselect.appendChild(topologicalsortoption);

    //runbutton
    runbutton = document.createElement("button");
    sidebardiv.appendChild(runbutton);
    runbutton.innerHTML = "run algorithm";

    //clearbutton
    clearbutton = document.createElement("button");
    sidebardiv.appendChild(clearbutton);
    clearbutton.innerHTML = "clear all nodes";
    clearbutton.style.position = "absolute";
    clearbutton.style.bottom = "0px";
    clearbutton.style.width = "100%";
    clearbutton.addEventListener("click", (e) => {
        ggraph.clear();
    });
}
