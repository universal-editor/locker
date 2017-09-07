; (function(angular) {
    'use strict';


    angular
        .module('ue-locks')
        .controller('ueLocksController', ueLocksController);


    function ueLocksController($scope, ueLocksService, $q, $controller, $translate, $timeout, $rootScope, $element, EditEntityStorage, $state, toastr) {
        'ngInject';
        var vm = this, componentSettings, baseController;

        vm.$onInit = function() {
            componentSettings = vm.setting.component.settings;
            vm.isBlock = false;
            if (angular.isArray(componentSettings.unLockComponents) && angular.isArray(componentSettings.lockComponents)) {
                console.error($translate.instant('LOCKS.EXCLUSION'));
            } else {
                baseController = $controller('FieldsController', { $scope: $scope, $element: $element });
                angular.extend(vm, baseController);
                if (angular.isArray(componentSettings.unLockComponents)) {
                    vm.unLockComponents = componentSettings.unLockComponents;
                }
                if (angular.isArray(componentSettings.lockComponents)) {
                    vm.lockComponents = componentSettings.lockComponents;
                }

                vm.listeners.push($scope.$on('ue:componentDataLoaded', function(e, data) {
                    let component = vm.getParentComponent();
                    let comp = EditEntityStorage.getComponentBySetting(vm.options.$componentId);
                    vm.message = $translate.instant('LOCKS.BLOCKED');
                    let timer;
                    let components = getComponents(comp.setting);
                    lock();
                    function lock() {
                        ueLocksService.lock(comp, data).then(function(result) {
                            angular.forEach(components, function(component) {
                                component = EditEntityStorage.getComponentBySetting(component);
                                ueLocksService.registerComponent(vm.setting.component.$id, component);
                                if (component && component.setting && component.setting.component.name !== 'ue-locks') {
                                    if (angular.isUndefined(vm.unLockComponents) && angular.isUndefined(vm.lockComponents)) {
                                        component.readonly = !result;
                                    } else {
                                        if (angular.isDefined(vm.unLockComponents) && vm.unLockComponents.indexOf(component.setting.component.$id) === -1) {
                                            component.readonly = !result;
                                        } else if (angular.isDefined(vm.lockComponents) && ~vm.lockComponents.indexOf(component.setting.component.$id)) {
                                            component.readonly = !result;
                                        }
                                    }
                                }
                            });
                            timer = $timeout(lock, (componentSettings.timing || 15) * 60 * 1000);
                            vm.isBlock = true;
                            if (result === null) {
                                vm.message = $translate.instant('LOCKS.IMPOSSIBLE');
                                toastr.error($translate.instant('RESPONSE_ERROR.UNDEFINED'));
                            }
                            if (result !== false && result !== null) {
                                vm.isBlock = false;
                            }
                        });
                    }
                    $scope.$on("$destroy", function() {
                        angular.forEach(components, function(component) {
                            ueLocksService.unRegisterComponent(vm.setting.component.$id, component);
                        });
                        ueLocksService.unlock(comp, data);
                        $timeout.cancel(timer);
                    });

                    $(window).unload(function() {
                        $timeout.cancel(timer);
                        ueLocksService.unlock(comp, data);
                    });
                }));


            }
        };

        function getComponents(value) {
            var container = [];
            if (value !== false) {
                (function check(value) {
                    var keys = Object.keys(value);
                    for (var i = keys.length; i--;) {
                        var propValue = value[keys[i]];
                        if (angular.isObject(propValue)) {
                            if (angular.isObject(propValue.component)) {
                                container.push(propValue);
                            }
                            check(propValue);
                        }
                    }
                })(value);
            }
            return container;
        }
    }
})(angular);
