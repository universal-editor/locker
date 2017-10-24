(function() {
    'use strict';

    angular
        .module('demoApp')
        .controller('NewsFormController', NewsFormController);

    NewsFormController.$inject = ['$state'];
    function NewsFormController($state) {
        'ngInject';
        var vm = this;
        var newsDataSource = {
            standard: 'YiiSoft',
            transport: {
                url: 'http://universal-backend.dev/rest/v1/news',
                unlock: {
                    method: 'UNLOCK',
                    url: 'http://universal-backend.dev/rest/v1/news/:id',
                    handlers: {
                        before: function(config) {
                            console.log('Before unlock-handler');
                            console.log(config);
                        },
                        success: function(response) {
                            console.log('Success unlock-handler');
                            console.log(response);
                        },
                        error: function(reject) {
                            console.log('Reject unlock-handler');
                            console.log(reject);
                        },
                        complete: function() {
                            console.log('Complete unlock-handler');
                        }
                    }
                },
                lock: {
                    method: 'LOCK',
                    url: 'http://universal-backend.dev/rest/v1/news/:id',
                    handlers: {
                        before: function(config) {
                            console.log('Before lock-handler');
                            console.log(config);
                        },
                        success: function(response) {
                            console.log('Success lock-handler');
                            console.log(response);
                        },
                        error: function(reject) {
                            console.log('Reject lock-handler');
                            console.log(reject);
                        },
                        complete: function() {
                            console.log('Complete lock-handler');
                        }
                    }
                }
            },
            primaryKey: 'id',
            fields: [
                {
                    name: 'id',
                    component: {
                        name: 'ue-string',
                        settings: {
                            label: 'ID',
                            validators: [
                                {
                                    type: 'number'
                                }
                            ],
                            disabled: true
                        }
                    }
                },
                {
                    name: 'published_at',
                    component: {
                        name: 'ue-date',
                        settings: {
                            label: 'Publication date'
                        }
                    }
                },
                {
                    name: 'category_id',
                    component: {
                        name: 'ue-autocomplete',
                        settings: {
                            label: 'Category',
                            valuesRemote: {
                                fields: {
                                    value: 'id',
                                    label: 'title'
                                },
                                url: 'http://universal-backend.dev/rest/v1/news/categories'
                            },
                            search: true
                        }
                    }
                },
                {
                    name: 'title',
                    component: {
                        name: 'ue-string',
                        settings: {
                            label: 'Title'
                        }
                    }
                },
                {
                    name: 'description',
                    component: {
                        name: 'ue-textarea',
                        settings: {
                            label: 'Text'
                        }
                    }
                },
                {
                    name: 'authors',
                    component: {
                        name: 'ue-autocomplete',
                        settings: {
                            label: 'Authors',
                            draggable: true,
                            valuesRemote: {
                                fields: {
                                    value: 'id',
                                    label: 'name'
                                },
                                url: 'http://universal-backend.dev/rest/v1/staff'
                            },
                            multiple: true,
                            expandable: true,
                            multiname: 'staff_id'
                        }
                    }
                },
                {
                    name: 'tags',
                    component: {
                        name: 'ue-dropdown',
                        settings: {
                            label: 'Tags',
                            valuesRemote: {
                                fields: {
                                    value: 'id',
                                    label: 'name'
                                },
                                url: 'http://universal-backend.dev/rest/v1/tags'
                            },
                            multiple: true,
                            expandable: true
                        }
                    }
                },
                {
                    name: 'created_at',
                    component: {
                        name: 'ue-date',
                        settings: {
                            label: 'Created',
                            disabled: true
                        }
                    }
                },
                {
                    name: 'updated_at',
                    component: {
                        name: 'ue-date',
                        settings: {
                            label: 'Updated',
                            disabled: true
                        }
                    }
                }
            ]
        };

        vm.ueConfig = {
            component: {
                name: 'ue-form',
                settings: {
                    dataSource: newsDataSource,
                    primaryKeyValue: function() {
                        if ($state.params.pk === 'new') {
                            return null;
                        }
                        return $state.params.pk;
                    },
                    header: {
                        toolbar: [
                            {
                                component: {
                                    name: 'ue-button',
                                    settings: {
                                        label: 'Back',
                                        sref: 'news',
                                        useBackUrl: true,
                                        template: function($scope) {
                                            return '<div class="close-editor" ng-click="vm.click()"> </div>';
                                        }
                                    }
                                }
                            }
                        ]
                    },
                    body: [
                        {
                            component: {
                                name: 'ue-form-tabs',
                                settings: {
                                    tabs: [
                                        {
                                            label: 'Description',
                                            fields: [
                                                'id',
                                                'category_id',
                                                'title',
                                                'description'
                                            ]
                                        },
                                        {
                                            label: 'Place',
                                            fields: [
                                                'authors',
                                                'tags'
                                            ]
                                        }
                                    ]
                                }
                            }
                        },
                        {
                            component: {
                                name: 'ue-locks',
                                settings: {
                                    timing: 0.06
                                }
                            }
                        }
                    ],
                    footer: {
                        toolbar: [
                            {
                                component: {
                                    name: 'ue-button',
                                    settings: {
                                        label: 'Save',
                                        action: 'save',
                                        sref: 'news'
                                    }
                                }
                            },
                            {
                                component: {
                                    name: 'ue-button',
                                    settings: {
                                        label: 'Apply',
                                        action: 'presave'
                                    }
                                }
                            },
                            {
                                component: {
                                    name: 'ue-button',
                                    settings: {
                                        label: 'Delete',
                                        action: 'delete',
                                        sref: 'news'
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        };
    }
})();
