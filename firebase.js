import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    signInAnonymously
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
    getFirestore,
    collection,
    doc,
    getDocs,
    limit,
    orderBy,
    query,
    serverTimestamp,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDjAdeq5_ax7iwzsRDOEYsaPdUfWB-4An4",
    authDomain: "doenertycoon.firebaseapp.com",
    projectId: "doenertycoon",
    storageBucket: "doenertycoon.firebasestorage.app",
    messagingSenderId: "297316866409",
    appId: "1:297316866409:web:6c33b1a88444ce6f4945f8",
    measurementId: "G-36QHH2MQG8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let aktuellerSpieler = null;

async function anonymAnmelden() {
    try {
        if (!auth.currentUser) {
            await signInAnonymously(auth);
        }
    } catch (fehler) {
        console.error("Firebase-Anmeldung fehlgeschlagen:", fehler);
    }
}

onAuthStateChanged(auth, (spieler) => {
    aktuellerSpieler = spieler;

    if (spieler) {
        window.dispatchEvent(
            new CustomEvent("firebaseBereit", {
                detail: {
                    spielerId: spieler.uid
                }
            })
        );
    }
});

window.ranglistenSpielerSpeichern = async function (spielDaten) {
    if (!aktuellerSpieler) {
        return;
    }

    try {
        const spielerRef = doc(
            db,
            "players",
            aktuellerSpieler.uid
        );

        await setDoc(
            spielerRef,
            {
                ladenName: String(spielDaten.ladenName || "Unbekannter Laden"),
                gesamtUmsatz: Number(spielDaten.gesamtUmsatz) || 0,
                geld: Number(spielDaten.geld) || 0,
                mitarbeiter: Number(spielDaten.mitarbeiter) || 0,
                level: Number(spielDaten.level) || 1,
                zuletztAktiv: serverTimestamp()
            },
            {
                merge: true
            }
        );
    } catch (fehler) {
        console.error("Spieler konnte nicht gespeichert werden:", fehler);
    }
};

window.ranglisteLaden = async function () {
    try {
        const ranglistenQuery = query(
            collection(db, "players"),
            orderBy("gesamtUmsatz", "desc"),
            limit(10)
        );

        const ergebnis = await getDocs(ranglistenQuery);

        return ergebnis.docs.map((eintrag, index) => {
            const daten = eintrag.data();

            return {
                platz: index + 1,
                ladenName: daten.ladenName || "Unbekannter Laden",
                gesamtUmsatz: Number(daten.gesamtUmsatz) || 0,
                mitarbeiter: Number(daten.mitarbeiter) || 0,
                level: Number(daten.level) || 1
            };
        });
    } catch (fehler) {
        console.error("Rangliste konnte nicht geladen werden:", fehler);
        return [];
    }
};

anonymAnmelden();
