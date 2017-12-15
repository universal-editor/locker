# Компонент ue-locks

Компонент ue-locks предназначен для работы с блокировками.
Механизм блокировок предназначен для невозможности редактировать сущность на форме редактора одновременно двумя клиентами.

Секция `dataSource[transport]` включает описание блокировок.
Если какой-то компонент не нужно блочить, то предполагается передача его id компонента ue-lock, который исключит его из списка заблокированных.
Настройки компонента `ue-lock[unLockComponents]` и  `ue-lock[lockComponents]` являются взаимоисключающими.

```javascript
 var newsDataSource = {
    standard: "YiiSoft",
    transport: {
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
    primaryKey: "id",
    fields: [
        {
            name: "id",
            component: {
                name: "ue-string",
                settings: {
                    label: "ID",
                    validators: [
                        {
                            type: "number"
                        }
                    ],
                    disabled: true
                }
            }
        },
        {
            name: "title",
            component: {
                name: "ue-string",
                settings: {
                    label: "Title"
                }
            }
        },
        {
            name: "description",
            component: {
                name: "ue-textarea",
                settings: {
                    label: "Text"
                }
            }
        }
    ]
};

vm.ueConfig = {
    component: {
        name: "ue-form",
        settings: {
            dataSource: newsDataSource,
            primaryKeyValue: function() {
                if ($state.params.pk === "new") {
                    return null;
                }
                return $state.params.pk;
            },
            header: {
                toolbar: [
                    {
                        component: {
                            name: "ue-button",
                            settings: {
                                label: "Back",
                                sref: "news",
                                useBackUrl: true,
                                template: function($scope) {
                                    return "<div class="close-editor" ng-click="vm.click()"> </div>";
                                }
                            }
                        }
                    }
                ]
            },
            body: [
                {
                    component: {
                        name: "ue-form-tabs",
                        settings: {
                            tabs: [
                                {
                                    label: "Description",
                                    fields: [
                                        "id",
                                        "title",
                                        "description"
                                    ]
                                }
                            ]
                        }
                    }
                },
                {
                    component: {
                        name: "ue-locks",
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
                            name: "ue-button",
                            settings: {
                                label: "Save",
                                action: "save",
                                sref: "news"
                            }
                        }
                    },
                    {
                        component: {
                            name: "ue-button",
                            settings: {
                                label: "Apply",
                                action: "presave"
                            }
                        }
                    },
                    {
                        component: {
                            name: "ue-button",
                            settings: {
                                label: "Delete",
                                action: "delete",
                                sref: "news"
                            }
                        }
                    }
                ]
            }
        }
    }
}
```

## Параметры раздела **settings**

| Параметр | Тип | Описание | Обязательный параметр? | Значение по-умолчанию |
| --- | --- | --- | --- | --- |
| unLockComponents | array | Массив id компонентов, которые не блокируются компонентом `ue-lock`. | \- | \- |
| lockComponents | array |  Массив id компонентов, которые блокируются компонентом `ue-lock`. | \- | \- |
| timing | number |  Время в минутах, на которое блокируются компоненты. | \- | 15 |

## События, относящиеся к компоненту
* ue-locks:lock – событие вызывается при блокировке;
* ue-locks:unlock – событие вызвается при разблокировке.

``` javascript
$scope.$on('ue-locks:lock', function(e, data) {
    /**
    data.component – модель компонента (объект), в рамках которого происходит блокировка
    data.entity – заблокированная сущность  (объект, который прислал сервер и в отношении которого производилась блокировка)
    data.response – ответ от сервера, который был получен на запрос блокировки.
    */
}); 

$scope.$on('ue-locks:unlock', function(e, data) {
    /**
    data.component – модель компонента (объект), в рамках которого происходит разблокировка
    data.entity – разблокированная сущность (объект, который прислал сервер и в отношении которого производилась разблокировка)
    data.response – ответ от сервера, который был получен на запрос разблокировки.
    */
}); 
```
