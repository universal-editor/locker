(function() {
    'use strict';

    angular
        .module('ue-locks')
        .service('ueLocksService', ueLocksService);

    function ueLocksService($http, $q, configData, $rootScope, ApiService) {
        'ngInject';

        var self = this;
        self.lock = function(component, entity) {
            var defer = $q.defer();
            var DS = new DataSource(component.componentSettings.dataSource);
            var service = ApiService.getCustomService(DS.standard);
            ApiService.checkStandardParameter(DS.standard, service);

            var config = {
                action: 'lock',
                $dataSource: DS
            };
            var optionsHttp = ApiService.getAjaxOptionsByTypeService(config, DS.standard, entity);
            var handlers = DS.getHandlers('lock');
            var objectBind = {
                action: 'one',
                parentComponentId: component.options.$componentId,
                request: handlers,
                $dataSource: DS
            };
            $http(optionsHttp).then(function(response) {
                $rootScope.$broadcast('ue-lock: unlock', { component: component, entity: entity });
                defer.resolve(true);
                //defer.resolve(false);
            }, function(reject) {
                $rootScope.$broadcast('ue-lock: lock', { component: component, entity: entity });
                if (reject.status === 423) {
                    defer.resolve(false);
                }
                defer.resolve(null);
            });
            return defer.promise;
        };

        self.unlock = function(component, entity) {
            var defer = $q.defer();
            var DS = new DataSource(component.componentSettings.dataSource);
            var service = ApiService.getCustomService(DS.standard);
            ApiService.checkStandardParameter(DS.standard, service);
            var config = {
                action: 'unlock',
                $dataSource: DS
            };
            var optionsHttp = ApiService.getAjaxOptionsByTypeService(config, DS.standard, entity);
            var handlers = DS.getHandlers('unlock');
            var objectBind = {
                action: 'one',
                parentComponentId: component.options.$componentId,
                request: handlers,
                $dataSource: DS
            };
            $http(optionsHttp).then(function(response) {
                $rootScope.$broadcast('ue-lock: unlock', { component: component, entity: entity });
                deferred.resolve(data);
            }, function(reject) {
            });
            return defer.promise;
        };
    }
})();