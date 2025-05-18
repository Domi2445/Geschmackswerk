$(document).ready(function() {
    initialisierung();
    // Add-to-cart für alle Buttons auf der Bestellen-Seite
    $(".add-to-cart").on("click", function() {
        var produktDiv = $(this).closest(".produkt");
        var produktbild = produktDiv.find(".produktbild");
        var produktUrl = produktbild.data("link");
        if (!produktUrl) return;
        // Produkt-Unterseite per AJAX laden
        $.get(produktUrl, function(data) {
            // Name aus <h2> ("Produktname: ...")
            var nameMatch = data.match(/<h2[^>]*>\s*Produktname:\s*([^<]+)<\/h2>/);
            var produktName = nameMatch ? nameMatch[1].trim() : "Produkt";
            // Preis aus <div id="preis">...
            var preisMatch = data.match(/<div[^>]*id=["']preis["'][^>]*>([^<]+)<\/div>/);
            var preisText = preisMatch ? preisMatch[1].replace('€','').replace(',','.').trim() : "0";
            var produktPreis = parseFloat(preisText);
            // Warenkorb aus localStorage holen
            var cart = JSON.parse(localStorage.getItem("cart")) || [];
            var normalizedName = produktName.toLowerCase();
            var existingIndex = cart.findIndex(function(item) { return (item.name||"").toLowerCase() === normalizedName; });
            if (existingIndex !== -1) {
                cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
            } else {
                cart.push({ name: produktName, preis: produktPreis, quantity: 1 });
            }
            localStorage.setItem("cart", JSON.stringify(cart));
            warenkorbZaehlerAktualisieren();
            // Erfolgsnachricht anzeigen
            $("#success-message").show();
            setTimeout(function() { $("#success-message").fadeOut(); }, 2000);
        });
    });
});

// Initialisierung: Setzt alle Event-Listener und Interaktionen
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

    // Warenkorb-Sidepanel öffnen/schließen
    $('#cart-button').on('click', function() {
        warenkorbPanelListeRendern();
        $('#cart-panel').addClass('open');
    });
    $('#close-cart').on('click', function() {
        $('#cart-panel').removeClass('open');
    });
    // Panel schließen, wenn man außerhalb klickt
    $(document).on('mousedown', function(e) {
        var panel = $('#cart-panel');
        if (panel.hasClass('open') && !panel.is(e.target) && panel.has(e.target).length === 0 && !$('#cart-button').is(e.target)) {
            panel.removeClass('open');
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

// Vergrößert das Produktbild beim Hover
function bildVergroessern() {
    $(this).find(".produktbild").stop().css({
        transform: 'scale(1.05)',
        transition: 'transform 0.4s ease'
    });
    $(this).stop().css({
        transform: 'scale(1.05)',
        transition: 'transform 0.4s ease'
    });
}

// Setzt das Produktbild wieder auf Normalgröße
function bildZuruecksetzen() {
    $(this).find(".produktbild").stop().css({
        transform: 'scale(1)',
        transition: 'transform 0.4s ease'
    });
    $(this).stop().css({
        transform: 'scale(1)',
        transition: 'transform 0.4s ease'
    });
}

// Leitet beim Klick auf ein Produktbild zur Produktseite weiter
function navigiereZuProdukt() {
    var link = $(this).data("link");
    if (link) {
        window.location.href = link;
    }
}

// Rendert die Produktliste im Warenkorb-Sidepanel
function warenkorbPanelListeRendern() {
    var warenkorb = JSON.parse(localStorage.getItem("cart")) || [];
    var listenDiv = $("#cart-panel-list");
    listenDiv.empty();
    if (warenkorb.length === 0) {
        listenDiv.append('<div style="color: #888;">Ihr Warenkorb ist leer.</div>');
        return;
    }
    var gesamt = 0;
    warenkorb.forEach(function(artikel) {
        var artikelGesamt = (artikel.preis * artikel.quantity);
        gesamt += artikelGesamt;
        listenDiv.append(
            '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">'
            + '<div>' + artikel.name + '<br><span style="font-size: 0.9em; color: #888;">Menge: ' + artikel.quantity + '</span></div>'
            + '<div>' + artikelGesamt.toFixed(2) + ' €</div>'
            + '</div>'
        );
    });
    listenDiv.append('<div style="border-top: 1px solid #eee; margin-top: 10px; padding-top: 10px; text-align: right; font-weight: bold;">Gesamt: ' + gesamt.toFixed(2) + ' €</div>');
}