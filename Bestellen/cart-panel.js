// cart-panel.js

// Initialisierung: Wird beim Laden des Dokuments ausgeführt
function initialisierung() {
    // Füge Event-Listener zu allen "In den Warenkorb" Buttons hinzu
    $(".produkt").each(function() {
        var knopf = $(this).find(".add-to-cart");
        var bild = $(this).find(".produktbild");
        if (knopf.length && bild.length) {
            // Beim Klick auf den Button das Produkt zum Warenkorb hinzufügen
            knopf.on("click", function() {
                var produktUrl = bild.data("link");
                if (produktUrl) {
                    console.log("Versuche Produkt hinzuzufügen:", produktUrl);
                    produktZuWarenkorbHinzufuegen(produktUrl);
                } else {
                    alert("Produkt-URL nicht gefunden!");
                }
            });
        }
    });
    // Aktualisiere den Warenkorb-Zähler beim Laden der Seite
    warenkorbZaehlerAktualisieren();
}

// Starte die Initialisierung, sobald das Dokument bereit ist
$(document).ready(initialisierung);

/**
 * Holt Produktdetails (Name, Preis) von einer Produkt-Unterseite per AJAX (jQuery)
 * @param {string} url - Die URL der Produkt-Unterseite
 * @returns {Promise<{name: string, preis: number}>} - Ein Promise mit Produktname und Preis
 */
function produktdetailsLaden(url) {
    return new Promise(function(erfolgreich, fehlgeschlagen) {
        var absoluteUrl = new URL(url, window.location.href).href;
        // Lade die Produktseite per AJAX
        $.get(absoluteUrl, function(daten) {
            // Parse das HTML der Produktseite
            var parser = new DOMParser();
            var doc = parser.parseFromString(daten, 'text/html');
            // Hole Name und Preis aus der Seite
            var produktName = $(doc).find("#beschreibung h2").text();
            var preisText = $(doc).find("#preis").text();
            if (!produktName) {
                fehlgeschlagen("Produktname nicht gefunden. Bitte überprüfen Sie die Struktur der Produktseite.");
                return;
            }
            if (!preisText) {
                fehlgeschlagen("Preis nicht gefunden. Bitte überprüfen Sie die Struktur der Produktseite.");
                return;
            }
            // Preis-Text bereinigen und in Zahl umwandeln
            preisText = preisText.replace('€', '').replace(',', '.').trim();
            var produktPreis = parseFloat(preisText);
            if (isNaN(produktPreis)) {
                fehlgeschlagen("Ungültiger Preis: " + preisText);
                return;
            }
            // Produktdaten zurückgeben
            erfolgreich({ name: produktName, preis: produktPreis });
        }).fail(function(jqXHR, textStatus, errorThrown) {
            fehlgeschlagen("Fehler beim Laden des Produkts: " + textStatus);
        });
    });
}

// Zählt die Gesamtanzahl der Produkte im Warenkorb und zeigt sie im Warenkorb-Icon an
function warenkorbZaehlerAktualisieren() {
    const warenkorb = JSON.parse(localStorage.getItem("cart")) || [];
    const gesamtAnzahl = warenkorb.reduce((summe, artikel) => summe + artikel.quantity, 0);
    $("#cart-count").text(gesamtAnzahl);
}

// Fügt ein Produkt zum Warenkorb hinzu (wird von den Produkt-Buttons aufgerufen)
function produktZuWarenkorbHinzufuegen(produktUrl) {
    produktdetailsLaden(produktUrl)
        .then(function(produktObjekt) {
            // Warenkorb aus dem localStorage holen
            let warenkorb = JSON.parse(localStorage.getItem("cart")) || [];
            // Prüfen, ob das Produkt schon im Warenkorb ist
            const normalisierterName = produktObjekt.name.trim().toLowerCase();
            const vorhandenerIndex = warenkorb.findIndex(artikel => artikel.name.trim().toLowerCase() === normalisierterName);
            if (vorhandenerIndex !== -1) {
                // Menge erhöhen, falls schon vorhanden
                warenkorb[vorhandenerIndex].quantity = (warenkorb[vorhandenerIndex].quantity || 1) + 1;
            } else {
                // Neues Produkt mit Menge 1 hinzufügen
                produktObjekt.quantity = 1;
                warenkorb.push(produktObjekt);
            }
            // Warenkorb speichern
            localStorage.setItem("cart", JSON.stringify(warenkorb));
            // Zähler aktualisieren
            warenkorbZaehlerAktualisieren();
            // Erfolgsmeldung anzeigen
            $("#success-message").show();
            setTimeout(function() {
                $("#success-message").fadeOut();
            }, 3000);
        })
        .catch(function(fehler) {
            // Fehler anzeigen
            alert(fehler);
        });
} 