import Device from '../models/Device';

const data = {
  devices: [],
  currentDevice: 0
};

const DeviceStore = {
  getDevices: function () {
    return data.devices;
  },
  getCurrentDevice: function () {
    return data.devices[data.currentDevice];
  },
  addDevice: function (attr) {
    const newDevice = new Device(attr);
    data.devices.push(newDevice);
    return newDevice;
  }
};

export default DeviceStore;
