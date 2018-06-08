(function() {
   'use strict';

   angular.module('SiteCamaraAdminApp').controller('SelectPageModalInstanceController', SelectPageModalInstanceController);

   SelectPageModalInstanceController.$inject = [ '$scope', 'Utils',
                                                 'settings', 'messages',
                                                 '$uibModalInstance', 'PagesService']
   function SelectPageModalInstanceController( $scope, Utils,
                                               settings, messages,
                                               $uibModalInstance, PagesService ) {
      var $modalCtrl = this;

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      var _clear = function() {
         $modalCtrl.pager.page = 1;
         $modalCtrl.pager.total = 0;
         $modalCtrl.pages = null;
         $modalCtrl.notFoundMessage = null;
         $modalCtrl.infoMessage = null;
         $modalCtrl.errorMessage = null;
      }

      var _setIds = function(pages) {
         if(pages) {
            var i;
            var resultPages = [];
            for(i = 0; i < pages.length; i++) {
               var resultPage = pages[i];
               resultPage.id = resultPage._id;
               resultPages.push(resultPage);
            }
            return resultPages;
         } else {
            null;
         }
      }

      var _update = function() {
         $modalCtrl.loading = true;

         //BEGIN - getPages
         var __getPages = function(filter) {
            return PagesService.getPages({ page: $modalCtrl.pager.page,
                                           pageSize: $modalCtrl.pager.itemsPerPage },
                                           filter);
         }
         //END - getPages

         //BEGIN - handleResult
         var __handleResult = function(result) {
            if(result.totalLength) {
               //page adjustment
               $modalCtrl.pager.page = result.page;
               $modalCtrl.pager.itemsPerPage = result.pageSize;
               $modalCtrl.pager.total = result.totalLength;
               $modalCtrl.pages = _setIds(result.pages);
            } else {
               $modalCtrl.notFoundMessage = messages.bannerNewsNotFound;
            }
         }
         //END - handleResult

         if(Utils.isMongoId($modalCtrl.keywords)) {
            //if the keywords is just one token
            __getPages({ id: $modalCtrl.keywords }) //try searching by id
               .then(function(result) {
                     //result of the search by id
                     __handleResult(result);
               }).catch(function(error) {
                  $modalCtrl.loading = false;
                  $modalCtrl.errorMessage = error.message;
                  console.log(error);
               });
         } else {
            __getPages({ keywords: $modalCtrl.keywords })
               .then(function(result) {
                  __handleResult(result);
                  $modalCtrl.loading = false;
               }).catch(function(error) {
                  $modalCtrl.loading = false;
                  $modalCtrl.errorMessage = error.message;
                  console.log(error);
               });
         }
      }

      $modalCtrl.pageUrlBase = settings.Pages.pageUrlBase;
      $modalCtrl.pager = {
         page: 1,
         itemsPerPage: 4,
         total: -1
      }
      $modalCtrl.loading = false;
      _update();

      $modalCtrl.selectPage = function(page) {
         $modalCtrl.selectedPage = page;
         $modalCtrl.infoMessage = _templateMessage( messages.bannerPageSelected,
                                                    { pageTitle: page.title });
      }

      $modalCtrl.searchPrev = function() {
         if($modalCtrl.pages && $modalCtrl.pages.length > 0 && $modalCtrl.pager.page > 1) {
            $modalCtrl.pager.page--;
            _update();
         }
      }

      $modalCtrl.searchNext = function() {
         if($modalCtrl.pages && $modalCtrl.pages.length > 0 && $modalCtrl.pager.page * $modalCtrl.pager.itemsPerPage < $modalCtrl.pager.total) {
            $modalCtrl.pager.page++;
            _update();
         }
      }

      $modalCtrl.search = function() {
         _clear();
         _update();
      }

      $modalCtrl.ok = function() {
         $uibModalInstance.close($modalCtrl.selectedPage);
      };

      $modalCtrl.close = function() {
         $uibModalInstance.dismiss('cancel');
      }

   }
})();
