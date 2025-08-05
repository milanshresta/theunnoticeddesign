// Preloader typing effect
function typeText(element, text, speed, callback) {
  let i = 0;
  element.textContent = '';
  
  function typing() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(typing, speed);
    } else {
      if (callback) callback();
    }
  }
  
  typing();
}

// Shuffle array function
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

document.addEventListener('DOMContentLoaded', function() {
  const preloader = document.getElementById('preloader');
  const typingText = document.getElementById('typingText');
  const textToType = "The Unnoticed Design";
  
  typeText(typingText, textToType, 100, function() {
    setTimeout(() => {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.remove();
        document.body.classList.add('loaded');
        initializeMainContent();
      }, 500);
    }, 1000);
  });
});

function initializeMainContent() {
  // Only these two aspect ratios: [w, h]
  const baseRatios = [
    [1080, 1350], // Vertical (4:5)
    [1080, 1080]  // Square (1:1)
  ];
  
  // Create shuffled array of ratios for all items
  const itemRatios = [];
  for (let i = 0; i < 24; i++) {
    itemRatios.push(...baseRatios);
  }
  const shuffledRatios = shuffleArray(itemRatios).slice(0, 24);

  const MIN_WIDTH = 500;
  const ITEM_COUNT = 24;

  function randomColor() {
    const h = Math.floor(Math.random() * 360);
    const s = 60 + Math.floor(Math.random() * 30);
    const l = 45 + Math.floor(Math.random() * 20);
    return `hsl(${h},${s}%,${l}%)`;
  }

  // Set container height to 60% of viewport to better fit vertical items
  function getContainerHeight() {
    return Math.floor(window.innerHeight * 0.6);
  }

  function createItems() {
    const imagesRow = document.getElementById('imagesRow');
    imagesRow.innerHTML = "";
    let totalWidth = 0;
    const containerHeight = getContainerHeight();
    
    shuffledRatios.forEach(([w, h], i) => {
      // Calculate width based on container height
      let boxHeight = containerHeight;
      let boxWidth = Math.round(boxHeight * w / h);
      
      // Ensure minimum width
      if (boxWidth < MIN_WIDTH) {
        boxWidth = MIN_WIDTH;
        boxHeight = Math.round(boxWidth * h / w);
      }
      
      const item = document.createElement('div');
      item.className = 'scroll-item';
      item.style.width = `${boxWidth}px`;
      item.style.height = `${boxHeight}px`;
      item.style.background = randomColor();
      item.textContent = i + 1;
      imagesRow.appendChild(item);
      totalWidth += boxWidth;
    });
    
    document.getElementById('fakeInner').style.minWidth = `${totalWidth}px`;
    return totalWidth;
  }

  // Scroll sync setup
  const imagesRow = document.getElementById('imagesRow');
  const fakeScrollbar = document.getElementById('fakeScrollbar');

  function handleResize() {
    createItems();
    fakeScrollbar.scrollLeft = 0;
    imagesRow.scrollLeft = 0;
  }

  // Initialize
  createItems();
  window.addEventListener('resize', handleResize);

  // Sync scrollbars
  fakeScrollbar.addEventListener('scroll', () => {
    imagesRow.scrollLeft = fakeScrollbar.scrollLeft;
  });

  // Horizontal scroll via wheel
  document.addEventListener('wheel', function(e) {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      fakeScrollbar.scrollLeft += e.deltaX;
      e.preventDefault();
    } else if (e.ctrlKey || e.shiftKey) {
      fakeScrollbar.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  }, {passive: false});

  // Initial scroll position
  function syncInitialScroll() {
    fakeScrollbar.scrollLeft = 0;
    imagesRow.scrollLeft = 0;
  }
  window.onload = syncInitialScroll;
}
