(() => {
  const {edges, createTrace, edgeKind, nodeKind} = window.DijkstraTrace;
  const trace = createTrace(), $ = id => document.getElementById(id);
  const coords = [[105,210],[285,75],[285,345],[545,75],[545,345],[755,210]];
  const letters = 'ABCDEF', svgNS = 'http://www.w3.org/2000/svg';
  let index = 0, timer = null;
  function el(name, attrs, text) { const e = document.createElementNS(svgNS,name); Object.entries(attrs).forEach(([k,v]) => e.setAttribute(k,v)); if (text != null) e.textContent = text; return e; }
  function drawGraph(s) {
    const svg = $('graph'); svg.replaceChildren();
    edges.forEach(([u,v,w]) => {
      const [x1,y1] = coords[u], [x2,y2] = coords[v];
      const kind = edgeKind(s,u,v);
      svg.append(el('line',{x1,y1,x2,y2,class:`graph-edge ${kind}`,'data-edge':`${u}-${v}`}));
      svg.append(el('text',{x:(x1+x2)/2, y:(y1+y2)/2-8, class:`weight ${kind}`,'text-anchor':'middle'},w));
    });
    coords.forEach(([x,y],n) => {
      const state = nodeKind(s,n);
      const group = el('g',{class:`node ${state}`,transform:`translate(${x} ${y})`,'data-node':n});
      group.append(el('circle',{r:27}),el('text',{},letters[n]),el('text',{class:'distance',y:-44},Number.isFinite(s.dist[n])?s.dist[n]:'∞'),el('text',{class:'caption',y:46},n===0?'起點 0':n===5?'終點 5':''));
      svg.append(group);
    });
  }
  function render() {
    const s=trace[index]; drawGraph(s);
    $('queue-count').textContent=`${s.queue.length} 條目`;
    $('queue').replaceChildren(...(s.queue.length ? s.queue.map((e,i)=>{const d=document.createElement('div');d.className='queue-entry';d.textContent=`(${e.distance}, ${letters[e.node]})${i===0?' ← 下一個取出':''}`;return d;}) : [Object.assign(document.createElement('div'),{className:'empty',textContent:'佇列已清空'})]));
    ['pops','stale','relaxations'].forEach(k=>$(k).textContent=s[k]);
    const count=s.settled.filter(Boolean).length; $('settled-count').textContent=count; $('table-count').textContent=`定案 ${count} / 6`;
    $('table-body').replaceChildren(...s.dist.map((d,n)=>{const tr=document.createElement('tr');const status=s.settled[n]?'已定案':s.queue.some(q=>q.node===n&&q.distance===d)?'排隊中':'未探索';[`${letters[n]} (${n})`,Number.isFinite(d)?d:'∞',s.parent[n]<0?'—':`${letters[s.parent[n]]} (${s.parent[n]})`,status].forEach(t=>{const td=document.createElement('td');td.textContent=t;tr.append(td)});return tr}));
    $('event-label').textContent={start:'START',pop:'取出',relax:'鬆弛',stale:'跳過',finish:'DONE'}[s.kind]; $('event-label').parentElement.classList.toggle('finished',s.kind==='finish'); $('event-title').textContent=s.title; $('event-detail').textContent=s.detail;
    $('step-count').textContent=`${index} / ${trace.length-1}`; $('progress-bar').style.width=`${index/(trace.length-1)*100}%`;
    $('previous').disabled=index===0; $('next').disabled=index===trace.length-1; $('play').disabled=index===trace.length-1; $('play').textContent=timer?'❚❚ 暫停':'▶ 自動播放';
  }
  function stop(){if(timer){clearInterval(timer);timer=null;}}
  $('previous').addEventListener('click',()=>{stop();index=Math.max(0,index-1);render()});
  $('next').addEventListener('click',()=>{stop();index=Math.min(trace.length-1,index+1);render()});
  $('reset').addEventListener('click',()=>{stop();index=0;render()});
  $('play').addEventListener('click',()=>{if(timer)stop();else timer=setInterval(()=>{index++;if(index>=trace.length-1)stop();render()},800);render()});
  render();
})();
