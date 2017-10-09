(function() {
    esrgApp.controller('EsrgController', ['$scope', '$rootScope', '$timeout', function($scope, $rootScope, $timeout) {

        $scope.data = {};
        $scope.error = {
            status: false,
            code: '',
            message: ''
        }

        $scope.test = 'test';
        console.log('teste1')

        $scope.init = function() {
            console.log('teste')
            jsonfile.readFile('source/assets/data/dataDefinition.json', function(err, data) {
                if (_.isEmpty(data)) {
                    $scope.error.code = '404';
                    $scope.error.message = 'Não foi possivel recuperar os dados iniciais, favor reiniciar o programa. Se o erro persistir contate o administrador';
                }
                $timeout(() => {
                    $scope.data = data;
                }, 0)
            });
        }
    }]);
})();