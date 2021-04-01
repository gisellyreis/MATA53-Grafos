let ggraph = new graph();
let canvas;
let inputbox;
let runbutton;
function setup(){
	setcanvas();
	setsidebar();

	ellipseMode(RADIUS)
	frameRate(30);
	colorMode(HSL);
	textAlign(CENTER, CENTER);
	textStyle(BOLD);
	textSize(20);
}

function draw(){
	background(0);

	if(ggraph.selectednode != -1){
		inputbox.value = ggraph.nodes[ggraph.selectednode].label;
	}else if(ggraph.selectededge != -1){
		inputbox.value = ggraph.edges[ggraph.selectededge].label;
	}else{
		inputbox.value = "edit label";
	}

	if(ggraph.selectednode != -1 && mouseIsPressed){
		stroke(240, 100, 50); strokeWeight(1);
		let dx = mouseX;
		let dy = mouseY;
		let nodemouseisin = -1;
		for(let i=ggraph.nodes.length - 1; i>=0; i--){
			if(ggraph.nodes[i].contains(mouseX, mouseY)){
				dx = ggraph.nodes[i].x;
				dy = ggraph.nodes[i].y;
				nodemouseisin = i;
				break;
			}
		}
		if(keyIsDown(SHIFT)){		
			line(dx, dy, ggraph.nodes[ggraph.selectednode].x, ggraph.nodes[ggraph.selectednode].y);
		}else if(keyIsDown(CONTROL)){
			line(dx, dy, ggraph.nodes[ggraph.selectednode].x, ggraph.nodes[ggraph.selectednode].y);
			if(ggraph.selectednode != nodemouseisin){
				function lineangle(xa, ya, xb, yb){
					return Math.atan2((ya-yb), (xa-xb));
				}
				let angle = lineangle(dx, dy, ggraph.nodes[ggraph.selectednode].x, ggraph.nodes[ggraph.selectednode].y);
				let arrowpoint = {};
				if(nodemouseisin == -1){
					arrowpoint.x = dx;
					arrowpoint.y = dy;
				}else{
					arrowpoint.x = ggraph.nodes[nodemouseisin].x - Math.cos(angle)*ggraph.nodes[nodemouseisin].r;
					arrowpoint.y = ggraph.nodes[nodemouseisin].y - Math.sin(angle)*ggraph.nodes[nodemouseisin].r;
				}
				line(arrowpoint.x, arrowpoint.y, arrowpoint.x - Math.cos(angle + Math.PI/6)*15, arrowpoint.y - Math.sin(angle + Math.PI/6)*15);
				line(arrowpoint.x, arrowpoint.y, arrowpoint.x - Math.cos(angle - Math.PI/6)*15, arrowpoint.y - Math.sin(angle - Math.PI/6)*15);		}
			}
	}

	ggraph.draw();
}

function setcanvas(){
	canvas = createCanvas(windowWidth, windowHeight);
	canvas.elt.style.zIndex = -1;

	const x = (windowWidth - width) / 2;
	const y = (windowHeight - height) / 2;
	canvas.position(x, y);

	canvas.doubleClicked(() => {
		if(ggraph.selectednode == -1 && ggraph.selectededge == -1){
			ggraph.addnode(mouseX, mouseY, 20);
			// print("added node");
		}
	});

	canvas.mousePressed(() => {
		ggraph.selectnode(mouseX, mouseY);
		// print("selectednode ", ggraph.selectednode);
		if(ggraph.selectednode != -1){
			ggraph.selectededge = -1;
		}else{
			ggraph.selectedge(mouseX, mouseY);
			// print("selectededge ", ggraph.selectededge);
			if(ggraph.selectededge != -1){
				if(keyIsDown(CONTROL)){
					ggraph.edges[ggraph.selectededge].direction = (ggraph.edges[ggraph.selectededge].direction + 1)%3; 
				}
			}else{
			}
		}
	});

	canvas.mouseReleased(() => {
		if(keyIsDown(SHIFT)){
			for(let i=ggraph.nodes.length - 1; i>=0; i--){
				if(ggraph.nodes[i].contains(mouseX, mouseY)){
					ggraph.addegde(ggraph.selectednode, i);
					// print("added edge");
					break;
				}
			}
		}else if(keyIsDown(CONTROL)){
			for(let i=ggraph.nodes.length - 1; i>=0; i--){
				if(ggraph.nodes[i].contains(mouseX, mouseY)){
					ggraph.adddirectedegde(ggraph.selectednode, i);
					// print("added edge");
					break;
				}
			}
		}
	});

	canvas.mouseMoved(() => {
		if(mouseIsPressed){
			if(ggraph.selectednode != -1){
				if(!keyIsDown(SHIFT) && !keyIsDown(CONTROL)){
					ggraph.nodes[ggraph.selectednode].update(mouseX, mouseY);
				}
			}
		}
	});
}

function keyPressed(){
	if(keyCode === DELETE){
		// print("remove ", ggraph.selectednode);
		ggraph.removenode();
		// print("remove ", ggraph.selectededge);
		ggraph.removeedge();
	}
}

function setsidebar(){
	let sidebardiv = document.createElement("div");
		sidebardiv.style.position = "absolute";
		sidebardiv.style.top = "20px";
		sidebardiv.style.left = "20px";
		sidebardiv.style.zIndex = 1;

	//inputbox
		inputbox = document.createElement("input");
			inputbox.type = "text";
			inputbox.id = "inputbox";
			inputbox.value = "edit label";
			inputbox.style.width = 150;
			inputbox.addEventListener("input", (e) => {
				if(ggraph.selectednode != -1){
					ggraph.nodes[ggraph.selectednode].label = inputbox.value;
				}else if(ggraph.selectededge != -1){
					ggraph.edges[ggraph.selectededge].label = inputbox.value;
				}
			});
		sidebardiv.appendChild(inputbox);

	//runbutton
		runbutton = document.createElement("button");
			runbutton.innerHTML = "run";
			runbutton.addEventListener("click", (e) => {
				if(!isempty() && isdirected() && !hascycle()){
					topologicalsort();
				}
			});
		sidebardiv.appendChild(runbutton);
	document.body.appendChild(sidebardiv);
}

function isempty(){
	return ggraph.nodes.length == 0;
}

function isdirected(){
	for(let i=0; i<ggraph.edges.length; i++){
		if(ggraph.edges[i].direction == 2){
			print("not a directed graph")
			return false;
		}
	}
	return true;
}

function hascycle(){
	let adjmatrix = [];
	for(let i=0; i<ggraph.nodes.length; i++){
		const u = ggraph.nodes[i];
		adjmatrix.push([i]);
		for(let j=0; j<ggraph.edges.length; j++){
			const e = ggraph.edges[j];
			if(e.direction == 0 && e.u == u){ 
				adjmatrix[i].push(ggraph.nodes.indexOf(e.v));
			}else if(e.direction == 1 && e.v == u){
				adjmatrix[i].push(ggraph.nodes.indexOf(e.u));
			}
		}
	}

	let stack = [];
	let visited = new Array(ggraph.nodes.length);
	
	function hascycledfs(){
		const childrenstacktop = adjmatrix[stack[stack.length - 1]];
		for(let i=1; i<childrenstacktop.length; i++){
			const child = childrenstacktop[i];
			if(!visited[child]){
				visited[child] = true;
				stack.push(child);
				if(hascycledfs()){
					return true;
				}
			}else{
				for(let j=0; j<stack.length; j++){
					if(child == stack[j]) return true; 
				}
				return false;
			}
		}
		stack.pop();
		return false;
	}

	for(let i=0; i<ggraph.nodes.length; i++){
		for(let j=0; j<visited.length; j++){
			visited[j] = false;
		}
		stack.push(i);
		visited[i] = true;
		if(hascycledfs()){
			print("graph contains cycle")
			return true;
		}
	}
}

function componentreps(){
	let adjmatrix = new Array(ggraph.nodes.length);
	for(let i=0; i<adjmatrix.length; i++){
		adjmatrix[i] = [i];
	}
	for(let i=0; i<adjmatrix.length; i++){
		const u = ggraph.nodes[i];
		for(let j=0; j<ggraph.edges.length; j++){
			const e = ggraph.edges[j];
			if(e.u == u){ 
				adjmatrix[i].push(ggraph.nodes.indexOf(e.v));
				adjmatrix[ggraph.nodes.indexOf(e.v)].push(i);
			}
		}
	}
	// print("adjmat", adjmatrix)


	let visited = new Array(adjmatrix.length);
	for(let i=0; i<visited.length; i++){
		visited[i] = false;
	}
	let representatives = [];
	let queue = [];

	function componentrepsbfs(){
		while(queue.length != 0){
			// print("queue", queue)
			// print("vis", visited)
			const connectionsqueuefront = adjmatrix[queue[0]];
			// print("connectionsqueuefront", connectionsqueuefront)
			for(let i=1; i<connectionsqueuefront.length; i++){
				// print("connectionsqueuefront i", connectionsqueuefront[i])
				if(!visited[connectionsqueuefront[i]]){
					visited[connectionsqueuefront[i]] = true;
					queue.push(connectionsqueuefront[i]);
					// print("visited and pushed", i)
				}
			}
			queue.shift();
		}
	}

	for(let i=0; i<adjmatrix.length; i++){
		// print("trying", i)
		if(!visited[i]){
			// print("visited and pushed", i)
			visited[i] = true;
			representatives.push(i);
			queue.push(i);
			componentrepsbfs();
		}
	}

	return representatives;
}

function topologicalsort(){
	let adjmatrix = [];
	for(let i=0; i<ggraph.nodes.length; i++){
		const v = ggraph.nodes[i];
		adjmatrix.push([i]);
		for(let j=0; j<ggraph.edges.length; j++){
			const e = ggraph.edges[j];
			if(e.direction == 0 && e.v == v){ 
				adjmatrix[i].push(ggraph.nodes.indexOf(e.u));
			}else if(e.direction == 1 && e.u == v){
				adjmatrix[i].push(ggraph.nodes.indexOf(e.v));
			}
		}
	}

	// let stack = [];
	// let visited = new Array(adjmatrix.length);
	// for(let j=0; j<visited.length; j++){
	// 	visited[j] = false;
	// }
	// let nodelabelcounter = 1;

	// function topologicalsortdfs(level){
	// 	const parentsstacktop = adjmatrix[stack[stack.length - 1]];
	// 	for(let i=1; i<parentsstacktop.length; i++){
	// 		const parent = parentsstacktop[i];
	// 		if(!visited[parent]){
	// 			visited[parent] = true;
	// 			stack.push(parent);
	// 			topologicalsortdfs(level + 1);
	// 		}
	// 	}
	// 	ggraph.nodes[parentsstacktop[0]].label = level;
	// 	nodelabelcounter++;
	// 	stack.pop();
	// }

	let order = [];
	let orphans = [];
	for(let i=0; i<adjmatrix.length; i++){
		if(adjmatrix[i].length == 1){
			orphans.push(i);
		}
	}

	while(orphans.length > 0){
		order.push(orphans[0]);
		for(let i=0; i<adjmatrix.length; i++){
			const pos = adjmatrix[i].indexOf(orphans[0]); 
			if(pos != -1){
				adjmatrix[i].splice(pos, 1);
				if(adjmatrix[i].length == 1){
					orphans.push(adjmatrix[i][0]);
				}
			}
		}
		orphans.shift();
	}

	// print(order)
	for(let i=0; i<order.length; i++){
		ggraph.nodes[order[i]].label = i;
	}

	// let representatives = componentreps();
	// print("reps", representatives);
	// for(let i=0; i<representatives.length; i++){
	// 	stack.push(representatives[i]);
	// 	visited[i] = true;
	// 	topologicalsortdfs(0);
	// }
}