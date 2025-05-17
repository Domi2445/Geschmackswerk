$(document).ready(function() {
    // Produkt-Interaktionen
    $(".produkt").hover(bildVergroessern, bildZuruecksetzen);
    toggleBurgerMenu();
    burgerMenuClickHandler();
    $(window).resize(function () {
        toggleBurgerMenu();
    });
    $(".produktbild").click(navigateToProduct);

    // Warenkorb-Sidepanel öffnen/schließen
    $('#cart-button').on('click', function() {
        renderCartPanelList();
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

function renderCartPanelList() {
    var cart = JSON.parse(localStorage.getItem("cart")) || [];
    var listDiv = $("#cart-panel-list");
    listDiv.empty();
    if (cart.length === 0) {
        listDiv.append('<div style="color: #888;">Ihr Warenkorb ist leer.</div>');
        return;
    }
    var total = 0;
    cart.forEach(function(item) {
        var itemTotal = (item.preis * item.quantity);
        total += itemTotal;
        listDiv.append(
            '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">'
            + '<div>' + item.name + '<br><span style="font-size: 0.9em; color: #888;">Menge: ' + item.quantity + '</span></div>'
            + '<div>' + itemTotal.toFixed(2) + ' €</div>'
            + '</div>'
        );
    });
    listDiv.append('<div style="border-top: 1px solid #eee; margin-top: 10px; padding-top: 10px; text-align: right; font-weight: bold;">Gesamt: ' + total.toFixed(2) + ' €</div>');
}