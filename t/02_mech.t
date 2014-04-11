use strict;
use warnings;
use utf8;
use t::Util;
use Plack::Test;
use Plack::Util;
use Test::More;
use Test::Requires 'Test::WWW::Mechanize::PSGI';

my $app = Plack::Util::load_psgi 'script/wasynth2-server';

my $mech = Test::WWW::Mechanize::PSGI->new(app => $app);
$mech->get_ok('/');
$mech->get_ok('/test');

done_testing;
