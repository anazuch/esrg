(function(core) {
    var estabilidadeConexao = (function() {

        function execute() {
            _calculateSistemaEnvelopado();
            _calculateFSSistemaEnvelopado();
            _calculateSistemBloco();
            _calculateFSSistemBloco();
        }

        function _calculateSistemaEnvelopado() {
            var f = core.resultData.f;
            var escala = core.getValue("arrancamento.escala");
            var lo = core.getValue("bloco.ancoragem");
            var interation = core.resultData.segundaInteracao;

            var maxInterationVertical;
            var maxInterationTMax;
            for (var i in interation) {
                var tVertical = interation[i].tensaoVertical;
                var tMax = interation[i].tmax;
                if (_.isEmpty(maxInterationVertical) && _.isEmpty(maxInterationTMax)) {
                    maxInterationVertical = tVertical;
                    maxInterationTMax = tMax;
                }
                if (maxInterationVertical < tVertical) {
                    maxInterationVertical = tVertical;
                }
                if (maxInterationTMax < tMax) {
                    maxInterationTMax = tMax;
                }
            }
            core.resultData.maxTmax = maxInterationTMax;
            core.resultData.maxTensaoVertical = maxInterationVertical;
            core.resultData.sistemaEnvelopado = 2 * f * escala * maxInterationVertical * lo;
        }

        function _calculateFSSistemaEnvelopado() {
            core.resultData.fsSistemaEnvelopado = 1.5 * (0.5 * core.resultData.maxTmax)
        }

        function _calculateSistemBloco() {
            var cr = core.getValue("bloco.eficienciaAcoplamento");
            core.resultData.sistemaBloco = (cr / 100) * core.resultData.maxTmax;
        }

        function _calculateFSSistemBloco() {
            var to = core.getValue("bloco.tracao");
            core.resultData.sistemaFSBloco = (to / 100) * core.resultData.maxTmax * 1.5;
        }


        return {
            execute
        }
    })();

    core.estabilidadeConexao = estabilidadeConexao;
})(core);