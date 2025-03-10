let isDragging = false;
let startX, startY;
let offsetX = 0, offsetY = 0;
let container = document.body;

document.addEventListener("mousedown", (event) => {
    if(!window.spoutActive) return;
    isDragging = true;
    startX = event.clientX - offsetX;
    startY = event.clientY - offsetY;
    container.style.transition = "none";
});

document.addEventListener("mousemove", (event) => {
    if (!isDragging) return;
    
    offsetX = event.clientX - startX;
    offsetY = event.clientY - startY;

    // container.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
});

document.addEventListener("mouseup", () => {
    isDragging = false;
    container.style.transition = "transform 0.25s ease-out";
    container.style.transform = "translate(0px, 0px)";
    offsetX = 0
    offsetY = 0;
});

document.querySelectorAll('a').forEach(link => {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  });
  
