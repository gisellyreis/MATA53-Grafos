let ggraph = new graph();
let inputbox;
let canvas;
function setup(){
	setbackground();
	setelements();

	ellipseMode(RADIUS)
	frameRate(30);
	colorMode(HSL);
	textAlign(CENTER, CENTER);
	textStyle(BOLD);
	textSize(20);
}

function draw(){
	background(0);
	ggraph.draw();

	if(ggraph.selectednode != -1 && mouseIsPressed && keyIsDown(SHIFT)){
		stroke(240, 100, 50); strokeWeight(1);
		let dx = mouseX;
		let dy = mouseY;
		for(let i=ggraph.nodes.length-1; i>=0; i--){
			if(ggraph.nodes[i].contains(mouseX, mouseY)){
				dx = ggraph.nodes[i].x;
				dy = ggraph.nodes[i].y;
				break;
			}
		}
		line(dx, dy, ggraph.nodes[ggraph.selectednode].x, ggraph.nodes[ggraph.selectednode].y);
	}
}

function setbackground(){
	// create canvas behind all elements
		canvas = createCanvas(windowWidth, windowHeight);
		canvas.style("z-index", -1);

	// center canvas
		const x = (windowWidth - width) / 2;
		const y = (windowHeight - height) / 2;
		canvas.position(x, y);

	background(0);
}

function setelements(){
	//inputbox
		inputbox = document.createElement("input");
		inputbox.type = "text";
		inputbox.id = "inputbox";
		inputbox.value = "";
		inputbox.style.width = 150;
		inputbox.style.position = "absolute";
		inputbox.style.top = "20px";
		inputbox.style.left = "20px";
		inputbox.style.zIndez = 1;
		inputbox.addEventListener("input", (e) => {
			if(ggraph.selectednode != -1){
				ggraph.nodes[ggraph.selectednode].label = inputbox.value;
			}else if(ggraph.selectededge != -1){
				ggraph.edges[ggraph.selectededge].label = inputbox.value;
			}
		});
		document.body.appendChild(inputbox);
	
	//canvas
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
				inputbox.value = ggraph.nodes[ggraph.selectednode].label;
				ggraph.selectededge = -1;
			}else{
				ggraph.selectedge(mouseX, mouseY);
				// print("selectededge ", ggraph.selectededge);
				if(ggraph.selectededge != -1){
					inputbox.value = ggraph.edges[ggraph.selectededge].label;
					if(keyIsDown(SHIFT)){
						ggraph.edges[ggraph.selectededge].direction = (ggraph.edges[ggraph.selectededge].direction + 1)%3; 
					}
				}
			}
		});

		canvas.mouseReleased(() => {
			if(keyIsDown(SHIFT)){
				for(let i=ggraph.nodes.length-1; i>=0; i--){
					if(ggraph.nodes[i].contains(mouseX, mouseY)){
						ggraph.addegde(ggraph.selectednode, i);
						// print("added edge");
						break;
					}
				}
			}
		});

		canvas.mouseMoved(() => {
			if(mouseIsPressed){
				if(ggraph.selectednode != -1){
					if(!keyIsDown(SHIFT)){
						ggraph.nodes[ggraph.selectednode].update(mouseX, mouseY);
					}
				}
			}
		});

		function keyPressed(){
			if(keyCode === DELETE){
				// print("remove ", ggraph.selectednode);
				ggraph.removenode();
				// print("remove ", ggraph.selectededge);
				ggraph.removeedge();
			}
		}
}