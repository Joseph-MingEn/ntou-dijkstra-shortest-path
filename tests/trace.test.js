const assert = require('node:assert/strict');
const { createTrace } = require('../trace.js');
const trace = createTrace();
const last = trace.at(-1);
assert.deepEqual(last.dist, [0, 2, 3, 6, 5, 9]);
assert.deepEqual(last.path, [0, 1, 3, 5]);
assert.ok(trace.some(s => s.kind === 'stale'));
assert.equal(trace[0].queue[0].node, 0);
assert.equal(trace[0].queue[0].distance, 0);
assert.equal(last.settled.filter(Boolean).length, 6);
console.log('網頁演算法測試通過');
const fs = require('node:fs');
const html = fs.readFileSync('index.html', 'utf8');
const readme = fs.readFileSync('README.md', 'utf8');
for (const document of [html, readme]) {
  for (const required of ['演算法', '成本計算', '時間複雜度', '空間複雜度', '2 + 4 + 3', 'https://github.com/Joseph-MingEn/ntou-dijkstra-shortest-path']) {
    assert.ok(document.includes(required), `說明缺少：${required}`);
  }
}
console.log('說明內容測試通過');
const { edgeKind, nodeKind } = require('../trace.js');
assert.equal(edgeKind(last, 0, 1), 'path');
assert.equal(edgeKind(last, 1, 3), 'path');
assert.equal(edgeKind(last, 3, 5), 'path');
assert.equal(edgeKind(last, 1, 2), 'tree');
assert.equal(edgeKind(last, 2, 4), 'tree');
assert.equal(edgeKind(last, 0, 2), 'default');
assert.equal(nodeKind(last, 0), 'path');
assert.equal(nodeKind(last, 2), 'done');
assert.equal(nodeKind(trace[0], 0), 'queued');
console.log('路徑視覺狀態測試通過');
