$(function(){

    var h = (window.innerHeight ? window.innerHeight : $(window).height()) + 100;

    var debug = $('#debug');
    
    var body = $('body');
    var logo = $('#logo');
    var copy = $('#copy');
    var vertigo = $('#vertigo');
    var offset = h / 2 - 30;

    logo.css('top', offset + 'px');
    vertigo.css('top', offset + 'px');
    $('body > div').css('height', h + 'px');
    $('footer').css('height', h + 'px');

 });
