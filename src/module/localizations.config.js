(function() {
  'use strict';

  angular
    .module('ue-locks')
    .config(LocalizationMessage);

  function LocalizationMessage($translateProvider) {    
    'ngInject';
    var config = {
      'RESPONSE_ERROR': {
        'N423': 'Запись заблокирована.'
      },
      'LOCKS': {
        /** English version (TODO)
         * 
          'IMPOSSIBLE': 'Editing is impossible. Try later.',
          'BLOCKED': 'Record is blocked.',
          'EXCLUSION': 'Cannot be specified properties ue-lock::lockComponents and ue-lock::unLockComponents at one time.'
        */
        'IMPOSSIBLE': 'Редактирование невозможно. Попробуйте позже.',
        'BLOCKED': 'Запись заблокирована.',
        'EXCLUSION': 'Невозможно одновременно указать настройки компонента ue-lock::lockComponents и ue-lock::unLockComponents.'
      }
    };

    var baseConfig = $translateProvider.translations('ru');
    $translateProvider.translations('ru', angular.merge(config, baseConfig));
    $translateProvider.useSanitizeValueStrategy(null);
    $translateProvider.preferredLanguage('ru');
  }

})();