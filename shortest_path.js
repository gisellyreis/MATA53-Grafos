// retorna todos os vizinhos do nó u
function neighbor(u) {
    var adjmatrix = ggraph.get_adjacency_matrix();

    var neighbors = [];
    for(let i =0; i < ggraph.nodes.length; i++) {
        if(adjmatrix[u][i] != 0) {
            neighbors.push(i);
        }
    }
    return neighbors;
}

async function Dijkstra(target) {
    // d = peso
    // p = prev
    // n = quantidade de vértices do grafo
    // u = vetor de visitados

    var visitados = [];
    var predecessor = [];

    for (let i = 0; i< ggraph.nodes.length; i++) {
        ggraph.nodes[i].weight = Infinity;
        predecessor[i] = -1;
        visitados[i] = false;
    }

    ggraph.nodes[0].weight = 0;


    for(let i=0; i < ggraph.nodes.length; i++) {
        let v = -1;
        for(let j = 0; j < ggraph.nodes.length; j++) {
            if(!visitados[j] && (v == -1 || ggraph.nodes[j].weight < ggraph.nodes[v].weight)) {
                v = j;
            }

        }

        if(ggraph.nodes[v].weight == Infinity) {
            break;
        }

        visitados[v] = true;

        var neighbors = neighbor(v);
        for(let k = 0; k < neighbors.length; k++) {
            if((ggraph.nodes[v].weight + 1) < ggraph.nodes[neighbors[k]].weight) {
                ggraph.nodes[neighbors[k]].weight = ggraph.nodes[v].weight + 1;
                predecessor[neighbors[k]] = v;
            }
        }
    }
    console.log(predecessor);
    return
}


async function Bellman() {
    // m = ?
    // e[j].a = u ; e[j].b = v
    // d[e[j].a] = peso do vértice u em e

    var visitados = [];
    var predecessor = [];

    for (let i = 0; i< ggraph.nodes.length; i++) {
        ggraph.nodes[i].weight = Infinity;
        predecessor[i] = -1;
        visitados[i] = false;
    }

    ggraph.nodes[0].weight = 0;

    for(;;) {
        var any = false;

        for(let j = 0; j < ggraph.edges.length; j++) {

            if(ggraph.edges[j].weight == 0 ) {ggraph.edges[j].weight = 1;}
            else {ggraph.edges[j].weight = parseInt(ggraph.edges[j].weight, 10);}

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
    }


    
    console.log(predecessor);
}

// achar o indice do nó

