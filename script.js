let geld = 0;

const geldAnzeige = document.getElementById("money");
const donerButton = document.getElementById("donerButton");

function aktualisieren() {
    geldAnzeige.textContent = geld + " €";
}

donerButton.addEventListener("click", () => {

    geld++;

    aktualisieren();

    // Döner springt kurz
    donerButton.style.transform = "scale(1.08)";

    setTimeout(() => {
        donerButton.style.transform = "scale(1)";
    }, 100);

    // Vibration (Handy)
    if (navigator.vibrate) {
        navigator.vibrate(15);
    }

    // +1 €
    const plus = document.createElement("div");

    plus.textContent = "+1 €";

    plus.style.position = "fixed";
    plus.style.left = "50%";
    plus.style.top = "50%";
    plus.style.transform = "translate(-50%, -50%)";
    plus.style.fontSize = "32px";
    plus.style.fontWeight = "bold";
    plus.style.color = "#00ff66";
    plus.style.pointerEvents = "none";
    plus.style.transition = "all 0.8s ease";

    document.body.appendChild(plus);

    setTimeout(() => {
        plus.style.top = "38%";
        plus.style.opacity = "0";
    }, 20);

    setTimeout(() => {
        plus.remove();
    }, 800);

});
