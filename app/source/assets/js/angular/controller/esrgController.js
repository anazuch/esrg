(function() {
    esrgApp.controller('EsrgController', ['$scope', '$rootScope', '$timeout', '$interval', function($scope, $rootScope, $timeout, $interval) {
        $scope.data = {};
        $scope.inLoading = true;

        $scope.error = {
            status: false,
            code: '',
            message: ''
        }
        $scope.isPrinting = false;

        var _compactorData = {};
        var _tipoReforcos = [];

        $scope._ = _;

        $scope.getPrettyfiedName = function(option, value) {

        }

        $scope.init = function() {
            jsonfile.readFile(core.getPath('dataDefinition'), function(err, data) {
                if (_.isEmpty(data)) {
                    $scope.error.code = '404';
                    $scope.error.message = 'Não foi possivel recuperar os dados iniciais, favor reiniciar o programa. Se o erro persistir contate o administrador';
                }
                $timeout(() => {
                    $scope.data = data;
                    core.data = data;
                    $scope.inLoading = false;
                    _bindListeners();
                    _loadTipoReforcos();
                }, 0)
            });

            jsonfile.readFile(core.getPath('tiposCompactadores'), function(err, data) {
                core.compactorData = data;
                _compactorData = data;
            });

            jsonfile.readFile(core.getPath('abacos'), function(err, data) {
                core.abacos = data;
            });

        }

        $scope.printPdf = function() {
            $scope.isPrinting = true;
            ipc.send('print-to-pdf');
            $timeout(function() {
                $scope.isPrinting = false;
            }, 1000)
        }

        $scope.getMaxLr = function() {
            return _.max([core.resultData.deslizamento, core.resultData.tombamento, core.resultData.tensoesBase, core.resultData.le])
        }

        function _bindListeners() {
            $scope.$watch('data.soloFundacao.inputs.igualAEnchimento.value', function() {
                core.cloneValues($scope.data.soloEnchimento.inputs, $scope.data.soloFundacao.inputs, 'value')
            });

            $scope.$watch('data.geometriaMuro.inputs.espacamentoVertical.value', function(value) {
                if (value > 0.6) {
                    $scope.data.geometriaMuro.inputs.espacamentoVertical.value = 0.6;
                }
            });

            $scope.$watch('data.soloEnchimento.inputs.coesao.value', function(value) {
                if (value != 0) {
                    $scope.data.soloEnchimento.inputs.anguloAtrito.options[1].hide = true;
                } else {
                    $scope.data.soloEnchimento.inputs.anguloAtrito.options[1].hide = false;
                }
            });

            $scope.$watch('data.soloFundacao.inputs.coesao.value', function(value) {
                if (value != 0) {
                    $scope.data.soloFundacao.inputs.anguloAtrito.options[1].hide = true;
                } else {
                    $scope.data.soloFundacao.inputs.anguloAtrito.options[1].hide = false;
                }
            });

            $scope.$watch('data.reforcos.inputs.tipoReforco.value', function(value) {
                if (!_.isEmpty(value)) {
                    $scope.data.reforcos.inputs.resistenciaTracao.value = Number(value);
                }
            });

            $scope.$watch('data.compactacao.inputs.tipo.value', function(value) {
                $scope.data.compactacao.inputs.area.hide = true;
                $scope.data.compactacao.inputs.larguraRolo.hide = true;
                $scope.data.compactacao.inputs.tensao.hide = true;
                $scope.data.compactacao.inputs.pesoRolo.hide = true;

                $scope.data.compactacao.inputs.area.value = "";
                $scope.data.compactacao.inputs.tensao.value = "";
                $scope.data.compactacao.inputs.larguraRolo.value = "";
                $scope.data.compactacao.inputs.pesoRolo.value = "";
                $scope.data.compactacao.inputs.cargaEstatica.value = "";
                if (_.isEqual(value, 'placa')) {
                    $scope.data.compactacao.inputs.area.hide = false;
                    $scope.data.compactacao.inputs.tensao.hide = false;
                    _loadCompactadorData('placa');
                    return;
                }
                if (_.isEqual(value, 'rolo')) {
                    $scope.data.compactacao.inputs.pesoRolo.hide = false;
                    $scope.data.compactacao.inputs.larguraRolo.hide = false;
                    _loadCompactadorData('rolo');
                    return;
                }
            });


            $scope.$watch('data.bloco.inputs.tipo.value', function(value) {
                $scope.data.bloco.inputs.ancoragem.hide = true;
                $scope.data.bloco.inputs.eficienciaAcoplamento.hide = true;
                $scope.data.bloco.inputs.tracao.hide = true;

                if (_.isEqual(value, 'autoenvelopado')) {
                    $scope.data.bloco.inputs.ancoragem.hide = false;
                    return;
                }
                if (_.isEqual(value, 'rigidoBloco')) {
                    $scope.data.bloco.inputs.eficienciaAcoplamento.hide = false;
                    $scope.data.bloco.inputs.tracao.hide = false;
                    return;
                }
            });

            $scope.$watch('data.compactacao.inputs.modelos.value', function(value) {
                if (value) {
                    var currentCompactorData = _compactorData[_currentCompactor];
                    var currentCompactor = _.find(currentCompactorData, { "model": value });
                    if (_.isEqual(_currentCompactor, 'placa')) {
                        $scope.data.compactacao.inputs.area.value = currentCompactor.area;
                        $scope.data.compactacao.inputs.cargaEstatica.value = currentCompactor.charge;
                        $scope.data.compactacao.inputs.tensao.value = currentCompactor.tension;
                    } else {
                        $scope.data.compactacao.inputs.larguraRolo.value = currentCompactor.width;
                        $scope.data.compactacao.inputs.pesoRolo.value = currentCompactor.weight;
                        $scope.data.compactacao.inputs.cargaEstatica.value = currentCompactor.charge;
                    }
                }
            });
        }

        $scope.calculated = false;
        $scope.calc = function() {
            if (!$scope.calcForm.$valid) {
                return;
            }

            $scope.inLoading = true;
            core.control.init($scope.data);
            $scope.resultData = core.resultData;
            $scope.calculated = true;
            $scope.inLoading = false;
        }

        $scope.inputChange = function() {
            $scope.calculated = false;
        }

        $scope.round = function(value) {
            var number = core.round(value);
            return String(number).replace('.', ',')
        }

        $scope.Math = Math;

        $scope.core = core;

        var _currentCompactor = "";

        function _loadCompactadorData(type) {
            _currentCompactor = type;
            var currentList = _compactorData[type];
            if (currentList) {
                var optionList = [];
                optionList.push({ "value": "", "label": "Selecione" });
                for (i in currentList) {
                    var current = currentList[i];
                    var auxJson = { "value": current.model, "label": current.model }
                    optionList.push(auxJson);
                }
                $scope.data.compactacao.inputs.modelos.options = optionList;
            }

        }

        function _loadTipoReforcos() {
            jsonfile.readFile(core.getPath('tiposReforcos'), function(err, data) {
                _tipoReforcos = data;
                $scope.data.reforcos.inputs.tipoReforco.options = data;
                $scope.$apply();
            });
        }



        $scope.isEmpty = _.isEmpty;
    }]);
})();