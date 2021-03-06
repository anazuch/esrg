const _ = _require('lodash');
const fs = _require('fs');
const jsonfile = _require('jsonfile');
const ipc = _require('electron').ipcRenderer;
const remote = _require('electron').remote;
const appPath = remote.app.getAppPath();

(function() {
    var core = (function() {
        let resultData = {};
        let _objData = {};
        let data = {};

        let _pathMap = {
            'dataDefinition': 'source/assets/data/dataDefinition.json',
            'abacos': 'source/assets/data/abacos.json',
            'tiposCompactadores': 'source/assets/data/tiposCompactadores.json',
            'tiposReforcos': 'source/assets/data/tiposReforcos.json'
        }

        function getPath(key) {
            var path = appPath + '/' + _pathMap[key];
            return path;
        }

        function setObjectValues(obj) {
            _objData = obj;
        }

        function convertAngleToRadian(value) {
            return (value * Math.PI) / 180;
        }

        function getValue(key) {
            var splittedKey = key.split('.');
            if (splittedKey.length == 2) {
                var container = _objData[splittedKey[0]];
                if (container) {
                    var obj = container.inputs[splittedKey[1]];
                    if (/^[\d\.]+$/.test(obj.value)) {
                        return Number(obj.value)
                    }
                    return obj.value;
                }
            }
        }

        function round(value) {
            return Math.round10(value, -2);
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
            getPath,
            setObjectValues,
            getValue,
            resultData,
            convertAngleToRadian,
            data,
            round
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


(function() {

    function decimalAdjust(type, value, exp) {
        if (typeof exp === 'undefined' || +exp === 0) {
            return Math[type](value);
        }
        value = +value;
        exp = +exp;
        if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
            return NaN;
        }
        value = value.toString().split('e');
        value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
        value = value.toString().split('e');
        return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
    }

    if (!Math.round10) {
        Math.round10 = function(value, exp) {
            return decimalAdjust('round', value, exp);
        };
    }

    if (!Math.floor10) {
        Math.floor10 = function(value, exp) {
            return decimalAdjust('floor', value, exp);
        };
    }

    if (!Math.ceil10) {
        Math.ceil10 = function(value, exp) {
            return decimalAdjust('ceil', value, exp);
        };
    }

    Math.cot = function(value) {
        return 1 / Math.tan(value);
    };

})();