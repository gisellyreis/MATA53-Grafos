// retorna todos os vizinhos do nó u
function neighbor(u) {
    var adjmatrix = ggraph.get_adjacency_matrix();

    var neighbors = [];
    for (let i = 0; i < ggraph.nodes.length; i++) {
        if (adjmatrix[u][i] != 0) {
            neighbors.push(i);
        }
    }
    return neighbors;
}


async function Johnsons(source, target) {
   
    Bellman(source, target);

}

async function Dijkstra(source, target) {

    var visitados = [];
    var predecessor = [];

    for (let i = 0; i < ggraph.nodes.length; i++) {
        ggraph.nodes[i].weight = Infinity;
        predecessor[i] = -1;
        visitados[i] = false;
    }

    ggraph.nodes[0].weight = 0;


    for (let i = 0; i < ggraph.nodes.length; i++) {
        let v = -1;
        for (let j = 0; j < ggraph.nodes.length; j++) {
            if (!visitados[j] && (v == -1 || ggraph.nodes[j].weight < ggraph.nodes[v].weight)) {
                v = j;
            }

        }

        if (ggraph.nodes[v].weight == Infinity) {
            break;
        }

        visitados[v] = true;

        var neighbors = neighbor(v);
        var edg;
        for (let k = 0; k < neighbors.length; k++) {
            edg = ggraph.get_edge_index(v, neighbors[k]);
            if ((ggraph.nodes[v].weight + ggraph.edges[edg].weight) < ggraph.nodes[neighbors[k]].weight) {
                ggraph.nodes[neighbors[k]].weight = ggraph.nodes[v].weight + ggraph.edges[edg].weight;
                predecessor[neighbors[k]] = v;

                // Colore os vértices sendo comparados
                await new Promise(p => setTimeout(p, 1000));
                ggraph.nodes[v].hue = 320;
                ggraph.nodes[neighbors[k]].hue = 320;
                ggraph.edges[edg].hue = 320;
            }

            await new Promise(p => setTimeout(p, 1000));
            ggraph.nodes[v].hue = 120;
            ggraph.nodes[neighbors[k]].hue = 120;
            ggraph.edges[edg].hue = 0;
            //console.log(ggraph.edges[edg]);
        }
    }

    //console.log(predecessor);

    // Recupera o caminho final
    var path = [];

    for (let v = target; v != source; v = predecessor[v]) {
        path.unshift(v);
    }

    path.unshift(source);
    console.log(path);

    //var edge;
    for (let i = 1; i < path.length; i++) {
        ggraph.nodes[path[i]].hue = 120;
        edge = ggraph.get_edge_index(path[i - 1], path[i]);
        ggraph.edges[edge].hue = 120;
    }
    return
}


async function Bellman(source, target) {
    // m = ?
    // e[j].a = u ; e[j].b = v
    // d[e[j].a] = peso do vértice u em e

    var visitados = [];
    var predecessor = [];
    var x;

    for (let i = 0; i < ggraph.nodes.length; i++) {
        ggraph.nodes[i].weight = Infinity;
        predecessor[i] = -1;
        visitados[i] = false;
    }

    ggraph.nodes[0].weight = 0;
    /* 
        for(;;) {
            var any = false;
    
            for(let j = 0; j < ggraph.edges.length; j++) {
    
                if(ggraph.edges[j].label == "" ) {
                    console.log('sem peso');
                }
                else {
                    console.log('com peso. peso = ' + ggraph.edges[j].label);
                    ggraph.edges[j].weight = parseInt(ggraph.edges[j].label, 10);
                } 
                
    
                if(ggraph.edges[j].u.weight < Infinity) {
                    if(ggraph.edges[j].v.weight > (ggraph.edges[j].u.weight + ggraph.edges[j].weight)) {
                        ggraph.edges[j].v.weight = ggraph.edges[j].u.weight + ggraph.edges[j].weight;
                        predecessor[ggraph.nodes.indexOf(ggraph.edges[j].v)] = ggraph.nodes.indexOf(ggraph.edges[j].u);
                        
                        console.log(ggraph.edges[j].u);
                        console.log(ggraph.edges[j].v);
                        
                        any = true;
                    }
                }
    
                //console.log(ggraph.edges[j].u);
            }
            
    
            if(!any) break;
        } */

    for (let i = 0; i < ggraph.nodes.length; i++) {
        x = -1;
        for (let j = 0; j < ggraph.edges.length; j++) {
            if (ggraph.edges[j].label == "") {
                continue;
            }
            else {
                ggraph.edges[j].weight = parseInt(ggraph.edges[j].label, 10);
            }

            if (ggraph.edges[j].u.weight < Infinity) {

                if (ggraph.edges[j].v.weight > (ggraph.edges[j].u.weight + ggraph.edges[j].weight)) {
                    ggraph.edges[j].v.weight = ggraph.edges[j].u.weight + ggraph.edges[j].weight;
                    predecessor[ggraph.nodes.indexOf(ggraph.edges[j].v)] = ggraph.nodes.indexOf(ggraph.edges[j].u);
                    x = ggraph.nodes.indexOf(ggraph.edges[j].v);

                    /* console.log(ggraph.edges[j].u);
                    console.log(ggraph.edges[j].v); */

                }
            }

        }
    }

    // Redefine os pesos das arestas 
    var aux;
    for (let j = 0; j < ggraph.edges.length; j++) {
        aux = ggraph.edges[j].weight + ggraph.edges[j].u.weight - ggraph.edges[j].v.weight;
        ggraph.edges[j].weight = aux;
        ggraph.edges[j].label = aux;
    }

    if (x == -1) {
        console.log("No negative cycle found.");
    }
    else {
        console.log("Negative cycle: ");
    }


    console.log(ggraph.edges);
    console.log(predecessor);

    Dijkstra(source, target);
    return
    var path = [];

    for (let v = target; v != source; v = predecessor[v]) {
        path.unshift(v);
    }

    path.unshift(source);
    console.log(path);

    var edge;
    for (let i = 1; i < path.length; i++) {
        ggraph.nodes[path[i]].hue = 120;
        edge = ggraph.get_edge_index(path[i - 1], path[i]);
        ggraph.edges[edge].hue = 120;
    }
    //Dijkstra(source, target);
}
