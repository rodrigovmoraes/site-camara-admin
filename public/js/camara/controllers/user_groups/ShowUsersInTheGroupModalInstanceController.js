(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').controller('ShowUsersInTheGroupModalInstanceController', ShowUsersInTheGroupModalInstanceController);

   ShowUsersInTheGroupModalInstanceController.$inject = [ '$uibModalInstance', '$scope',
                                                          'UserService', 'UserGroupService',
                                                          'messages', 'Utils', 'group',
                                                          'users' ];
   function ShowUsersInTheGroupModalInstanceController( $uibModalInstance, $scope,
                                                        UserService, UserGroupService,
                                                        messages, Utils, group,
                                                        users ) {
      var $modalCtrl = this;

      //messages control
      Utils.applyMessageControls($modalCtrl);

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      //grid definition
      $modalCtrl.instanceGrid = {
         enablePaginationControls: false,
         enableFiltering: true,
         useExternalPagination: false,
         useExternalSorting: false,
         useExternalFiltering: false,
         data: users,
         columnDefs: [  {  name: 'Usuário', field: 'username', enableFiltering: true },
                        {  name: 'Nome', field: 'name', enableFiltering: true },
                        {  name: 'Grupo / Subgrupo', field: 'groupName', enableFiltering: true },
                        {  name: 'Tipo', field: 'groupType', enableFiltering: true } ]
      }

      $modalCtrl.resizeUsersGrid = function () {
         var clamp = function(min, max, value) {
            return Math.min(Math.max(min, value), max);
         };

         var len = $modalCtrl.instanceGrid.data.length;
         var initialOff = 57;
         var rowOff = 33;
         var calculatedHeight = initialOff + len * rowOff;
         var min = initialOff + 1 * rowOff;
         var max = initialOff + 10 * rowOff;

         return {
            height: clamp(min, max, calculatedHeight) + 'px'
         }
      }

      $modalCtrl.groupCompleteName = group.completeName;

      $modalCtrl.close = function () {
         $uibModalInstance.dismiss('cancel');
      }

      App.unblockUI();
   }
})();
