$(function(){
    var pos = 0;
    var h = window.innerHeight ? window.innerHeight : $(window).height();
    var last_scroll = 0;
    $('body > div').css('height', h + 'px');
    $('footer').css('height', h + 'px');

    var body = $('body');
    var logo = $('#logo');
    var copy = $('#copy');
    var vertigo = $('#vertigo');

    var is_auto = false;

    $(window).on('scroll', function(){
        var scroll = $(this).scrollTop();

        if (scroll < 100) {
            copy.css('opacity', (100 - scroll) / 100.0);
        }
        if (scroll < h) {
            logo.css('opacity', ((h - scroll) / h) * 0.1 + 0.1);
        }
        if (h * 4 < scroll && scroll < h * 5) {
            logo.css('opacity', (scroll % h) / h * 0.3 + 0.1);
        }

        if (is_auto) { return; }

        if (last_scroll < scroll) {
            // Down
            if (50 < scroll % h) {
                is_auto = true;
                logo.addClass('out');
                vertigo.addClass('in');
                body.animate({scrollTop: (Math.floor(scroll/h) + 1) * h}, 300);
                setTimeout(function(){
                    is_auto = false;
                    if (h * 4 < scroll) {
                        logo.css({
                            '-webkit-animation-play-state': 'running',
                            '-moz-animation-play-state': 'running',
                            '-ms-animation-play-state': 'running'
                        });
                        vertigo.css({
                            '-webkit-animation-play-state': 'running',
                            '-moz-animation-play-state': 'running',
                            '-ms-animation-play-state': 'running'
                        });
                    }
                }, 300);
            }
        }
        else {
            // Up

            if ((50 < h - scroll % h) && (scroll % h != 0)) {
                is_auto = true;
                $('body').animate({scrollTop: (Math.floor(scroll/h)) * h}, 300);
                setTimeout(function(){
                    is_auto = false;

                    if (Math.floor(scroll / h) == 4) {
                        logo.removeClass().css({
                            '-webkit-animation-play-state': 'paused',
                            '-moz-animation-play-state': 'paused',
                            '-ms-animation-play-state': 'paused',
                            'opacity': 0
                        }).animate({'opacity': '0.1'}, 300);
                        vertigo.removeClass().css({
                            '-webkit-animation-play-state': 'paused',
                            '-moz-animation-play-state': 'paused',
                            '-ms-animation-play-state': 'paused'
                        }).animate({'opacity': '0'}, 300);
                    }

                }, 300);
            }
        }

        last_scroll = scroll;
    });
});
