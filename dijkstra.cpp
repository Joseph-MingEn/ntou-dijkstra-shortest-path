#include <algorithm>
#include <functional>
#include <iostream>
#include <limits>
#include <queue>
#include <tuple>
#include <utility>
#include <vector>

using Graph = std::vector<std::vector<std::pair<int, int>>>; // (鄰點, 權重)
const int INF = std::numeric_limits<int>::max();

void addEdge(Graph& graph, int u, int v, int weight) {
    graph[u].push_back({v, weight});
    graph[v].push_back({u, weight}); // 無向邊
}

struct Result {
    std::vector<int> dist;
    std::vector<int> parent;
    int staleSkipped = 0;
};

Result dijkstra(const Graph& graph, int source) {
    Result result{std::vector<int>(graph.size(), INF), std::vector<int>(graph.size(), -1), 0};
    using Entry = std::pair<int, int>; // (dist, node)
    std::priority_queue<Entry, std::vector<Entry>, std::greater<>> minHeap;
    result.dist[source] = 0;
    minHeap.push({0, source});

    while (!minHeap.empty()) {
        const auto [distance, node] = minHeap.top();
        minHeap.pop();
        if (distance != result.dist[node]) { // lazy deletion：舊距離已被改善，跳過過期條目
            ++result.staleSkipped;
            continue;
        }
        for (const auto& [next, weight] : graph[node]) {
            // 本題權重皆非負；先檢查加法避免整數溢位。
            if (weight <= INF - distance && distance + weight < result.dist[next]) {
                result.dist[next] = distance + weight;
                result.parent[next] = node;
                minHeap.push({result.dist[next], next});
            }
        }
    }
    return result;
}

std::vector<int> getPath(const std::vector<int>& parent, int source, int target) {
    std::vector<int> path;
    for (int node = target; node != -1; node = parent[node]) {
        path.push_back(node);
        if (node == source) {
            std::reverse(path.begin(), path.end());
            return path;
        }
    }
    return {}; // 無法抵達
}

void printPath(const std::vector<int>& parent, int source, int target, std::ostream& out = std::cout) {
    const auto path = getPath(parent, source, target);
    if (path.empty()) { out << "無法抵達"; return; }
    for (std::size_t i = 0; i < path.size(); ++i) {
        if (i) out << " -> ";
        out << path[i];
    }
}

#ifndef DIJKSTRA_NO_MAIN
int main() {
    Graph graph(6);
    const std::vector<std::tuple<int, int, int>> edges = {
        {0,1,2}, {0,2,5}, {1,2,1}, {1,3,4},
        {2,4,2}, {4,3,1}, {3,5,3}, {4,5,6}
    };
    for (const auto& [u, v, weight] : edges) addEdge(graph, u, v, weight);
    const auto result = dijkstra(graph, 0);
    std::cout << "dist[5] = " << result.dist[5] << "\n路徑: ";
    printPath(result.parent, 0, 5);
    std::cout << '\n';
}
#endif
