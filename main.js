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

document.querySelectorAll("a").forEach(link => {
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
});
  
if (window.innerWidth <= 768) {
    const popup = document.createElement("div");
    popup.style.position = "fixed";
    popup.style.width = "80%";
    popup.style.maxWidth = "600px";
    popup.style.textAlign = "left"; 
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.background = "linear-gradient(145deg, #333, #000)";
    popup.style.padding = "30px";
    popup.style.borderRadius = "20px";
    popup.style.zIndex = "9999";
    popup.style.textAlign = "center";
    popup.style.color = "#fff";
    popup.style.fontFamily = "'Arial', sans-serif";
    popup.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.7)";
    popup.style.transition = "all 0.5s ease-in-out";
    popup.style.opacity = "0";
    popup.style.visibility = "hidden";

    popup.innerHTML = `
        <h2 style="font-size: 24px; margin-bottom: 10px;">Sorry... This site isn't mobile-friendly yet.</h2>
        <p style="font-size: 16px; margin-bottom: 20px;">But hey, I've always preferred the backend anyway...</p>
        <button style="padding: 12px 20px; background: #ff4b5c; border: none; border-radius: 10px; color: white; font-size: 16px; cursor: pointer; transition: background 0.3s ease;">
            Got it.
        </button>
    `;

    const button = popup.querySelector("button");
    button.addEventListener("mouseover", () => {
        button.style.backgroundColor = "#ff3d4b";
    });
    button.addEventListener("mouseout", () => {
        button.style.backgroundColor = "#ff4b5c";
    });

    document.body.appendChild(popup);

    setTimeout(() => {
        popup.style.opacity = "1";
        popup.style.visibility = "visible";
    }, 100);

    button.addEventListener("click", () => {
        popup.style.opacity = "0";
        popup.style.visibility = "hidden";
        setTimeout(() => {
            popup.remove();
        }, 500);
    });
}