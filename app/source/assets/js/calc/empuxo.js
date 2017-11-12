(function(core) {
    var empuxo = (function() {

        function execute() {
            console.log("Inicialized calcule of empuxo");
            _calculateZeq();
            _calculateKa();
            _calculateH();
            _calculateEmpuxo();
        }

        function _calculateZeq() {
            var pesoEspecifico = core.getValue("soloEnchimento.pesoEspecifico");
            var sobrecarga = core.getValue("geometriaMuro.sobrecarga");
            var calculatedValue = sobrecarga / pesoEspecifico;
            core.resultData.zeq = calculatedValue;
        }

        function _calculateKa() {
            var anguloAtrito = core.getValue("soloEnchimento.anguloAtrito");
            var angle = 45 - (anguloAtrito / 2);
            var tangent = Math.tan(core.convertAngleToRadian(angle));
            core.resultData.ka = tangent * tangent;
        }

        function _calculateH() {
            var alturaMuro = core.getValue("geometriaMuro.alturaMuro");
            var embutimento = core.getValue("geometriaMuro.embutimento");
            var calculatedValue = alturaMuro + core.resultData.zeq + embutimento;
            core.resultData.h = calculatedValue;
        }

        function _calculateEmpuxo() {
            var pesoEspecifico = core.getValue("soloEnchimento.pesoEspecifico");
            var calculatedValue = pesoEspecifico * (core.resultData.h * core.resultData.h) * core.resultData.ka * 0.5;
            core.resultData.empuxo = calculatedValue;
        }

        return {
            execute
        }
    })();

    core.empuxo = empuxo;
})(core);