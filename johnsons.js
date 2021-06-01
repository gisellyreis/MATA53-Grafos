async function Johnsons() {
    if (!only_edges_with_label()) {
        warn("ERRO: Todas as arestas devem conter custos.");
        return;
    }
    if (non_valid_labels()) {
        warn("ERRO: Todas as arestas devem conter apenas números.");
        return;
    }
    if (!isdirected()) {
        warn("ERRO: Todas as arestas devem ser direcionadas.");
        return;
    }
    if (isempty()) {
        warn("ERRO: Grafo vazio");
        return;
    }
    if (ggraph.nodes.length < 2) {
        warn("ERRO: O grafo precisa ter no mínimo dois vértices");
        return;
    }

    ggraph.unselect();
    ggraph.allow_select = true;
    warn("Primeiro escolha o nó de partida");
    while (ggraph.selectedelement != element.node) await sleep(50);
    let source = ggraph.selectedindex;
    ggraph.nodes[source].lightness -= 25;
    ggraph.unselect();
    warn("Agora escolha o nó de destino");
    while (ggraph.selectedelement != element.node || ggraph.selectedindex == source) await sleep(50);
    let target = ggraph.selectedindex;
    ggraph.nodes[source].lightness += 25;
    ggraph.allow_select = false;
    ggraph.unselect();

    // console.log(source, target);

    var code = new algorithm();

    code.add_step("se G um grafo direcionado, source e target os vértices selecionados.");
    code.add_step("seja H a lista resultante do algoritmo de Bellman-Ford começando de um vértice\n   fictício 'q' que é conectado com todos os outros vértices com peso 0.");
    code.add_step("para cada aresta (u, v) com peso c de G faça:");
    code.add_step("atualize o valor de c para c + H[u] - H[v].", 4);
    code.add_step("seja D a lista resultante do algoritmo de Dijkstra começando em source.");
    code.add_step("a menor distância entre os source e target é D[target] + H[target] - H[source].");

    // step 1 and 2: use bellman ford to calculate h(x) for every x in the graph
    // h(x) is the minimum value i can get for starting in any node in the graph
    // and making a path to x. 
    // to achieve this we create a fictional node Q connected to every node in the graph
    // with distance 0.
    await code.print(0);
    await code.print(1, 1500);
    h = await Bellman();
    if (!h) {
        return;
    }

    // reweight the edges using h:
    for (let i = 0; i < ggraph.edges.length; i++) {
        let u = ggraph.edges[i].uidx;
        let v = ggraph.edges[i].vidx;
        let old_hue = ggraph.edges[i].hue;
        ggraph.edges[i].hue = 150;
        await code.print(2);
        let c = parseInt(ggraph.edges[i].label);
        c += h[u] - h[v];
        await code.print(3);
        ggraph.edges[i].label = c.toString();
        ggraph.edges[i].hue = old_hue;
    }

    // finally: run dijkstra to find the shortest path between these two nodes.
    await code.print(3, 1500);
    let res = await Dijkstra(source, target);
    await code.print(4);
    for (let i = 0; i < ggraph.nodes.length; i++) {
        if (ggraph.nodes[i].label != "oo") ggraph.nodes[i].label = (res[i] + h[i] - h[source]).toString();
    }
    for (let i = 0; i < ggraph.edges.length; i++) {
        let u = ggraph.edges[i].uidx;
        let v = ggraph.edges[i].vidx;
        let c = parseInt(ggraph.edges[i].label);
        c -= h[u] - h[v];
        ggraph.edges[i].label = c.toString();
    }
    await code.print(5, 1500);
    warn("A menor distância entre os dois vértices escolhidos é de: " + ggraph.nodes[target].label);

}

async function Bellman() {
    let algo = new algorithm();
    algo.add_step("Bellman-Ford:\n   G é um grafo com n nós.");
    algo.add_step("Inicialize dois vetores D e P de tamanho n.\n   D é o vetor de distâncias e P o vetor auxiliar para detectar ciclo negativo.");
    algo.add_step("");
    algo.add_step("Repita n-1 vezes:");
    algo.add_step("Para cada aresta (u, v) com peso c em G faça:", 3);
    algo.add_step("se D[v] > D[u] + c então:", 6);
    algo.add_step("D[v] = D[u] + c", 9);
    algo.add_step("P[v] = u", 9);
    algo.add_step("");
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
    algo.add_step("se G não conter ciclos negativos, retorne D");
    let h = [], from = [];
    let n = ggraph.nodes.length;
    for (let i = 0; i < n; i++) {
        h.push(0);
        from.push([0, 0]);
    }
    await algo.print(1);
    // h is the distance from Q to every node in the graph.
    // since it is connected with everyone with distance 0,
    // we can start h with N zeroes to represent the start
    // of the bellman-ford algorithm.
    let m = ggraph.edges.length;
    for (let i = 0; i < n - 1; i++) {
        await algo.print(3);
        for (let j = 0; j < m; j++) {
            await algo.print(4);
            let old_hue = ggraph.edges[j].hue;
            ggraph.edges[j].hue = 150;
            let u = ggraph.edges[j].uidx;
            let v = ggraph.edges[j].vidx;
            let c = parseInt(ggraph.edges[j].label);
            await algo.print(5);
            if (h[v] > h[u] + c) {
                h[v] = h[u] + c;
                await algo.print(6);
                from[v] = [u, j];
                await algo.print(7);
            }
            ggraph.edges[j].hue = old_hue;
        }
    }
    await algo.print(8);
    for (let j = 0; j < m; j++) { // if at the nth iteration there is a relaxation, there is a negative cycle.
        await algo.print(10 - 1);
        let old_hue = ggraph.edges[j].hue;
        ggraph.edges[j].hue = 150;
        let u = ggraph.edges[j].uidx;
        let v = ggraph.edges[j].vidx;
        let c = parseInt(ggraph.edges[j].label);
        await algo.print(11 - 1);
        if (h[v] > h[u] + c) {
            ggraph.edges[j].hue = old_hue;
            await algo.print(12 - 1);
            let at = v;
            await algo.print(13 - 1);
            while (from[at][0] != -1) {
                await algo.print(14 - 1);
                ggraph.edges[from[at][1]].hue = 240;
                await algo.print(15 - 1);
                let x = from[at][0];
                await algo.print(16 - 1);
                from[at][0] = -1;
                await algo.print(17 - 1);
                at = x;
                await algo.print(18 - 1);
            }
            warn("ERRO: Existe um ciclo negativo no grafo.");
            await algo.print(19 - 1);
            return null;
        }
        ggraph.edges[j].hue = old_hue;
    }
    await algo.print(20 - 1);
    return h;
}

async function Dijkstra(source, target) {
    let algo = new algorithm();
    algo.add_step("Dijkstra:\n   G é um grafo com n nós. s é um vértice de G.\n   Calcularemos a menor distância de todos os vértices até s.");
    algo.add_step("Inicialize dois vetores D e V de tamanho n.\n   D é o vetor de distâncias e V o vetor que diz se um vértice já foi utilizado.");
    algo.add_step("D é inicializado com D[v] = oo para cada vértice v em G.");
    algo.add_step("V é inicializado com V[v] = falso para cada vértice v em G.");
    algo.add_step("");
    algo.add_step("D[s] = 0");
    algo.add_step("Enquanto houver vértices não visitados faça:");
    algo.add_step("seja u um vértice v de G não visitado com menor valor D[v].", 3);
    algo.add_step("se D[u] é oo então:", 3);
    algo.add_step("Pare.", 6);
    algo.add_step("V[u] = verdadeiro", 3);
    algo.add_step("para cada vértice v conectado à u com peso c faça:", 3);
    algo.add_step("se D[v] > D[u] + c então:", 6);
    algo.add_step("D[v] = D[u] + c", 9);
    algo.add_step("Retorne D.");
    let n = ggraph.nodes.length;
    distance = [];
    vis = [];
    for (let i = 0; i < n; i++) {
        distance.push(Infinity);
        vis.push(false);
        ggraph.nodes[i].label = 'oo';
    }
    await algo.print(1);
    let adj = ggraph.get_adjacency_list();
    distance[source] = 0;
    ggraph.nodes[source].label = '0';
    await algo.print(5);
    for (let it = 0; it < n; it++) {
        await algo.print(6);
        let u = -1;
        for (let v = 0; v < n; v++) {
            if (!vis[v] && (u == -1 || distance[v] < distance[u])) {
                u = v;
            }
        }
        await algo.print(7);
        await algo.print(8);
        if (distance[u] == Infinity) {
            await algo.print(9);
            break;
        }
        ggraph.nodes[u].hue = 0;
        ggraph.nodes[u].saturation = 0;
        vis[u] = true;
        await algo.print(10);
        adj[u] = adj[u].filter((value, index, self) => self.indexOf(value) === index);
        for (let e = 0; e < adj[u].length; e++) {
            let v = adj[u][e];
            let edges = ggraph.get_edges(u, v);
            for (let j = 0; j < edges.length; j++) {
                let idx = edges[j];
                let old_hue = ggraph.edges[idx].hue;
                ggraph.edges[idx].hue = 150;
                await algo.print(11);
                let c = parseInt(ggraph.edges[idx].label);

                await algo.print(12);
                if (distance[v] > distance[u] + c) {
                    await algo.print(13);
                    distance[v] = distance[u] + c;
                    ggraph.nodes[v].label = distance[v].toString();
                }
                ggraph.edges[idx].hue = old_hue;
            }
        }
    }
    for (let i = 0; i < n; i++) {
        ggraph.nodes[i].hue = 120;
        ggraph.nodes[i].saturation = 70;
    }
    await algo.print(14);
    // minimum distance from source to every node now stored in distance array.
    return distance;
}
