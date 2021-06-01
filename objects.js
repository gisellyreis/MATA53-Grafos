function ptopdist(x1, y1, x2, y2) {
    return sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

function ptoldist(xp, yp, xa, ya, xb, yb) {
    return abs((xb - xa) * (ya - yp) - (xa - xp) * (yb - ya)) / ptopdist(xa, ya, xb, yb);
}

function anglefromline(xa, ya, xb, yb) {
    //angle XAB, X is a positive point in the x axis
    return Math.atan2((ya - yb), (xa - xb));
}

function rotateonpoint(p, c, angle) {
    let ret = {x: 0, y: 0};
    ret.x = p.x - c.x;
    ret.y = p.y - c.y;
    let aux = {x: 0, y: 0};
    aux.x = ret.x;
    aux.y = ret.y;
    aux.x = ret.x * Math.cos(angle) - ret.y * Math.sin(angle);
    aux.y = ret.x * Math.sin(angle) + ret.y * Math.cos(angle);
    ret.x = aux.x + c.x;
    ret.y = aux.y + c.y;
    return ret;
}

function polartocartesian(c, w, h, angle) {
    // console.log(c, w, h, angle);
    return {x: c.x + w * Math.cos(angle), y: c.y + h * Math.sin(angle)};
}

const element = {
    none: -1,
    node: 0,
    edge: 1,
};

class node {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;

        this.weight = 0;

        this.hue = 120;
        this.saturation = 70;
        this.lightness = 60;
        this.label = "";
    }

    draw() {
        fill(this.hue, this.saturation, this.lightness); noStroke();
        ellipse(this.x, this.y, this.r, this.r);

        fill(90); stroke(0); strokeWeight(5);
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
    constructor(u, v, h) {
        this.u = u;
        this.v = v;
        this.uidx = ggraph.nodes.indexOf(u);
        this.vidx = ggraph.nodes.indexOf(v);
        this.directed = false;
        this.height = h == 0 ? 0.01 : h;
        this.togglecount = 0;

        this.weight = 1;

        this.hue = 0;
        this.saturation = 95;
        this.lightness = 60;
        this.label = "";
    }

    find_intersect_angle(midpoint, lineangle) {
        let low;
        let high;
        let mid;
        low = 3 * Math.PI / 2;
        high = 2 * Math.PI;
        for (let i = 0; i < 20; i++) {
            mid = (low + high) / 2;
            let inarc = polartocartesian(midpoint, ptopdist(this.v.x, this.v.y, midpoint.x, midpoint.y), this.height, mid);
            inarc = rotateonpoint(inarc, midpoint, lineangle);
            // stroke(60, 100, 50);
            // point(inarc.x, inarc.y);
            if (this.v.contains(inarc.x, inarc.y)) {
                high = mid;
            } else {
                low = mid;
            }
        }
        // for (let i = low; i < high; i += 0.1) {
        //     let inarc = polartocartesian(midpoint, ptopdist(this.v.x, this.v.y, midpoint.x, midpoint.y), this.height, i);
        //     inarc = rotateonpoint(inarc, midpoint, lineangle);
        //     // console.log(inarc);
        //     point(inarc.x, inarc.y);
        // }
        return mid;
    }

    draw(lightness = this.lightness) {
        noFill(); stroke(this.hue, this.saturation, lightness); strokeWeight(3);

        let baseangle = anglefromline(this.v.x, this.v.y, this.u.x, this.u.y);
        let midpoint = {};
        midpoint.x = (this.u.x + this.v.x) / 2;
        midpoint.y = (this.u.y + this.v.y) / 2;
        let dist = ptopdist(this.v.x, this.v.y, this.u.x, this.u.y);
        push();
        translate(midpoint.x, midpoint.y);
        rotate(baseangle);
        if (this.height < 0) {
            arc(0, 0, dist / 2, this.height == 0 ? 0.01 : this.height, 0, Math.PI);
        } else {
            arc(0, 0, dist / 2, this.height == 0 ? 0.01 : this.height, Math.PI, 0);
        }
        // stroke(240, 100, 50);
        pop();

        // arc(midpoint.x, midpoint.y, dist / 2, 50, 2 * Math.PI / 2, 3 * Math.PI / 2);
        // arc(midpoint.x, midpoint.y, dist / 2, this.height, 3 * Math.PI / 2, 4 * Math.PI / 2);
        if (this.directed) {
            // console.log(this);
            let intersectionangle = this.find_intersect_angle(midpoint, baseangle);

            // for (let i = 0; i < 1 * Math.PI; i += 0.01) {
            //     let intp = polartocartesian(midpoint, dist / 2, this.height, i);
            //     // push();
            //     // rotate(-baseangle);
            //     // translate(-midpoint.x, -midpoint.y);
            //     point(intp.x, intp.y);
            //     // pop();
            // }
            let intersectionpoint = polartocartesian(midpoint, dist / 2, this.height, intersectionangle);
            intersectionpoint = rotateonpoint(intersectionpoint, midpoint, baseangle);
            let outpoint = polartocartesian(midpoint, dist / 2, this.height, intersectionangle - 0.01);
            outpoint = rotateonpoint(outpoint, midpoint, baseangle);
            let inpoint = polartocartesian(midpoint, dist / 2, this.height, intersectionangle + 0.01);
            inpoint = rotateonpoint(inpoint, midpoint, baseangle);
            let angleofattack = anglefromline(outpoint.x, outpoint.y, inpoint.x, inpoint.y);

            push();
            translate(intersectionpoint.x, intersectionpoint.y);
            rotate(angleofattack);
            rotate(Math.PI / 6);
            line(0, 0, 15, 0);
            rotate(-2 * Math.PI / 6);
            line(0, 0, 15, 0);
            pop();
        }
        push();
        translate(midpoint.x, midpoint.y);
        rotate(baseangle);
        translate(0, -this.height);
        rotate(-baseangle);
        fill(90); stroke(0); strokeWeight(5);
        text(this.label, 0, 0);
        pop();
    }

    clear() {
        this.hue = 240;
        this.saturation = 100;
        this.lightness = 50;
        this.label = "";
    }

    toggledirection() {
        switch (this.togglecount) {
            case 0:
                this.directed = false;
                break;
            case 1:
            case 2:
                this.directed = true;
                let aux = this.u;
                this.u = this.v;
                this.v = aux;
                this.height *= -1;
                break;
        }
        this.togglecount = (this.togglecount + 1) % 3;
    }

    contains(x, y) {
        let baseangle = anglefromline(this.v.x, this.v.y, this.u.x, this.u.y);
        let midpoint = {};
        midpoint.x = (this.u.x + this.v.x) / 2;
        midpoint.y = (this.u.y + this.v.y) / 2;
        let dist = ptopdist(this.v.x, this.v.y, this.u.x, this.u.y);
        for (let i = 1 * Math.PI; i < 2 * Math.PI; i += 0.01) {
            let arcpoint = polartocartesian(midpoint, dist / 2, this.height, i);
            arcpoint = rotateonpoint(arcpoint, midpoint, baseangle);
            // stroke(240, 100, 50);
            // ellipse(arcpoint.x, arcpoint.y, 10, 10);
            if ((x - arcpoint.x) * (x - arcpoint.x) + (y - arcpoint.y) * (y - arcpoint.y) <= 10 * 10) {
                return true;
            }
        }
        return false;
    }

    update(x, y) {
        let h = ptoldist(x, y, this.v.x, this.v.y, this.u.x, this.u.y);
        h == 0 ? h = 0.001 : h;
        let baseangle = anglefromline(this.v.x, this.v.y, this.u.x, this.u.y);
        let midpoint = {};
        midpoint.x = (this.u.x + this.v.x) / 2;
        midpoint.y = (this.u.y + this.v.y) / 2;
        let p = {x: x, y: y};
        p = rotateonpoint(p, midpoint, -baseangle);
        let pu = {x: this.u.x, y: this.u.y};
        pu = rotateonpoint(pu, midpoint, -baseangle);
        // console.log(this.v.x, pu.x, this.v.y, pu.y);
        // stroke(240, 100, 50);
        // point(pu.x, pu.y);
        // point(p.x, p.y);
        if (p.y < pu.y) {
            this.height = h;
        } else {
            this.height = -h;
        }
        // console.log(this.height);
    }

    setlabel(label) {
        this.label = label;
    }
}


class graph {
    constructor(oldgraph = null) {
        if (oldgraph == null) {
            this.nodes = [];
            this.edges = [];
            this.selectedelement = element.none; // type of the selected element [see const element]
            this.selectedindex = -1; // index of the selected element in the according type's array
            this.locked = false;
            this.allow_select = false;
        } else {
            this.nodes = [];
            this.edges = [];
            this.selectedelement = oldgraph.selectedelement;
            this.selectedindex = oldgraph.selectedindex;
            this.locked = oldgraph.locked;
            this.allow_select = oldgraph.allow_select;
            for (let i = 0; i < oldgraph.nodes.length; i++) {
                let u = oldgraph.nodes[i];
                let n = new node(u.x, u.y, u.r);
                n.hue = u.hue;
                n.saturation = u.saturation;
                n.lightness = u.lightness;
                n.label = u.label;
                this.nodes.push(n);
            }
            for (let i = 0; i < oldgraph.edges.length; i++) {
                let e = oldgraph.edges[i];
                let n = new edge(this.nodes[e.uidx], this.nodes[e.vidx]);
                n.directed = e.directed;
                n.uidx = e.uidx;
                n.vidx = e.vidx;
                n.height = e.height;
                n.hue = e.hue;
                n.saturation = e.saturation;
                n.lightness = e.lightness;
                n.label = e.label;
                this.edges.push(n);
            }
        }
    }

    lock() {
        this.locked = true;
    }

    unlock() {
        this.locked = false;
    }

    get_edges(u, v) {
        let es = [];
        // console.log(u);
        // console.log(v);
        // console.log("funcione porra");
        for (let i = 0; i < this.edges.length; i++) {
            // console.log(this.edges[i].u);
            // console.log(this.edges[i].v);
            if (
                this.nodes.indexOf(this.edges[i].u) == u && this.nodes.indexOf(this.edges[i].v) == v ||
                this.nodes.indexOf(this.edges[i].u) == v && this.nodes.indexOf(this.edges[i].v) == u ||
                this.edges[i].u == u && this.edges[i].v == v || this.edges[i].v == u && this.edges[i].u == v
            ) {
                es.push(i);
            }
        }
        return es;
    }

    get_edge_index(u, v, h) {
        let es = this.get_edges(u, v);
        for (let i = 0; i < es.length; i++) {
            if (this.edges[es[i]].height == height) {
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
            let es = this.get_edges(u, v);
            let e = new edge(u, v, 15 * es.length);
            this.edges.push(e);
        }
        // console.log(this)
    }

    adddirectedegde(u, v) {
        if (u != v) {
            let es = this.get_edges(u, v);
            let e = new edge(u, v, 15 * es.length);
            e.directed = true;
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
        if (this.selectedelement == element.node) this.removenode();
        else if (this.selectedelement == element.edge) this.removeedge();
    }

    select(x, y) {
        // nodes need to be checked first because they are visually on top of edges
        for (let i = this.nodes.length - 1; i >= 0; i--) {
            if (this.nodes[i].contains(x, y)) {
                this.selectedelement = element.node;
                this.selectedindex = i;
                return;
            }
        }
        for (let i = this.edges.length - 1; i >= 0; i--) {
            if (this.edges[i].contains(x, y)) {
                this.selectedelement = element.edge;
                this.selectedindex = i;
                return;
            }
        }
        this.unselect();
    }

    unselect() {
        this.selectedelement = element.none;
        this.selectedindex = -1;
    }

    draw() {
        // edges need to be drawn first so that nodes are drawn on top of them
        for (let i = 0; i < this.edges.length; i++) {
            if (this.selectedindex == i && this.selectedelement == element.edge) {
                this.edges[i].draw(100);
                // push();
                // translate((this.edges[i].u.x + this.edges[i].v.x) / 2, (this.edges[i].u.y + this.edges[i].v.y) / 2);
                // rotate(anglefromline(this.edges[i].u.x, this.edges[i].u.y, this.edges[i].v.x, this.edges[i].v.y));
                // let dist = ptopdist(this.edges[i].u.x, this.edges[i].u.y, this.edges[i].v.x, this.edges[i].v.y);
                // noFill(); stroke(100); strokeWeight(3);
                // line(-dist / 2, 0, dist / 2, 0);
                // // ellipse(0, 0, ptopdist(this.edges[i].u.x, this.edges[i].u.y, this.edges[i].v.x, this.edges[i].v.y) / 2 - this.nodes[0].r, this.nodes[0].r);
                // pop();
            } else {
                // let es = this.get_edges(this.edges[i].u, this.edges[i].v);
                // console.log(es);
                // console.log(this.edges);

                // this.edges[es[0]].height = 0.01;
                // for (let j = 1; j < es.length; j++) {
                // let width = min(200, ptopdist(this.edges[i].u.x, this.edges[i].u.y, this.edges[i].v.x, this.edges[i].v.y));
                // this.edges[es[j]].height = j * width / es.length;
                // }
                this.edges[i].draw();
            }
        }
        for (let i = 0; i < this.nodes.length; i++) {
            if (this.selectedindex == i && this.selectedelement == element.node) {
                noFill(); stroke(100); strokeWeight(3);
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
                        switch (this.edges[k].directed) {
                            case false:
                                adjmatrix[i][j] += 1;
                                adjmatrix[j][i] += 1;
                                break;
                            case true:
                                adjmatrix[i][j] += 1;
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
                switch (e.directed) {
                    case false:
                        if (e.u == u) adjlist[i].push(this.nodes.indexOf(e.v));
                        if (e.v == u) adjlist[i].push(this.nodes.indexOf(e.u));
                        break;
                    case true:
                        if (e.u == u) adjlist[i].push(this.nodes.indexOf(e.v));
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

    async print(at_step = -1, wait_time = null) {
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
        if (!wait_time) await sleep(MS_PER_STEP / multiplier);
        else await sleep(wait_time / multiplier);
    }

    write(code) {
        algoBox.innerHTML = code;
    }
}
