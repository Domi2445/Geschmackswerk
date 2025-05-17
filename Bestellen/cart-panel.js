// cart-panel.js

/**
 * Lädt die Produktdetails von der Produkt-Unterseite
 * @param {string} url - Die URL der Produkt-Unterseite
 * @returns {Promise<{name: string, preis: number}>} - Ein Objekt mit Produktname und Preis
 */
async function fetchProductDetails(url) {
    try {
        const absoluteUrl = new URL(url, window.location.href).href;
        console.log("Lade Produkt von URL:", absoluteUrl);
        
        const response = await fetch(absoluteUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');

        console.log("Gefundene Elemente:", {
            beschreibung: doc.querySelector("#beschreibung h2")?.innerText,
            preis: doc.querySelector("#preis")?.innerText
        });

        let produktName = doc.querySelector("#beschreibung h2")?.innerText;
        if (!produktName) {
            throw new Error("Produktname nicht gefunden. Bitte überprüfen Sie die Struktur der Produktseite.");
        }

        let preisText = doc.querySelector("#preis")?.innerText;
        if (!preisText) {
            throw new Error("Preis nicht gefunden. Bitte überprüfen Sie die Struktur der Produktseite.");
        }

        preisText = preisText.replace('€', '').replace(',', '.').trim();
        let produktPreis = parseFloat(preisText);
        
        if (isNaN(produktPreis)) {
            throw new Error(`Ungültiger Preis: ${preisText}`);
        }

        return { name: produktName, preis: produktPreis };
    } catch (error) {
        console.error('Fehler beim Laden der Produktdetails:', error);
        alert(`Fehler beim Laden des Produkts: ${error.message}`);
        return null;
    }
}

// Funktion zum Aktualisieren des Warenkorb-Zählers
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById("cart-count").textContent = totalItems;
}

// Modifiziere die bestehende addToCartFromTest Funktion
async function addToCartFromTest(productUrl) {
    try {
        const produkt = await fetchProductDetails(productUrl);
        if (!produkt) {
            return;
        }

        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        
        const normalizedProductName = produkt.name.trim().toLowerCase();
        const existingProductIndex = cart.findIndex(item => item.name.trim().toLowerCase() === normalizedProductName);
        
        if (existingProductIndex !== -1) {
            cart[existingProductIndex].quantity = (cart[existingProductIndex].quantity || 1) + 1;
        } else {
            produkt.quantity = 1;
            cart.push(produkt);
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();

        const successMessage = document.getElementById("success-message");
        successMessage.style.display = "block";

        setTimeout(() => {
            successMessage.style.display = "none";
        }, 3000);
    } catch (error) {
        console.error('Fehler beim Hinzufügen zum Warenkorb:', error);
        alert(`Fehler beim Hinzufügen zum Warenkorb: ${error.message}`);
    }
}

// Füge Event-Listener zu allen "In den Warenkorb" Buttons hinzu
document.querySelectorAll(".produkt").forEach(produktDiv => {
    const button = produktDiv.querySelector(".add-to-cart");
    const img = produktDiv.querySelector(".produktbild");
    if (button && img) {
        button.addEventListener("click", () => {
            const productUrl = img.getAttribute("data-link");
            if (productUrl) {
                console.log("Versuche Produkt hinzuzufügen:", productUrl);
                addToCartFromTest(productUrl);
            } else {
                alert("Produkt-URL nicht gefunden!");
            }
        });
    }
});

// Initialisiere den Warenkorb-Zähler beim Laden der Seite
updateCartCount(); 