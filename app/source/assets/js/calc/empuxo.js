(function(core) {
    var empuxo = (function() {

        function init() {
            console.log("Inicialized calcule of empuxo");
        }

        return { init }
    })();

    core.empuxo = empuxo;
})(core);