import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import $ from 'jquery';

console.log('Welcome to evil! (React migration in progress...)');

// Check browser compatibility
const ua = window.navigator.userAgent.toLowerCase();
if (!ua.match(/chrome/g)) {
  // Show sorry message for non-Chrome browsers
  $('#top-sorry').show();
  $('#top-logo-wrapper').addClass('logo-sorry');
} else {
  // Hide loading screen
  setTimeout(() => {
    $('#top')
      .css({ opacity: '0' })
      .delay(500)
      .css('z-index', '-1');
    $('#top-logo').css({
      '-webkit-transform': 'translate3d(0px, -100px, 0px)',
      opacity: '0',
    });
  }, 1500);

  // Set footer height
  const footer_size = $(window).height() / 2 - 300;
  $('footer').css('height', footer_size + 'px');

  // Mount React app to the footer element
  const footerElement = document.querySelector('footer');
  if (footerElement) {
    const root = ReactDOM.createRoot(footerElement);
    root.render(<App />);
  }
}
