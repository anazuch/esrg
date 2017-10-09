(function() {
    esrgApp.directive('htmlInclude', ['$templateRequest', '$compile', 'cacheService', function($templateRequest, $compile, cacheService) {
        return {
            restrict: 'E',
            link: function(scope, element, attrs) {
                if (!attrs.src) {
                    return;
                }
                var cachedData = cacheService.get(attrs.src);
                if (!cachedData) {
                    $templateRequest(attrs.src, true).then(function(response) {
                        if (response) {
                            cacheService.put(attrs.src, response);
                        }
                        var responseElem = angular.element(response);
                        element.replaceWith(responseElem);
                        $compile(responseElem)(scope)
                    }, function() {

                    });
                } else {
                    var responseElem = angular.element(cachedData);
                    element.replaceWith(responseElem);
                    $compile(responseElem)(scope)
                }
            }
        }
    }])
})();