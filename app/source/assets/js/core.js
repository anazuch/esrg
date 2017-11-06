const _ = _require('lodash');
const fs = _require('fs');
const jsonfile = _require('jsonfile');
const ipc = _require('electron').ipcRenderer;
const remote = _require('electron').remote;
const appPath = remote.app.getAppPath();

(function() {
    var core = (function() {

        let _pathMap = {
            'dataDefinition': 'source/assets/data/dataDefinition.json',
            'abacos': 'source/assets/data/abacos.json',
            'fatoresCapacidadeCarga': 'source/assets/data/fatoresCapacidadeCarga.json',
            'tiposCompactadores': 'source/assets/data/tiposCompactadores.json',
            'tiposReforcos': 'source/assets/data/tiposReforcos.json',
        }

        function getPath(key) {
            var path = appPath + '/' + _pathMap[key];
            return path;
        }

        function cloneValues(obj1, obj2, property) {
            _.forEach(obj1, function(data, key) {
                if (obj2[key]) {
                    obj2[key][property] = data[property];
                }
            });
        }

        return {
            cloneValues,
            getPath
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