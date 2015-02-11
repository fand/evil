'use strict';

var Device = require('../models/Device');

var data = {
  devices: [],
  currentDevice: 0
};

var DeviceStore = {
  getDevices: function () {
    return data.devices;
  },
  getCurrentDevice: function () {
    return data.devices[data.currentDevice];
  },
  addDevice: function (attr) {
    var newDevice = new Device(attr);
    data.devices.push(newDevice);
    return newDevice;
  }
};

module.exports = DeviceStore;
