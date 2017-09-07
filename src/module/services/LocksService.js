(function() {
    'use strict';

    angular
        .module('ue-locks')
        .service('ueLocksService', ueLocksService);

    function ueLocksService($http, $q, configData, $rootScope, ApiService) {
        'ngInject';

        var self = this,
            lockedComponents = [],
            lockerStorage = [];

        self.registerComponent = function(lockerId, component) {
            lockerStorage[lockerId] = lockerStorage[lockerId] || [];
            if (angular.isObject(component)) {
                lockerStorage[lockerId].push(component);
            }
        };

        self.unRegisterComponent = function(lockerId, component) {
            lockerStorage[lockerId] = lockerStorage[lockerId] || [];
            if (angular.isObject(component)) {
                let i = lockerStorage[lockerId].indexOf(component);
                if (i !== -1) {
                    lockerStorage[lockerId].splice(i, 1);
                }
            }
        };

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
                $rootScope.$broadcast('ue-locks: unlock', { component: component, entity: entity });
                if (lockedComponents.indexOf(component.setting.component.$id) === -1) {
                    lockedComponents.push(component.setting.component.$id);
                }
                defer.resolve(true);
                //defer.resolve(false);
            }, function(reject) {
                $rootScope.$broadcast('ue-locks: lock', { component: component, entity: entity });
                if (reject.status === 423) {
                    defer.resolve(false);
                }
                defer.resolve(null);
            });
            return defer.promise;
        };

        self.unlock = function(component, entity) {
            var i = lockedComponents.indexOf(component.setting.component.$id);
            var defer = $q.defer();
            if (i !== -1) {                
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
                    $rootScope.$broadcast('ue-locks: unlock', { component: component, entity: entity });
                    lockedComponents.splice(i, 1);
                    defer.resolve(data);
                }, function(reject) {
                    defer.resolve(reject);
                });
            } else {
                defer.resolve(false);
            }
            return defer.promise;
        };
    }
})();