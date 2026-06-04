// Internet Topology and BGP Relationships - vis-network
// CANVAS_HEIGHT: 660
// Autonomous systems in three tiers with transit (customer→provider) and
// peering relationships. Click two ASes to highlight a BGP path; toggle
// transit visibility or add an IXP. Bloom: Understand, Analyze, Evaluate.

document.addEventListener('DOMContentLoaded', function () {
  const AMBER = '#F5A623', DEEPSLATE = '#37474f', MIDSLATE = '#607d8b';
  const main = document.querySelector('main');

  const title = document.createElement('div');
  title.textContent = 'Internet Topology and BGP Relationships';
  title.style.cssText = 'font:bold 19px Arial,sans-serif;text-align:center;padding:6px 0 2px;color:#212529;';
  main.appendChild(title);

  const bar = document.createElement('div');
  bar.style.cssText = 'text-align:center;padding:4px;';
  const btnTransit = mkBtn('Hide transit links');
  const btnIXP = mkBtn('Add IXP');
  const btnClear = mkBtn('Clear selection');
  bar.appendChild(btnTransit); bar.appendChild(btnIXP); bar.appendChild(btnClear);
  main.appendChild(bar);

  const container = document.createElement('div');
  container.style.cssText = 'width:100%;height:500px;background:#f7fbff;border:1px solid silver;';
  main.appendChild(container);

  const info = document.createElement('div');
  info.style.cssText = 'font:13px Arial,sans-serif;padding:6px 10px;color:#37474f;min-height:34px;';
  info.textContent = 'Click an AS to see its relationships. Click a second AS to highlight the BGP path between them.';
  main.appendChild(info);

  function mkBtn(label) {
    const b = document.createElement('button');
    b.textContent = label;
    b.style.cssText = 'margin:0 4px;padding:4px 10px;font:13px Arial;cursor:pointer;';
    return b;
  }

  // AS definitions: tier 1 (top), tier 2 (middle), tier 3/content (bottom)
  const ASes = [
    { id: 'AS1', label: 'Tier-1 A', tier: 1, x: -300, y: -200 },
    { id: 'AS2', label: 'Tier-1 B', tier: 1, x: -100, y: -200 },
    { id: 'AS3', label: 'Tier-1 C', tier: 1, x: 100, y: -200 },
    { id: 'AS4', label: 'Tier-1 D', tier: 1, x: 300, y: -200 },
    { id: 'T21', label: 'Tier-2 E', tier: 2, x: -340, y: 0 },
    { id: 'T22', label: 'Tier-2 F', tier: 2, x: -200, y: 0 },
    { id: 'T23', label: 'Tier-2 G', tier: 2, x: -40, y: 0 },
    { id: 'T24', label: 'Tier-2 H', tier: 2, x: 120, y: 0 },
    { id: 'T25', label: 'Tier-2 I', tier: 2, x: 260, y: 0 },
    { id: 'CDN', label: 'CDN AS13335', tier: 1, x: 360, y: -60, content: true },
    { id: 'GGL', label: 'Content AS15169', tier: 2, x: 40, y: -90, content: true },
    { id: 'T31', label: 'AS J', tier: 3, x: -360, y: 200 },
    { id: 'T32', label: 'AS K', tier: 3, x: -240, y: 200 },
    { id: 'T33', label: 'AS L', tier: 3, x: -120, y: 200 },
    { id: 'T34', label: 'AS M', tier: 3, x: 0, y: 200 },
    { id: 'T35', label: 'AS N', tier: 3, x: 120, y: 200 },
    { id: 'T36', label: 'AS O', tier: 3, x: 240, y: 200 },
    { id: 'T37', label: 'AS P', tier: 3, x: 360, y: 200 }
  ];
  // relationships: ['a','b','transit'] means a is customer of b; ['a','b','peer']
  const rels = [
    ['AS1', 'AS2', 'peer'], ['AS1', 'AS3', 'peer'], ['AS1', 'AS4', 'peer'],
    ['AS2', 'AS3', 'peer'], ['AS2', 'AS4', 'peer'], ['AS3', 'AS4', 'peer'],
    ['T21', 'AS1', 'transit'], ['T22', 'AS1', 'transit'], ['T22', 'AS2', 'transit'],
    ['T23', 'AS2', 'transit'], ['T24', 'AS3', 'transit'], ['T25', 'AS4', 'transit'], ['T25', 'AS3', 'transit'],
    ['T21', 'T22', 'peer'], ['T23', 'T24', 'peer'], ['T24', 'T25', 'peer'],
    ['CDN', 'AS1', 'peer'], ['CDN', 'AS3', 'peer'], ['CDN', 'AS4', 'peer'], ['CDN', 'T24', 'peer'],
    ['GGL', 'AS2', 'peer'], ['GGL', 'AS3', 'peer'], ['GGL', 'T23', 'peer'],
    ['T31', 'T21', 'transit'], ['T32', 'T21', 'transit'], ['T33', 'T22', 'transit'],
    ['T34', 'T23', 'transit'], ['T35', 'T24', 'transit'], ['T36', 'T25', 'transit'],
    ['T37', 'T25', 'transit'], ['T37', 'T24', 'transit'], ['T33', 'GGL', 'peer'], ['T35', 'CDN', 'peer']
  ];

  let hideTransit = false, addIXP = false;
  let selA = null, selB = null;

  function colorFor(as) {
    if (as.tier === 1) return { background: DEEPSLATE, border: '#263238' };
    if (as.content) return { background: AMBER, border: '#c77f12' };
    if (as.tier === 2) return { background: MIDSLATE, border: '#455a64' };
    return { background: AMBER, border: '#c77f12' };
  }

  let network, nodesDS, edgesDS;
  function build() {
    const nodeArr = ASes.map(a => ({ id: a.id, label: a.label, x: a.x, y: a.y, fixed: true,
      shape: 'box', shapeProperties: { borderRadius: 6 }, margin: 7, shadow: true,
      color: colorFor(a), font: { size: 13, color: (a.tier === 1 || a.tier === 2) && !a.content ? 'white' : '#3e2723' } }));
    const edgeArr = [];
    for (const [a, b, kind] of rels) {
      if (hideTransit && kind === 'transit') continue;
      if (kind === 'transit') edgeArr.push({ id: a + '-' + b, from: a, to: b, arrows: 'to', color: { color: AMBER }, width: 3, title: 'Transit: ' + a + ' is customer of ' + b + ' (pays for reachability)', smooth: false });
      else edgeArr.push({ id: a + '-' + b, from: a, to: b, dashes: true, color: { color: MIDSLATE }, width: 1.5, title: 'Peering: ' + a + ' ↔ ' + b + ' (settlement-free)', smooth: false });
    }
    if (addIXP) {
      nodeArr.push({ id: 'IXP', label: 'IXP', x: 0, y: 90, fixed: true, shape: 'hexagon', size: 24, color: { background: '#6a1b9a', border: '#4a148c' }, font: { color: 'white', size: 13 }, title: 'Internet Exchange Point — one connection replaces many pairwise peerings' });
      ['T21', 'T22', 'T23', 'T24', 'T25', 'GGL', 'CDN', 'T34'].forEach(id => edgeArr.push({ from: id, to: 'IXP', dashes: true, color: { color: '#6a1b9a' }, width: 1.5, title: 'Peering via IXP' }));
    }
    nodesDS = new vis.DataSet(nodeArr); edgesDS = new vis.DataSet(edgeArr);
    network = new vis.Network(container, { nodes: nodesDS, edges: edgesDS },
      { physics: false, interaction: { hover: true, zoomView: false, dragView: true, dragNodes: false, tooltipDelay: 80 }, nodes: { borderWidth: 2 } });
    network.fit({ animation: false });
    network.on('click', onClick);
  }

  function neighbors(id) {
    const out = [];
    for (const [a, b, kind] of rels) {
      if (hideTransit && kind === 'transit') continue;
      if (a === id) out.push({ n: b, kind });
      else if (b === id) out.push({ n: a, kind });
    }
    if (addIXP) { /* ixp peers omitted from path calc for simplicity */ }
    return out;
  }
  function bfsPath(src, dst) {
    const q = [[src]]; const seen = new Set([src]);
    while (q.length) { const path = q.shift(); const last = path[path.length - 1];
      if (last === dst) return path;
      for (const { n } of neighbors(last)) if (!seen.has(n)) { seen.add(n); q.push(path.concat(n)); } }
    return null;
  }

  function resetEdgeStyles() {
    edgesDS.forEach(e => {
      const orig = rels.find(r => (r[0] === e.from && r[1] === e.to) || (r[0] === e.to && r[1] === e.from));
      if (!orig) { edgesDS.update({ id: e.id, color: { color: '#6a1b9a' }, width: 1.5 }); return; }
      const kind = orig[2];
      edgesDS.update({ id: e.id, color: { color: kind === 'transit' ? AMBER : MIDSLATE }, width: kind === 'transit' ? 3 : 1.5 });
    });
  }
  function highlightPath(path) {
    resetEdgeStyles();
    for (let i = 0; i < path.length - 1; i++) {
      const a = path[i], b = path[i + 1];
      edgesDS.forEach(e => { if ((e.from === a && e.to === b) || (e.from === b && e.to === a)) edgesDS.update({ id: e.id, color: { color: '#2e7d32' }, width: 5 }); });
    }
  }

  function onClick(params) {
    if (!params.nodes.length) return;
    const id = params.nodes[0];
    if (!selA) {
      selA = id; selB = null; resetEdgeStyles();
      const nb = neighbors(id);
      info.innerHTML = '<b>' + id + '</b> relationships: ' +
        nb.map(x => x.n + ' (' + x.kind + ')').join(', ') +
        '. &nbsp;Now click a destination AS.';
    } else if (id !== selA) {
      selB = id;
      const path = bfsPath(selA, selB);
      if (path) { highlightPath(path); info.innerHTML = '<b>BGP path ' + selA + ' → ' + selB + ':</b> ' + path.join(' → ') + ' &nbsp;(green). Transit segments cost money; peering is free.'; }
      else info.textContent = 'No path between ' + selA + ' and ' + selB + ' with current filters.';
      selA = null;
    } else { selA = null; resetEdgeStyles(); info.textContent = 'Selection cleared.'; }
  }

  btnTransit.onclick = () => { hideTransit = !hideTransit; btnTransit.textContent = hideTransit ? 'Show transit links' : 'Hide transit links'; selA = selB = null; build(); };
  btnIXP.onclick = () => { addIXP = !addIXP; btnIXP.textContent = addIXP ? 'Remove IXP' : 'Add IXP'; build(); };
  btnClear.onclick = () => { selA = selB = null; resetEdgeStyles(); info.textContent = 'Selection cleared. Click an AS to begin.'; };

  build();
  window.addEventListener('resize', () => network.fit({ animation: false }));
});
