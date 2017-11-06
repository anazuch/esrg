const _ = _require('lodash');
const fs = _require('fs');
const jsonfile = _require('jsonfile');
const ipc = _require('electron').ipcRenderer;

(function() {
    var core = (function() {
        function cloneValues(obj1, obj2, property) {
            _.forEach(obj1, function(data, key) {
                if (obj2[key]) {
                    obj2[key][property] = data[property];
                }
            });
        }

        return {
            cloneValues
        }
    })();

    window.core = core;
})();

Object.defineProperty(window, 'CONSTANTS', {
    value: (function() {
        var config = {};
        Object.defineProperty(config, 'APP_NAME', { value: 'ESRG - Estabilidade de Solo Reforçado com Geossintéticos', writable: false })
        Object.defineProperty(config, 'COPYRIGHT', { value: '©2017 ESRG - Estabilidade de Solo Reforçado com Geossintéticos - Created by Ana Carolina Zuchetto', writable: false })
        return config;
    })(),
    writable: false
});