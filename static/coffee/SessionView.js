(function() {
  this.SessionView = (function() {
    function SessionView(model) {
      this.model = model;
      this.canvas_tracks_dom = $('#session-tracks');
      this.canvas_master_dom = $('#session-master');
      this.canvas_tracks = this.canvas_tracks_dom[0];
      this.canvas_master = this.canvas_master_dom[0];
      this.ctx_tracks = this.canvas_tracks.getContext('2d');
      this.ctx_master = this.canvas_master.getContext('2d');
      this.initCanvas();
    }

    SessionView.prototype.initCanvas = function() {
      this.canvas_tracks.width = 700;
      this.canvas_master.width = 100;
      this.canvas_tracks.height = this.canvas_master.height = 300;
      this.rect = this.canvas_tracks.getBoundingClientRect();
      return this.offset = {
        x: this.rect.left,
        y: this.rect.top
      };
    };

    SessionView.prototype.addSynth = function(s) {};

    return SessionView;

  })();

}).call(this);
