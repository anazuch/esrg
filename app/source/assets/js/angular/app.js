var esrgApp = angular.module("esrgApp", []).run(['$rootScope', '$locale', function($rootScope, $locale) {}]).config(['$locationProvider', '$compileProvider', '$logProvider', '$sceProvider', function($locationProvider, $compileProvider, $logProvider, $sceProvider) {
    $compileProvider.debugInfoEnabled(false);
    $logProvider.debugEnabled(true);
    $sceProvider.enabled(false);
}]);