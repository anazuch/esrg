(function(core) {
    var tombamento = (function() {

        function execute() {
            console.log("Inicialized calcule of tombamento");
            _calculateTombamento();
        }

        function _calculateTombamento() {
            var fs = 2;
            var calculatedValue = (fs * Math.pow(core.resultData.h, 2) * core.resultData.ka) / 3;
            core.resultData.tombamento = Math.sqrt(calculatedValue);
        }

        return {
            execute
        }
    })();

    core.tombamento = tombamento;
})(core);