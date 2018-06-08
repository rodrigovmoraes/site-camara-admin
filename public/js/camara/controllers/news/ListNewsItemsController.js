(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').controller('ListNewsItemsController', ListNewsItemsController);

   ListNewsItemsController.$inject = [ '$scope', 'messages',
                                       'Utils', '$stateParams',
                                       'NewsService', 'settings' ];
   function ListNewsItemsController( $scope, messages,
                                     Utils, $stateParams,
                                     NewsService, settings ) {
      var $listNewsItemsCtrl = this;

      //messages control
      Utils.applyMessageControls($listNewsItemsCtrl);

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      var _updateNewsList = function() {
         var paginationOptions = {
            page: $listNewsItemsCtrl.pager.currentPage,
            pageSize: $listNewsItemsCtrl.pager.itemsPerPage
         };
         var date1 = $listNewsItemsCtrl.filter.date1 ? $listNewsItemsCtrl.filter.date1 : null;
         var date2 = $listNewsItemsCtrl.filter.date2 ? $listNewsItemsCtrl.filter.date2 : null;
         if(date1) {
            date1.setMilliseconds(0);
            date1.setSeconds(0);
            date1.setMinutes(0);
            date1.setHours(0);
         }
         if(date2) {
            date2.setMilliseconds(999);
            date2.setSeconds(59);
            date2.setMinutes(59);
            date2.setHours(23);
         }
         var filterOptions = {
            'keywords': $listNewsItemsCtrl.filter.keywords ? $listNewsItemsCtrl.filter.keywords : null,
            'date1': date1,
            'date2': date2,
            'publication' : $listNewsItemsCtrl.filter.publication
         };
         if($listNewsItemsCtrl.filter.id) {
            filterOptions.id = $listNewsItemsCtrl.filter.id;
            $listNewsItemsCtrl.filter.id = null; //reset this filter id
         }
         return NewsService.getNews(paginationOptions, filterOptions).then(function(result) {
            $listNewsItemsCtrl.news = result.news;
            $listNewsItemsCtrl.pager.totalItems = result.totalLength;
            $listNewsItemsCtrl.pager.currentPage = result.page;
            $listNewsItemsCtrl.pager.totalPages = Math.ceil(result.totalLength / $listNewsItemsCtrl.pager.itemsPerPage);
            $listNewsItemsCtrl.errorMessage = "";
         });
      }

      //messages
      $listNewsItemsCtrl.errorMessage = $stateParams.errorMessage;
      $listNewsItemsCtrl.infoMessage = $stateParams.infoMessage;
      $listNewsItemsCtrl.notFoundMessage = messages.newsNotFound;
      $listNewsItemsCtrl.thumbnailHeight = Math.ceil(settings.News.thumbnail.height/ 4.7);
      $listNewsItemsCtrl.thumbnailWidth = Math.ceil(settings.News.thumbnail.width / 4.7);
      $listNewsItemsCtrl.highlightNewsItemId = NewsService.getHighlightNewsItemId();
      NewsService.clearHighlightNewsItemId();

      //pager setup
      $listNewsItemsCtrl.pager = NewsService.getPaginationOptions();

      $listNewsItemsCtrl.pager.pageChanged = function() {
          //update
          $listNewsItemsCtrl.clearMessage();
          _updateNewsList().catch(function(error) {
            $listNewsItemsCtrl.errorMessage = error.message;
          });
      }
      //filter setup
      $listNewsItemsCtrl.filter = NewsService.getFilterOptions();

      //initial load of the news
      _updateNewsList();

      //filter update
      //keywords
      $scope.$watch("$listNewsItemsCtrl.filter.keywords", function (newValue, oldValue) {
         //keywords updated
         if(newValue != oldValue) {
            $listNewsItemsCtrl.clearMessage();
            _updateNewsList().catch(function (error) {
               $listNewsItemsCtrl.errorMessage = error.message;
            });
         }
      });
      //publication date, begin
      $scope.$watch("$listNewsItemsCtrl.filter.date1", function (newValue, oldValue) {
         //keywords updated
         if(newValue != oldValue) {
            $listNewsItemsCtrl.clearMessage();
            _updateNewsList().catch(function (error) {
               $listNewsItemsCtrl.errorMessage = error.message;
            });
         }
      });

      //publication date, end
      $scope.$watch("$listNewsItemsCtrl.filter.date2", function (newValue, oldValue) {
         //keywords updated
         if(newValue != oldValue) {
            $listNewsItemsCtrl.clearMessage();
            _updateNewsList().catch(function(error) {
               $listNewsItemsCtrl.errorMessage = error.message;
            });
         }
      });

      //publication type
      $listNewsItemsCtrl.returnAllNews = function () {
         $listNewsItemsCtrl.clearMessage();
         $listNewsItemsCtrl.filter.publication = "ALL";
         $listNewsItemsCtrl.filter.publicationDescription = messages.newsFilterPublicationTypeALL;
         _updateNewsList().catch(function(error) {
            $listNewsItemsCtrl.errorMessage = error.message;
         });
      }

      $listNewsItemsCtrl.returnNewsAlreadyPublished = function () {
         $listNewsItemsCtrl.clearMessage();
         $listNewsItemsCtrl.filter.publication = "PUBLISHED";
         $listNewsItemsCtrl.filter.publicationDescription = messages.newsFilterPublicationTypePUBLISHED;
         _updateNewsList().catch(function(error) {
            $listNewsItemsCtrl.errorMessage = error.message;
         });
      }

      $listNewsItemsCtrl.returnNewsToBePublished = function () {
         $listNewsItemsCtrl.clearMessage();
         $listNewsItemsCtrl.filter.publication = "TO_BE_PUBLISHED";
         $listNewsItemsCtrl.filter.publicationDescription = messages.newsFilterPublicationTypeTO_BE_PUBLISHED;
         _updateNewsList().catch(function(error) {
            $listNewsItemsCtrl.errorMessage = error.message;
         });
      }

      $listNewsItemsCtrl.returnNewsNotToBePublished = function () {
         $listNewsItemsCtrl.clearMessage();
         $listNewsItemsCtrl.filter.publication = "NOT_TO_BE_PUBLISHED";
         $listNewsItemsCtrl.filter.publicationDescription = messages.newsFilterPublicationTypeNOT_TO_BE_PUBLISHED;
         _updateNewsList().catch(function(error) {
            $listNewsItemsCtrl.errorMessage = error.message;
         });
      }
   }
})();
