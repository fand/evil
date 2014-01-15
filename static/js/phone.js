$(function(){
    var pos = 0;
    var h = window.innerHeight ? window.innerHeight : $(window).height();
    var last_scroll = 0;

    $(window).on('scroll', function(){
        var scroll = $(this).scrollTop();
        if (last_scroll < scroll) {
            // Down
            if (20 < scroll % h) {
                $('body').animate({scrollTop: (Math.floor(scroll/h)+1)*h}, 300);
            }
        }
        else {
            // Up

        }

        last_scroll = scroll;
    });

});
