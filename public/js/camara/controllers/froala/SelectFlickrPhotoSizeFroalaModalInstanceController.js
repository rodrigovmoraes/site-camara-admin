(function() {
   'use strict';

   angular.module('SiteCamaraAdminApp').controller('SelectFlickrPhotoSizeFroalaModalInstanceController', SelectFlickrPhotoSizeFroalaModalInstanceController);

   SelectFlickrPhotoSizeFroalaModalInstanceController.$inject = [ '$scope',
                                                                  'settings', 'messages',
                                                                  '$uibModalInstance']
   function SelectFlickrPhotoSizeFroalaModalInstanceController( $scope,
                                                                settings, messages,
                                                                $uibModalInstance ) {
       var $modalCtrl = this;

       $modalCtrl.size = 'z';

       $modalCtrl.ok = function() {
          $uibModalInstance.close($modalCtrl.size);
       }

       $modalCtrl.close = function() {
          $uibModalInstance.dismiss('cancel');
       }
   }
})();
