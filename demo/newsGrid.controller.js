(function() {
    'use strict';
    angular
        .module('demoApp')
        .controller('NewsGridController', NewsGridController);

    function NewsGridController(toastr, $translate) {
        'ngInject';
        var vm = this;
        var newsDataSource = {
            standard: 'YiiSoft',
            transport: {
                url: 'http://universal-backend.dev/rest/v1/news',
                delete: {
                    url: (item) => 'http://universal-backend.dev/rest/v1/news/[id]'.replace('[id]', item[newsDataSource.primaryKey]),
                    handlers: {
                        error: function(reject) {
                            if (reject.status === 423) {
                                toastr.error($translate.instant('RESPONSE_ERROR.N423'));
                            }
                        }
                    }
                }
            },
            sortBy: {
                id: 'asc',
                title: 'desc'
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
                            ]
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
                        name: 'ue-dropdown',
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
                            label: 'Created'
                        }
                    }
                },
                {
                    name: 'updated_at',
                    component: {
                        name: 'ue-date',
                        settings: {
                            label: 'Updated'
                        }
                    }
                }
            ]
        };

        vm.ueConfig = {
            component: {
                name: 'ue-grid',
                settings: {
                    dataSource: newsDataSource,
                    multiSorting: true,
                    header: {
                        toolbar: [
                            {
                                component: {
                                    name: 'ue-button',
                                    settings: {
                                        label: 'Add news',
                                        sref: 'news_edit'
                                    }
                                }
                            }
                        ]
                    },
                    dragMode: {
                        containerName: 'news',
                        allowedContainers: ['news']
                    },
                    columns: [
                        { name: 'id', width: '20%' },
                        { name: 'title', width: '30%' },
                        { name: 'authors', width: '30%' },
                        { name: 'category_id', width: '30%', sortable: false }],
                    contextMenu: [
                        {
                            component: {
                                name: 'ue-button',
                                settings: {
                                    label: 'Edit',
                                    sref: 'news_edit',
                                    useable: function(data) {
                                        return true;
                                    }
                                }
                            }
                        },
                        {
                            separator: true,
                            component: {
                                name: 'ue-button',
                                settings: {
                                    label: 'Delete',
                                    action: 'delete'
                                }
                            }
                        }
                    ],
                    footer: {
                        toolbar: [
                            {
                                component: {
                                    name: 'ue-pagination'
                                }
                            }
                        ]
                    }
                }
            }
        };
    }
})();
