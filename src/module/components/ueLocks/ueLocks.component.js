; (function(angular) {
    'use strict';

    var ueLocks = {
        bindings: {
            setting: '<',
            options: '='
        },
        template: function($templateCache) {
            'ngInject';
            return $templateCache.get('module/components/ueLocks/ueLocks.html');
        },
        controller: 'ueLocksController',
        controllerAs: 'vm'
    };

    angular
        .module('ue-locks')
        .component('ueLocks', ueLocks);
})(angular);
