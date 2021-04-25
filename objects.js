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

        fill(90); stroke(0);
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

        fill(90); stroke(0);
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
        this.selectedhue = 0;
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
                    console.log("already added edge");
                    return;
                } else if (this.edges[i].u == v && this.edges[i].v == u) {
                    console.log("already added edge");
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
                    console.log("already added edge");
                    return;
                } else if (this.edges[i].u == v && this.edges[i].v == u) {
                    console.log("already added edge");
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
            this.edges[i].draw();
            if (this.selectedindex == i && this.selectedelement == 1) {
                noFill(); stroke(100); strokeWeight(2);
                ellipse((this.edges[i].u.x + this.edges[i].v.x) / 2, (this.edges[i].u.y + this.edges[i].v.y) / 2, this.nodes[0].r, this.nodes[0].r);
            }
        }
        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].draw();
            if (this.selectedindex == i && this.selectedelement == 0) {
                noFill(); stroke(100); strokeWeight(2);
                ellipse(this.nodes[i].x, this.nodes[i].y, this.nodes[i].r, this.nodes[i].r);
            }
        }
        this.selectedhue = (this.selectedhue + 5) % 360;
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
                if (e.direction == 0 && e.u == u) {
                    adjlist[i].push(this.nodes.indexOf(e.v));
                }
            }
        }
        return adjlist;
    }
}
