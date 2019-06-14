(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').service('SyslegisService', SyslegisService);

   SyslegisService.$inject = [ 'settings', '$http' ];
   function SyslegisService( settings, $http ) {
      var syslegisService = this;

      syslegisService.getLegislativeProcessesTypes = function () {
         return $http
                 .get(settings.baseUrlSyslegisApi + "/tiposDeMateria")
                 .then(function(result) {
                    return result.data;
                 });
      }
   }
})();
