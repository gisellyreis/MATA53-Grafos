
function isempty() {
    return ggraph.nodes.length == 0;
}

function isdirected() {
    for (let i = 0; i < ggraph.edges.length; i++) {
        if (ggraph.edges[i].direction == 2) {
            console.log("not a directed graph");
            return false;
        }
    }
    return true;
}

function hascycle() {
    let adjmatrix = [];
    for (let i = 0; i < ggraph.nodes.length; i++) {
        const u = ggraph.nodes[i];
        adjmatrix.push([i]);
        for (let j = 0; j < ggraph.edges.length; j++) {
            const e = ggraph.edges[j];
            if (e.direction == 0 && e.u == u) {
                adjmatrix[i].push(ggraph.nodes.indexOf(e.v));
            } else if (e.direction == 1 && e.v == u) {
                adjmatrix[i].push(ggraph.nodes.indexOf(e.u));
            }
        }
    }

    let stack = [];
    let visited = new Array(ggraph.nodes.length);

    function hascycledfs() {
        const childrenstacktop = adjmatrix[stack[stack.length - 1]];
        for (let i = 1; i < childrenstacktop.length; i++) {
            const child = childrenstacktop[i];
            if (!visited[child]) {
                visited[child] = true;
                stack.push(child);
                if (hascycledfs()) {
                    return true;
                }
            } else {
                for (let j = 0; j < stack.length; j++) {
                    if (child == stack[j]) return true;
                }
                return false;
            }
        }
        stack.pop();
        return false;
    }

    for (let i = 0; i < ggraph.nodes.length; i++) {
        for (let j = 0; j < visited.length; j++) {
            visited[j] = false;
        }
        stack.push(i);
        visited[i] = true;
        if (hascycledfs()) {
            console.log("graph contains cycle");
            return true;
        }
    }
}

function componentreps() {
    let adjmatrix = new Array(ggraph.nodes.length);
    for (let i = 0; i < adjmatrix.length; i++) {
        adjmatrix[i] = [i];
    }
    for (let i = 0; i < adjmatrix.length; i++) {
        const u = ggraph.nodes[i];
        for (let j = 0; j < ggraph.edges.length; j++) {
            const e = ggraph.edges[j];
            if (e.u == u) {
                adjmatrix[i].push(ggraph.nodes.indexOf(e.v));
                adjmatrix[ggraph.nodes.indexOf(e.v)].push(i);
            }
        }
    }
    // console.log("adjmat", adjmatrix)


    let visited = new Array(adjmatrix.length);
    for (let i = 0; i < visited.length; i++) {
        visited[i] = false;
    }
    let representatives = [];
    let queue = [];

    function componentrepsbfs() {
        while (queue.length != 0) {
            // console.log("queue", queue)
            // console.log("vis", visited)
            const connectionsqueuefront = adjmatrix[queue[0]];
            // console.log("connectionsqueuefront", connectionsqueuefront)
            for (let i = 1; i < connectionsqueuefront.length; i++) {
                // console.log("connectionsqueuefront i", connectionsqueuefront[i])
                if (!visited[connectionsqueuefront[i]]) {
                    visited[connectionsqueuefront[i]] = true;
                    queue.push(connectionsqueuefront[i]);
                    // console.log("visited and pushed", i)
                }
            }
            queue.shift();
        }
    }

    for (let i = 0; i < adjmatrix.length; i++) {
        // console.log("trying", i)
        if (!visited[i]) {
            // console.log("visited and pushed", i)
            visited[i] = true;
            representatives.push(i);
            queue.push(i);
            componentrepsbfs();
        }
    }

    return representatives;
}

async function topologicalsort() {
    running = true;
    ggraph.unselect();
    let adjmatrix = [];
    for (let i = 0; i < ggraph.nodes.length; i++) {
        const v = ggraph.nodes[i];
        adjmatrix.push([i]);
        for (let j = 0; j < ggraph.edges.length; j++) {
            const e = ggraph.edges[j];
            if (e.direction == 0 && e.v == v) {
                adjmatrix[i].push(ggraph.nodes.indexOf(e.u));
            } else if (e.direction == 1 && e.u == v) {
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
    for (let i = 0; i < adjmatrix.length; i++) {
        if (adjmatrix[i].length == 1) {
            orphans.push(i);
        }
    }

    while (orphans.length > 0) {
        order.push(orphans[0]);
        for (let i = 0; i < adjmatrix.length; i++) {
            const pos = adjmatrix[i].indexOf(orphans[0]);
            if (pos != -1) {
                adjmatrix[i].splice(pos, 1);
                if (adjmatrix[i].length == 1) {
                    orphans.push(adjmatrix[i][0]);
                }
            }
        }
        orphans.shift();
    }

    for (let i = 0; i < ggraph.nodes.length; i++) {
        ggraph.nodes[i].label = "";
        ggraph.nodes[i].hue = 0;
        ggraph.nodes[i].sorted = false;
    }

    // console.log(order)
    for (let i = 0; i < order.length; i++) {
        await new Promise(r => setTimeout(r, 1000));
        ggraph.nodes[order[i]].label = i;
        ggraph.nodes[order[i]].sorted = true;
    }

    // let representatives = componentreps();
    // console.log("reps", representatives);
    // for(let i=0; i<representatives.length; i++){
    //     stack.push(representatives[i]);
    //  visited[i] = true;
    //     topologicalsortdfs(0);
    // }
    running = false;
}
