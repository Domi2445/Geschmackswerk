// Warenkorb-Panel-Funktionen für Bestellen.html und Produkt-Unterseiten

$(document).ready(initialisierungWarenkorbPanel);

// Initialisierung: Setzt alle Event-Listener und Interaktionen für das Warenkorb-Panel
function initialisierungWarenkorbPanel() {
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
    warenkorbZaehlerAktualisieren();
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

// Aktualisiert den Warenkorb-Zähler im Symbol
function warenkorbZaehlerAktualisieren() {
    var warenkorb = JSON.parse(localStorage.getItem("cart")) || [];
    var gesamtAnzahl = warenkorb.reduce(function(summe, artikel) {
        return summe + (artikel.quantity || 0);
    }, 0);
    $("#cart-count").text(gesamtAnzahl);
}
window.warenkorbZaehlerAktualisieren = warenkorbZaehlerAktualisieren; 