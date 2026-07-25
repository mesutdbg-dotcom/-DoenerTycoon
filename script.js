let geld = 0;

const geldAnzeige = document.getElementById("money");
const donerButton = document.getElementById("donerButton");

function aktualisieren() {
    geldAnzeige.textContent = geld + " €";
}

donerButton.addEventListener("click", function () {
    geld++;
    aktualisieren();

    donerButton.style.transform = "scale(1.08)";

    setTimeout(function () {
        donerButton.style.transform = "";
    }, 100);

    const plus = document.createElement("div");
    plus.textContent = "+1 €";

    plus.style.position = "fixed";
    plus.style.left = "50%";
    plus.style.top = "48%";
    plus.style.transform = "translate(-50%, -50%)";
    plus.style.fontSize = "32px";
    plus.style.fontWeight = "bold";
    plus.style.color = "#00ff66";
    plus.style.pointerEvents = "none";
    plus.style.zIndex = "9999";
    plus.style.transition = "all 0.7s ease";

    document.body.appendChild(plus);

    setTimeout(function () {
        plus.style.top = "38%";
        plus.style.opacity = "0";
    }, 20);

    setTimeout(function () {
        plus.remove();
    }, 750);

    if ("vibrate" in navigator) {
        navigator.vibrate(15);
    }
});
