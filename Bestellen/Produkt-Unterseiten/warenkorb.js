// Funktion zum Abrufen des Produktnamens und Preises
function getProductDetails() {
    // Den Produktnamen aus dem h2-Tag holen und "Produktname: " entfernen
    let produktName = document.querySelector("#beschreibung h2").innerText;
    produktName = produktName.replace(/^Produktname:\s*/, '').trim();

    // Den Preis aus dem div#preis holen und in eine Zahl umwandeln
    let preisText = document.querySelector("#preis").innerText;
    // Eurozeichen entfernen, Komma durch Punkt ersetzen und in float umwandeln
    let produktPreis = parseFloat(preisText.replace('€', '').replace(',', '.').trim());

    // Rückgabe der Produktinformationen als Objekt
    return {
        name: produktName,
        preis: produktPreis
    };
}

// Funktion zum Hinzufügen eines Produkts zum Warenkorb
function addToCart() {
    const produkt = getProductDetails();

    // Den Warenkorb aus dem LocalStorage holen (falls vorhanden)
    let cart = JSON.parse(localStorage.getItem("cart")) || []; // Falls der Warenkorb noch leer ist, ein leeres Array erstellen

    // Normalize product name for comparison
    const normalizedProductName = produkt.name.trim().toLowerCase();

    // Prüfen, ob das Produkt bereits im Warenkorb ist (case-insensitive)
    const existingProductIndex = cart.findIndex(item => item.name.trim().toLowerCase() === normalizedProductName);
    if (existingProductIndex !== -1) {
        // Produkt ist bereits im Warenkorb, Menge erhöhen
        cart[existingProductIndex].quantity = (cart[existingProductIndex].quantity || 1) + 1;
    } else {
        // Neues Produkt, Menge auf 1 setzen
        produkt.quantity = 1;
        cart.push(produkt);
    }

    // Den Warenkorb wieder im LocalStorage speichern
    localStorage.setItem("cart", JSON.stringify(cart));

    // Erfolgsnachricht anzeigen
    const successMessage = document.getElementById("success-message");
    successMessage.style.display = "block";

    // Nachricht nach 3 Sekunden ausblenden
    setTimeout(() => {
        successMessage.style.display = "none";
    }, 3000); // Nachricht nach 3 Sekunden ausblenden

    // Zähler aktualisieren
    if (typeof warenkorbZaehlerAktualisieren === 'function') {
        warenkorbZaehlerAktualisieren();
    }
}

// Event Listener für den "In den Warenkorb"-Button
document.getElementById("add-to-cart-button").addEventListener("click", addToCart);

// Funktion zum Schließen der Erfolgsmeldung
function closeSuccessMessage() {
    const successMessage = document.getElementById("success-message");
    successMessage.style.display = "none"; // Versteckt die Nachricht
}
