'use strict';

var Scene = require('../models/Scene');

var data = {
  scenes: [],
  currentScene: 0
};

var SceneStore = {
  initScenes: function (scenes) {
    data.scenes = scenes.map(s => new Scene(s));
  },
  getCurrentScene: function () {
    return data.scenes[data.currentScene];
  },
  addScenes: function (scenes) {
    var newScenes = scenes.map(s => new Scene(s));
    data.scenes = data.scenes.concat(newScenes);
    return newScenes;
  }
};

module.exports = SceneStore;
