let geld = 0;
let geldProKlick = 1;
let geldProSekunde = 0;
let gesamtUmsatz = 0;

let mitarbeiter = 0;
let mitarbeiterPreis = 50;

let knifeGekauft = false;
let meatGekauft = false;

const spielstand = localStorage.getItem("doenerTycoon");

if (spielstand) {
    try {
        const daten = JSON.parse(spielstand);

        geld = Number(daten.geld) || 0;
        geldProKlick = Number(daten.geldProKlick) || 1;
        geldProSekunde = Number(daten.geldProSekunde) || 0;

        mitarbeiter = Number(daten.mitarbeiter) || 0;
        mitarbeiterPreis = Number(daten.mitarbeiterPreis) || 50;

        knifeGekauft = Boolean(daten.knifeGekauft);
        meatGekauft = Boolean(daten.meatGekauft);

        gesamtUmsatz =
            Number(daten.gesamtUmsatz) ||
            Number(daten.geld) ||
            0;
    } catch (fehler) {
        console.log("Spielstand konnte nicht geladen werden.");
    }
}

const geldAnzeige = document.getElementById("money");
const donerButton = document.getElementById("donerButton");
const workerBtn = document.getElementById("workerBtn");
const knifeBtn = document.getElementById("knifeBtn");
const meatBtn = document.getElementById("meatBtn");

const levelAnzeige = document.createElement("div");
levelAnzeige.id = "levelAnzeige";

levelAnzeige.style.background = "rgba(255, 255, 255, 0.92)";
levelAnzeige.style.color = "#333";
levelAnzeige.style.padding = "15px";
levelAnzeige.style.margin = "20px 0";
levelAnzeige.style.borderRadius = "18px";
levelAnzeige.style.boxShadow = "0 6px 15px rgba(0,0,0,0.15)";
levelAnzeige.style.fontWeight = "bold";

geldAnzeige.parentNode.insertBefore(levelAnzeige, geldAnzeige);

const levelListe = [
    {
        name: "Straßenstand",
        emoji: "🥙",
        grenze: 0
    },
    {
        name: "Kleine Dönerbude",
        emoji: "🏠",
        grenze: 500
    },
    {
        name: "Döner-Restaurant",
        emoji: "🍽️",
        grenze: 2500
    },
    {
        name: "Große Filiale",
        emoji: "🏢",
        grenze: 10000
    },
    {
        name: "Döner-Kette",
        emoji: "🌍",
        grenze: 50000
    }
];

function aktuellesLevelFinden() {
    let aktuellesLevel = 0;

    for (let i = 0; i < levelListe.length; i++) {
        if (gesamtUmsatz >= levelListe[i].grenze) {
            aktuellesLevel = i;
        }
    }

    return aktuellesLevel;
}

let letztesLevel = aktuellesLevelFinden();

function speichern() {
    localStorage.setItem(
        "doenerTycoon",
        JSON.stringify({
            geld,
            geldProKlick,
            geldProSekunde,
            gesamtUmsatz,
            mitarbeiter,
            mitarbeiterPreis,
            knifeGekauft,
            meatGekauft
        })
    );
}

function levelAktualisieren() {
    const levelNummer = aktuellesLevelFinden();
    const level = levelListe[levelNummer];
    const naechstesLevel = levelListe[levelNummer + 1];

    if (levelNummer > letztesLevel) {
        alert(
            "🎉 Neues Level erreicht!\n\n" +
            level.emoji +
            " " +
            level.name
        );

        letztesLevel = levelNummer;
    }

    if (naechstesLevel) {
        const benoetigt =
            naechstesLevel.grenze - gesamtUmsatz;

        levelAnzeige.innerHTML =
            level.emoji +
            " Level " +
            (levelNummer + 1) +
            ": " +
            level.name +
            "<br><small>Noch " +
            Math.max(0, Math.ceil(benoetigt)) +
            " € bis " +
            naechstesLevel.name +
            "</small>";
    } else {
        levelAnzeige.innerHTML =
            level.emoji +
            " Level " +
            (levelNummer + 1) +
            ": " +
            level.name +
            "<br><small>🏆 Höchstes Level erreicht!</small>";
    }
}

function aktualisieren() {
    geldAnzeige.textContent =
        Math.floor(geld).toLocaleString("de-DE") + " €";

    workerBtn.innerHTML =
        "👨‍🍳 Mitarbeiter (" +
        mitarbeiter +
        ")" +
        "<br><small>" +
        mitarbeiterPreis.toLocaleString("de-DE") +
        " € • +1 €/Sekunde</small>";

    if (knifeGekauft) {
        knifeBtn.innerHTML =
            "✅ Besseres Messer gekauft" +
            "<br><small>2 €/Klick</small>";

        knifeBtn.disabled = true;
    }

    if (meatGekauft) {
        meatBtn.innerHTML =
            "✅ Premium-Fleisch gekauft" +
            "<br><small>5 €/Klick</small>";

        meatBtn.disabled = true;
    }

    levelAktualisieren();
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

    setTimeout(() => {
        plus.style.top = "38%";
        plus.style.opacity = "0";
    }, 20);

    setTimeout(() => {
        plus.remove();
    }, 700);
}

donerButton.addEventListener("click", () => {
    geld += geldProKlick;
    gesamtUmsatz += geldProKlick;

    zeigePlus("+" + geldProKlick + " €");

    donerButton.style.transform = "scale(1.08)";

    setTimeout(() => {
        donerButton.style.transform = "";
    }, 100);

    aktualisieren();
});

workerBtn.addEventListener("click", () => {
    if (geld >= mitarbeiterPreis) {
        geld -= mitarbeiterPreis;
        mitarbeiter++;
        geldProSekunde++;

        mitarbeiterPreis =
            Math.floor(mitarbeiterPreis * 1.8);

        aktualisieren();
    } else {
        alert(
            "Du brauchst " +
            mitarbeiterPreis.toLocaleString("de-DE") +
            " €."
        );
    }
});

knifeBtn.addEventListener("click", () => {
    if (knifeGekauft) {
        return;
    }

    if (geld >= 100) {
        geld -= 100;
        geldProKlick = 2;
        knifeGekauft = true;

        aktualisieren();
    } else {
        alert("Du brauchst 100 €.");
    }
});

meatBtn.addEventListener("click", () => {
    if (meatGekauft) {
        return;
    }

    if (geld >= 250) {
        geld -= 250;
        geldProKlick = 5;
        meatGekauft = true;

        aktualisieren();
    } else {
        alert("Du brauchst 250 €.");
    }
});

setInterval(() => {
    if (geldProSekunde > 0) {
        geld += geldProSekunde;
        gesamtUmsatz += geldProSekunde;

        aktualisieren();
    }
}, 1000);

aktualisieren();
