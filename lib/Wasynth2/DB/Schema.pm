package Wasynth2::DB::Schema;
use strict;
use warnings;
use utf8;

use Teng::Schema::Declare;

base_row_class 'Wasynth2::DB::Row';

table {
    name 'songs';
    pk 'id';
    columns qw(id json);
};

1;
