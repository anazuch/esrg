(function(core) {
    var estabilidadeInterna = (function() {

        function execute() {
            console.log("Inicialized calcule of estabilidadeInterna");
            _calculateKo();
            _calculateV();
            _calculateNy();
            _executeFirstInteration();
        }

        function _calculateKo() {
            var apoiadoRocha = core.getValue("soloEnchimento.anguloAtrito");
            var calculatedValue = 1 - Math.sin(core.convertAngleToRadian(apoiadoRocha));
            core.resultData.ko = calculatedValue;
        }

        function _calculateV() {
            var calculatedValue = core.resultData.ko / (core.resultData.ko + 1);
            core.resultData.v = calculatedValue;
        }

        function _calculateNy() {
            var anguloAtrito = core.getValue("soloEnchimento.anguloAtrito");
            var angle = 45 + (anguloAtrito / 2);
            var tangent = Math.tan(core.convertAngleToRadian(angle));
            var elevated = Math.pow(tangent, 4) - 1
            core.resultData.ny = tangent * elevated;
        }

        function _executeFirstInteration() {
            var alturaMuro = core.getValue("geometriaMuro.alturaMuro");
            var embutimento = core.getValue("geometriaMuro.embutimento");
            var espacamentoVertical = core.getValue("geometriaMuro.espacamentoVertical");
            var interations = Math.round((alturaMuro + embutimento) / espacamentoVertical);
            var resultData = [];
            for (i = 0; i < interations; i++) {
                var interationResult = _callFunctionsFirstInteration(i);
                resultData.push(interationResult);
            }
            core.resultData.primeiraInteracao = resultData;
        }

        function _callFunctionsFirstInteration(i) {
            var returnData = {};
            returnData.z = _calculateTensaoZ(returnData, i);
            returnData.lr = _.max([core.resultData.deslizamento, core.resultData.tombamento, core.resultData.tensoesBase, core.resultData.le]);
            returnData.si = core.getValue("reforcos.si");
            returnData.tensaoVertical = _calculateTensaoVertical(returnData, i);
            returnData.compactacao = _calculateCompactacao(returnData, i);
            return returnData;
        }

        function _calculateTensaoZ(returnData, i) {
            var espacamentoVertical = core.getValue("geometriaMuro.espacamentoVertical");
            return Math.round10(espacamentoVertical * (i + 1), -1);
        }

        function _calculateTensaoVertical(returnData, i) {
            var z = returnData.z;
            var pesoEspecifico = core.getValue("soloEnchimento.pesoEspecifico");
            var calculatedValue = pesoEspecifico * returnData.z;
            var calculatedValue = calculatedValue / (1 - (core.resultData.ka / 3) * Math.pow(returnData.z / returnData.lr, 2))
            return calculatedValue + core.resultData.zeq;
        }

        function _calculateCompactacao(returnData, i) {
            var tipoCompactacao = core.getValue("compactacao.tipo")
            if (_.isEqual(tipoCompactacao, "placa")) {
                var data = core.compactorData["placa"];
                return _calculatePlaca(returnData, i, data)
            }
            var data = core.compactorData["rolo"];
            return _calculateRolo(returnData, i, data)
        }

        function _calculatePlaca(returnData, i, data) {
            var model = _.find(data, { "model": core.getValue("compactacao.modelos") });
            return model.tension;
        }

        function _calculateRolo(returnData, i, data) {
            var model = _.find(data, { "model": core.getValue("compactacao.modelos") });
            var pesoEspecifico = core.getValue("soloEnchimento.pesoEspecifico");
            var calculatedData = (1 - core.resultData.v) * (1 + core.resultData.ka);
            calculatedData = calculatedData * (Math.sqrt((0.5 * pesoEspecifico) * ((model.charge * core.resultData.ny) / model.width)));
            return calculatedData;
        }

        return {
            execute
        }
    })();

    core.estabilidadeInterna = estabilidadeInterna;
})(core);