#!/bin/sh

export PLACK_ENV=production
carton exec perl -Ilib script/wasynth2-server -p 9000 -c config/production.pl
