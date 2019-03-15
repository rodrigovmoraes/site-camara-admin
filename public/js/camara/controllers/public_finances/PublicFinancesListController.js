(function() {
   'use strict';

   angular.module('SiteCamaraAdminApp').controller('PublicFinancesListController', PublicFinancesListController);

   PublicFinancesListController.$inject = [ '$scope', 'messages',
                                            'Utils', '$stateParams',
                                            'PublicFinancesService',
                                            'settings', 'objects',
                                            'folderPath', '$uibModal']
   function PublicFinancesListController( $scope, messages,
                                          Utils, $stateParams,
                                          PublicFinancesService,
                                          settings, objects,
                                          folderPath, $uibModal ) {
      var $publicFinancesListCtrl = this;

      //messages control
      Utils.applyMessageControls($publicFinancesListCtrl);

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      //refresh the content of the current folder
      var _refresh = function () {
         return PublicFinancesService
               .getFolderContents($stateParams.folderId)
               .then(function(result) {
                  $publicFinancesListCtrl.highlightObjectId = PublicFinancesService.getHighlightObjectId();
                  $publicFinancesListCtrl.objects = result.objects;
               });
      }

      //messages
      $publicFinancesListCtrl.errorMessage = $stateParams.errorMessage;
      $publicFinancesListCtrl.infoMessage = $stateParams.infoMessage;
      $publicFinancesListCtrl.notFoundMessage = messages.publicFinancesFolderEmpty;
      $publicFinancesListCtrl.objects = objects;
      $publicFinancesListCtrl.folderPath = folderPath;
      $publicFinancesListCtrl.highlightObjectId = null;
      $publicFinancesListCtrl.formatFileSize = function(size) {
         return Utils.formatFileSize(size);
      };
      $publicFinancesListCtrl.fileDownloadURL = settings.baseUrlSiteCamaraApi + settings.PublicFinances.fileDownloadPath;

      $publicFinancesListCtrl.openNewFolderModal = function() {
         $publicFinancesListCtrl.newFolderModalInstance = $uibModal.open({
           templateUrl: 'newFolder.html',
           animation: false,
           size: 'l',
           controller: 'NewFolderModalInstanceController',
           controllerAs: '$modalCtrl',
           scope: $scope,
           resolve: {
               params: {
                  'folderId': $stateParams.folderId
               }
           }
         });

         $publicFinancesListCtrl
            .newFolderModalInstance
            .result
            .then(function(folderItem) {
               PublicFinancesService.setHighlightObjectId(folderItem.id);
               $publicFinancesListCtrl.infoMessage = _templateMessage( messages.publicFinancesFolderCreated,
                                                                       { 'folderDescription': folderItem.description } );
               return _refresh();
            }).catch(function(error) {
               $publicFinancesListCtrl.errorMessage = error.message;
            });
      }

      $publicFinancesListCtrl.openUploadNewFileModal = function() {
         $publicFinancesListCtrl.uploadNewFileModalInstance = $uibModal.open({
           templateUrl: 'uploadNewFile.html',
           animation: false,
           size: 'lg',
           controller: 'UploadNewFileModalInstanceController',
           controllerAs: '$modalCtrl',
           scope: $scope,
           resolve: {
               params: {
                  'folderId': $stateParams.folderId
               }
           }
         });

         $publicFinancesListCtrl
            .uploadNewFileModalInstance
            .result
            .then(function(fileItem) {
               PublicFinancesService.setHighlightObjectId(fileItem.id);
               $publicFinancesListCtrl.infoMessage = _templateMessage( messages.publicFinancesFileCreated,
                                                                       { 'fileDescription': fileItem.description } );
               return _refresh();
            }).catch(function(error) {
               $publicFinancesListCtrl.errorMessage = error.message;
            });
      }

      $publicFinancesListCtrl.openChangeFolderDescriptionModal = function(folderItem) {
         $publicFinancesListCtrl.changeFolderDescriptionModalInstance = $uibModal.open({
           templateUrl: 'changeFolderDescription.html',
           animation: false,
           size: 'l',
           controller: 'ChangeFolderDescriptionModalInstanceController',
           controllerAs: '$modalCtrl',
           scope: $scope,
           resolve: {
               params: {
                  'folder': folderItem,
                  'parentFolderId': $stateParams.folderId
               }
           }
         });

         $publicFinancesListCtrl
            .changeFolderDescriptionModalInstance
            .result
            .then(function(folderItem) {
               PublicFinancesService.setHighlightObjectId(folderItem.id);
               $publicFinancesListCtrl.infoMessage = _templateMessage( messages.publicFinancesFolderCreated,
                                                                       { 'folderDescription': folderItem.description } );
               return _refresh();
            }).catch(function(error) {
               $publicFinancesListCtrl.errorMessage = error.message;
            });
      }

      $publicFinancesListCtrl.removeFile = function(fileItem) {
         $uibModal.open({
            templateUrl: 'tpl/camara/includes/confirm.html',
            animation: false,
            size: 'md',
            controller: 'ConfirmModalInstanceController',
            controllerAs: '$modalCtrl',
            scope: $scope,
            resolve: {
               texts: {
                  'message': _templateMessage( messages.publicFinancesFileRemoveDialogText,
                                               { 'fileDescription': fileItem.description } )
               }
            }
         }).result.then(function() {
            return PublicFinancesService
                   .removeFile(fileItem._id)
                   .then(function(result) {
                     PublicFinancesService.setHighlightObjectId(null);
                     $publicFinancesListCtrl.infoMessage = _templateMessage( messages.publicFinancesFileRemoved,
                                                                             { 'fileDescription': fileItem.description } )
                     return _refresh();
                  }).catch(function(error) {
                     $publicFinancesListCtrl.errorMessage = error.message;
                  });
         });

      }

      $publicFinancesListCtrl.removeFolder = function(folderItem) {
         PublicFinancesService
         .getAmountOfObjectsInFolder(folderItem._id)
         .then(function(result) {
            var amount = result.amount;

            if (amount > 0) {
               $uibModal.open({
                  templateUrl: 'tpl/camara/includes/message.html',
                  animation: false,
                  size: 'md',
                  controller: 'MessageModalInstanceController',
                  controllerAs: '$modalCtrl',
                  scope: $scope,
                  resolve: {
                     texts: {
                        'message': _templateMessage( messages.publicFinancesFolderNotEmptyToBeRemovedDialogText )
                     }
                  }
               });
            } else {
               $uibModal.open({
                  templateUrl: 'tpl/camara/includes/confirm.html',
                  animation: false,
                  size: 'md',
                  controller: 'ConfirmModalInstanceController',
                  controllerAs: '$modalCtrl',
                  scope: $scope,
                  resolve: {
                     texts: {
                        'message': _templateMessage( messages.publicFinancesFolderRemoveDialogText,
                                                     { 'folderDescription': folderItem.description } )
                     }
                  }
               }).result.then(function() {
                  return PublicFinancesService
                         .removeFolder(folderItem._id)
                         .then(function(result) {
                           PublicFinancesService.setHighlightObjectId(null);
                           $publicFinancesListCtrl.infoMessage = _templateMessage( messages.publicFinancesFolderRemoved,
                                                                                   { 'folderDescription': folderItem.description } )
                           return _refresh();
                        }).catch(function(error) {
                           $publicFinancesListCtrl.errorMessage = error.message;
                        });
               });
            }

         }).catch(function(error) {
            $publicFinancesListCtrl.errorMessage = error.message;
         });
      }



      $publicFinancesListCtrl.moveFolderUp = function(folderItem) {
         PublicFinancesService
         .moveFolderUp(folderItem._id)
         .then(function(result) {
            PublicFinancesService.setHighlightObjectId(folderItem._id);
            $publicFinancesListCtrl.infoMessage = _templateMessage( messages.publicFinancesFolderMovedUp,
                                                                    { 'folderDescription': folderItem.description } );
            return _refresh();
         }).catch(function(error) {
            $publicFinancesListCtrl.errorMessage = error.message;
         });
      }

      $publicFinancesListCtrl.moveFolderDown = function(folderItem) {
         PublicFinancesService
         .moveFolderDown(folderItem._id)
         .then(function(result) {
            PublicFinancesService.setHighlightObjectId(folderItem._id);
            $publicFinancesListCtrl.infoMessage = _templateMessage( messages.publicFinancesFolderMovedDown,
                                                                    { 'folderDescription': folderItem.description } );
            return _refresh();
         }).catch(function(error) {
            $publicFinancesListCtrl.errorMessage = error.message;
         });
      }

      $publicFinancesListCtrl.moveFileUp = function(fileItem) {
         PublicFinancesService
         .moveFileUp(fileItem._id)
         .then(function(result) {
            PublicFinancesService.setHighlightObjectId(fileItem._id);
            $publicFinancesListCtrl.infoMessage = _templateMessage( messages.publicFinancesFileMovedUp,
                                                                    { 'fileDescription': fileItem.description } );
            return _refresh();
         }).catch(function(error) {
            $publicFinancesListCtrl.errorMessage = error.message;
         });
      }

      $publicFinancesListCtrl.moveFileDown = function(fileItem) {
         PublicFinancesService
         .moveFileDown(fileItem._id)
         .then(function(result) {
            PublicFinancesService.setHighlightObjectId(fileItem._id);
            $publicFinancesListCtrl.infoMessage = _templateMessage( messages.publicFinancesFileMovedDown,
                                                                    { 'fileDescription': fileItem.description } );
            return _refresh();
         }).catch(function(error) {
            $publicFinancesListCtrl.errorMessage = error.message;
         });
      }

   }
})();
