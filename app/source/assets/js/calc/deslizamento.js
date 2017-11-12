(function(core) {
    var deslizamento = (function() {

        function execute() {
            console.log("Inicialized calcule of deslizamento");
            _calculateDeslizamento();
        }

        function _calculateDeslizamento() {
            var anguloAtrito = core.getValue("soloEnchimento.anguloAtrito");
            var fs = _getFS();
            var calculatedValue = 0.5 * fs * core.resultData.h * core.resultData.ka;
            var calculatedValue = calculatedValue / Math.tan(core.convertAngleToRadian(anguloAtrito))
            core.resultData.deslizamento = calculatedValue;
        }

        function _getFS() {
            var inclinacaoFace = core.getValue("geometriaMuro.inclinacaoFace");
            if (inclinacaoFace >= 65) {
                return 1.5;
            } else {
                return 1.3;
            }
        }

        return {
            execute
        }
    })();

    core.deslizamento = deslizamento;
})(core);