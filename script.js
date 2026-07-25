let geld = 0;
let geldProKlick = 1;
let geldProSekunde = 0;

let mitarbeiter = 0;
let mitarbeiterPreis = 50;

const spielstand = localStorage.getItem("doenerTycoon");

if (spielstand) {
    const daten = JSON.parse(spielstand);

    geld = daten.geld || 0;
    geldProKlick = daten.geldProKlick || 1;
    geldProSekunde = daten.geldProSekunde || 0;
    mitarbeiter = daten.mitarbeiter || 0;
    mitarbeiterPreis = daten.mitarbeiterPreis || 50;
}

const geldAnzeige = document.getElementById("money");
const donerButton = document.getElementById("donerButton");

const workerBtn = document.getElementById("workerBtn");
const knifeBtn = document.getElementById("knifeBtn");
const meatBtn = document.getElementById("meatBtn");

let knifeGekauft = false;
let meatGekauft = false;

function speichern() {
    localStorage.setItem("doenerTycoon", JSON.stringify({
        geld,
        geldProKlick,
        geldProSekunde,
        mitarbeiter,
        mitarbeiterPreis
    }));
}

function aktualisieren() {
    geldAnzeige.textContent = Math.floor(geld) + " €";

    workerBtn.innerHTML =
        "👨‍🍳 Mitarbeiter (" + mitarbeiter + ")" +
        "<br><small>" + mitarbeiterPreis + " € • +1 €/Sekunde</small>";

    speichern();
}

function zeigePlus(text) {
    const plus = document.createElement("div");

    plus.textContent = text;
    plus.style.position = "fixed";
    plus.style.left = "50%";
    plus.style.top = "48%";
    plus.style.transform = "translate(-50%,-50%)";
    plus.style.fontSize = "32px";
    plus.style.fontWeight = "bold";
    plus.style.color = "#00ff66";
    plus.style.pointerEvents = "none";
    plus.style.transition = "0.7s";

    document.body.appendChild(plus);

    setTimeout(() => {
        plus.style.top = "38%";
        plus.style.opacity = "0";
    }, 20);

    setTimeout(() => plus.remove(), 700);
}

donerButton.addEventListener("click", () => {
    geld += geldProKlick;

    donerButton.style.transform = "scale(1.08)";
    setTimeout(() => donerButton.style.transform = "", 100);

    zeigePlus("+" + geldProKlick + " €");

    aktualisieren();
});

workerBtn.addEventListener("click", () => {
    if (geld >= mitarbeiterPreis) {
        geld -= mitarbeiterPreis;
        mitarbeiter++;
        geldProSekunde++;

        mitarbeiterPreis = Math.floor(mitarbeiterPreis * 1.8);

        aktualisieren();
    } else {
        alert("Du brauchst " + mitarbeiterPreis + " €.");
    }
});

knifeBtn.addEventListener("click", () => {
    if (knifeGekauft) return;

    if (geld >= 100) {
        geld -= 100;
        geldProKlick = 2;
        knifeGekauft = true;

        knifeBtn.innerHTML = "✅ Messer gekauft";
        knifeBtn.disabled = true;

        aktualisieren();
    } else {
        alert("Du brauchst 100 €.");
    }
});

meatBtn.addEventListener("click", () => {
    if (meatGekauft) return;

    if (geld >= 250) {
        geld -= 250;
        geldProKlick = 5;
        meatGekauft = true;

        meatBtn.innerHTML = "✅ Premium-Fleisch gekauft";
        meatBtn.disabled = true;

        aktualisieren();
    } else {
        alert("Du brauchst 250 €.");
    }
});

setInterval(() => {
    geld += geldProSekunde;
    aktualisieren();
}, 1000);

aktualisieren();
