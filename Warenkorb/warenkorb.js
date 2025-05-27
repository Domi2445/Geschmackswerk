$(document).ready(initialisierung);

// Initialisierung: Wird beim Laden des Dokuments ausgeführt
function initialisierung() {
    // Hover-Effekt für Produkte
    $(".produkt").hover(bildVergroessern, bildZuruecksetzen);
    // Burger-Menü anpassen je nach Fenstergröße
    burgerMenueUmschalten();
    burgerMenueClickHandler();
    $(window).resize(function () {
        burgerMenueUmschalten();
    });
    // Klick auf Produktbild führt zur Produktseite
    $(".produktbild").click(navigiereZuProdukt);

    // Event Listener für "Weiter einkaufen"-Button
    $(".weiter-btn").on('click', function() {
        window.location.href = '../Bestellen/Bestellen.html';
    });
    // Event Listener für "Warenkorb leeren"-Button
    $(".clear-cart-btn").on('click', function() {
        localStorage.removeItem('cart');
        window.location.reload();
        window.dispatchEvent(new Event('storage'));
    });
    // Event Listener für "Zur Kasse"-Button
    $(".kasse-btn").on('click', function() {
       window.location.href = '../kasse/Kasse.html';
    });
    // Beim Laden der Seite den Warenkorb laden
    warenkorbLaden();
    // Listener für Änderungen im LocalStorage (z.B. wenn Produkt in anderem Tab hinzugefügt wird)
    $(window).on('storage', function(event) {
        if (event.originalEvent.key === 'cart') {
            warenkorbLaden();
        }
    });
}

// Passt das Burger-Menü an die Fenstergröße an
function burgerMenueUmschalten() {
    if ($(window).width() < 700) {
        $("#burger-menu").show();
        $("#menue").removeClass("open").css("left", "-250px");
    } else {
        $("#burger-menu").hide();
        $("#menue").removeClass("open").css("left", "auto");
        $("#menue").show();
    }
}

// Öffnet/schließt das Burger-Menü bei Klick
function burgerMenueClickHandler() {
    $("#burger-menu").off("click").on("click", function () {
        if ($("#menue").hasClass("open")) {
            $("#menue").removeClass("open").css("left", "-250px");
        } else {
            $("#menue").addClass("open").css("left", "0");
        }
    });
}

// Leitet beim Klick auf ein Produktbild zur Produktseite weiter
function navigiereZuProdukt() {
    var link = $(this).data("link");
    if (link) {
        window.location.href = link;
    }
}

// Lädt den Warenkorb aus dem LocalStorage und zeigt ihn an
function warenkorbLaden() {
    const warenkorb = JSON.parse(localStorage.getItem('cart')) || [];
    console.log("Warenkorb geladen:", warenkorb);
    const warenkorbContainer = $('#warenkorb-container');
    warenkorbContainer.empty();
    let gesamtpreis = 0;
    // Wenn der Warenkorb leer ist
    if (warenkorb.length === 0) {
        warenkorbContainer.html('<p>Dein Warenkorb ist leer.</p>');
        $("#warenkorb-summary h3").text('Gesamtpreis: €0.00');
        return;
    }
    // Für jeden Artikel im Warenkorb ein Element erzeugen
    $.each(warenkorb, function(i, artikel) {
        console.log("Verarbeite Artikel:", artikel);
        var artikelDiv = $('<div>').addClass('product-item');
        var artikelName = $('<h4>').text(artikel.name);
        var artikelMenge = $('<span>').text('Menge: ' + (artikel.quantity || 1))
            .css({ 'margin-left': '15px', 'font-weight': 'bold', 'color': '#b12704' });
        artikelName.append(artikelMenge);
        artikelDiv.append(artikelName);
        var artikelPreis = $('<p>');
        var preisNummer = artikel.preis;
        // Preis ggf. umwandeln
        if (typeof preisNummer !== 'number') {
            if (typeof preisNummer === 'string') {
                preisNummer = parseFloat(preisNummer.replace('€', '').replace(',', '.').trim());
            } else {
                preisNummer = NaN;
            }
        }
        if (!isNaN(preisNummer)) {
            artikelPreis.text('€' + preisNummer.toFixed(2));
            gesamtpreis += preisNummer * (artikel.quantity || 1);
        } else {
            artikelPreis.text('Preis nicht verfügbar');
            console.error("Preis ist keine Zahl:", artikel.preis);
        }
        artikelDiv.append(artikelPreis);
        warenkorbContainer.append(artikelDiv);
    });
    // Gesamtpreis anzeigen
    $("#warenkorb-summary h3").text('Gesamtpreis: €' + gesamtpreis.toFixed(2));
}
