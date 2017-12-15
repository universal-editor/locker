(function(module) {
    try {
        module = angular.module('ue-locks.templates');
    } catch (e) {
        module = angular.module('ue-locks.templates', []);
    }
    module.run(function($templateCache) {
        'ngInject';
        require.context('../module', true, /\.jade$/).keys().forEach(function(req) {
            var path = req.substr(2, req.length - 7);
            $templateCache.put('module/' + path + '.html', require('./' + path + '.jade')());
        });
    });
})();