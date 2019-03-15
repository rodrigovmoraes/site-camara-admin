(function() {
   'use strict';

   angular.module('SiteCamaraAdminApp').controller('SelectFlickrPhotoFroalaModalInstanceController', SelectFlickrPhotoFroalaModalInstanceController);

   SelectFlickrPhotoFroalaModalInstanceController.$inject = [ '$scope', 'Utils',
                                                              'settings', 'messages',
                                                              '$uibModalInstance', 'FlickrService']
   function SelectFlickrPhotoFroalaModalInstanceController( $scope, Utils,
                                                            settings, messages,
                                                            $uibModalInstance, FlickrService ) {
      var $modalCtrl = this;

      //messages control
      Utils.applyMessageControls($modalCtrl);

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      var _selectDefaultProfile = function(profiles) {
         if(profiles) {
            var i = 0;
            for (i = 0; i < profiles.length; i++) {
               if (profiles[i].default) {
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

      var _updatePhotos = function() {
         return FlickrService
                  .getPagePhotosFromSet( $modalCtrl.selectedProfile.userId,
                                         $modalCtrl.selectedPhotoset.id,
                                         'c',
                                         $modalCtrl.photosPager.page,
                                         $modalCtrl.photosPager.itemsPerPage)
                  .then(function(result) {
                     $modalCtrl.photos = result.flickrPhotosetPhotos;
                     $modalCtrl.photosPager.totalItems = result.total;
                     $modalCtrl.photosPager.currentPage = result.page;
                     $modalCtrl.photosPager.totalPages = result.pageCount;
                  });
      }

      $modalCtrl.PHOTOSET_MODE = 0;//first step, choose the photoset
      $modalCtrl.PHOTO_MODE = 1;//second step, choose the photo
      $modalCtrl.mode = $modalCtrl.PHOTOSET_MODE;
      $modalCtrl.profiles = settings.FlickrService.profiles;
      $modalCtrl.selectedProfile = _selectDefaultProfile($modalCtrl.profiles);
      $modalCtrl.flickrUrlBase = settings.FlickrService.visualizationBaseUrl;
      $modalCtrl.searchResult = null;
      $modalCtrl.pager = {
         page: 1,
         itemsPerPage: 3
      }
      //photos pagination control
      $modalCtrl.photosPager = {
         page: 1,
         itemsPerPage: 12,
         maxSize: 5
      }
      //handle: photos page changed
      $modalCtrl.photosPager.pageChanged = function() {
          //update
          $modalCtrl.clearMessage();
          _updatePhotos().catch(function(error) {
             $modalCtrl.errorMessage = error.message;
          });
      }

      $modalCtrl.loading = false;

      _update();

      $modalCtrl.selectProfile = function(profile) {
         $modalCtrl.selectedProfile = profile;
         $modalCtrl.pager.page = 1;
         _update().catch(function(error) {
            $modalCtrl.errorMessage = error.message;
         });
      }

      $modalCtrl.selectPhotoset = function(photoset) {
         $modalCtrl.selectedPhotoset = photoset;
         $modalCtrl.mode = $modalCtrl.PHOTO_MODE;
         _updatePhotos();
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

      $modalCtrl.backToAlbums = function() {
         $modalCtrl.mode = $modalCtrl.PHOTOSET_MODE;
      }

      $modalCtrl.selectPhoto = function(photo) {
         $uibModalInstance.close(photo);
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
             $modalCtrl.searchResult.entireResult )
         {
             var photosetsResult = [];
             var entireResult = $modalCtrl.searchResult.entireResult;
             var i = 0;
             for(i = 0; i < entireResult.length; i++) {
                var photoset = entireResult[i];
                //filter the photosets
                if ( ( photoset.title && photoset.title.toLowerCase().indexOf(newValue.toLowerCase() ) >= 0) ||
                     ( photoset.description && photoset.description.toLowerCase().indexOf(newValue.toLowerCase() ) >= 0 ) ||
                     ( Utils.hasJustOneToken(newValue) && photoset.id === newValue ) ) {
                    photosetsResult.push(photoset)
                }
             }
             $modalCtrl.searchResult.result = photosetsResult;
             _doPagination($modalCtrl.searchResult.result, $modalCtrl.pager);
         }
      });

   }
})();
