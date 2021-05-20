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
    var unvisited = [];
    var prev = [];

    for (let i = 0; i < ggraph.nodes.length; i++) {
        ggraph.nodes[i].weight = 1000000;
        prev[i] = null;
        unvisited.push(i);
    }

    // node inicial = peso 0
    ggraph.nodes[0].weight = 0;

    var u = ggraph.nodes[unvisited[0]];
    var idx;
    var weight = 1000000;

    while (unvisited.length > 0) {

        // u = node com o menor peso
        for (let i = 0; i < unvisited.length; i++) {
            if(ggraph.nodes[unvisited[i]].weight < weight) {
                weight = ggraph.nodes[unvisited[i]].weight;
                u = ggraph.nodes[unvisited[i]];
                idx = unvisited[i];
            }
        }

        // remove u de unvisited pelo indice
        unvisited.splice(idx,1);
        console.log(idx, target, u);


        if (idx == target) {
            return
        }

        var neighbors = neighbor(idx);
        console.log(neighbors);

        for (let v = 0; v < neighbors.length; v++) {
            if(unvisited.includes(neighbors[v])) {
                let aux = u.weight + 1;
                if(aux < ggraph.nodes[neighbors[v]].weight) {
                    console.log(ggraph.nodes[neighbors[v]]);
                    ggraph.nodes[neighbors[v]].weight = aux;
                    prev[v] = u;
                }
            }
        }

    }

    console.log(prev); 
    return
}