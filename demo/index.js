; (function(angular) {
    'use strict';

    angular.module('demoApp', [
        'ui.router',
        'universal-editor',
        'ue-locks'
    ]).config(routerConfig);

    routerConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

    function routerConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('news', {
                url: '/news',
                template: '<universal-editor ue-config="vm.ueConfig"></universal-editor>',
                controllerAs: 'vm',
                controller: 'NewsGridController'
            })
            .state('news_edit', {
                url: '/news/:pk',
                template: '<universal-editor ue-config="vm.ueConfig"></universal-editor>',
                controllerAs: 'vm',
                controller: 'NewsFormController'
            });
        $urlRouterProvider.otherwise('/news');
    }

})(angular);
