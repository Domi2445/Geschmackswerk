$(document).ready(fertig);

function fertig() {
    $(".produkt").hover(bildVergroessern, bildZuruecksetzen);
    toggleBurgerMenu();
    burgerMenuClickHandler();
    $(window).resize(function () {
        toggleBurgerMenu();
    });
    $(".produktbild").click(navigateToProduct);
}

function toggleBurgerMenu() {
    if ($(window).width() < 700) {
        $("#burger-menu").show();
        $("#menue").removeClass("open").css("left", "-250px");
    } else {
        $("#burger-menu").hide();
        $("#menue").removeClass("open").css("left", "auto");
        $("#menue").show();
    }
}

function burgerMenuClickHandler() {
    $("#burger-menu").off("click").on("click", function () {
        if ($("#menue").hasClass("open")) {
            $("#menue").removeClass("open").css("left", "-250px");
        } else {
            $("#menue").addClass("open").css("left", "0");
        }
    });
}


// Funktion, um den Warenkorb aus dem LocalStorage zu laden und anzuzeigen
function loadCart() 
{
    // Warenkorb aus dem LocalStorage holen
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log("Cart loaded from localStorage:", cart);

    // Warenkorb-Container leeren
    const cartContainer = document.getElementById('warenkorb-container');
    cartContainer.innerHTML = '';

    // Gesamtpreis initialisieren
    let totalPrice = 0;

    // Wenn der Warenkorb leer ist
    if (cart.length === 0) 
    {
        cartContainer.innerHTML = '<p>Dein Warenkorb ist leer.</p>';
        return;
    }

    // Für jedes Produkt im Warenkorb ein HTML-Element erstellen
    cart.forEach(item => {
        console.log("Processing item:", item);
        const productDiv = document.createElement('div');
        productDiv.classList.add('product-item');
        
        const productName = document.createElement('h4');
        productName.innerText = item.name;
        productDiv.appendChild(productName);

        // Display quantity
        const productQuantity = document.createElement('span');
        productQuantity.innerText = `Menge: ${item.quantity || 1}`;
        productQuantity.style.marginLeft = '15px';
        productQuantity.style.fontWeight = 'bold';
        productQuantity.style.color = '#b12704';
        productName.appendChild(productQuantity);

        const productPrice = document.createElement('p');
        let priceNumber = item.preis;
        if (typeof priceNumber !== 'number') 
        {
            // Try to parse price string like "3,00€"
            if (typeof priceNumber === 'string') 
            {
                priceNumber = parseFloat(priceNumber.replace('€', '').replace(',', '.').trim());
            } 
            else
            {
                priceNumber = NaN;
            }
        }
        if (!isNaN(priceNumber))
        {
            productPrice.innerText = `€${priceNumber.toFixed(2)}`;
            totalPrice += priceNumber * (item.quantity || 1);
        } 
        else 
        {
            productPrice.innerText = `Preis nicht verfügbar`;
            console.error("Preis ist kein Zahl:", item.preis);
        }
        productDiv.appendChild(productPrice);

        cartContainer.appendChild(productDiv);
    });

    // Gesamtpreis anzeigen
    const totalPriceElement = document.querySelector('#warenkorb-summary h3');
    totalPriceElement.innerText = `Gesamtpreis: €${totalPrice.toFixed(2)}`;
}

// Funktion zum Entfernen eines Produkts aus dem Warenkorb
function removeFromCart(productIndex) 
{
    // Den Warenkorb aus dem LocalStorage holen
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Produkt aus dem Warenkorb entfernen
    cart.splice(productIndex, 1);

    // Den Warenkorb wieder im LocalStorage speichern
    localStorage.setItem('cart', JSON.stringify(cart));

    // Warenkorb neu laden
    loadCart();
}

// Event Listener für "Weiter einkaufen"-Button
document.querySelector('.weiter-btn').addEventListener('click', () => {
    window.location.href = '../index.html'; // Zurück zur Startseite oder Bestellseite
});

// Event Listener für "Warenkorb leeren"-Button
document.querySelector('.clear-cart-btn').addEventListener('click', () => {
    localStorage.removeItem('cart');
    // Seite neu laden, um den leeren Warenkorb anzuzeigen
    window.location.reload();
    // Manuell ein Storage-Event auslösen, damit andere Tabs reagieren können
    window.dispatchEvent(new Event('storage'));
});

// Event Listener für "Zur Kasse"-Button
document.querySelector('.kasse-btn').addEventListener('click', () => {
    // window.location.href = '../Bestellen/Kasse.html'; // Zur neuen Kassenseite
    localStorage.removeItem('cart');
    // Seite neu laden, um den leeren Warenkorb anzuzeigen
    window.location.reload();
    // Manuell ein Storage-Event auslösen, damit andere Tabs reagieren können
    window.dispatchEvent(new Event('storage'));

    alert("Sie haben erfolgreich Bezahlt \nDie Bestellung wurde erfolgreich abgeschlossen");

});

// Beim Laden der Seite den Warenkorb laden
window.onload = loadCart;

// Listener für Änderungen im LocalStorage (z.B. wenn Produkt in anderem Tab hinzugefügt wird)
window.addEventListener('storage', (event) => {
    if (event.key === 'cart') {
        loadCart();
    }
});
