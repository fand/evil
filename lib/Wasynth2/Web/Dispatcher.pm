package Wasynth2::Web::Dispatcher;
use strict;
use warnings;
use utf8;
use Encode;
use Amon2::Web::Dispatcher::RouterBoom;

# Show tests in console.
get '/test' => sub {
    my ($c) = @_;
    return $c->render( 'index.tx', +{ debug => 1, test => 1 } );
};

# Show smartphone page explicitly.
get '/mobile' => sub {
    my ($c) = @_;
    return $c->render('smartphone.tx');
};

# Route URI.
get '/' => sub {
    my ($c) = @_;

    # Render pages for IE or smartphones.
    my $ua = $c->req->headers->user_agent;
    if ( $ua =~ /msie/i ) {
        return $c->render('ie.tx');
    }
    elsif ( $ua =~ /iPhone|iPod|Android/i ) {
        return $c->render('smartphone.tx');
    }
    else {
        # Render route.
        if ( $ENV{PLACK_ENV} =~ /pro/ ) {
            return $c->render('index.tx');
        }
        else {
            return $c->render( 'index.tx', +{ debug => 1 } );
        }
    }
};

# URI to Save a song.
post '/' => sub {
    my ($c) = @_;
    my $json = decode_utf8 $c->request->param('json');
    if ( !defined $json ) { return; }

    my $song = $c->db->insert( 'songs', +{ json => encode_utf8 $json } );

    # return song as json
    return $c->create_response(
        200,
        [ 'Content-Type' => 'text/plain' ],
        [ encode_utf8 $song->get('id') ]
    );
};

# URI to play a song.
get '/:id' => sub {
    my ( $c, $args ) = @_;

    my $ua = $c->req->headers->user_agent;
    if ( $ua =~ /msie/i ) {
        return $c->render('ie.tx');
    }
    elsif ( $ua =~ /iPhone|iPod|Android/i ) {
        return $c->render('smartphone.tx');
    }

    my $song_id = $args->{id};
    my $song = $c->db->single( 'songs', +{ id => $song_id } );

    if ( !defined $song ) {
        return $c->redirect( '/', +{ error => 'invalid URL' } );
    }

    my $json = $song->get('json');
    $json =~ s/([<>\/\+])/sprintf("\\u%04x",ord($1))/eg;

    if ( $ENV{PLACK_ENV} =~ /pro/ ) {
        return $c->render( 'index.tx', +{ song => $json } );
    }
    else {
        return $c->render( 'index.tx', +{ song => $json, debug => 1 } );
    }

};

1;
