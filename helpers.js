function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function only_edges_with_label(){
    for(var i=0;i<ggraph.edges.length;i++){
        if(ggraph.edges[i].label == ""){
            return false;
        }
    }
    return true;
}

function isempty() {
    return ggraph.nodes.length == 0;
}

function isdirected() {
    for (let i = 0; i < ggraph.edges.length; i++) {
        if (ggraph.edges[i].direction == 2) {
            return false;
        }
    }
    return true;
}

function isundirected(){
    for (let i = 0; i < ggraph.edges.length; i++) {
        if (ggraph.edges[i].direction != 2) {
            return false;
        }
    }
    return true;
}

function is_graph_connected(){ // returns true if graph is connected
    if(ggraph.nodes.length == 0) return true;
    adj = ggraph.get_adjacency_list();
    vis = {};
    function dfs(u){
        vis[u] = true;
        let ans = 1;
        for(var i=0;i<adj[u].length;i++){
            var v = adj[u][i];
            if(!vis[v]){
                ans += dfs(v);
            }
        }
        return ans;
    };
    return dfs(0) == ggraph.nodes.length;
}