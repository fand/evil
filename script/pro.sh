#!/usr/bin/sh

export PLACK_ENV=production
carton exec perl -Ilib script/wasynth2-server --host=0.0.0.0 -p 9000
