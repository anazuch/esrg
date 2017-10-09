const _ = _require('lodash');
const fs = _require('fs');
const jsonfile = _require('jsonfile');
const ipc = _require('electron').ipcRenderer;

(function() {
    var core = (function() {
        const _isProduction = false;

        let _pathMap = {
            'dataDefinition': 'source/assets/data/dataDefinition.json'
        }

        let getPath = function(key) {
            var path = _pathMap[key];
            if (_isProduction) {
                path = _buildProductionPath + path;
            }
            return path;
        }

        return {
            getPath: getPath
        }
    })();

    window.core = core;
})();