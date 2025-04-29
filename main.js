let isDragging = false;
let startX, startY;
let offsetX = 0, offsetY = 0;
let container = document.body;

document.addEventListener("mousedown", (event) => {
    if (!window.spoutActive) return;
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
    container.style.transform = "translate(0, 0)";
    offsetX = offsetY = 0;
});

document.querySelectorAll("a").forEach(link => {
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
});

// —— Mobile popup (always top) ——
if (window.innerWidth <= 768) {
    const popup = document.createElement("div");
    Object.assign(popup.style, {
        position: "fixed",
        width: "90%",
        maxWidth: "480px",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "#111",
        padding: "24px",
        borderRadius: "16px",
        zIndex: "10002",
        color: "#f0f0f0",
        fontFamily: "system-ui, sans-serif",
        textAlign: "center",
        boxShadow: "0 12px 48px rgba(0,0,0,0.8)",
        backdropFilter: "blur(8px)",
        opacity: "0",
        visibility: "hidden",
        transition: "opacity 0.4s ease, visibility 0.4s ease"
    });

    popup.innerHTML = `
        <h2 style="font-size:1.5rem; margin-bottom:0.75rem;">Heads up!</h2>
        <p style="margin-bottom:1rem;">
            This site isn’t optimized for mobile yet, but you can check out my <strong>sleek portfolio</strong> that is:
        </p>
        <a href="https://powplowdevs.github.io/sleekPortfolio/" 
           style="display:inline-block; margin-bottom:1rem; padding:0.75rem 1.5rem; 
                  background:linear-gradient(135deg,#1e90ff,#3cbaff); color:#fff; 
                  border:none; border-radius:8px; text-decoration:none; font-weight:500; 
                  box-shadow:0 4px 12px rgba(0,0,0,0.3); transition:transform 0.2s ease;"
           onmouseover="this.style.transform='scale(1.05)';"
           onmouseout="this.style.transform='scale(1)';">
            View Mobile Site
        </a>
        <div>
            <button id="mobileClose" 
                    style="padding:0.5rem 1rem; background:#444; border:none; 
                           border-radius:6px; color:#ccc; font-size:0.9rem; cursor:pointer; 
                           transition:background 0.2s ease;">
                Got it
            </button>
        </div>
    `;

    document.body.appendChild(popup);
    setTimeout(() => {
        popup.style.opacity = "1";
        popup.style.visibility = "visible";
    }, 100);

    popup.querySelector("#mobileClose").addEventListener("click", () => {
        popup.style.opacity = "0";
        popup.style.visibility = "hidden";
        setTimeout(() => popup.remove(), 400);
    });
}

// —— Employer popup (desktop only) ——
if (window.innerWidth > 768) {
    window.addEventListener("load", () => {
        // backdrop
        const backdrop = document.createElement("div");
        Object.assign(backdrop.style, {
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: "10000",
            opacity: "0",
            visibility: "hidden",
            transition: "opacity 0.4s ease"
        });
        document.body.appendChild(backdrop);

        // popup card
        const empPopup = document.createElement("div");
        Object.assign(empPopup.style, {
            position: "fixed",
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: "400px",
            background: "#fff",
            padding: "32px",
            borderRadius: "12px",
            zIndex: "10001",
            color: "#333",
            fontFamily: "system-ui, sans-serif",
            textAlign: "center",
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            opacity: "0",
            visibility: "hidden",
            transition: "opacity 0.4s ease, visibility 0.4s ease"
        });

        empPopup.innerHTML = `
            <h2 style="margin-bottom:0.5rem; font-size:1.75rem; color:#222;">
                Hey there!
            </h2>
            <p style="margin-bottom:1.5rem; font-size:1rem; line-height:1.4;">
                Are you an employer? Take a peek at my <strong>sleek portfolio</strong>, a more conventional showcase of my work.
            </p>
            <a href="https://powplowdevs.github.io/sleekPortfolio/" 
               style="display:inline-block; margin-bottom:1.5rem; padding:0.75rem 1.5rem; 
                      background:#007bff; color:#fff; text-decoration:none; border-radius:6px; 
                      font-weight:500; box-shadow:0 4px 10px rgba(0,0,0,0.15); transition:background 0.2s ease;"
               onmouseover="this.style.background='#0056b3';"
               onmouseout="this.style.background='#007bff';">
                View Portfolio
            </a>
            <div>
                <button id="empClose" 
                        style="padding:0.5rem 1rem; background:#e0e0e0; border:none; 
                               border-radius:6px; font-size:0.9rem; cursor:pointer; 
                               transition:background 0.2s ease;">
                    Close
                </button>
            </div>
        `;

        document.body.appendChild(empPopup);

        // show both
        setTimeout(() => {
            backdrop.style.opacity = "1";
            backdrop.style.visibility = "visible";
            empPopup.style.opacity = "1";
            empPopup.style.visibility = "visible";
        }, 100);

        // close handler
        document.querySelector("#empClose").addEventListener("click", () => {
            backdrop.style.opacity = empPopup.style.opacity = "0";
            backdrop.style.visibility = empPopup.style.visibility = "hidden";
            setTimeout(() => {
                backdrop.remove();
                empPopup.remove();
            }, 400);
        });
    });
}
