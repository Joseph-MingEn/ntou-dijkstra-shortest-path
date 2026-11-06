# 最短路徑派遣：Dijkstra

以 C++ 實作無向加權圖的 Dijkstra 最短路徑，並用靜態網頁逐步展示優先佇列、距離、parent、鬆弛和過期條目跳過。網頁中 A–F 分別對應節點 0–5。

- [互動網頁（GitHub Pages）](https://joseph-mingen.github.io/ntou-dijkstra-shortest-path/)
- [GitHub 專案儲存庫](https://github.com/Joseph-MingEn/ntou-dijkstra-shortest-path)
- [範圍、規格、計畫與審查](docs/workflow.md)

## 執行

```sh
c++ -std=c++17 -Wall -Wextra -pedantic dijkstra.cpp -o /tmp/dijkstra
/tmp/dijkstra
bash tests/run.sh
```

預期輸出：

```text
dist[5] = 9
路徑: 0 -> 1 -> 3 -> 5
```

也可以直接開啟 `index.html` 操作互動頁面。網頁資源使用相對路徑，不需要後端。

## 演算法原理

Dijkstra 從起點出發，反覆選擇目前距離最小的有效候選節點，再嘗試利用這個節點改善相鄰節點的距離。它適用於**所有邊權非負**的圖。

為什麼取出的距離可以定案？最小堆取出的有效條目不大於其他尚待處理的候選距離。任何尚未探索的替代路徑，都必須先經過距離至少一樣大的候選點；邊權非負，後續距離不會減少，因此無法找到更短的路。候選距離可以相等，所以不能說其他點一定嚴格更大；負權邊則會破壞這個推論。

## 演算法步驟

1. 用 `vector<vector<pair<int,int>>>` 建立鄰接串列；無向邊要在兩端各存一次。初始化 `dist[0] = 0`、其餘為無限大，`parent` 為 -1。
2. 用 `priority_queue` 與 `greater<>` 建立最小堆，放入 `(0, 0)`，依 `(dist, node)` 由小到大取出。
3. 如果取出的距離不等於目前的 `dist[node]`，表示較短路徑已經取代它；跳過這個過期條目，稱為 lazy deletion。
4. 檢查相鄰邊。若 `dist[node] + weight < dist[next]`，就更新 `dist[next]` 和 `parent[next]`，把新距離放入堆；這個動作稱為鬆弛。
5. 佇列清空後，從終點沿 `parent` 反向追溯，反轉後即為起點到終點的路徑。

## 本題路徑成本計算

| 邊 | 權重 |
| --- | ---: |
| 0 → 1 | 2 |
| 1 → 3 | 4 |
| 3 → 5 | 3 |
| 合計 | **2 + 4 + 3 = 9** |

完整路徑為 **0 → 1 → 3 → 5**；六個節點的最終距離為 `[0, 2, 3, 6, 5, 9]`。另一條路徑 0 → 1 → 2 → 4 → 3 → 5 的成本是 2 + 1 + 2 + 1 + 3 = 9，也同樣最短。程式僅在距離嚴格變小時更新 parent，所以會保留先找到的指定路徑。

## 運算成本計算

設 V 為節點數，E 為無向邊數；本題 V = 6、E = 8。

- **時間複雜度：** O(V + E log(E + 1))。初始化需 O(V)，掃描鄰接串列共 O(E)；每次成功鬆弛會增加一個堆條目，堆的大小最多為 O(E)，插入與取出需 O(log(E + 1))。對本題這類簡單圖，常簡寫為 O((V + E) log V)。
- **空間複雜度：** O(V + E)。鄰接串列儲存每條無向邊的兩個方向，佔 O(V + E)；dist 與 parent 佔 O(V)，lazy deletion 的堆最多佔 O(E)。

這裡的運算成本是漸近成長量；路徑成本 9 則是本題所選邊權的加總。
