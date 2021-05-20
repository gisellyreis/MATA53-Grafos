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
    var adj = [];
    for(var i=0;i<ggraph.nodes.length;i++) adj[i] = [];
    var vis = {};
    let dfs = async (u, idx, col) => {
        ggraph.nodes[u].label = idx;
        ggraph.nodes[u].hue = col;
        await sleep(150/multiplier);
        vis[u] = idx;
        for(var i=0;i<adj[u].length;i++){
            if(!vis[adj[u][i]]){
                await dfs(adj[u][i], idx, col);
            }
        }
    };
    E = {}; // cheapest edge for every component
    let reset_cheapest_edges = (n) => {
        for(var i=1; i < n;i++){
           E[i] = [Infinity, -1];
        }
    };
    await algo.print(3);
    let completed = false;
    await algo.print(4);
    while(!completed){ await algo.print(5);
        var comp = 1;
        for(var i=0;i<ggraph.nodes.length;i++) vis[i] = 0;
        algo.print(6);
        for(var i=0;i<ggraph.nodes.length;i++){
            if(!vis[i]){
                await dfs(i, comp++, i * (360 / ggraph.nodes.length));
            }
        }
        await algo.print(6);
        reset_cheapest_edges(comp); await algo.print(7);
        for(var i=0;i<ggraph.edges.length;i++){ await algo.print(8); 
            var old_hue = ggraph.edges[i].hue;
            ggraph.edges[i].hue = 35;
            await algo.print(9);
            var u = ggraph.edges[i].u;
            var v = ggraph.edges[i].v;
            var iu = ggraph.nodes.indexOf(u);
            var iv = ggraph.nodes.indexOf(v);
            var c = parseInt(ggraph.edges[i].label);
            if(vis[iu] != vis[iv]){
                iu = vis[iu]; 
                iv = vis[iv];
                await algo.print(10);
                if(c < E[iu][0] || (c == E[iu][0] && i < E[iu][1])){
                    await algo.print(11);
                    E[iu] = [c, i];
                }
                await algo.print(12);
                if(c < E[iv][0] || (c == E[iv][0] && i < E[iv][1])){
                    await algo.print(13);
                    E[iv] = [c, i];
                }
            }
            ggraph.edges[i].hue = old_hue;
        }
        completed = true;
        await algo.print(14);
        comps = Object.keys(E);
        for(var i=0;i<comps.length;i++){
            k = comps[i];
            if(E[k][0] != Infinity){
                await algo.print(15);
                var u = ggraph.nodes.indexOf(ggraph.edges[E[k][1]].u), v = ggraph.nodes.indexOf(ggraph.edges[E[k][1]].v);
                adj[u].push(v); adj[v].push(u); ggraph.edges[E[k][1]].hue = 275;
                await algo.print(16);
                completed = false;
                await algo.print(17);
            }
        }
        E = {}; // clear edges.
        vis = {}; // clear components
        for(var i=0;i<ggraph.nodes.length;i++){
            ggraph.nodes[i].label = "";
            ggraph.nodes[i].hue = 120;
        }
    }
    await sleep(15000/multiplier);
    for(var i=0;i<ggraph.edges.length;i++){
        ggraph.edges[i].hue = 0;
    }
    return;
}