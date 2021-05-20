var adj;
var vis;

function non_valid_labels(){
    re = /^\d{1,9}$/;
    let values = {}
    for(var i=0;i<ggraph.edges.length;i++){
        if(!re.test(ggraph.edges[i].label)){
            return true;
        }
        if(values.hasOwnProperty(ggraph.edges[i].label)){
            return true;
        }
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
        warn("Todas as arestas devem conter apenas números, todos distintos.")
        return;
    }
    if(!is_graph_connected()){
        warn("O grafo precisa ser conexo.");
        return;
    }
    // all requirements are met, start the algorithm
    var algo = new algorithm();
    // construct my pseudocode line by line:
    algo.add_step("input: Um grafo G com arestas de pesos distintos.");
    algo.add_step("output: F será a floresta geradora mínima de G.")
    algo.add_step("");
    algo.add_step("F é uma floresta, onde cada vértice de G é uma árvore.");
    algo.add_step("concluído <- falso");
    algo.add_step("Enquanto não concluído faça");
    algo.add_step("Ache os componentes conexos de F e nomeie cada vértice de G relacionado ao seu componente", 3);
    algo.add_step("Inicialize as arestas de peso mínimo de cada componente com o label 'nenhum'", 3);
    algo.add_step("para cada aresta uv de G faça", 3);
    algo.add_step("se u e v tiverem label diferente:", 6);
    algo.add_step("se uv tiver peso menor que a menor aresta do componente de u", 9);
    algo.add_step("Defina uv como a menor aresta do componente u", 12);
    algo.add_step("se uv tiver peso menor que a menor aresta do componente de v", 9);
    algo.add_step("Defina uv como a menor aresta do componente v", 12);
    algo.add_step("concluído <- verdadeiro", 3);
    algo.add_step("para cada componente em que a aresta de peso mínimo não têm label 'nenhum'", 3);
    algo.add_step("Adicione a aresta com peso mínimo para F", 6);
    algo.add_step("concluído <- falso", 6);
    algo.print(1);
    await sleep(25000);
    return;
}