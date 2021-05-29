async function Johnsons(source, target) {

    // step 1 and 2: use bellman ford to calculate h(x) for every x in the graph
    // h(x) is the minimum value i can get for starting in any node in the graph
    // and making a path to x. 
    // to achieve this we create a fictional node Q connected to every node in the graph
    // with distance 0.
    h = await Bellman();
    if(!h){
        return;
    }
    // reweight the edges using h:
    for(let i=0; i < ggraph.edges.length; i++){
        let u = ggraph.edges[i].uidx;
        let v = ggraph.edges[i].vidx;
        let c = parseInt(ggraph.edges[i].label);
        c += h[u] - h[v];
        ggraph.edges[i].label = c.toString();
    }

    // finally: run dijkstra to find the shortest path between these two nodes.
    await Dijkstra(source, target);
}
async function Bellman() {
    let algo = new algorithm();
    algo.add_step("G é um grafo com n nós.")
    algo.add_step("Inicialize dois vetores D e P de tamanho n.\n     D é o vetor de distâncias e P o vetor auxiliar para detectar ciclo negativo.");
    algo.add_step("")
    algo.add_step("Repita n-1 vezes:")
    algo.add_step("Para cada aresta (u, v) com peso c em G faça:", 3);
    algo.add_step("se D[v] > D[u] + c então:", 6);
    algo.add_step("D[v] = D[u] + c", 9);
    algo.add_step("P[v] = u", 9);
    algo.add_step("");
    algo.add_step("Agora se for possível relaxar o custo de mais algum caminho, então temos um ciclo negativo:");
    algo.add_step("Para cada aresta (u, v) com peso c em G faça:");
    algo.add_step("se D[v] > D[u] + c então:", 3);
    algo.add_step("T = {}", 6);
    algo.add_step("w = v", 6);
    algo.add_step("enquanto P[w] não é -1 faça:", 6);
    algo.add_step("T = T + w", 9);
    algo.add_step("k = P[w]", 9);
    algo.add_step("P[w] = -1", 9);
    algo.add_step("w = k", 9);
    algo.add_step("G contém o ciclo negativo T.", 6);
    algo.add_step("se G não conter ciclos negativos, retorne D")
    let h = [], from = [];
    let n = ggraph.nodes.length;
    for(let i=0; i < n; i++){
        h.push(0);
        from.push(0);
    }
    await algo.print(1);
    // h is the distance from Q to every node in the graph.
    // since it is connected with everyone with distance 0,
    // we can start h with N zeroes to represent the start
    // of the bellman-ford algorithm.
    let m = ggraph.edges.length;
    for(let i=0; i < n-1; i++){
        await algo.print(3);
        for(let j=0; j < m; j++){
            await algo.print(4);
            let old_hue = ggraph.edges[j].hue;
            ggraph.edges[j].hue = 150;
            let u = ggraph.edges[j].uidx;
            let v = ggraph.edges[j].vidx;
            let c = parseInt(ggraph.edges[j].label);
            await algo.print(5);
            if(h[v] > h[u] + c){
                h[v] = h[u] + c;
                await algo.print(6);
                from[v] = u;
                await algo.print(7);
            }
            ggraph.edges[j].hue = old_hue;
        }
    }
    await algo.print(8); await algo.print(9);
    for(let j=0; j < m; j++){ // if at the nth iteration there is a relaxation, there is a negative cycle.
        await algo.print(10);
        let old_hue = ggraph.edges[j].hue;
        ggraph.edges[j].hue = 150;
        let u = ggraph.edges[j].uidx;
        let v = ggraph.edges[j].vidx;
        let c = parseInt(ggraph.edges[j].label);
        await algo.print(11);
        if(h[v] > h[u] + c){
            ggraph.edges[j].hue = old_hue;
            await algo.print(12);
            let at = v;
            await algo.print(13);
            while(from[at] != -1){
                await algo.print(14);
                ggraph.edges[ggraph.get_edge_index(at, from[at])].hue = 240;
                await algo.print(15);
                let x = from[at];
                await algo.print(16);
                from[at] = -1;
                await algo.print(17);
                at = x;
                await algo.print(18);
            }
            warn("Existe um ciclo negativo no grafo.");
            await algo.print(19);
            return null;
        }
        ggraph.edges[j].hue = old_hue;
    }
    await algo.print(20);
    return h;
}

async function Dijkstra(source, target) {
    let algo = new algorithm();
    algo.add_step("G é um grafo com n nós. s é um vértice de G. Calcularemos a menor distância de todos os vértices até s.");
    algo.add_step("Inicialize dois vetores D e V de tamanho n.\n     D é o vetor de distâncias e V o vetor que diz se um vértice já foi utilizado.");
    algo.add_step("D é inicializado com D[v] = oo para cada vértice v em G.");
    algo.add_step("V é inicializado com V[v] = false para cada vértice v em G.");
    algo.add_step("");
    algo.add_step("D[s] = 0");
    algo.add_step("Enquanto houver vértices não visitados faça:");
    algo.add_step("seja u um vértice v de G não visitado com menor valor D[v].", 3);
    algo.add_step("se D[u] é oo então:", 3);
    algo.add_step("Pare.", 6);
    algo.add_step("V[u] = true", 3);
    algo.add_step("para cada vértice v conectado à u com peso c faça:", 3);
    algo.add_step("se D[v] > D[u] + c então:", 6);
    algo.add_step("D[v] = D[u] + c", 9);
    algo.add_step("Retorne D.");
    let n = ggraph.nodes.length;
    distance = [];
    vis = [];
    for(let i=0;i<n;i++){
        distance.push(Infinity);
        vis.push(false);
        ggraph.nodes[i].label = 'oo';
    }
    await algo.print(1);
    let adj = ggraph.get_adjacency_list();
    distance[source] = 0;
    ggraph.nodes[source].label = '0';
    await algo.print(5);
    for(let it=0; it < n; it++){
        await algo.print(6);
        let u = -1;
        for(let v=0; v < n; v++){
            if(!vis[v] && (u == -1 || distance[v] < distance[u])){
                u = v;
            }
        }
        await algo.print(7);
        await algo.print(8);
        if(distance[u] == Infinity){
            await algo.print(9);
            break;
        }
        ggraph.nodes[u].hue = 0;
        ggraph.nodes[u].saturation = 0;
        vis[u] = true;
        await algo.print(10);
        for(let e=0; e < adj[u].length; e++){
            let v = adj[u][e];
            let idx = ggraph.get_edge_index(u, v);
            let old_hue = ggraph.edges[idx].hue;
            ggraph.edges[idx].hue = 150;
            await algo.print(11);
            let c = parseInt(ggraph.edges[idx].label);
            
            await algo.print(12);
            if(distance[v] > distance[u] + c){
                await algo.print(13);
                distance[v] = distance[u] + c;
                ggraph.nodes[v].label = distance[v].toString();
            }
            ggraph.edges[idx].hue = old_hue;
        }
    }
    for(let i=0;i<n;i++){
        ggraph.nodes[i].hue = 120;
        ggraph.nodes[i].saturation = 70;
    }
    await algo.print(14);
    // minimum distance from source to every node now stored in distance array.
    return distance;
}


