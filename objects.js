function ptopdist(x1, y1, x2, y2){
	return sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
}

function ptoldist(xp, yp, xa, ya, xb, yb){
	return abs((xb-xa)*(ya-yp) - (xa-xp)*(yb-ya))/ptopdist(xa, ya, xb, yb);
}

function lineangle(xa, ya, xb, yb){
	return Math.atan2((ya-yb), (xa-xb));
}

let nodeidcounter = 0;
let edgeidcounter = 0;

class node{
	constructor(x, y, r){
		this.x = x;
		this.y = y;
		this.r = r;
		this.hue = 0;	
		this.saturation = 100;
		this.lightness = 50;
		this.label = "";
	}

	draw(){
		fill(this.hue, this.saturation, this.lightness); noStroke();
		ellipse(this.x, this.y, this.r, this.r);

		fill(100);
		text(this.label, this.x, this.y);
	}

	update(x, y){
		this.x = x;
		this.y = y;
	}

	contains(x, y){
		return (x - this.x)*(x - this.x) + (y - this.y)*(y - this.y) <= this.r*this.r;
	}
}

class edge{
	constructor(u, v){
		this.u = u;
		this.v = v;
		
		this.hue = 240;
		this.saturation = 100;
		this.lightness = 50;
		
		this.direction = 2; 
			//	0: u -> v
			//	1: u <- v
			//	2: u - v

		this.label = "";
	}

	draw(){
		stroke(this.hue, this.saturation, this.lightness); strokeWeight(3);
		line(this.u.x, this.u.y, this.v.x, this.v.y);
		if(this.direction == 0){
			// u -> v
			let angle = lineangle(this.v.x, this.v.y, this.u.x, this.u.y);
			let borderpoint = {};
			borderpoint.x = this.v.x - Math.cos(angle)*this.v.r;
			borderpoint.y = this.v.y - Math.sin(angle)*this.v.r;
			line(borderpoint.x, borderpoint.y, borderpoint.x - Math.cos(angle + Math.PI/6)*15, borderpoint.y - Math.sin(angle + Math.PI/6)*15);
			line(borderpoint.x, borderpoint.y, borderpoint.x - Math.cos(angle - Math.PI/6)*15, borderpoint.y - Math.sin(angle - Math.PI/6)*15);
		}else if(this.direction == 1){
			// u <- v
			let angle = lineangle(this.u.x, this.u.y, this.v.x, this.v.y);
			let borderpoint = {};
			borderpoint.x = this.u.x - Math.cos(angle)*this.u.r;
			borderpoint.y = this.u.y - Math.sin(angle)*this.u.r;
			line(borderpoint.x, borderpoint.y, borderpoint.x - Math.cos(angle + Math.PI/6)*15, borderpoint.y - Math.sin(angle + Math.PI/6)*15);
			line(borderpoint.x, borderpoint.y, borderpoint.x - Math.cos(angle - Math.PI/6)*15, borderpoint.y - Math.sin(angle - Math.PI/6)*15);
		}

		fill(100); noStroke(100);
		text(this.label, min(this.u.x, this.v.x) + abs(this.u.x - this.v.x)/2, min(this.u.y, this.v.y) + abs(this.u.y - this.v.y)/2);
	}

	contains(x, y){
		return ptopdist(this.u.x, this.u.y, x, y) + ptopdist(x, y, this.v.x, this.v.y) - ptopdist(this.u.x, this.u.y, this.v.x, this.v.y) < 0.3;  
	}
}

class graph{
	constructor(){
		this.nodes = [];
		this.edges = [];
		this.selectednode = -1;
		this.selectededge = -1;
	}

	addnode(x, y, r){
		let n = new node(x, y, r);
		this.nodes.push(n);
		// print(this)
	}

	addegde(u, v){
		if(u != v){
			let e = new edge(this.nodes[u], this.nodes[v]);
			this.edges.push(e);
		}
		// print(this)
	}

	adddirectedegde(u, v){
		if(u != v){
			let e = new edge(this.nodes[u], this.nodes[v]);
			e.direction = 0;
			this.edges.push(e);
		}
		// print(this)
	}

	removenode(){
		if(this.selectednode != -1){
			for(let i=0; i<this.edges.length; i++){
				if(this.edges[i].u == this.nodes[this.selectednode] || this.edges[i].v == this.nodes[this.selectednode]){
					this.edges.splice(i, 1);
					i--;
				}
			}
			this.nodes.splice(this.selectednode, 1);
			this.selectednode = -1;
		}
		// print(this)
	}

	removeedge(){
		if(this.selectededge != -1){
			this.edges.splice(this.selectededge, 1);
			this.selectededge = -1;
		}
		// print(this)
	}

	selectnode(x, y){
		this.selectednode = -1;
		for(let i=this.nodes.length-1; i>=0; i--){
			if(this.nodes[i].contains(x, y)){
				this.selectednode = i;
				return;
			}
		}
	}

	selectedge(x, y){
		this.selectededge = -1;
		for(let i=this.edges.length-1; i>=0; i--){
			if(this.edges[i].contains(x, y)){
				this.selectededge = i;
				return;
			}
		}
	}

	draw(){
		for(let i=0; i<this.edges.length; i++){
			if(this.selectededge == i){
				this.edges[i].hue = 260;
			}else{
				this.edges[i].hue = 240;
			}
			this.edges[i].draw();
		}
		for(let i=0; i<this.nodes.length; i++){
			if(this.selectednode == i){
				this.nodes[i].hue = 20;
			}else{
				this.nodes[i].hue = 0;
			}
			this.nodes[i].draw();
		}
	}
}