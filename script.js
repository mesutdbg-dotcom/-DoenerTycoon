let geld = 0;
let geldProKlick = 1;
let geldProSekunde = 0;

const spielstand = localStorage.getItem("doenerTycoon");

if (spielstand) {
    const daten = JSON.parse(spielstand);
    geld = daten.geld;
    geldProKlick = daten.geldProKlick;
    geldProSekunde = daten.geldProSekunde;
}

const geldAnzeige = document.getElementById("money");
const donerButton = document.getElementById("donerButton");

const workerBtn = document.getElementById("workerBtn");
const knifeBtn = document.getElementById("knifeBtn");
const meatBtn = document.getElementById("meatBtn");

function speichern() {
    localStorage.setItem("doenerTycoon", JSON.stringify({
        geld: geld,
        geldProKlick: geldProKlick,
        geldProSekunde: geldProSekunde
    }));
}

function aktualisieren() {
    geldAnzeige.textContent = Math.floor(geld) + " €";
    speichern();
}

function zeigePlus(text) {
    const plus = document.createElement("div");

    plus.textContent = text;
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
}

donerButton.addEventListener("click", function () {
    geld += geldProKlick;
    aktualisieren();

    donerButton.style.transform = "scale(1.08)";

    setTimeout(function () {
        donerButton.style.transform = "";
    }, 100);

    zeigePlus("+" + geldProKlick + " €");
});

workerBtn.addEventListener("click", function () {
    if (geld >= 50) {
        geld -= 50;
        geldProSekunde += 1;

        workerBtn.innerHTML =
            "✅ Mitarbeiter gekauft<br><small>+1 €/Sekunde</small>";

        workerBtn.disabled = true;
        aktualisieren();
    } else {
        alert("Du brauchst 50 €.");
    }
});

knifeBtn.addEventListener("click", function () {
    if (geld >= 100) {
        geld -= 100;
        geldProKlick = 2;

        knifeBtn.innerHTML =
            "✅ Besseres Messer gekauft<br><small>2 €/Klick</small>";

        knifeBtn.disabled = true;
        aktualisieren();
    } else {
        alert("Du brauchst 100 €.");
    }
});

meatBtn.addEventListener("click", function () {
    if (geld >= 250) {
        geld -= 250;
        geldProKlick = 5;

        meatBtn.innerHTML =
            "✅ Premium-Fleisch gekauft<br><small>5 €/Klick</small>";

        meatBtn.disabled = true;
        aktualisieren();
    } else {
        alert("Du brauchst 250 €.");
    }
});

setInterval(function () {
    geld += geldProSekunde;
    aktualisieren();
}, 1000);

aktualisieren();
