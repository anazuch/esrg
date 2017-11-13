(function(core) {
    var estabilidadeInterna = (function() {

        function execute() {
            console.log("Inicialized calcule of estabilidadeInterna");
            _calculateKo();
            _calculateV();
            _calculateNy();
            _calculateF();
            _executeInteration();
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

        function _calculateF() {
            var aderencia = core.getValue("arrancamento.aderencia");
            var anguloAtrito = core.getValue("soloEnchimento.anguloAtrito");
            var calculatedValue = aderencia * Math.tan(core.convertAngleToRadian(anguloAtrito));
            core.resultData.f = calculatedValue;
        }

        function _executeInteration() {
            var espacamentoVertical = core.getValue("geometriaMuro.espacamentoVertical");
            var interations = Math.round((core.resultData.h) / espacamentoVertical);
            var resultDataFirstInteration = [];
            for (i = 0; i < interations; i++) {
                var interationResult = _callFunctionsInteration("first", i);
                resultDataFirstInteration.push(interationResult);
            }
            core.resultData.primeiraInteracao = resultDataFirstInteration;

            var resultDataSecondInteration = [];
            for (i = 0; i < interations; i++) {
                var interationResult = _callFunctionsInteration("second", i);
                resultDataSecondInteration.push(interationResult);
            }
            core.resultData.segundaInteracao = resultDataSecondInteration;


            var resultDataFS = [];
            for (i = 0; i < interations; i++) {
                var interationResult = _callFunctionsFS(i);
                resultDataFS.push(interationResult);
            }
            core.resultData.fsArrancamento = resultDataFS;
        }


        /**
         * Init calc of interations 
         */
        function _callFunctionsInteration(interation, i) {
            var returnData = {};
            returnData.camada = i + 1;
            returnData.z = _calculateTensaoZ(returnData, i);
            returnData.lr = _.max([core.resultData.deslizamento, core.resultData.tombamento, core.resultData.tensoesBase, core.resultData.le]);
            if (_.isEqual(interation, "first")) {
                returnData.si = core.getValue("reforcos.si");
            } else {
                returnData.si = _calculateSi(returnData, i);
                returnData.jr = core.getValue("reforcos.modRigidezTracao");
            }
            returnData.tensaoVertical = _calculateTensaoVertical(returnData, i);
            returnData.compactacao = _calculateCompactacao(returnData, i);
            returnData.tensaoAtuante = _calculateTensaoAtuante(returnData, i);
            returnData.relacaoTensao = _calculateRelacaoTensao(returnData, i);
            returnData.relacaoTensaoAdotado = _calculateRelacaoTensaoAdotado(returnData, i);
            returnData.relacaoCoesao = _calculateRelacaoCoesao(returnData, i);
            returnData.relacaoCoesaoAdotada = _calculateRelacaoCoesaoAdotada(returnData, i);
            returnData.beta = _calculateBeta(returnData, i);
            returnData.betaAdotado = _calculateBetaAdotado(returnData, i);
            returnData.abaco = _calculateAbaco(returnData, i);
            returnData.tmax = _calculateTmax(returnData, i);
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

        function _calculateTensaoAtuante(returnData, i) {
            return _.max([returnData.compactacao, returnData.tensaoVertical]);
        }

        function _calculateRelacaoTensao(returnData, i) {
            return returnData.tensaoVertical / returnData.tensaoAtuante;
        }

        function _calculateRelacaoTensaoAdotado(returnData, i) {
            return Math.round10(returnData.relacaoTensao, -1);
        }

        function _calculateRelacaoCoesao(returnData, i) {
            var coesao = core.getValue("soloEnchimento.coesao");
            return coesao / returnData.tensaoAtuante;
        }

        function _calculateRelacaoCoesaoAdotada(returnData, i) {
            var relacaoCoesao = returnData.relacaoCoesao;
            if (_.inRange(relacaoCoesao, 0, 0.024)) {
                return 0.01;
            }
            if (_.inRange(relacaoCoesao, 0.024, 0.075)) {
                return 0.05;
            }
            if (_.inRange(relacaoCoesao, 0.075, 0.24)) {
                return 0.1;
            }
            if (_.inRange(relacaoCoesao, 0.24, 0.74)) {
                return 0.5;
            }
            if (_.inRange(relacaoCoesao, 0.74, 1)) {
                return 1;
            }
            return "-";
        }

        function _calculateBeta(returnData, i) {
            var moduloExpoente = core.getValue("soloEnchimento.moduloExpoente");
            var si = core.getValue("reforcos.si");
            var calculatedData = Math.pow((returnData.tensaoAtuante / 100), moduloExpoente);
            return calculatedData / si;
        }

        function _calculateBetaAdotado(returnData, i) {
            var beta = returnData.beta;
            if (_.inRange(beta, 0, 0.4)) {
                return 0;
            }
            if (_.inRange(beta, 0.4, 1.4)) {
                return 1;
            }
            if (_.inRange(beta, 1.4, 2.99)) {
                return 2;
            }
            if (_.inRange(beta, 2.99, 5.99)) {
                return 4;
            }
            if (_.inRange(beta, 5.99, 11.99)) {
                return 8;
            }
            if (_.inRange(beta, 11.99, 16)) {
                return 16;
            }
            return 17;
        }

        function _calculateAbaco(returnData, i) {
            var filterData = {
                anguloAtrito: core.getValue("soloEnchimento.anguloAtrito"),
                coesao: returnData.relacaoCoesaoAdotada,
                inclinacao: core.getValue("geometriaMuro.inclinacaoFace")
            }
            var currentAbaco = _.find(core.abacos, filterData);
            var filterValueData = {
                beta: returnData.betaAdotado,
                tensaoAbacus: returnData.relacaoTensaoAdotado
            }
            if (!currentAbaco.valores) {
                return 0;
            }

            var currentData = _.find(currentAbaco.valores, filterValueData);
            if (currentData) {
                return currentData.value;
            }
            return 0;
        }

        function _calculateTmax(returnData, i) {
            var eVertical = core.getValue("geometriaMuro.espacamentoVertical");
            var eHorizontal = core.getValue("geometriaMuro.espacamentoHorizontal");
            return returnData.tensaoAtuante * eVertical * eHorizontal * returnData.abaco;
        }

        function _calculateSi(returnData, i) {
            var jr = core.getValue("reforcos.modRigidezTracao");
            var k = core.getValue("soloEnchimento.moduloTangenteInicial");
            var sv = core.getValue("geometriaMuro.espacamentoVertical")
            return jr / (k * 100 * sv);
        }

        function _callFunctionsFS() {
            var returnData = {};
            returnData.camada = i + 1;
            returnData.z = _calculateTensaoZ(returnData, i);
            returnData.lr = lr = _.max([core.resultData.deslizamento, core.resultData.tombamento, core.resultData.tensoesBase, core.resultData.le]);
            returnData.le = _calculateLe(returnData, i);
            returnData.tensaoVertical = _calculateTensaoVertical(returnData, i);
            returnData.resistenciaArrancamento = _calculateResistenciaArrancamento(returnData, i);
            returnData.tmax = _cloneTmax(i);
            returnData.fs = _calculateFS(returnData, i);
            returnData.verificacao = _verify(returnData, i);
            return returnData;
        }

        function _calculateLe(returnData, i) {
            var anguloAtrito = core.getValue("soloEnchimento.anguloAtrito");
            var inclinacaoFace = core.getValue("geometriaMuro.inclinacaoFace");
            var angle = 45 - (anguloAtrito / 2);
            var tangent = Math.tan(core.convertAngleToRadian(angle));
            var calculatedData = (core.resultData.h - returnData.z) * (tangent - (1 / Math.tan(core.convertAngleToRadian(inclinacaoFace))));
            return returnData.lr - calculatedData;
        }

        function _calculateResistenciaArrancamento(returnData, i) {
            var escala = core.getValue("arrancamento.escala");
            var calculatedData = 2 * core.resultData.f * escala * returnData.tensaoVertical * returnData.le;
            return calculatedData;
        }

        function _cloneTmax(i) {
            return core.resultData.segundaInteracao[i].tmax;
        }

        function _calculateFS(returnData, i) {
            return returnData.resistenciaArrancamento / returnData.tmax;
        }

        function _verify(returnData, i) {
            return (returnData.fs < 1.5) ? false : true;
        }

        return {
            execute
        }
    })();

    core.estabilidadeInterna = estabilidadeInterna;
})(core);