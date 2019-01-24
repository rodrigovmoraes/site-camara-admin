(function() {
   'use strict';

   angular.module('SiteCamaraAdminApp').controller('SelectNewsItemModalInstanceController', SelectNewsItemModalInstanceController);

   SelectNewsItemModalInstanceController.$inject = [ '$scope', 'Utils',
                                                     'settings', 'messages',
                                                     '$uibModalInstance', 'NewsService']
   function SelectNewsItemModalInstanceController( $scope, Utils,
                                                   settings, messages,
                                                   $uibModalInstance, NewsService ) {
      var $modalCtrl = this;

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      var _clear = function() {
         $modalCtrl.pager.page = 1;
         $modalCtrl.pager.total = 0;
         $modalCtrl.news = null;
         $modalCtrl.notFoundMessage = null;
         $modalCtrl.infoMessage = null;
         $modalCtrl.errorMessage = null;
      }

      var _update = function() {
         $modalCtrl.loading = true;
         NewsService.getNews({ page: $modalCtrl.pager.page,
                               pageSize: $modalCtrl.pager.itemsPerPage },
                             { keywords: $modalCtrl.keywords, publication: "PUBLISHED" })
                    .then(function(result) {
            if(result.totalLength) {

               //page adjustment
               $modalCtrl.pager.page = result.page;
               $modalCtrl.pager.itemsPerPage = result.pageSize;
               $modalCtrl.pager.total = result.totalLength;
               $modalCtrl.news = result.news;
            } else {
               $modalCtrl.notFoundMessage = messages.bannerNewsNotFound;
            }
            $modalCtrl.loading = false;
         }).catch(function(error) {
            $modalCtrl.loading = false;
            $modalCtrl.errorMessage = error.message;
            console.log(error);
         });
      }

      $modalCtrl.newsUrlBase = settings.News.newsUrlBase;
      $modalCtrl.pager = {
         page: 1,
         itemsPerPage: 4,
         total: -1
      }
      $modalCtrl.loading = false;
      _update();

      $modalCtrl.selectNewsItem = function(newsItem) {
         $modalCtrl.selectedNewsItem = newsItem;
         $modalCtrl.infoMessage = _templateMessage( messages.bannerNewsItemSelected,
                                                    { newsItemTitle: newsItem.title });
      }

      $modalCtrl.searchPrev = function() {
         if($modalCtrl.news && $modalCtrl.news.length > 0 && $modalCtrl.pager.page > 1) {
            $modalCtrl.pager.page--;
            _update();
         }
      }

      $modalCtrl.searchNext = function() {
         if($modalCtrl.news && $modalCtrl.news.length > 0 && $modalCtrl.pager.page * $modalCtrl.pager.itemsPerPage < $modalCtrl.pager.total) {
            $modalCtrl.pager.page++;
            _update();
         }
      }

      $modalCtrl.search = function() {
         _clear();
         _update();
      }

      $modalCtrl.ok = function() {
         $uibModalInstance.close($modalCtrl.selectedNewsItem);
      };

      $modalCtrl.close = function() {
         $uibModalInstance.dismiss('cancel');
      }

   }
})();
