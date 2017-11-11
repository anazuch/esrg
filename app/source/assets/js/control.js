(function(core) {
    var control = (function() {

        function _execute() {
            core.empuxo.init();
        }

        function init(obj) {
            core.setObjectValues(obj);
            _execute();
        }

        return {
            init
        }
    })();

    core.control = control;
})(core);