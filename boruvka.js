var adj;
var vis;

function non_valid_labels(){
    re = /^\d{1,9}$/;
    let values = {}
    for(var i=0;i<ggraph.edges.length;i++){
        if(!re.test(ggraph.edges[i].label)){
            return true;
        }
        /*if(values.hasOwnProperty(ggraph.edges[i].label)){
            return true;
        }*/
        values[ggraph.edges[i].label] = true;
    }
    return false;
}

async function boruvka(){
    warn("");
    console.log(ggraph)
    if(!only_edges_with_label()){
        warn("Todas as arestas devem conter custos.")
        return;
    }
    if(non_valid_labels()){
        warn("Todas as arestas devem conter apenas números.")
        return;
    }
    if(!is_graph_connected()){
        warn("O grafo precisa ser conexo.");
        return;
    }
    // all requirements are met, start the algorithm
    var algo = new algorithm();
    // construct my pseudocode line by line:
    algo.add_step("input: Um grafo G com arestas com pesos.");
    algo.add_step("output: F será a floresta geradora mínima de G.")
    algo.add_step("");
    algo.add_step("F é uma floresta, onde cada vértice de G é uma árvore.");
    algo.add_step("concluído <- falso");
    algo.add_step("Enquanto não concluído faça");
    algo.add_step("Ache os componentes conexos de F e nomeie cada vértice de G relacionado ao seu componente", 3);
    algo.add_step("Inicialize as arestas de peso mínimo de cada componente com oo", 3);
    algo.add_step("para cada aresta uv de G faça", 3);
    algo.add_step("se u e v tiverem label diferente:", 6);
    algo.add_step("se uv tiver peso menor que a menor aresta do componente de u", 9);
    algo.add_step("Defina uv como a menor aresta do componente u", 12);
    algo.add_step("se uv tiver peso menor que a menor aresta do componente de v", 9);
    algo.add_step("Defina uv como a menor aresta do componente v", 12);
    algo.add_step("concluído <- verdadeiro", 3);
    algo.add_step("para cada componente em que a aresta de peso mínimo não é oo", 3);
    algo.add_step("Adicione a aresta com peso mínimo para F", 6);
    algo.add_step("concluído <- falso", 6);
    P = {}; SZ = {}; //parent, size => dsu
    let root = (u) => {return P[u.hash()] = (u == P[u.hash()] ? u : root(P[u.hash()]));}
    let swap = (x) => {return x;}
    let union = (u, v) => { // edge has been selected as part of mst
        console.log(u, v);
        console.log(P);
        ggraph.edges[ggraph.get_edge_index(u, v)].hue = 275;
        u = root(u); v = root(v);
        if(u != v){
            if(SZ[u.hash()] < SZ[v.hash()]){
                u = swap(v, v=u);
            }
            SZ[u.hash()] += SZ[v.hash()];
            P[v.hash()] = P[u.hash()];
        }
        console.log(P);
    };
    E = {}; // cheapest edge for every component
    for(var i = 0;i < ggraph.nodes.length; i++){
        P[ggraph.nodes[i].hash()] = ggraph.nodes[i]; // cada vértice tem seu próprio componente.
        SZ[ggraph.nodes[i].hash()] = 1;
    }
    let reset_cheapest_edges = () => {
        for(var i=0; i < ggraph.nodes.length;i++){
           E[root(ggraph.nodes[i]).hash()] = [Infinity, -1];
        }
    };
    await algo.print(3);
    let completed = false;
    await algo.print(4);
    while(!completed){ await algo.print(5);
        await algo.print(6); // already computed via dsu, no need to recompute
        reset_cheapest_edges(); await algo.print(7);
        for(var i=0;i<ggraph.edges.length;i++){ await algo.print(8);
            await algo.print(9);
            var u = ggraph.edges[i].u;
            var v = ggraph.edges[i].v;
            var c = parseInt(ggraph.edges[i].label);
            console.log(u, v, root(u), root(v));
            console.log(root(u) != root(v));
            if(root(u) != root(v)){
                await algo.print(10);
                if(c < E[root(u).hash()][0] || (c == E[root(u).hash()][0] && i < E[root(u).hash()][1])){
                    await algo.print(11);
                    E[root(u).hash()] = [c, i];
                }
                await algo.print(12);
                if(c < E[root(v).hash()][0] || (c == E[root(v).hash()][0] && i < E[root(v).hash()][1])){
                    await algo.print(13);
                    E[root(v).hash()] = [c, i];
                }
            }
        }
        completed = true;
        await algo.print(14);
        comps = Object.keys(E);
        for(var i=0;i<comps.length;i++){
            k = comps[i];
            if(E[k][0] != Infinity){
                await algo.print(15);
                union(ggraph.edges[E[k][1]].u, ggraph.edges[E[k][1]].v);
                await algo.print(16);
                completed = false;
                await algo.print(17);
            }
        }
        E = {}; // clear edges.
    }

    await sleep(25000);
    return;
}