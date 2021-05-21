$(document).ready(function() {
    $('.counter').each(function() {
        if (isNaN($(this).text())) {
            return false;
        }

        $(this).prop('Counter', 0).animate({
            Counter: $(this).text()
        }, {
            duration: 3000,
            easing: 'swing',
            step: function(now) {
                $(this).text(Math.ceil(now));
            }
        });
    });
});
