// script.js

$(document).ready(initialisierung);

// Initialisierung: Setzt Event-Listener für das Kontaktformular
function initialisierung() {
    // Beim Absenden des Formulars eigene Logik ausführen
    $('#kontaktformular').on('submit', function(event) {
        event.preventDefault(); // Verhindert das Standard-Verhalten des Formulars

        // Werte der Felder holen
        var name = $('#name').val();
        var email = $('#email').val();
        var betreff = $('#betreff').val();
        var nachricht = $('#nachricht').val();

        var fehlerGefunden = false;

        // Überprüfung der Eingabefelder
        if (name === "") {
            zeigeFehler('name', 'Bitte geben Sie Ihren Namen ein.');
            fehlerGefunden = true;
        }
        if (email === "") {
            zeigeFehler('email', 'Bitte geben Sie Ihre E-Mail-Adresse ein.');
            fehlerGefunden = true;
        } else if (!emailGueltig(email)) {
            zeigeFehler('email', 'Bitte geben Sie eine gültige E-Mail-Adresse ein (mit @).');
            fehlerGefunden = true;
        }
        if (betreff === "") {
            zeigeFehler('betreff', 'Bitte geben Sie einen Betreff ein.');
            fehlerGefunden = true;
        }
        if (nachricht === "") {
            zeigeFehler('nachricht', 'Bitte geben Sie eine Nachricht ein.');
            fehlerGefunden = true;
        }

        // Wenn ein Fehler vorliegt, Formular nicht absenden
        if (fehlerGefunden) {
            return;
        }

        // Erfolgreiches Absenden der Nachricht
        Swal.fire({
            icon: 'success',
            title: 'Nachricht gesendet!',
            text: 'Vielen Dank für Ihre Nachricht. Wir werden uns bald bei Ihnen melden.',
            confirmButtonText: 'Okay'
        });

        // Formular zurücksetzen
        $('#kontaktformular')[0].reset();
    });
}

// Zeigt eine Fehlernachricht mit SweetAlert2 an und setzt den Fokus auf das fehlerhafte Feld
function zeigeFehler(feldId, nachricht) {
    Swal.fire({
        icon: 'error',
        title: 'Fehler',
        text: nachricht,
        confirmButtonText: 'Schließen'
    }).then(function() {
        $('#' + feldId).focus();
    });
}

// Überprüft, ob die E-Mail-Adresse ein "@" enthält
function emailGueltig(email) {
    return email.includes('@');
}
