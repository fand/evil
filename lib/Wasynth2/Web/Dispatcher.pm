package Wasynth2::Web::Dispatcher;
use strict;
use warnings;
use utf8;
use Encode;
use Amon2::Web::Dispatcher::RouterBoom;

get '/' => sub {
    my ($c) = @_;
    my $ua = $c->req->headers->user_agent;
    if ( $ua =~ /msie/i ) {
        return $c->render( 'ie.tx' );
    }
    else  {
        return $c->render( 'index.tx' );
    }
};

post '/' => sub {
    my ($c) = @_;
    my $json = decode_utf8 $c->request->param('json');
    my $song = $c->db->insert( 'songs', +{ json => encode_utf8 $json } );

    return $c->create_response(
        200,
        [ 'Content-Type' => 'text/plain' ],
        [ encode_utf8 $song->get('id') ]
    );
};

get '/:id' => sub {
    my ( $c, $args ) = @_;

    my $song_id = $args->{id};
    my $song = $c->db->single( 'songs', +{ id => $song_id } );

    if ( !defined $song ) {
        return $c->redirect( '/', +{ error => 'invalid URL' } );
    }

    my $json = $song->get('json');
    $json =~ s/([<>\/\+])/sprintf("\\u%04x",ord($1))/eg;

    return $c->render( 'index.tx', +{ song => $json } );
};

1;
