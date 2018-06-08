(function() {
   'use strict';

   angular.module('SiteCamaraAdminApp').controller('NewHotNewsItemController', NewHotNewsItemController);

   NewHotNewsItemController.$inject = [ '$scope', 'Utils',
                                        'settings', 'messages',
                                        '$uibModal', 'HotNewsService',
                                        '$state' ]
   function NewHotNewsItemController( $scope, Utils,
                                      settings, messages,
                                      $uibModal, HotNewsService,
                                      $state ) {
      var $newHotNewsItemCtrl = this;

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      var _checkAccessInput = false;

      $newHotNewsItemCtrl.setIsAccessInputValidCallback = function(valid) {
         _checkAccessInput = valid;
      }

      $newHotNewsItemCtrl.getAccessCallback = function(returnedHotNewsItem, valid) {
         if(valid) {
            HotNewsService.saveNewHotNewsItem(returnedHotNewsItem).then(function(result) {
                 $state.go('hotNews.list', { infoMessage: messages.hotNewsItemCreated });
            }).catch(function(error) {
               $newHotNewsItemCtrl.errorMessage = error.message;
            });
         }
      }

      $newHotNewsItemCtrl.isValid = function() {
         return $newHotNewsItemCtrl.insertNewHotNewsItemForm.$valid &&
                           _checkAccessInput;
      }

      $newHotNewsItemCtrl.save = function () {
         $newHotNewsItemCtrl.insertNewHotNewsItemForm.$setSubmitted();
         if ($newHotNewsItemCtrl.isValid()) {
            var hotNewsItem = {
               title: $newHotNewsItemCtrl.title
            }
            $scope.$broadcast('request-access-property', hotNewsItem);
         }
      }
   }

})();
