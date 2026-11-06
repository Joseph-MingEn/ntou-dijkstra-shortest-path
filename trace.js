(function (root) {
  'use strict';
  const edges = [[0,1,2],[0,2,5],[1,2,1],[1,3,4],[2,4,2],[4,3,1],[3,5,3],[4,5,6]];
  const label = n => `${String.fromCharCode(65 + n)}（${n}）`;
  function createTrace() {
    const graph = Array.from({length: 6}, () => []);
    edges.forEach(([u,v,w]) => { graph[u].push([v,w]); graph[v].push([u,w]); });
    const dist = [0, Infinity, Infinity, Infinity, Infinity, Infinity];
    const parent = Array(6).fill(-1), settled = Array(6).fill(false), queue = [{distance: 0, node: 0}];
    let pops = 0, stale = 0, relaxations = 0;
    const trace = [];
    function record(kind, title, detail, current = -1, edge = null, path = []) {
      trace.push({kind, title, detail, current, edge, path: [...path], dist: [...dist], parent: [...parent], settled: [...settled], queue: queue.map(x => ({...x})).sort((a,b) => a.distance-b.distance || a.node-b.node), pops, stale, relaxations});
    }
    record('start', '初始化：dist[0] = 0，其他全部 ∞', '將 (0, A) 放進優先佇列。∞ 表示目前還不知道路徑。');
    while (queue.length) {
      queue.sort((a,b) => a.distance-b.distance || a.node-b.node);
      const {distance, node} = queue.shift(); pops++;
      if (distance !== dist[node]) {
        stale++;
        record('stale', `跳過過期條目 (${distance}, ${label(node)})`, `目前 dist[${node}] 已經是 ${dist[node]}；這張舊條目不再展開。`, node);
        continue;
      }
      settled[node] = true;
      record('pop', `取出 ${label(node)}，距離 ${distance} 定案`, '這是佇列中距離最小的有效條目，接著檢查相鄰的邊。', node);
      for (const [next, weight] of graph[node]) {
        const candidate = distance + weight;
        if (candidate < dist[next]) {
          const before = dist[next]; dist[next] = candidate; parent[next] = node; relaxations++;
          queue.push({distance: candidate, node: next});
          record('relax', `鬆弛 ${label(node)} → ${label(next)}`, `${distance} + ${weight} = ${candidate}，小於 ${Number.isFinite(before) ? before : '∞'}；更新 dist 與 parent，並加入佇列。`, node, [node,next]);
        }
      }
    }
    const path = []; for (let n = 5; n !== -1; n = parent[n]) path.unshift(n);
    record('finish', '完成！到 F 最短距離為 9', '佇列已清空，沿 parent 從終點回溯：A → B → D → F（0 → 1 → 3 → 5），總長 9。粗綠線就是這條最短路徑。', -1, null, path);
    return trace;
  }
  function edgeKind(state, u, v) {
    const matches = (a, b) => (a === u && b === v) || (a === v && b === u);
    if (state.path.some((node, i) => i > 0 && matches(node, state.path[i - 1]))) return 'path';
    if (state.edge && matches(...state.edge)) return 'active';
    if ((state.settled[u] && state.parent[u] === v) || (state.settled[v] && state.parent[v] === u)) return 'tree';
    return 'default';
  }
  function nodeKind(state, node) {
    if (state.path.includes(node)) return 'path';
    if (state.current === node && state.kind !== 'stale') return 'current';
    if (state.settled[node]) return 'done';
    return state.queue.some(item => item.node === node && item.distance === state.dist[node]) ? 'queued' : 'unknown';
  }
  const api = {edges, createTrace, edgeKind, nodeKind};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.DijkstraTrace = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
