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
    offsetX = 0;
    offsetY = 0;
});

document.querySelectorAll("a").forEach(link => {
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
});

// —— Employer popup ——
window.addEventListener("load", () => {
    const empPopup = document.createElement("div");
    empPopup.style.position = "fixed";
    empPopup.style.width = "80%";
    empPopup.style.maxWidth = "500px";
    empPopup.style.top = "50%";
    empPopup.style.left = "50%";
    empPopup.style.transform = "translate(-50%, -50%)";
    empPopup.style.background = "linear-gradient(145deg, #222, #111)";
    empPopup.style.padding = "25px";
    empPopup.style.borderRadius = "15px";
    empPopup.style.zIndex = "10000";
    empPopup.style.color = "#fff";
    empPopup.style.fontFamily = "'Arial', sans-serif";
    empPopup.style.textAlign = "center";
    empPopup.style.boxShadow = "0 8px 20px rgba(0,0,0,0.6)";
    empPopup.style.opacity = "0";
    empPopup.style.visibility = "hidden";
    empPopup.style.transition = "opacity 0.4s ease, visibility 0.4s ease";

    empPopup.innerHTML = `
        <h2 style="font-size: 22px; margin-bottom: 12px;">Hello there!</h2>
        <p style="font-size: 16px; margin-bottom: 18px;">
            Employer? Check out my <strong>sleek portfolio</strong> for a more streamlined view.
        </p>
        <a href="https://powplowdevs.github.io/sleekPortfolio/" 
           style="display:inline-block; margin-bottom:12px; padding:10px 16px; background:#1e90ff; color:#fff; border-radius:8px; text-decoration:none; font-size:15px;">
            View Portfolio
        </a>
        <br/>
        <button id="empClose" 
                style="padding:8px 14px; background:#444; border:none; border-radius:8px; color:#ccc; cursor:pointer; font-size:14px;">
            Close
        </button>
    `;

    document.body.appendChild(empPopup);
    // show it
    setTimeout(() => {
        empPopup.style.opacity = "1";
        empPopup.style.visibility = "visible";
    }, 100);

    document.getElementById("empClose").addEventListener("click", () => {
        empPopup.style.opacity = "0";
        empPopup.style.visibility = "hidden";
        setTimeout(() => empPopup.remove(), 400);
    });
});

// —— Mobile popup ——
if (window.innerWidth <= 768) {
    const popup = document.createElement("div");
    popup.style.position = "fixed";
    popup.style.width = "80%";
    popup.style.maxWidth = "600px";
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
        <p style="font-size: 16px; margin-bottom: 20px;">
            But hey, I've always preferred the backend anyway...
        </p>
        <p style="font-size: 14px; margin-bottom: 20px;">
            Hey, you can also check out my sleek website that <strong>IS</strong> mobile friendly:
            <a href="https://powplowdevs.github.io/sleekPortfolio/" 
               style="color:#1e90ff; text-decoration:underline;" target="_blank">
               sleekPortfolio
            </a>
        </p>
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
