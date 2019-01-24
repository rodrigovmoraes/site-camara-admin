(function() {
   'use strict';

   angular.module('SiteCamaraAdminApp').controller('SelectFlickrPhotosetModalInstanceController', SelectFlickrPhotosetModalInstanceController);

   SelectFlickrPhotosetModalInstanceController.$inject = [ '$scope', 'Utils',
                                                          'settings', 'messages',
                                                          '$uibModalInstance', 'FlickrService']
   function SelectFlickrPhotosetModalInstanceController( $scope, Utils,
                                                         settings, messages,
                                                         $uibModalInstance, FlickrService ) {
      var $modalCtrl = this;

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      var _selectDefaultProfile = function(profiles) {
         if(profiles) {
            var i = 0;
            for(i = 0; i < profiles.length; i++) {
               if(profiles[i].default) {
                  return profiles[i];
               }
            }
         } else {
            return null;
         }
      }

      var _getPage = function(result, pager) {
         //adjust page
         var lPage = pager.page;
         if(lPage < 1) {
            lPage = 1;
         }
         if((lPage - 1) * pager.itemsPerPage >= result.length) {
            lPage = Math.ceil(result.length / pager.itemsPerPage);
         }
         pager.page = lPage;
         return result.slice( lPage * pager.itemsPerPage - pager.itemsPerPage,
                              lPage * pager.itemsPerPage <= result.length ? lPage * pager.itemsPerPage : result.length);
      }

      var _doPagination = function(result, pager) {
         $modalCtrl.photosets = _getPage( result, pager );
         if( !$modalCtrl.photosets ||
             $modalCtrl.photosets.length === 0) {
            $modalCtrl.notFoundMessage = messages.bannerFlickrPhotosetNotFound;
         } else {
            $modalCtrl.notFoundMessage = null;
         }
      }

      var _clear = function() {
         $modalCtrl.pager.page = 1;
         $modalCtrl.searchResult = null;
         $modalCtrl.photosets = null;
         $modalCtrl.keywords = null;
      }

      var _update = function() {
         $modalCtrl.loading = true;
         _clear();
         FlickrService.getPhotosets($modalCtrl.selectedProfile.userId)
                      .then(function(result) {
            //page adjustment
            var totalPages = Math.ceil(result.length / $modalCtrl.pager.itemsPerPage);
            if($modalCtrl.pager.page > totalPages) {
               $modalCtrl.pager.page = totalPages;
            }
            //buid the page
            _doPagination(result, $modalCtrl.pager);
            //set the result information
            $modalCtrl.searchResult = {
               'result': result,
               'entireResult' : result
            }
            $modalCtrl.loading = false;
         }).catch(function(error) {
            $modalCtrl.loading = false;
            $modalCtrl.errorMessage = error.message;
            console.log(error);
         });
      }

      $modalCtrl.profiles = settings.FlickrService.profiles;
      $modalCtrl.selectedProfile = _selectDefaultProfile($modalCtrl.profiles);
      $modalCtrl.flickrUrlBase = settings.FlickrService.visualizationBaseUrl;
      $modalCtrl.searchResult = null;
      $modalCtrl.pager = {
         page: 1,
         itemsPerPage: 4
      }
      $modalCtrl.loading = false;
      _update();

      $modalCtrl.selectProfile = function(profile) {
         $modalCtrl.selectedProfile = profile;
         $modalCtrl.pager.page = 1;
         _update();
      }

      $modalCtrl.selectPhotoset = function(photoset) {
         $modalCtrl.selectedPhotoset = photoset;
         $modalCtrl.infoMessage = _templateMessage( messages.bannerFlickrPhotosetSelected,
                                                    { photosetTitle: photoset.title });
      }

      $modalCtrl.searchPrev = function() {
         if($modalCtrl.searchResult && $modalCtrl.pager.page > 1) {
            $modalCtrl.pager.page--;
            _doPagination($modalCtrl.searchResult.result, $modalCtrl.pager);
         }
      }

      $modalCtrl.searchNext = function() {
         if($modalCtrl.searchResult && $modalCtrl.pager.page * $modalCtrl.pager.itemsPerPage < $modalCtrl.searchResult.result.length) {
            $modalCtrl.pager.page++;
            _doPagination($modalCtrl.searchResult.result, $modalCtrl.pager);
         }
      }

      $modalCtrl.ok = function() {
         $uibModalInstance.close($modalCtrl.selectedPhotoset);
      };

      $modalCtrl.close = function() {
         $uibModalInstance.dismiss('cancel');
      }

      //filter update
      //keywords
      $scope.$watch("$modalCtrl.keywords", function (newValue, oldValue) {
         //keywords updated
         if( newValue &&
             newValue != oldValue &&
             $modalCtrl.searchResult &&
             $modalCtrl.searchResult.entireResult)
         {
             var photosetsResult = [];
             var entireResult = $modalCtrl.searchResult.entireResult;
             var i = 0;
             for(i = 0; i < entireResult.length; i++) {
                var photoset = entireResult[i];
                //filter the photosets
                if( ( photoset.title && photoset.title.toLowerCase().indexOf(newValue.toLowerCase()) >= 0) ||
                    ( photoset.description && photoset.description.toLowerCase().indexOf(newValue.toLowerCase()) >= 0 ) ) {
                    photosetsResult.push(photoset)
                }
             }
             $modalCtrl.searchResult.result = photosetsResult;
             _doPagination($modalCtrl.searchResult.result, $modalCtrl.pager);
         }
      });

   }
})();
