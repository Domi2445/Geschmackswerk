$(document).ready(function() {
    // Laden des Warenkorbs beim Start
    warenkorbLaden();

    // Event Listener für den "Bestellung bestätigen"-Button
    $("#confirm-order").on('click', function() {
        if (validiereBestellung()) {
            alert("Ihre Bestellung wurde erfolgreich abgeschlossen!");
            localStorage.removeItem('cart');  // Warenkorb leeren
            window.location.reload();  // Seite neu laden
        }
    });

    // Validierung der Bestellung (Zahlungs- und Liefermethode prüfen)
    function validiereBestellung() {
        let zahlungsMethode = $("input[name='payment-method']:checked").val();
        let lieferMethode = $("input[name='delivery-method']:checked").val();

        if (!zahlungsMethode) {
            alert("Bitte wählen Sie eine Zahlungsmethode.");
            return false;
        }
        if (!lieferMethode) {
            alert("Bitte wählen Sie eine Lieferoption.");
            return false;
        }
        if (zahlungsMethode === 'card') {
            if (!$("#card-number").val() || !$("#expiry-date").val() || !$("#cvv").val()) {
                alert("Bitte füllen Sie alle Felder für die Kartenzahlung aus.");
                return false;
            }
        }
        return true;
    }

    // Warenkorb laden und anzeigen
    function warenkorbLaden() {
        const warenkorb = JSON.parse(localStorage.getItem('cart')) || [];
        const warenkorbContainer = $('#cart-items');
        let gesamtpreis = 0;
        warenkorbContainer.empty();

        // Wenn der Warenkorb leer ist
        if (warenkorb.length === 0) {
            warenkorbContainer.html('<p>Dein Warenkorb ist leer.</p>');
            $("#total-amount").text('0,00 €');
            return;
        }

        // Für jeden Artikel im Warenkorb ein Element erzeugen
        $.each(warenkorb, function(i, artikel) {
            let artikelDiv = $('<div>').addClass('product-item');
            let artikelName = $('<h4>').text(artikel.name);
            let artikelMenge = $('<span>').text('Menge: ' + artikel.quantity)
                .css({ 'margin-left': '15px', 'font-weight': 'bold', 'color': '#b12704' });
            artikelName.append(artikelMenge);
            artikelDiv.append(artikelName);

            let artikelPreis = $('<p>');
            let preisNummer = artikel.preis;
            if (typeof preisNummer !== 'number') {
                if (typeof preisNummer === 'string') {
                    preisNummer = parseFloat(preisNummer.replace('€', '').replace(',', '.').trim());
                } else {
                    preisNummer = NaN;
                }
            }
            if (!isNaN(preisNummer)) {
                artikelPreis.text('€' + preisNummer.toFixed(2));
                gesamtpreis += preisNummer * artikel.quantity;
            } else {
                artikelPreis.text('Preis nicht verfügbar');
            }
            artikelDiv.append(artikelPreis);
            warenkorbContainer.append(artikelDiv);
        });

        // Gesamtpreis anzeigen
        $("#total-amount").text('€' + gesamtpreis.toFixed(2));
    }

    // Zahlung per Karte: Zeigt die Kartendetails an, wenn ausgewählt
    $("#card-payment").on('change', function() {
        if ($(this).is(':checked')) {
            $("#card-details").show();
        }
    });

    // Barzahlung: Versteckt die Kartendetails, wenn Barzahlung ausgewählt
    $("#cash-payment").on('change', function() {
        if ($(this).is(':checked')) {
            $("#card-details").hide();
        }
    });
});
