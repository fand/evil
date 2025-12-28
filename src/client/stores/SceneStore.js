import Scene from '../models/Scene';

const data = {
  scenes: [],
  currentScene: 0
};

const SceneStore = {
  initScenes: function (scenes) {
    data.scenes = scenes.map(s => new Scene(s));
  },
  getCurrentScene: function () {
    return data.scenes[data.currentScene];
  },
  addScenes: function (scenes) {
    const newScenes = scenes.map(s => new Scene(s));
    data.scenes = data.scenes.concat(newScenes);
    return newScenes;
  }
};

export default SceneStore;
