// script.js

document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Verhindert das Standard-Verhalten des Formulars

    // Die Werte der Felder holen
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var subject = document.getElementById('subject').value;
    var message = document.getElementById('message').value;

    var hasError = false;

    // Überprüfung der Eingabefelder
    if (name === "") 
        {
        showError('name', 'Bitte geben Sie Ihren Namen ein.');
        hasError = true;
        }
    if (email === "") 
        {
        showError('email', 'Bitte geben Sie Ihre E-Mail-Adresse ein.');
        hasError = true;
        } 
        else if (!validateEmail(email)) {
        showError('email', 'Bitte geben Sie eine gültige E-Mail-Adresse ein (mit @).');
        hasError = true;
    }
    if (subject === "") {
        showError('subject', 'Bitte geben Sie einen Betreff ein.');
        hasError = true;
    }
    if (message === "") {
        showError('message', 'Bitte geben Sie eine Nachricht ein.');
        hasError = true;
    }

    // Wenn ein Fehler vorliegt, brechen wir den Absendevorgang ab
    if (hasError) {
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
    document.getElementById('contactForm').reset();
});

// Funktion zur Anzeige einer Fehlernachricht mit SweetAlert2
function showError(fieldId, message) {
    Swal.fire({
        icon: 'error',
        title: 'Fehler',
        text: message,
        confirmButtonText: 'Schließen'
    }).then(function() {
        document.getElementById(fieldId).focus(); // Setzt den Fokus auf das fehlerhafte Feld
    });
}

// Funktion zur Überprüfung der E-Mail-Adresse (ob sie ein "@" enthält)
function validateEmail(email) {
    return email.includes('@');
}
