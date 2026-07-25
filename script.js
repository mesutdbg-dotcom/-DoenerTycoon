let geld = 0;
let geldProKlick = 1;
let geldProSekunde = 0;
let gesamtUmsatz = 0;

let mitarbeiter = 0;
let mitarbeiterPreis = 50;

let knifeGekauft = false;
let meatGekauft = false;

let ladenName = "";

let firebaseIstBereit = false;
let onlineSpeicherungLaeuft = false;
let letzteOnlineSpeicherung = 0;

const spielstand = localStorage.getItem("doenerTycoon");

if (spielstand) {
    try {
        const daten = JSON.parse(spielstand);

        geld = Number(daten.geld) || 0;
        geldProKlick = Number(daten.geldProKlick) || 1;
        geldProSekunde = Number(daten.geldProSekunde) || 0;
        gesamtUmsatz = Number(daten.gesamtUmsatz) || 0;

        mitarbeiter = Number(daten.mitarbeiter) || 0;
        mitarbeiterPreis = Number(daten.mitarbeiterPreis) || 50;

        knifeGekauft = Boolean(daten.knifeGekauft);
        meatGekauft = Boolean(daten.meatGekauft);

        ladenName = daten.ladenName || "";
    } catch (fehler) {
        console.log("Spielstand konnte nicht geladen werden.");
    }
}

const geldAnzeige = document.getElementById("money");
const incomeAnzeige = document.getElementById("incomeAnzeige");
const levelAnzeige = document.getElementById("levelAnzeige");

const donerButton = document.getElementById("donerButton");
const workerBtn = document.getElementById("workerBtn");
const knifeBtn = document.getElementById("knifeBtn");
const meatBtn = document.getElementById("meatBtn");

const nameOverlay = document.getElementById("nameOverlay");
const shopNameInput = document.getElementById("shopNameInput");
const startGameBtn = document.getElementById("startGameBtn");
const shopTitle = document.getElementById("shopTitle");

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
            meatGekauft,
            ladenName
        })
    );
}

function ladenNameAnzeigen() {
    if (ladenName) {
        shopTitle.textContent = "🥙 " + ladenName;
        nameOverlay.style.display = "none";
    } else {
        nameOverlay.style.display = "flex";
    }
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
            Math.max(0, Math.ceil(benoetigt)).toLocaleString("de-DE") +
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

    incomeAnzeige.textContent =
        "⚡ " +
        geldProSekunde.toLocaleString("de-DE") +
        " € pro Sekunde";

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

/* -------------------------------- */
/* ONLINE-RANGLISTE                  */
/* -------------------------------- */

function ranglisteErstellen() {
    if (document.getElementById("ranglisteBereich")) {
        return;
    }

    const bereich = document.createElement("section");
    bereich.id = "ranglisteBereich";

    bereich.innerHTML = `
        <div class="ranglisteKopf">
            <div>
                <h2>🏆 Online-Rangliste</h2>
                <p id="ranglisteStatus">Verbindung wird hergestellt …</p>
            </div>

            <button id="ranglisteNeuLaden" type="button">
                🔄
            </button>
        </div>

        <div id="ranglisteInhalt">
            <p class="ranglisteLaden">Rangliste wird geladen …</p>
        </div>
    `;

    const mainBereich = document.querySelector("main");

    if (mainBereich) {
        mainBereich.appendChild(bereich);
    } else {
        document.body.appendChild(bereich);
    }

    const style = document.createElement("style");

    style.textContent = `
        #ranglisteBereich {
            width: min(92%, 520px);
            margin: 24px auto 40px;
            padding: 18px;
            border-radius: 20px;
            background: rgba(20, 20, 20, 0.92);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
            color: white;
            box-sizing: border-box;
        }

        .ranglisteKopf {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            margin-bottom: 15px;
        }

        .ranglisteKopf h2 {
            margin: 0 0 4px;
            font-size: 22px;
        }

        #ranglisteStatus {
            margin: 0;
            font-size: 13px;
            opacity: 0.75;
        }

        #ranglisteNeuLaden {
            width: 44px;
            height: 44px;
            border: none;
            border-radius: 14px;
            font-size: 20px;
            cursor: pointer;
            background: #ffb000;
        }

        #ranglisteNeuLaden:active {
            transform: scale(0.94);
        }

        .ranglistenZeile {
            display: grid;
            grid-template-columns: 42px 1fr auto;
            align-items: center;
            gap: 10px;
            padding: 12px 8px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .ranglistenZeile:last-child {
            border-bottom: none;
        }

        .ranglistenPlatz {
            font-size: 21px;
            font-weight: bold;
            text-align: center;
        }

        .ranglistenName {
            font-weight: bold;
            overflow-wrap: anywhere;
        }

        .ranglistenDetails {
            margin-top: 3px;
            font-size: 12px;
            opacity: 0.7;
        }

        .ranglistenUmsatz {
            font-weight: bold;
            white-space: nowrap;
            color: #45e77b;
        }

        .ranglisteLaden,
        .ranglisteLeer,
        .ranglisteFehler {
            text-align: center;
            padding: 20px 10px;
            opacity: 0.8;
        }

        @media (max-width: 420px) {
            .ranglistenZeile {
                grid-template-columns: 36px 1fr;
            }

            .ranglistenUmsatz {
                grid-column: 2;
                margin-top: 3px;
            }
        }
    `;

    document.head.appendChild(style);

    document
        .getElementById("ranglisteNeuLaden")
        .addEventListener("click", async () => {
            await onlineSpeichern(true);
            await ranglisteAnzeigen();
        });
}

function ranglistenPlatzAnzeigen(platz) {
    if (platz === 1) {
        return "🥇";
    }

    if (platz === 2) {
        return "🥈";
    }

    if (platz === 3) {
        return "🥉";
    }

    return platz + ".";
}

async function ranglisteAnzeigen() {
    const inhalt = document.getElementById("ranglisteInhalt");
    const status = document.getElementById("ranglisteStatus");

    if (!inhalt || !status) {
        return;
    }

    if (
        !firebaseIstBereit ||
        typeof window.ranglisteLaden !== "function"
    ) {
        status.textContent = "Warte auf Firebase …";
        return;
    }

    inhalt.innerHTML =
        '<p class="ranglisteLaden">Rangliste wird geladen …</p>';

    try {
        const spielerListe = await window.ranglisteLaden();

        inhalt.innerHTML = "";

        if (!spielerListe || spielerListe.length === 0) {
            inhalt.innerHTML =
                '<p class="ranglisteLeer">Noch keine Spieler vorhanden.</p>';

            status.textContent = "Online verbunden";
            return;
        }

        spielerListe.forEach((spieler) => {
            const zeile = document.createElement("div");
            zeile.className = "ranglistenZeile";

            const platz = document.createElement("div");
            platz.className = "ranglistenPlatz";
            platz.textContent =
                ranglistenPlatzAnzeigen(spieler.platz);

            const informationen = document.createElement("div");

            const name = document.createElement("div");
            name.className = "ranglistenName";
            name.textContent =
                spieler.ladenName || "Unbekannter Laden";

            const details = document.createElement("div");
            details.className = "ranglistenDetails";
            details.textContent =
                "Level " +
                spieler.level +
                " • " +
                spieler.mitarbeiter +
                " Mitarbeiter";

            informationen.appendChild(name);
            informationen.appendChild(details);

            const umsatz = document.createElement("div");
            umsatz.className = "ranglistenUmsatz";
            umsatz.textContent =
                Math.floor(spieler.gesamtUmsatz)
                    .toLocaleString("de-DE") + " €";

            zeile.appendChild(platz);
            zeile.appendChild(informationen);
            zeile.appendChild(umsatz);

            inhalt.appendChild(zeile);
        });

        status.textContent =
            "Online verbunden • Top 10 nach Gesamtumsatz";
    } catch (fehler) {
        console.error("Fehler beim Anzeigen der Rangliste:", fehler);

        inhalt.innerHTML =
            '<p class="ranglisteFehler">Rangliste konnte nicht geladen werden.</p>';

        status.textContent = "Verbindungsfehler";
    }
}

async function onlineSpeichern(sofort = false) {
    if (
        !firebaseIstBereit ||
        !ladenName ||
        typeof window.ranglistenSpielerSpeichern !== "function"
    ) {
        return;
    }

    if (onlineSpeicherungLaeuft) {
        return;
    }

    const jetzt = Date.now();

    if (!sofort && jetzt - letzteOnlineSpeicherung < 10000) {
        return;
    }

    onlineSpeicherungLaeuft = true;

    try {
        await window.ranglistenSpielerSpeichern({
            ladenName,
            gesamtUmsatz,
            geld,
            mitarbeiter,
            level: aktuellesLevelFinden() + 1
        });

        letzteOnlineSpeicherung = Date.now();
    } catch (fehler) {
        console.error("Online-Speicherung fehlgeschlagen:", fehler);
    } finally {
        onlineSpeicherungLaeuft = false;
    }
}

window.addEventListener("firebaseBereit", async () => {
    firebaseIstBereit = true;

    const status = document.getElementById("ranglisteStatus");

    if (status) {
        status.textContent = "Online verbunden";
    }

    await onlineSpeichern(true);
    await ranglisteAnzeigen();
});

/*
Falls Firebase bereits bereit war, bevor dieses Script
den Event-Listener geladen hat, wird die Verbindung hier
noch einmal geprüft.
*/
const firebasePruefung = setInterval(async () => {
    if (
        typeof window.ranglistenSpielerSpeichern === "function" &&
        typeof window.ranglisteLaden === "function"
    ) {
        firebaseIstBereit = true;
        clearInterval(firebasePruefung);

        await onlineSpeichern(true);
        await ranglisteAnzeigen();
    }
}, 500);

/* -------------------------------- */
/* SPIELSTEUERUNG                    */
/* -------------------------------- */

startGameBtn.addEventListener("click", async () => {
    const eingegebenerName = shopNameInput.value.trim();

    if (eingegebenerName.length < 2) {
        alert("Bitte gib einen Namen mit mindestens 2 Zeichen ein.");
        return;
    }

    if (eingegebenerName.length > 24) {
        alert("Der Ladenname darf höchstens 24 Zeichen haben.");
        return;
    }

    ladenName = eingegebenerName;
    ladenNameAnzeigen();
    speichern();

    await onlineSpeichern(true);
    await ranglisteAnzeigen();
});

shopNameInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        startGameBtn.click();
    }
});

donerButton.addEventListener("click", () => {
    geld += geldProKlick;
    gesamtUmsatz += geldProKlick;

    zeigePlus("+" + geldProKlick + " €");

    donerButton.style.transform = "scale(1.08)";

    setTimeout(() => {
        donerButton.style.transform = "";
    }, 100);

    aktualisieren();
    onlineSpeichern();
});

workerBtn.addEventListener("click", () => {
    if (geld >= mitarbeiterPreis) {
        geld -= mitarbeiterPreis;
        mitarbeiter++;
        geldProSekunde++;

        mitarbeiterPreis =
            Math.floor(mitarbeiterPreis * 1.8);

        aktualisieren();
        onlineSpeichern();
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
        onlineSpeichern();
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
        onlineSpeichern();
    } else {
        alert("Du brauchst 250 €.");
    }
});

setInterval(() => {
    if (geldProSekunde > 0) {
        geld += geldProSekunde;
        gesamtUmsatz += geldProSekunde;

        aktualisieren();
        onlineSpeichern();
    }
}, 1000);

setInterval(async () => {
    await onlineSpeichern(true);
    await ranglisteAnzeigen();
}, 30000);

document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
        speichern();
        onlineSpeichern(true);
    }
});

window.addEventListener("beforeunload", () => {
    speichern();
    onlineSpeichern(true);
});

ranglisteErstellen();
ladenNameAnzeigen();
aktualisieren();
