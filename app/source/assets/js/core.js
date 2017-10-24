const _ = _require('lodash');
const fs = _require('fs');
const jsonfile = _require('jsonfile');
const ipc = _require('electron').ipcRenderer;

(function() {
    var core = (function() {
        const _isProduction = false;
        const _buildProductionPath = 'resources/app/';

        let _pathMap = {
            'dataDefinition': 'source/assets/data/dataDefinition.json'
        }

        function getPath(key) {
            var path = _pathMap[key];
            if (_isProduction) {
                path = _buildProductionPath + path;
            }
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
            getPath: getPath,
            cloneValues: cloneValues
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