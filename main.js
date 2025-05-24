// Aspect ratios: [w, h]
const aspectRatios = [
  [1, 1],
  [16, 9],
  [4, 3],
  [3, 2],
  [21, 9],
  [5, 4],
];
const MIN_WIDTH = 500;
const ITEM_COUNT = 24;

// Generate a random color (pastel for visibility)
function randomColor() {
  const h = Math.floor(Math.random() * 360);
  const s = 60 + Math.floor(Math.random() * 30);
  const l = 45 + Math.floor(Math.random() * 20);
  return `hsl(${h},${s}%,${l}%)`;
}

// Get container height (50% of viewport)
function getContainerHeight() {
  return Math.floor(window.innerHeight * 0.5);
}

function createItems() {
  const imagesRow = document.getElementById('imagesRow');
  imagesRow.innerHTML = "";
  let totalWidth = 0;
  const containerHeight = getContainerHeight();
  for (let i = 1; i <= ITEM_COUNT; i++) {
    const [w, h] = aspectRatios[Math.floor(Math.random() * aspectRatios.length)];
    // always fit within containerHeight
    let boxHeight = containerHeight;
    let boxWidth = Math.round(boxHeight * w / h);
    if (boxWidth < MIN_WIDTH) {
      boxWidth = MIN_WIDTH;
      boxHeight = Math.round(boxWidth * h / w);
      if (boxHeight > containerHeight) {
        boxHeight = containerHeight;
        boxWidth = Math.round(boxHeight * w / h);
      }
    }
    const item = document.createElement('div');
    item.className = 'scroll-item';
    item.style.width = boxWidth + 'px';
    item.style.height = boxHeight + 'px';
    item.style.background = randomColor();
    item.textContent = i;
    imagesRow.appendChild(item);
    totalWidth += boxWidth;
  }
  document.getElementById('fakeInner').style.minWidth = totalWidth + 'px';
  return totalWidth;
}

// Scroll sync: fakeScrollbar <-> imagesRow
const imagesRow = document.getElementById('imagesRow');
const fakeScrollbar = document.getElementById('fakeScrollbar');

// On resize, regenerate items for new height and reset scroll
function handleResize() {
  createItems();
  fakeScrollbar.scrollLeft = 0;
  imagesRow.scrollLeft = 0;
}
window.addEventListener('resize', handleResize);

// Init
createItems();

fakeScrollbar.addEventListener('scroll', () => {
  imagesRow.scrollLeft = fakeScrollbar.scrollLeft;
});

// Horizontal scroll via wheel/trackpad anywhere on the screen
document.addEventListener('wheel', function(e) {
  if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
    fakeScrollbar.scrollLeft += e.deltaX;
    e.preventDefault();
  } else if (e.ctrlKey || e.shiftKey) {
    fakeScrollbar.scrollLeft += e.deltaY;
    e.preventDefault();
  }
}, {passive: false});

// Center everything initially
function syncInitialScroll() {
  fakeScrollbar.scrollLeft = 0;
  imagesRow.scrollLeft = 0;
}
window.onload = syncInitialScroll;
