(function(core) {
    var capacidadeCarga = (function() {

        function execute() {
            console.log("Inicialized calcule of capacidadeCarga");
            _calculateLe();
            _calculateTensaoFundacao();
            _calculateE();
            _calculateB();
            _calculateRv();
            _calculateFqi();
            _calculateFyi();
            _calculateFci();
            _calculateQlim();
            _calculateFS();
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
            calculatedValue = calculatedValue / (1 - (core.resultData.ka / 3) * Math.pow(calculateSqrt, 2));
            core.resultData.capacidadeCarga = calculatedValue * fs;
        }

        function _calculateE() {
            var calculatedValue = core.resultData.ka * Math.pow(core.resultData.h, 2);
            calculatedValue = calculatedValue / (6 * core.resultData.le);
            core.resultData.e = calculatedValue;
        }

        function _calculateB() {
            var calculatedValue = core.resultData.le - (core.resultData.e * 2);
            core.resultData.b = calculatedValue;
        }

        function _calculateRv() {
            var pesoEspecifico = core.getValue("soloFundacao.pesoEspecifico");
            var calculatedValue = pesoEspecifico * core.resultData.h * core.resultData.le;
            core.resultData.rv = calculatedValue;
        }

        function _calculateFqi() {
            var coesao = core.getValue("soloFundacao.coesao");
            var anguloAtrito = core.getValue("soloFundacao.anguloAtrito");
            var divisor = core.resultData.rv + (core.resultData.b * coesao * Math.cot(core.convertAngleToRadian(anguloAtrito)))
            var calculatedValue = 1 - (core.resultData.empuxo / divisor);
            core.resultData.fqi = Math.pow(calculatedValue, 2);
        }

        function _calculateFyi() {
            var calculatedValue = Math.pow(core.resultData.fqi, (3 / 2));
            core.resultData.fyi = calculatedValue;
        }

        function _calculateFci() {
            var anguloAtrito = core.getValue("soloFundacao.anguloAtrito");
            var divisor = _getNc() * Math.tan(core.convertAngleToRadian(anguloAtrito));
            var calculatedValue = core.resultData.fqi - ((1 - core.resultData.fqi) / divisor);
            core.resultData.fci = calculatedValue;
        }

        function _calculateQlim() {
            var y = core.getValue("soloFundacao.pesoEspecifico");
            var d = core.getValue("geometriaMuro.embutimento");
            var c = core.getValue("soloFundacao.coesao");
            var calculatedValue = y * d + (c * _getNc() * core.resultData.fci);
            calculatedValue = calculatedValue + (y * d * (_getNq() - 1) * core.resultData.fqi);
            calculatedValue = calculatedValue + (0.5 * y * core.resultData.b * _getNy() * core.resultData.fyi);
            core.resultData.qlim = calculatedValue;
        }

        function _calculateFS() {
            core.resultData.fs = core.resultData.qlim / core.resultData.capacidadeCarga;
        }

        function _getNc() {
            var anguloAtrito = core.getValue("soloFundacao.anguloAtrito");
            if (anguloAtrito == 30) {
                return 30.14;
            }
            return 46.12;
        }

        function _getNq() {
            var anguloAtrito = core.getValue("soloFundacao.anguloAtrito");
            if (anguloAtrito == 30) {
                return 18.4;
            }
            return 33.30;
        }

        function _getNy() {
            var anguloAtrito = core.getValue("soloFundacao.anguloAtrito");
            if (anguloAtrito == 30) {
                return 22.4;
            }
            return 48.03;
        }

        return {
            execute
        }
    })();

    core.capacidadeCarga = capacidadeCarga;
})(core);