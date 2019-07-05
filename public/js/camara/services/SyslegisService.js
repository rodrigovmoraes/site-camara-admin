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

      syslegisService.getLegislativeProcesses = function (filter) {
         return $http
                 .post( settings.baseUrlSyslegisApi + "/materiasLegislativas",
                        { 'filter': filter } )
                 .then(function(result) {
                    return result.data;
                 });
      }

      syslegisService.getLegislativeProcess = function (legislativeProcessId) {
         return $http
                 .get( settings.baseUrlSyslegisApi + "/materiaLegislativa/" + legislativeProcessId)
                 .then(function(result) {
                    return result.data;
                 });
      }
   }
})();
