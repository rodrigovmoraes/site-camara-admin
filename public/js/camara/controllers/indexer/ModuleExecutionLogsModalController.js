(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').controller('ModuleExecutionLogsModalController', ModuleExecutionLogsModalController);

   ModuleExecutionLogsModalController.$inject = [ '$uibModalInstance', '$scope',
                                                  'IndexerService', 'messages',
                                                  'Utils', 'params' ];
   function ModuleExecutionLogsModalController( $uibModalInstance, $scope,
                                                IndexerService, messages,
                                                Utils, params ) {
      var $modalCtrl = this;

      //messages control
      Utils.applyMessageControls($modalCtrl);

      $modalCtrl.logStartDate = params.executionLog.startDate;
      $modalCtrl.logEndDate = params.executionLog.endDate;

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      IndexerService
         .getModulesLogs(params.executionLog._id)
         .then(function(result) {
            $modalCtrl.modulesExecutionLogs = result.modulesExecutionLogs;
         });

      $modalCtrl.close = function() {
         $uibModalInstance.dismiss('cancel');
      }

      $modalCtrl.ok = function () {
         $uibModalInstance.close();
      }
   }
})();
