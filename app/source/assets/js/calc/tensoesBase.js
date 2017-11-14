(function(core) {
    var tensoesBase = (function() {

        function execute() {
            _calculateTensoesBase();
        }

        function _calculateTensoesBase() {
            var fs = getFs();
            var calculatedValue = (Math.pow(core.resultData.h, 2) * core.resultData.ka) / (6 * fs);
            core.resultData.tensoesBase = Math.sqrt(calculatedValue);
        }

        function getFs() {
            var apoiadoRocha = core.getValue("soloFundacao.apoiadoRocha");
            if (apoiadoRocha) {
                return 1 / 4;
            }
            return 1 / 6;
        }

        return {
            execute,
            getFs
        }
    })();

    core.tensoesBase = tensoesBase;
})(core);