(function() {
    'use strict';

    angular
        .module('ue-locks')
        .service('ueLocksService', ueLocksService);

    function ueLocksService($http, $q, configData, $rootScope, ApiService) {
        'ngInject';

        var self = this;

        self.lockedComponents = [];
        self.lockerStorage = [];

        self.registerComponent = function(lockerId, component) {
            self.lockerStorage[lockerId] = self.lockerStorage[lockerId] || [];
            if (angular.isObject(component)) {
                self.lockerStorage[lockerId].push(component);
            }
        };

        self.unRegisterComponent = function(lockerId, component) {
            self.lockerStorage[lockerId] = self.lockerStorage[lockerId] || [];
            if (angular.isObject(component)) {
                let i = self.lockerStorage[lockerId].indexOf(component);
                if (i !== -1) {
                    self.lockerStorage[lockerId].splice(i, 1);
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
            var before = true;
            if (DS.transport && DS.transport.lock && DS.transport.lock.handlers && DS.transport.lock.handlers.before) {
                before = DS.transport.lock.handlers.before(optionsHttp) !== false;
            }
            if (before) {
                $http(optionsHttp).then(function(response) {
                    try {
                        DS.transport.lock.handlers.success(response);
                    } catch (e) { }
                    $rootScope.$broadcast('ue-locks: unlock', { component: component, entity: entity, response: response });

                    if (self.lockedComponents.indexOf(component.setting.component.$id) === -1) {
                        self.lockedComponents.push(component.setting.component.$id);
                    }
                    defer.resolve(true);
                }, function(reject) {
                    try {
                        DS.transport.lock.handlers.error(response);
                    } catch (e) { }
                    $rootScope.$broadcast('ue-locks: lock', { component: component, entity: entity, reject: reject });
                    if (reject.status === 423) {
                        defer.resolve(false);
                    }
                    defer.resolve(null);
                }).finally(function() {
                    try {
                        DS.transport.lock.handlers.complete();
                    } catch (e) { }
                });
            } else {
                defer.resolve(true);
            }
            return defer.promise;
        };

        self.unlock = function(component, entity) {
            var i = self.lockedComponents.indexOf(component.setting.component.$id);
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

                var before = true;
                if (DS.transport && DS.transport.unlock && DS.transport.unlock.handlers && DS.transport.unlock.handlers.before) {
                    before = DS.transport.unlock.handlers.before(optionsHttp) !== false;
                }
                if (before) {
                    $http(optionsHttp).then(function(response) {
                        try {
                            DS.transport.unlock.handlers.success(response);
                        } catch (e) { }
                        $rootScope.$broadcast('ue-locks: unlock', { component: component, entity: entity, response: response });
                        self.lockedComponents.splice(i, 1);
                        defer.resolve(data);
                    }, function(reject) {
                        try {
                            DS.transport.unlock.handlers.error(reject);
                        } catch (e) { }
                        defer.resolve(reject);
                    }).finally(function() {
                        try {
                            DS.transport.unlock.handlers.complete();
                        } catch (e) { }
                    });
                } else {
                    defer.resolve(false);
                }
            } else {
                defer.resolve(false);
            }
            return defer.promise;
        };
    }
})();