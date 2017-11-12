(function(core) {
    var capacidadeCarga = (function() {

        function execute() {
            console.log("Inicialized calcule of capacidadeCarga");
            _calculateLe();
            _calculateTensaoFundacao();
        }

        function _calculateLe() {
            var calculatedValue = core.resultData.h * 0.8;
            core.resultData.le = calculatedValue;
        }

        function _calculateTensaoFundacao() {
            var pesoEspecifico = core.getValue("soloFundacao.pesoEspecifico");
            var fs = 2.5;
            var calculatedValue = (pesoEspecifico * core.resultData.h)
            var calculateSqrt = core.resultData.h / core.resultData.le;
            calculatedValue = calculatedValue / (1 - (core.resultData.ka / 3) * (calculateSqrt * calculateSqrt));
            core.resultData.capacidadeCarga = calculatedValue * fs;
        }

        return {
            execute
        }
    })();

    core.capacidadeCarga = capacidadeCarga;
})(core);