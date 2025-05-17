$(document).ready(function() {
    $("#back-button").click(function() {
        handleBackNavigation();
    });
});

function handleBackNavigation() {
    if (document.referrer && !document.referrer.includes("Produkt-Unterseite")) {
        // Wenn ein Referrer vorhanden ist, aber nicht die Produkt-Unterseite
        window.history.back(); // Zurück zur letzten Seite
    } else {
        // Wenn kein Referrer vorhanden ist oder die Produkt-Unterseite der Referrer ist, zur Produktübersicht gehen
        window.location.href = "../Bestellen.html"; // Hier die URL der Produktübersicht einfügen
    }
}