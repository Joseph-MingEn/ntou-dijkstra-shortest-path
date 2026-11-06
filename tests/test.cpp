#define DIJKSTRA_NO_MAIN
#include "../dijkstra.cpp"
#include <cassert>
#include <sstream>

int main() {
    Graph g(6);
    for (const auto& [u,v,w] : std::vector<std::tuple<int,int,int>>{{0,1,2},{0,2,5},{1,2,1},{1,3,4},{2,4,2},{4,3,1},{3,5,3},{4,5,6}}) addEdge(g,u,v,w);
    auto result = dijkstra(g, 0);
    assert((result.dist == std::vector<int>{0,2,3,6,5,9}));
    assert((getPath(result.parent,0,5) == std::vector<int>{0,1,3,5}));
    assert(result.staleSkipped > 0);
    assert((getPath(result.parent,0,0) == std::vector<int>{0}));
    Graph disconnected(2);
    auto unreachable = dijkstra(disconnected,0);
    assert(unreachable.dist[1] == INF && getPath(unreachable.parent,0,1).empty());
    std::ostringstream out;
    printPath(result.parent,0,5,out);
    assert(out.str() == "0 -> 1 -> 3 -> 5");
}
