function ptopdist(x1, y1, x2, y2) {
    return sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

function ptoldist(xp, yp, xa, ya, xb, yb) {
    return abs((xb - xa) * (ya - yp) - (xa - xp) * (yb - ya)) / ptopdist(xa, ya, xb, yb);
}

function lineangle(xa, ya, xb, yb) {
    return Math.atan2((ya - yb), (xa - xb));
}

class node {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;

        this.hue = 120;
        this.saturation = 70;
        this.lightness = 60;
        this.label = "";
    }

    draw() {
        fill(this.hue, this.saturation, this.lightness); noStroke();
        ellipse(this.x, this.y, this.r, this.r);

        fill(90); stroke(0); strokeWeight(2);
        text(this.label, this.x, this.y);
    }

    clear() {
        this.hue = 120;
        this.saturation = 100;
        this.lightness = 50;
        this.label = "";
    }

    update(x, y) {
        this.x = x;
        this.y = y;
    }

    contains(x, y) {
        return (x - this.x) * (x - this.x) + (y - this.y) * (y - this.y) <= this.r * this.r;
    }

    setlabel(label) {
        this.label = label;
    }

    hash() {
        return this.x * 1_000_000 + this.y;
    }
}

class edge {
    constructor(u, v) {
        this.u = u;
        this.v = v;
        this.direction = 2; // |  0: u -> v  |  1: u <- v  |  2: u - v  |

        this.hue = 0;
        this.saturation = 95;
        this.lightness = 60;
        this.label = "";
    }

    draw() {
        stroke(this.hue, this.saturation, this.lightness); strokeWeight(3);
        line(this.u.x, this.u.y, this.v.x, this.v.y);
        if (this.direction == 0) {
            // u -> v
            let angle = lineangle(this.v.x, this.v.y, this.u.x, this.u.y);
            let borderpoint = {};
            borderpoint.x = this.v.x - Math.cos(angle) * this.v.r;
            borderpoint.y = this.v.y - Math.sin(angle) * this.v.r;
            line(borderpoint.x, borderpoint.y, borderpoint.x - Math.cos(angle + Math.PI / 6) * 15, borderpoint.y - Math.sin(angle + Math.PI / 6) * 15);
            line(borderpoint.x, borderpoint.y, borderpoint.x - Math.cos(angle - Math.PI / 6) * 15, borderpoint.y - Math.sin(angle - Math.PI / 6) * 15);
        } else if (this.direction == 1) {
            // u <- v
            let angle = lineangle(this.u.x, this.u.y, this.v.x, this.v.y);
            let borderpoint = {};
            borderpoint.x = this.u.x - Math.cos(angle) * this.u.r;
            borderpoint.y = this.u.y - Math.sin(angle) * this.u.r;
            line(borderpoint.x, borderpoint.y, borderpoint.x - Math.cos(angle + Math.PI / 6) * 15, borderpoint.y - Math.sin(angle + Math.PI / 6) * 15);
            line(borderpoint.x, borderpoint.y, borderpoint.x - Math.cos(angle - Math.PI / 6) * 15, borderpoint.y - Math.sin(angle - Math.PI / 6) * 15);
        }

        fill(90); stroke(0); strokeWeight(2);
        text(this.label, min(this.u.x, this.v.x) + abs(this.u.x - this.v.x) / 2, min(this.u.y, this.v.y) + abs(this.u.y - this.v.y) / 2);
    }

    clear() {
        this.hue = 240;
        this.saturation = 100;
        this.lightness = 50;
        this.label = "";
    }

    toggledirection() {
        this.direction = (this.direction + 1) % 3;
    }

    contains(x, y) {
        return ptopdist(this.u.x, this.u.y, x, y) + ptopdist(x, y, this.v.x, this.v.y) - ptopdist(this.u.x, this.u.y, this.v.x, this.v.y) < 0.3;
    }

    setlabel(label) {
        this.label = label;
    }
}

class graph {
    constructor() {
        this.nodes = [];
        this.edges = [];
        this.selectedelement = -1; // type of the selected element |  -1: none  |  0: node  |  1: edge  |
        this.selectedindex = -1; // index of the selected element in the according type's array
        this.locked = false;
    }

    lock() {
        this.locked = true;
    }

    unlock() {
        this.locked = false;
    }

    get_edge_index(u, v) {
        for (let i = 0; i < this.edges.length; i++) {
            if (
                this.nodes.indexOf(this.edges[i].u) == u && this.nodes.indexOf(this.edges[i].v) == v ||
                this.nodes.indexOf(this.edges[i].u) == v && this.nodes.indexOf(this.edges[i].v) == u ||
                this.edges[i].u == u && this.edges[i].v == v || this.edges[i].v == u && this.edges[i].u == v
            ) {
                return i;
            }
        }
        return -1;
    }

    addnode(x, y, r) {
        let n = new node(x, y, r);
        this.nodes.push(n);
        // console.log(this)
    }

    addegde(u, v) {
        if (u != v) {
            for (let i = 0; i < this.edges.length; i++) {
                if (this.edges[i].u == u && this.edges[i].v == v) {
                    warn("already added edge");
                    return;
                } else if (this.edges[i].u == v && this.edges[i].v == u) {
                    warn("already added edge");
                    return;
                }
            }
            let e = new edge(u, v);
            this.edges.push(e);
        }
        // console.log(this)
    }

    adddirectedegde(u, v) {
        if (u != v) {
            for (let i = 0; i < this.edges.length; i++) {
                if (this.edges[i].u == u && this.edges[i].v == v) {
                    warn("already added edge");
                    return;
                } else if (this.edges[i].u == v && this.edges[i].v == u) {
                    warn("already added edge");
                    return;
                }
            }
            let e = new edge(u, v);
            e.direction = 0;
            this.edges.push(e);
        }
        // console.log(this);
    }

    removenode() {
        for (let i = 0; i < this.edges.length; i++) {
            if (this.edges[i].u == this.nodes[this.selectedindex] || this.edges[i].v == this.nodes[this.selectedindex]) {
                this.edges.splice(i, 1);
                i--;
            }
        }
        this.nodes.splice(this.selectedindex, 1);
        this.unselect();
        // console.log(this)
    }

    removeedge() {
        this.edges.splice(this.selectedindex, 1);
        this.unselect();
        // console.log(this)
    }

    removeselected() {
        if (this.selectedelement == 0) this.removenode();
        else if (this.selectedelement == 1) this.removeedge();
    }

    select(x, y) {
        // nodes need to be checked first because they are visually on top of edges
        for (let i = this.nodes.length - 1; i >= 0; i--) {
            if (this.nodes[i].contains(x, y)) {
                this.selectedelement = 0;
                this.selectedindex = i;
                return;
            }
        }
        for (let i = this.edges.length - 1; i >= 0; i--) {
            if (this.edges[i].contains(x, y)) {
                this.selectedelement = 1;
                this.selectedindex = i;
                return;
            }
        }
        this.unselect();
    }

    unselect() {
        this.selectedelement = -1;
        this.selectedindex = -1;
    }

    draw() {
        // edges need to be drawn first so that nodes are drawn on top of them
        for (let i = 0; i < this.edges.length; i++) {
            if (this.selectedindex == i && this.selectedelement == 1) {
                noFill(); stroke(100); strokeWeight(2);
                push();
                translate((this.edges[i].u.x + this.edges[i].v.x) / 2, (this.edges[i].u.y + this.edges[i].v.y) / 2);
                rotate(lineangle(this.edges[i].u.x, this.edges[i].u.y, this.edges[i].v.x, this.edges[i].v.y));
                ellipse(0, 0, ptopdist(this.edges[i].u.x, this.edges[i].u.y, this.edges[i].v.x, this.edges[i].v.y) / 2 - this.nodes[0].r, this.nodes[0].r);
                pop();
            }
            this.edges[i].draw();
        }
        for (let i = 0; i < this.nodes.length; i++) {
            if (this.selectedindex == i && this.selectedelement == 0) {
                noFill(); stroke(100); strokeWeight(2);
                ellipse(this.nodes[i].x, this.nodes[i].y, this.nodes[i].r + 1, this.nodes[i].r + 1);
            }
            this.nodes[i].draw();
        }
    }

    clear() {
        this.unselect();
        this.nodes = [];
        this.edges = [];
    }

    get_adjacency_matrix() {
        let adjmatrix = [];
        for (let i = 0; i < this.nodes.length; i++) {
            adjmatrix.push([]);
            for (let j = 0; j < this.nodes.length; j++) {
                adjmatrix[i].push(0);
            }
        }
        for (let i = 0; i < this.nodes.length; i++) {
            const u = this.nodes[i];
            for (let j = 0; j < this.nodes.length; j++) {
                const v = this.nodes[j];
                for (let k = 0; k < this.edges.length; k++) {
                    if (this.edges[k].u == u && this.edges[k].v == v) {
                        switch (this.edges[k].direction) {
                            case 0:
                                adjmatrix[i][j] = 1;
                                adjmatrix[j][i] = -1;
                                break;
                            case 1:
                                adjmatrix[i][j] = -1;
                                adjmatrix[j][i] = 1;
                                break;
                            case 2:
                                adjmatrix[i][j] = 2;
                                adjmatrix[j][i] = 2;
                                break;
                        }
                    }
                }
            }
        }
        return adjmatrix;
    }

    get_adjacency_list() {
        let adjlist = [];
        for (let i = 0; i < this.nodes.length; i++) {
            const u = this.nodes[i];
            adjlist.push([]);
            for (let j = 0; j < this.edges.length; j++) {
                const e = this.edges[j];
                switch (e.direction) {
                    case 0:
                        if (e.u == u) adjlist[i].push(this.nodes.indexOf(e.v));
                        break;
                    case 1:
                        if (e.v == u) adjlist[i].push(this.nodes.indexOf(e.u));
                        break;
                    case 2:
                        if (e.u == u) adjlist[i].push(this.nodes.indexOf(e.v));
                        if (e.v == u) adjlist[i].push(this.nodes.indexOf(e.u));
                        break;
                }
            }
        }
        return adjlist;
    }
}

class algorithm {
    constructor() {
        this.steps = [];
    }

    get_indent(indent) {
        let res = "";
        while (indent > 0) {
            res += "&nbsp ";
            indent--;
        }
        return res;
    }

    add_step(step, indent = 0) {
        this.steps.push(" ".repeat(indent + 3) + step);
    }

    async print(at_step = -1) {
        let alg = "";
        for (var i = 0; i < this.steps.length; i++) {
            if (i == at_step) {
                this.steps[i] = "->" + this.steps[i].substr(2);
                alg += this.steps[i] + '\n';
                this.steps[i] = "  " + this.steps[i].substr(2);
            }
            else alg += this.steps[i] + '\n';
        }
        //console.log(alg);
        this.write(`<pre><code>` + alg + `</code></pre>`);
        await sleep(MS_PER_STEP / multiplier);
    }

    write(code) {
        algoBox.innerHTML = code;
    }
}
