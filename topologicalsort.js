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
            warn("graph contains cycle");
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
    // if (isempty()) {
    //     warn("empty graph");
    //     return;
    // }
    // if (!isdirected()) {
    //     warn("not a directed graph");
    //     return;
    // }
    // if (hascycle()) {
    //     warn("graph contains cycle");
    //     return;
    // }

    // let adjmatrix = [];
    // for (let i = 0; i < ggraph.nodes.length; i++) {
    //     const v = ggraph.nodes[i];
    //     adjmatrix.push([i]);
    //     for (let j = 0; j < ggraph.edges.length; j++) {
    //         const e = ggraph.edges[j];
    //         if (e.direction == 0 && e.v == v) {
    //             adjmatrix[i].push(ggraph.nodes.indexOf(e.u));
    //         } else if (e.direction == 1 && e.u == v) {
    //             adjmatrix[i].push(ggraph.nodes.indexOf(e.v));
    //         }
    //     }
    // }
    // console.log(adjmatrix);

    const algo = new algorithm();
    algo.add_step("input: um grafo acíclico direcionado");
    algo.add_step("output: uma ordenação topológica dos vértices do grafo");
    algo.add_step("");
    algo.add_step("enquanto houver vértices verdes:");
    algo.add_step("selecione um vértice u verde e pinte de amarelo", 3);
    algo.add_step("execute pinta_vértices_dfs(u)", 3);
    algo.add_step("");
    algo.add_step("pinta_vértices_dfs(vértice u):");
    algo.add_step("se o vértice u for vermelho:", 3);
    algo.add_step("retorne", 6);
    algo.add_step("se o vértice u for azul:", 3);
    algo.add_step("o grafo não é acíclico, portanto pare", 6);
    algo.add_step("pinte u de azul", 3);
    algo.add_step("para cada vértice v com uma aresta u->v:", 3);
    algo.add_step("execute pinta_vértices_dfs(v)", 6);
    algo.add_step("pinte u de vermelho", 3);
    algo.add_step("adicione u na frente da lista", 3);

    async function topologicalsortdfs(node) {
        ggraph.selectedelement = 0;
        ggraph.selectedindex = node;
        await algo.print(8);
        await algo.print(9);
        if (marked[node]) {
            await algo.print(10);
            return;
        }
        await algo.print(11);
        if (visited[node]) {
            await algo.print(12);
            foundcycle.push(node);
            return;
        }

        ggraph.nodes[node].hue = 240; //azul
        await algo.print(13);
        visited[node] = true;
        for (let i = 0; i < adjacency_matrix.length; i++) {
            switch (adjacency_matrix[node][i]) {
                case -1:
                    break;
                case 1:
                    await algo.print(14);
                    await algo.print(15);
                    await topologicalsortdfs(i);
                    if (undirected.found) return;
                    if (foundcycle.length > 0) {
                        foundcycle.push(node);
                        return;
                    }
                    break;
                case 2:
                    undirected.found = true;
                    undirected.u = node;
                    undirected.v = i;
                    return;
            }
        }
        ggraph.nodes[node].hue = 0; //vermelho
        await algo.print(16);
        marked[node] = true;
        visited[node] = false;
        await algo.print(17);
        order.unshift(node);
        await reorder();
    }

    function get_unmarked() {
        for (let i = 0; i < marked.length; i++) {
            if (!marked[i]) return i;
        }
        return -1;
    }

    function reorder() {
        // console.log(order);
        const start = windowWidth * 0.2;
        const block = (windowWidth * 0.8) / order.length;
        for (let i = 0; i < order.length; i++) {
            const startx = ggraph.nodes[order[i]].x;
            const starty = ggraph.nodes[order[i]].y;
            const finalx = start + block * i;
            const finaly = windowHeight / 2; // Math.floor(Math.random() * windowHeight / 2) + windowHeight / 4;
            const stepx = (finalx - startx) / 1000;
            const stepy = (finaly - starty) / 1000;
            const starttime = Date.now();
            let currenttime = Date.now();
            const interval = setInterval(() => {
                currenttime = Date.now();
                ggraph.nodes[order[i]].x = startx + stepx * (currenttime - starttime);
                ggraph.nodes[order[i]].y = starty + stepy * (currenttime - starttime);
                if ((currenttime - starttime) >= 1000) {
                    clearInterval(interval);
                }
            });
            sleep(1000);
            ggraph.nodes[order[i]].x = finalx;
            ggraph.nodes[order[i]].y = finaly;
        }
    }

    let adjacency_matrix = ggraph.get_adjacency_matrix();
    // console.log(adjacency_matrix);

    await algo.print(3);
    let order = [];
    let foundcycle = [];
    let undirected = {found: false, u: -1, v: -1};
    let visited = new Array(adjacency_matrix.length);
    let marked = new Array(adjacency_matrix.length);
    for (let j = 0; j < visited.length; j++) {
        marked[j] = false;
        visited[j] = false;
    }

    let unmarked;
    while ((unmarked = get_unmarked()) >= 0) {
        await algo.print(4);
        ggraph.nodes[unmarked].hue = 60; //amarelo
        await algo.print(5);
        await algo.print(6);
        await topologicalsortdfs(unmarked);
        if (undirected.found) {
            ggraph.unselect();
            for (let i = 0; i < ggraph.nodes.length; i++) {
                ggraph.nodes[i].hue = 120;
            }
            ggraph.edges[ggraph.get_edge_index(undirected.u, undirected.v)].hue = 240;
            message = "graph contains an undirected edge: </br> ";
            message += `${ggraph.edges[ggraph.get_edge_index(undirected.u, undirected.v)].label}`;
            warn(message);
            return;
        }
        if (foundcycle.length > 0) {
            ggraph.unselect();
            for (let i = 0; i < ggraph.nodes.length; i++) {
                ggraph.nodes[i].hue = 120;
            }
            message = "graph contains a cycle: </br> ";
            message2 = `${ggraph.nodes[foundcycle[0]].label}`;
            for (let i = 1; i < foundcycle.length; i++) {
                ggraph.nodes[foundcycle[i]].hue = 180;
                ggraph.edges[ggraph.get_edge_index(ggraph.nodes[foundcycle[i]], ggraph.nodes[foundcycle[i - 1]])].hue = 240;
                message2 = `${ggraph.nodes[foundcycle[i]].label} ` + message2;
                // console.log(foundcycle[i]);
                if (foundcycle[0] == foundcycle[i]) break;
            }
            warn(message + message2);
            return;
        }
    }

    ggraph.unselect();
    for (let i = 0; i < ggraph.nodes.length; i++) {
        ggraph.nodes[i].hue = 120;
    }
    return;

    // let orphans = [];
    // for (let i = 0; i < adjmatrix.length; i++) {
    //     if (adjmatrix[i].length == 1) {
    //         orphans.push(i);    
    //     }
    // }

    // while (orphans.length > 0) {
    //     order.push(orphans[0]);    
    //     for (let i = 0; i < adjmatrix.length; i++) {
    //         const pos = adjmatrix[i].indexOf(orphans[0]);    
    //         if (pos != -1) {
    //             adjmatrix[i].splice(pos, 1);    
    //             if (adjmatrix[i].length == 1) {
    //                 orphans.push(adjmatrix[i][0]);    
    //             }
    //         }
    //     }
    //     orphans.shift();
    // }

    // for (let i = 0; i < ggraph.nodes.length; i++) {
    //     ggraph.nodes[i].label = "";    
    //     ggraph.nodes[i].hue = 0;
    // }    
}
