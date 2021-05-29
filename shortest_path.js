async function Johnsons(source, target) {

    var code = new algorithm();

    code.add_step("Grafo direcionado");
    code.add_step("Bellman-Ford", 3);
    code.add_step("Recalcula peso das arestas", 3);
    code.add_step("Dijkstra", 3);
    code.add_step("Fim", 3);

    // step 1 and 2: use bellman ford to calculate h(x) for every x in the graph
    // h(x) is the minimum value i can get for starting in any node in the graph
    // and making a path to x. 
    // to achieve this we create a fictional node Q connected to every node in the graph
    // with distance 0.
    
    await code.print(1);
    h = await Bellman();
    if(!h){
        return;
    }

    await code.print(2);
    // reweight the edges using h:
    for(let i=0; i < ggraph.edges.length; i++){
        let u = ggraph.edges[i].uidx;
        let v = ggraph.edges[i].vidx;
        let c = parseInt(ggraph.edges[i].label);
        c += h[u] - h[v];
        ggraph.edges[i].label = c.toString();
    }

    // finally: run dijkstra to find the shortest path between these two nodes.
    await code.print(3);
    await Dijkstra(source, target);
    await code.print(4);
}
async function Bellman() {
    let h = [], from = [];
    let n = ggraph.nodes.length;
    for(let i=0; i < n; i++){
        h.push(0);
        from.push(0);
    }
    // h is the distance from Q to every node in the graph.
    // since it is connected with everyone with distance 0,
    // we can start h with N zeroes to represent the start
    // of the bellman-ford algorithm.
    let m = ggraph.edges.length;
    for(let i=0; i < n-1; i++){
        for(let j=0; j < m; j++){
            let u = ggraph.edges[j].uidx;
            let v = ggraph.edges[j].vidx;
            let c = parseInt(ggraph.edges[j].label);
            if(h[v] > h[u] + c){
                h[v] = h[u] + c;
                from[v] = u;
            }
        }
    }
    for(let j=0; j < m; j++){ // if at the nth iteration there is a relaxation, there is a negative cycle.
        let u = ggraph.edges[j].uidx;
        let v = ggraph.edges[j].vidx;
        let c = parseInt(ggraph.edges[j].label);
        if(h[v] > h[u] + c){
            used = {};
            let at = v;
            while(true){
                ggraph.edges[ggraph.get_edge_index(at, from[at])].hue = 240;
                used[at] = 1;
                if(used.hasOwnProperty(from[at])){
                    break;
                }
                at = from[at];
            }
            warn("Existe um ciclo negativo no grafo.");
            return null;
        }
    }
    return h;
}

async function Dijkstra(source, target) {
    let n = ggraph.nodes.length;
    distance = [];
    vis = [];
    for(let i=0;i<n;i++){
        distance.push(Infinity);
        vis.push(false);
    }
    let adj = ggraph.get_adjacency_list();
    distance[source] = 0;
    for(let it=0; it < n; it++){
        let u = -1;
        for(let v=0; v < n; v++){
            if(!vis[v] && (u == -1 || distance[v] < distance[u])){
                u = v;
            }
        }
        if(distance[u] == Infinity){
            break;
        }
        vis[u] = true;
        for(let e=0; e < adj[u].length; e++){
            let v = adj[u][e];
            let c = parseInt(ggraph.edges[ggraph.get_edge_index(u, v)].label);
            if(distance[v] > distance[u] + c){
                distance[v] = distance[u] + c;
            }
        }
    }
    // minimum distance from source to every node now stored in distance array.
    for(let i=0;i<n;i++){
        ggraph.nodes[i].label = distance[i].toString();
    }
}


