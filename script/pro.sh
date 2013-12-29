#!/bin/sh

export PLACK_ENV=production
carton exec perl -Ilib script/wasynth2-server -c config/production.pl
