(function() {
    esrgApp.controller('EsrgController', ['$scope', '$rootScope', '$timeout', function($scope, $rootScope, $timeout) {
        $scope.data = {};
        $scope.inLoading = true;

        $scope.error = {
            status: false,
            code: '',
            message: ''
        }
        $scope.isPrinting = false;

        $scope.init = function() {
            jsonfile.readFile(core.getPath('dataDefinition'), function(err, data) {
                if (_.isEmpty(data)) {
                    $scope.error.code = '404';
                    $scope.error.message = 'Não foi possivel recuperar os dados iniciais, favor reiniciar o programa. Se o erro persistir contate o administrador';
                }
                $timeout(() => {
                    $scope.data = data;
                    $scope.inLoading = false;
                    _bindListeners();
                }, 0)
            });
            jsonfile.readFile(core.getPath('abacos'), function(err, data) {});
        }

        $scope.printPdf = function() {
            $scope.isPrinting = true;
            ipc.send('print-to-pdf');
            $timeout(function() {
                $scope.isPrinting = false;
            }, 1000)
        }

        function _bindListeners() {
            $scope.$watch('data.soloFundacao.inputs.igualAEnchimento.value', function() {
                core.cloneValues($scope.data.soloEnchimento.inputs, $scope.data.soloFundacao.inputs, 'value')
            });
        }

        $scope.isEmpty = _.isEmpty;
    }]);
})();