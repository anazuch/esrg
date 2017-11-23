(function(core) {
    var control = (function() {

        function _execute() {
            core.empuxo.execute();
            core.deslizamento.execute();
            core.tombamento.execute();
            core.tensoesBase.execute();
            core.capacidadeCarga.execute();
            core.estabilidadeInterna.execute();
            core.estabilidadeConexao.execute();
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