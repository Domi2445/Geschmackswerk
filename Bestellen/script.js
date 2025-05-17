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


function navigateToProduct() {
    var link = $(this).data("link"); // Link aus dem "data-link"-Attribut abrufen
    if (link) {
        window.location.href = link; // Weiterleitung zur Produktseite
    }
}

// Warenkorb-Sidepanel öffnen/schließen
$(document).ready(function() {
    $('#cart-button').on('click', function() {
        $('#cart-panel').addClass('open');
    });
    $('#close-cart').on('click', function() {
        $('#cart-panel').removeClass('open');
    });
    // Optional: Panel schließen, wenn man außerhalb klickt
    $(document).on('mousedown', function(e) {
        var panel = $('#cart-panel');
        if (panel.hasClass('open') && !panel.is(e.target) && panel.has(e.target).length === 0 && !$('#cart-button').is(e.target)) {
            panel.removeClass('open');
        }
    });
});