(function() {
   'use strict';

   angular.module('SiteCamaraAdminApp').controller('EditHotNewsItemController', EditHotNewsItemController);

   EditHotNewsItemController.$inject = [ '$scope', 'Utils',
                                         'settings', 'messages',
                                         '$uibModal', 'HotNewsService',
                                         '$state', 'hotNewsItem' ]
   function EditHotNewsItemController( $scope, Utils,
                                       settings, messages,
                                       $uibModal, HotNewsService,
                                       $state, hotNewsItem ) {
      var $editHotNewsItemCtrl = this;

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      $editHotNewsItemCtrl.hotNewsItem = hotNewsItem;
      $editHotNewsItemCtrl.title = hotNewsItem.title;
      $editHotNewsItemCtrl.order = hotNewsItem.order;

      var _checkAccessInput = false;

      $editHotNewsItemCtrl.setIsAccessInputValidCallback = function(valid) {
         _checkAccessInput = valid;
      }

      $editHotNewsItemCtrl.getAccessCallback = function(returnedHotNewsItemToBeSaved, valid) {
         if(valid) {
            HotNewsService.editHotNewsItem(returnedHotNewsItemToBeSaved).then(function(result) {
               HotNewsService.setHighlightHotNewsId(returnedHotNewsItemToBeSaved.id);
               $state.go('hotNews.list', { infoMessage: _templateMessage( messages.hotNewsItemChanged,
                                                                         { 'order': hotNewsItem.order })
                                        });
            }).catch(function(error) {
               $editHotNewsItemCtrl.errorMessage = error.message;
            });
         }
      }

      $editHotNewsItemCtrl.isValid = function() {
         return $editHotNewsItemCtrl.editHotNewsItemForm.$valid &&
                           _checkAccessInput;
      }

      $editHotNewsItemCtrl.save = function () {
         $editHotNewsItemCtrl.editHotNewsItemForm.$setSubmitted();
         if ($editHotNewsItemCtrl.isValid()) {
            var hotNewsItemToBeSaved = {
               id: hotNewsItem.id,
               title: $editHotNewsItemCtrl.title
            }
            $scope.$broadcast('request-access-property', hotNewsItemToBeSaved);
         }
      }

      $editHotNewsItemCtrl.resetAccess = function() {
         AccessService.resetAccess($editHotNewsItemCtrl, hotNewsItem);
      }

   }

})();
