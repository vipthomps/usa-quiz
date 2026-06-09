const statesData = [
  { abbr: 'AL', name: 'Alabama', capital: 'Montgomery', fips: '01' },
  { abbr: 'AK', name: 'Alaska', capital: 'Juneau', fips: '02' },
  { abbr: 'AZ', name: 'Arizona', capital: 'Phoenix', fips: '04' },
  { abbr: 'AR', name: 'Arkansas', capital: 'Little Rock', fips: '05' },
  { abbr: 'CA', name: 'California', capital: 'Sacramento', fips: '06' },
  { abbr: 'CO', name: 'Colorado', capital: 'Denver', fips: '08' },
  { abbr: 'CT', name: 'Connecticut', capital: 'Hartford', fips: '09' },
  { abbr: 'DE', name: 'Delaware', capital: 'Dover', fips: '10' },
  { abbr: 'FL', name: 'Florida', capital: 'Tallahassee', fips: '12' },
  { abbr: 'GA', name: 'Georgia', capital: 'Atlanta', fips: '13' },
  { abbr: 'HI', name: 'Hawaii', capital: 'Honolulu', fips: '15' },
  { abbr: 'ID', name: 'Idaho', capital: 'Boise', fips: '16' },
  { abbr: 'IL', name: 'Illinois', capital: 'Springfield', fips: '17' },
  { abbr: 'IN', name: 'Indiana', capital: 'Indianapolis', fips: '18' },
  { abbr: 'IA', name: 'Iowa', capital: 'Des Moines', fips: '19' },
  { abbr: 'KS', name: 'Kansas', capital: 'Topeka', fips: '20' },
  { abbr: 'KY', name: 'Kentucky', capital: 'Frankfort', fips: '21' },
  { abbr: 'LA', name: 'Louisiana', capital: 'Baton Rouge', fips: '22' },
  { abbr: 'ME', name: 'Maine', capital: 'Augusta', fips: '23' },
  { abbr: 'MD', name: 'Maryland', capital: 'Annapolis', fips: '24' },
  { abbr: 'MA', name: 'Massachusetts', capital: 'Boston', fips: '25' },
  { abbr: 'MI', name: 'Michigan', capital: 'Lansing', fips: '26' },
  { abbr: 'MN', name: 'Minnesota', capital: 'Saint Paul', fips: '27' },
  { abbr: 'MS', name: 'Mississippi', capital: 'Jackson', fips: '28' },
  { abbr: 'MO', name: 'Missouri', capital: 'Jefferson City', fips: '29' },
  { abbr: 'MT', name: 'Montana', capital: 'Helena', fips: '30' },
  { abbr: 'NE', name: 'Nebraska', capital: 'Lincoln', fips: '31' },
  { abbr: 'NV', name: 'Nevada', capital: 'Carson City', fips: '32' },
  { abbr: 'NH', name: 'New Hampshire', capital: 'Concord', fips: '33' },
  { abbr: 'NJ', name: 'New Jersey', capital: 'Trenton', fips: '34' },
  { abbr: 'NM', name: 'New Mexico', capital: 'Santa Fe', fips: '35' },
  { abbr: 'NY', name: 'New York', capital: 'Albany', fips: '36' },
  { abbr: 'NC', name: 'North Carolina', capital: 'Raleigh', fips: '37' },
  { abbr: 'ND', name: 'North Dakota', capital: 'Bismarck', fips: '38' },
  { abbr: 'OH', name: 'Ohio', capital: 'Columbus', fips: '39' },
  { abbr: 'OK', name: 'Oklahoma', capital: 'Oklahoma City', fips: '40' },
  { abbr: 'OR', name: 'Oregon', capital: 'Salem', fips: '41' },
  { abbr: 'PA', name: 'Pennsylvania', capital: 'Harrisburg', fips: '42' },
  { abbr: 'RI', name: 'Rhode Island', capital: 'Providence', fips: '44' },
  { abbr: 'SC', name: 'South Carolina', capital: 'Columbia', fips: '45' },
  { abbr: 'SD', name: 'South Dakota', capital: 'Pierre', fips: '46' },
  { abbr: 'TN', name: 'Tennessee', capital: 'Nashville', fips: '47' },
  { abbr: 'TX', name: 'Texas', capital: 'Austin', fips: '48' },
  { abbr: 'UT', name: 'Utah', capital: 'Salt Lake City', fips: '49' },
  { abbr: 'VT', name: 'Vermont', capital: 'Montpelier', fips: '50' },
  { abbr: 'VA', name: 'Virginia', capital: 'Richmond', fips: '51' },
  { abbr: 'WA', name: 'Washington', capital: 'Olympia', fips: '53' },
  { abbr: 'WV', name: 'West Virginia', capital: 'Charleston', fips: '54' },
  { abbr: 'WI', name: 'Wisconsin', capital: 'Madison', fips: '55' },
  { abbr: 'WY', name: 'Wyoming', capital: 'Cheyenne', fips: '56' },
];
const NORTHEAST_SMALL = ['09','10','24','25','33','34','44','50'];
const byFips = new Map(statesData.map(d => [d.fips, d]));
let assignments = new Map(statesData.map(d => [d.fips, { stateName: null, capital: null }]));
const itemOwner = new Map();
const targetsByFips = new Map();
const labelBoxesByFips = new Map();
const insetLabelBoxesByFips = new Map();
let currentMode = 'both';
let currentTimeRemaining = 0;
let timerId = null;
let hintsUsed = 0;
const maxHints = 5;

const stateBankEl = document.getElementById('state-bank');
const capitalBankEl = document.getElementById('capital-bank');
const statesPanel = document.getElementById('states-panel');
const capitalsPanel = document.getElementById('capitals-panel');
const mapContainerEl = document.getElementById('map-container');
const statusTextEl = document.getElementById('status-text');
const progressTextEl = document.getElementById('progress-text');
const resultsEl = document.getElementById('results');
const hintResultEl = document.getElementById('hint-result');
const scoreBtn = document.getElementById('score-btn');
const hintBtn = document.getElementById('hint-btn');
const resetBtn = document.getElementById('reset-btn');
const modeSelect = document.getElementById('mode-select');
const timerSelect = document.getElementById('timer-select');
const timerDisplay = document.getElementById('timer-display');
const chipTemplate = document.getElementById('chip-template');

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
function activeTypes() {
  if (currentMode === 'states') return ['state'];
  if (currentMode === 'capitals') return ['capital'];
  return ['state', 'capital'];
}
function isTypeActive(type) { return activeTypes().includes(type); }
function findChip(type, value) {
  return [...document.querySelectorAll('.chip')].find(chip => chip.dataset.type === type && chip.dataset.value === value) || null;
}
function createChip(value, type) {
  const chip = chipTemplate.content.firstElementChild.cloneNode(true);
  chip.textContent = value;
  chip.dataset.value = value;
  chip.dataset.type = type;
  chip.classList.add(type === 'state' ? 'state-chip' : 'capital-chip');
  chip.addEventListener('dragstart', (event) => {
    event.dataTransfer.setData('text/plain', JSON.stringify({ value, type }));
    event.dataTransfer.effectAllowed = 'move';
  });
  return chip;
}
function renderBanks() {
  stateBankEl.innerHTML = '';
  capitalBankEl.innerHTML = '';
  shuffle(statesData.map(d => d.name)).forEach(name => stateBankEl.appendChild(createChip(name, 'state')));
  shuffle(statesData.map(d => d.capital)).forEach(capital => capitalBankEl.appendChild(createChip(capital, 'capital')));
  syncModeVisibility();
}
function syncModeVisibility() {
  statesPanel.classList.toggle('hidden-panel', currentMode === 'capitals');
  capitalsPanel.classList.toggle('hidden-panel', currentMode === 'states');
  updateProgress();
  updateLabelsForAll();
}
function markChipUsage(type, value, used) {
  const chip = findChip(type, value);
  if (chip) chip.classList.toggle('used', used);
}
function clearExistingOwner(type, value) {
  const key = `${type}:${value}`;
  const previousFips = itemOwner.get(key);
  if (!previousFips) return;
  const slot = assignments.get(previousFips);
  if (type === 'state') slot.stateName = null;
  if (type === 'capital') slot.capital = null;
  itemOwner.delete(key);
  markChipUsage(type, value, false);
  updateLabel(previousFips);
}
function assignToState(fips, payload) {
  if (!isTypeActive(payload.type)) return;
  const info = assignments.get(fips);
  clearExistingOwner(payload.type, payload.value);
  if (payload.type === 'state') {
    if (info.stateName) {
      markChipUsage('state', info.stateName, false);
      itemOwner.delete(`state:${info.stateName}`);
    }
    info.stateName = payload.value;
    itemOwner.set(`state:${payload.value}`, fips);
    markChipUsage('state', payload.value, true);
  } else {
    if (info.capital) {
      markChipUsage('capital', info.capital, false);
      itemOwner.delete(`capital:${info.capital}`);
    }
    info.capital = payload.value;
    itemOwner.set(`capital:${payload.value}`, fips);
    markChipUsage('capital', payload.value, true);
  }
  updateLabel(fips);
  updateProgress();
  setTargetClass(fips, 'correct', false);
  setTargetClass(fips, 'wrong', false);
  resultsEl.textContent = '';
}
function setTargetClass(fips, className, enabled) {
  const nodes = targetsByFips.get(fips) || [];
  nodes.forEach(node => node.classList.toggle(className, enabled));
}
function clearScoringClasses() {
  for (const fips of byFips.keys()) {
    setTargetClass(fips, 'correct', false);
    setTargetClass(fips, 'wrong', false);
  }
}
function updateProgress() {
  const placed = [...assignments.values()].reduce((sum, slot) => {
    let count = 0;
    if (currentMode !== 'capitals' && slot.stateName) count += 1;
    if (currentMode !== 'states' && slot.capital) count += 1;
    return sum + count;
  }, 0);
  const total = currentMode === 'both' ? 100 : 50;
  progressTextEl.textContent = `${placed} / ${total} placed`;
  statusTextEl.textContent = currentMode === 'both'
    ? 'Drag a state and a capital onto each state.'
    : currentMode === 'states'
      ? 'Drag the state names onto the correct states.'
      : 'Drag the capital cities onto the correct states.';
}
function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}
function stopTimer() { if (timerId) clearInterval(timerId); timerId = null; }
function startTimer() {
  stopTimer();
  currentTimeRemaining = Number(timerSelect.value || 0);
  timerDisplay.textContent = currentTimeRemaining ? formatTime(currentTimeRemaining) : '--:--';
  if (!currentTimeRemaining) return;
  timerId = setInterval(() => {
    currentTimeRemaining -= 1;
    timerDisplay.textContent = formatTime(Math.max(0, currentTimeRemaining));
    if (currentTimeRemaining <= 0) {
      stopTimer();
      scoreQuiz(true);
    }
  }, 1000);
}
function updateOneLabelBox(boxSelection, slot, isInset = false, fips = null) {
  if (!boxSelection) return;
  const showStateText = currentMode !== 'capitals';
  const showCapitalText = currentMode !== 'states';
  const stateText = showStateText ? (slot.stateName || '') : '';
  const capitalText = showCapitalText ? (slot.capital || '') : '';
  const placeholder = currentMode === 'both'
    ? (!slot.stateName && !slot.capital ? 'Drop here' : '')
    : currentMode === 'states'
      ? (!slot.stateName ? 'Drop state here' : '')
      : (!slot.capital ? 'Drop capital here' : '');
  boxSelection.select(`.${isInset ? 'inset-label-state' : 'label-state'}`).text(stateText);
  boxSelection.select(`.${isInset ? 'inset-label-capital' : 'label-capital'}`).text(capitalText);
  boxSelection.select(`.${isInset ? 'inset-label-placeholder' : 'label-placeholder'}`).text(placeholder);
  if (!isInset && NORTHEAST_SMALL.includes(fips)) boxSelection.attr('visibility', 'hidden');
  else boxSelection.attr('visibility', 'visible');
  const classPrefix = isInset ? 'inset-label' : 'label';
  const nodes = [
    boxSelection.select(`.${classPrefix}-state`).node(),
    boxSelection.select(`.${classPrefix}-capital`).node(),
    boxSelection.select(`.${classPrefix}-placeholder`).node(),
  ].filter(node => node && node.textContent);
  let width = isInset ? 88 : 46;
  let height = isInset ? 32 : 20;
  const paddingX = isInset ? 10 : 6;
  const paddingY = isInset ? 7 : 4;
  if (nodes.length) {
    const boxes = nodes.map(node => node.getBBox());
    const minX = Math.min(...boxes.map(b => b.x));
    const minY = Math.min(...boxes.map(b => b.y));
    const maxX = Math.max(...boxes.map(b => b.x + b.width));
    const maxY = Math.max(...boxes.map(b => b.y + b.height));
    width = Math.max(width, maxX - minX + paddingX * 2);
    height = Math.max(height, maxY - minY + paddingY * 2);
  }
  boxSelection.select('.label-bg')
    .attr('x', -width / 2)
    .attr('y', -height / 2)
    .attr('width', width)
    .attr('height', height)
    .attr('rx', isInset ? 10 : 8)
    .attr('ry', isInset ? 10 : 8);
}
function updateLabel(fips) {
  const slot = assignments.get(fips);
  updateOneLabelBox(labelBoxesByFips.get(fips), slot, false, fips);
  updateOneLabelBox(insetLabelBoxesByFips.get(fips), slot, true, fips);
}
function updateLabelsForAll() { for (const fips of byFips.keys()) updateLabel(fips); }
function buildDropHandlers(fips, node) {
  node.addEventListener('dragover', (event) => { event.preventDefault(); node.classList.add('drop-target'); });
  node.addEventListener('dragleave', () => node.classList.remove('drop-target'));
  node.addEventListener('drop', (event) => {
    event.preventDefault();
    node.classList.remove('drop-target');
    try {
      const payload = JSON.parse(event.dataTransfer.getData('text/plain'));
      assignToState(fips, payload);
    } catch (error) {
      console.error('Invalid drop payload', error);
    }
  });
}
async function buildMap() {
  const width = 1180;
  const height = 720;
  const mapArea = { x0: 18, y0: 18, x1: 820, y1: 700 };
  const inset = { x: 850, y: 72, w: 300, h: 300 };
  mapContainerEl.innerHTML = '';
  targetsByFips.clear();
  labelBoxesByFips.clear();
  insetLabelBoxesByFips.clear();
  const svg = d3.select(mapContainerEl)
    .append('svg')
    .attr('class', 'us-map')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('role', 'img')
    .attr('aria-label', 'Map of the United States with drop targets for states and capitals');
  const us = await d3.json('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json');
  const features = topojson.feature(us, us.objects.states).features
    .filter(feature => byFips.has(String(feature.id).padStart(2, '0')));
  const projection = d3.geoAlbersUsa();
  projection.fitExtent([[mapArea.x0, mapArea.y0], [mapArea.x1, mapArea.y1]], { type: 'FeatureCollection', features });
  const path = d3.geoPath(projection);
  const baseLayer = svg.append('g').attr('class', 'base-layer');
  const statesLayer = baseLayer.append('g').attr('class', 'states-layer');
  const labelsLayer = baseLayer.append('g').attr('class', 'labels-layer');
  const groups = statesLayer.selectAll('.state-target')
    .data(features)
    .enter()
    .append('g')
    .attr('class', 'state-target scorable')
    .attr('data-fips', d => String(d.id).padStart(2, '0'));
  groups.append('path')
    .attr('class', 'state-path')
    .attr('d', path);
  const labels = labelsLayer.selectAll('.label-box')
    .data(features)
    .enter()
    .append('g')
    .attr('class', 'label-box')
    .attr('transform', d => {
      const [x, y] = path.centroid(d);
      if (!isFinite(x) || !isFinite(y)) return 'translate(-999,-999)';
      let offsetY = -18;
      const fips = String(d.id).padStart(2, '0');
      if (['12','22'].includes(fips)) offsetY = 13;
      return `translate(${x}, ${y + offsetY})`;
    });
  labels.append('rect').attr('class', 'label-bg');
  labels.append('text').attr('class', 'label-state').attr('text-anchor', 'middle').attr('y', -2);
  labels.append('text').attr('class', 'label-capital').attr('text-anchor', 'middle').attr('y', 9);
  labels.append('text').attr('class', 'label-placeholder').attr('text-anchor', 'middle').attr('y', 4);
  groups.each(function(feature) {
    const fips = String(feature.id).padStart(2, '0');
    targetsByFips.set(fips, [this]);
    labelBoxesByFips.set(fips, labels.filter(d => String(d.id).padStart(2, '0') === fips));
    buildDropHandlers(fips, this);
  });
  const insetLayer = svg.append('g').attr('class', 'northeast-inset');
  insetLayer.append('rect').attr('class', 'inset-frame').attr('x', inset.x).attr('y', inset.y).attr('width', inset.w).attr('height', inset.h);
  insetLayer.append('text').attr('class', 'inset-title').attr('x', inset.x + 16).attr('y', inset.y + 24).text('Expanded Northeast');
  insetLayer.append('text').attr('class', 'inset-note').attr('x', inset.x + 16).attr('y', inset.y + 42).text('Use these larger targets for the small states.');
  const insetFeatures = features.filter(feature => NORTHEAST_SMALL.includes(String(feature.id).padStart(2, '0')));
  const insetCells = [
    { fips: '50', cx: inset.x + 60, cy: inset.y + 90 },
    { fips: '33', cx: inset.x + 148, cy: inset.y + 90 },
    { fips: '25', cx: inset.x + 237, cy: inset.y + 90 },
    { fips: '44', cx: inset.x + 60, cy: inset.y + 195 },
    { fips: '09', cx: inset.x + 148, cy: inset.y + 195 },
    { fips: '34', cx: inset.x + 237, cy: inset.y + 195 },
    { fips: '10', cx: inset.x + 104, cy: inset.y + 282 },
    { fips: '24', cx: inset.x + 215, cy: inset.y + 282 },
  ];
  insetCells.forEach(cell => {
    const feature = insetFeatures.find(d => String(d.id).padStart(2, '0') === cell.fips);
    if (!feature) return;
    const bounds = path.bounds(feature);
    const bw = Math.max(1, bounds[1][0] - bounds[0][0]);
    const bh = Math.max(1, bounds[1][1] - bounds[0][1]);
    const targetW = 72;
    const targetH = 52;
    const scale = Math.min(targetW / bw, targetH / bh);
    const originalCenterX = (bounds[0][0] + bounds[1][0]) / 2;
    const originalCenterY = (bounds[0][1] + bounds[1][1]) / 2;
    const tx = cell.cx - (scale * originalCenterX);
    const ty = cell.cy - (scale * originalCenterY);
    const connectorSource = path.centroid(feature);
    insetLayer.append('path').attr('class', 'inset-connector').attr('d', `M ${connectorSource[0]} ${connectorSource[1]} L ${cell.cx} ${cell.cy}`);
    const group = insetLayer.append('g').attr('class', 'state-target scorable inset-target').attr('data-fips', cell.fips);
    group.append('path').attr('class', 'inset-state-path').attr('d', path(feature)).attr('transform', `translate(${tx}, ${ty}) scale(${scale})`);
    const labelBox = group.append('g').attr('class', 'inset-label-box').attr('transform', `translate(${cell.cx}, ${cell.cy + 28})`);
    labelBox.append('rect').attr('class', 'label-bg');
    labelBox.append('text').attr('class', 'inset-label-state').attr('text-anchor', 'middle').attr('y', -2);
    labelBox.append('text').attr('class', 'inset-label-capital').attr('text-anchor', 'middle').attr('y', 12);
    labelBox.append('text').attr('class', 'inset-label-placeholder').attr('text-anchor', 'middle').attr('y', 5);
    const existingTargets = targetsByFips.get(cell.fips) || [];
    existingTargets.push(group.node());
    targetsByFips.set(cell.fips, existingTargets);
    insetLabelBoxesByFips.set(cell.fips, labelBox);
    buildDropHandlers(cell.fips, group.node());
  });
  for (const fips of byFips.keys()) updateLabel(fips);
  updateProgress();
}
function scoreQuiz(fromTimer = false) {
  stopTimer();
  let correctStateNames = 0;
  let correctCapitals = 0;
  clearScoringClasses();
  for (const meta of statesData) {
    const assigned = assignments.get(meta.fips);
    const includeState = currentMode !== 'capitals';
    const includeCapital = currentMode !== 'states';
    const stateCorrect = !includeState || assigned.stateName === meta.name;
    const capitalCorrect = !includeCapital || assigned.capital === meta.capital;
    if (includeState && assigned.stateName === meta.name) correctStateNames += 1;
    if (includeCapital && assigned.capital === meta.capital) correctCapitals += 1;
    setTargetClass(meta.fips, 'correct', stateCorrect && capitalCorrect);
    setTargetClass(meta.fips, 'wrong', !(stateCorrect && capitalCorrect));
  }
  const totalPossible = currentMode === 'both' ? 100 : 50;
  const totalCorrect = currentMode === 'both' ? (correctStateNames + correctCapitals) : (currentMode === 'states' ? correctStateNames : correctCapitals);
  const percent = ((totalCorrect / totalPossible) * 100).toFixed(0);
  const detail = currentMode === 'both'
    ? `${correctStateNames}/50 state names correct · ${correctCapitals}/50 capitals correct · ${totalCorrect}/100 total`
    : currentMode === 'states'
      ? `${correctStateNames}/50 state names correct`
      : `${correctCapitals}/50 capitals correct`;
  resultsEl.innerHTML = `Grade: ${percent}% <small>${detail}${fromTimer ? ' · Time expired, scored automatically.' : ''}</small>`;
}
function resetAssignments() {
  assignments = new Map(statesData.map(d => [d.fips, { stateName: null, capital: null }]));
  itemOwner.clear();
  document.querySelectorAll('.chip.used').forEach(chip => chip.classList.remove('used'));
  clearScoringClasses();
  updateLabelsForAll();
  updateProgress();
  resultsEl.textContent = '';
  hintResultEl.textContent = '';
  hintsUsed = 0;
}
function getHintTargets() {
  const candidates = [];
  for (const meta of statesData) {
    const slot = assignments.get(meta.fips);
    if (currentMode !== 'capitals' && !slot.stateName) candidates.push({ fips: meta.fips, type: 'state', value: meta.name, display: `${meta.name} placed on the correct state.` });
    if (currentMode !== 'states' && !slot.capital) candidates.push({ fips: meta.fips, type: 'capital', value: meta.capital, display: `${meta.capital} placed on the correct state.` });
  }
  return shuffle(candidates);
}
function applyHint() {
  const candidates = getHintTargets();
  if (!candidates.length) {
    hintResultEl.innerHTML = '<small>No hints available because every answer for the current mode has already been placed.</small>';
    return;
  }
  if (hintsUsed >= maxHints) {
    hintResultEl.innerHTML = `<small>You used all ${maxHints} hints for this round.</small>`;
    return;
  }
  const hint = candidates[0];
  assignToState(hint.fips, { type: hint.type, value: hint.value });
  hintsUsed += 1;
  hintResultEl.innerHTML = `Hint ${hintsUsed}/${maxHints}<small>${hint.display}</small>`;
}
function handleModeChange() {
  currentMode = modeSelect.value;
  syncModeVisibility();
  clearScoringClasses();
  resultsEl.textContent = '';
  hintResultEl.textContent = '';
}
window.addEventListener('resize', () => {
  clearTimeout(window.__mapResizeTimer);
  window.__mapResizeTimer = setTimeout(() => {
    buildMap().catch((err) => {
      console.error(err);
      statusTextEl.textContent = 'Could not reload the map.';
    });
  }, 180);
});
scoreBtn.addEventListener('click', () => scoreQuiz(false));
hintBtn.addEventListener('click', applyHint);
resetBtn.addEventListener('click', () => { resetAssignments(); startTimer(); });
modeSelect.addEventListener('change', handleModeChange);
timerSelect.addEventListener('change', () => { startTimer(); resultsEl.textContent = ''; });
renderBanks();
buildMap()
  .then(() => {
    syncModeVisibility();
    startTimer();
    statusTextEl.textContent = 'Ready! Drag words onto the map or use the Northeast inset for smaller states.';
  })
  .catch((err) => {
    console.error(err);
    statusTextEl.textContent = 'Could not load the online map. Run this app from a local web server and make sure you are online.';
    resultsEl.innerHTML = '<small>This version uses public CDNs for the map data and JavaScript libraries.</small>';
  });
