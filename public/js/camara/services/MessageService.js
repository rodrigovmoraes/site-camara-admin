(function() {
"use strict";

      angular.module('SiteCamaraAdminApp').factory('messages', MessageService);

      MessageService.$inject = ['$rootScope']
      function MessageService($rootScope) {
             var messages = camaraConfig('js/camara/config/messages');

             $rootScope.messages = messages;
             return messages;
      }

})();
