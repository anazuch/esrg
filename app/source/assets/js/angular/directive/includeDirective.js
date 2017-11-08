(function() {
    esrgApp.directive('htmlInclude', ['$templateRequest', '$compile', function($templateRequest, $compile) {
        return {
            restrict: 'E',
            link: function(scope, element, attrs) {
                if (!attrs.src) {
                    return;
                }
                $templateRequest(attrs.src, true).then(function(response) {
                    var responseElem = angular.element(response);
                    element.replaceWith(responseElem);
                    $compile(responseElem)(scope)
                }, function() {

                });
            }
        }
    }])
})();