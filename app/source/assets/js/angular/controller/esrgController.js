(function() {
    esrgApp.controller('EsrgController', ['$scope', '$rootScope', '$timeout', function($scope, $rootScope, $timeout) {
        const _buildProductionPath = 'resources/app/';
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
                }, 0)
            });
        }

        $scope.printPdf = function() {
            $scope.isPrinting = true;
            ipc.send('print-to-pdf');
            $timeout(function() {
                $scope.isPrinting = false;
            }, 1000)
        }

        $scope.isEmpty = _.isEmpty;
    }]);
})();