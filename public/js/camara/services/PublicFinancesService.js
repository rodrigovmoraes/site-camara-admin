(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').service('PublicFinancesService', PublicFinancesService);

   PublicFinancesService.$inject = [ 'HttpDispatcherService', 'settings',
                                     'FileUploader', 'uuid',
                                     'AuthenticationService', '$q'
                                   ];
   function PublicFinancesService( HttpDispatcherService, settings,
                                   FileUploader, uuid,
                                   AuthenticationService, $q
                                 ) {
      var publicFinancesService = this;

      publicFinancesService.getFolderContents = function (folderId) {
         return HttpDispatcherService.get(
                                          '/publicFinances/folder' + ( folderId ? '/' + folderId : '' )
                                      ).then(function(result) {
                                        return result.data;
                                     }).catch(function(error) {
                                        throw error
                                     });
      };

      publicFinancesService.getFolderPath = function (folderId) {
         return HttpDispatcherService.get(
                                          '/publicFinances/folderPath/' + folderId
                                      ).then(function(result) {
                                        return result.data;
                                     }).catch(function(error) {
                                        throw error
                                     });
      };

      publicFinancesService.moveFolderUp = function (folderId) {
         return HttpDispatcherService.get(
                                          '/publicFinances/moveFolder/up/' + folderId
                                      ).then(function(result) {
                                        return result.data;
                                     }).catch(function(error) {
                                        throw error
                                     });
      };

      publicFinancesService.moveFolderDown = function (folderId) {
         return HttpDispatcherService.get(
                                          '/publicFinances/moveFolder/down/' + folderId
                                      ).then(function(result) {
                                        return result.data;
                                     }).catch(function(error) {
                                        throw error
                                     });
      };

      publicFinancesService.moveFileUp = function (fileId) {
         return HttpDispatcherService.get(
                                          '/publicFinances/moveFile/up/' + fileId
                                      ).then(function(result) {
                                        return result.data;
                                     }).catch(function(error) {
                                        throw error
                                     });
      };

      publicFinancesService.moveFileDown = function (fileId) {
         return HttpDispatcherService.get(
                                          '/publicFinances/moveFile/down/' + fileId
                                      ).then(function(result) {
                                        return result.data;
                                     }).catch(function(error) {
                                        throw error
                                     });
      };

      publicFinancesService.newFile = function (file) {
         return HttpDispatcherService.put('/publicFinances/file',
                                          { 'file':  file }
                                     ).then(function(result) {
                                         return result.data;
                                     }).catch(function(error) {
                                         throw error
                                     });
      }

      publicFinancesService.newFolder = function (folder) {
         return HttpDispatcherService.put('/publicFinances/folder',
                                          { 'folder':  folder }
                                     ).then(function(result) {
                                         return result.data;
                                     }).catch(function(error) {
                                         throw error
                                     });
      }

      publicFinancesService.editFolder = function (folder) {
         return HttpDispatcherService.post('/publicFinances/folder',
                                          { 'folder' : folder }
                                     ).then(function(result) {
                                         return result.data;
                                     }).catch(function(error) {
                                         throw error
                                     });
      }

      publicFinancesService.removeRawFile = function (filePath) {
         return HttpDispatcherService.delete(
                                       '/publicFinances/file/raw',
                                       {  params: {
                                            filePath: filePath
                                          }
                                       }
                                     ).then(function(result) {
                                         return result.data;
                                     }).catch(function(error) {
                                         throw error
                                     });
      }

      publicFinancesService.removeFile = function (fileId) {
         return HttpDispatcherService.delete(
                                       '/publicFinances/file/' + fileId
                                     ).then(function(result) {
                                         return result.data;
                                     }).catch(function(error) {
                                         throw error
                                     });
      }

      publicFinancesService.removeFolder = function (folderId) {
         return HttpDispatcherService.delete(
                                       '/publicFinances/folder/' + folderId
                                     ).then(function(result) {
                                         return result.data;
                                     }).catch(function(error) {
                                         throw error
                                     });
      }

      publicFinancesService.getAmountOfObjectsInFolder = function (folderId) {
         return HttpDispatcherService
                .get('/publicFinances/folder/amountOfElements' + (folderId ? "/" + folderId : ""))
                .then(function(result) {
                   return result.data;
                }).catch(function(error) {
                   throw error
                });
      }

      publicFinancesService.checkUniqueDescription = function (folderId, description) {
         var defer = $q.defer();
         HttpDispatcherService
         .get('/publicFinances/checkUniqueDescription/' + folderId, {
            params: {
               description: description
            }
         }).then(function(result) {
            var resultData = result.data;
            if(!resultData.exists) {
               defer.resolve(result.data)
            } else {
               defer.reject(result.data);
            }
         }).catch(function(error) {
            defer.reject(error);
         });
         return  defer.promise;
      }

      publicFinancesService.getFileUploader = function (folderId) {
         //new upload handler
         var uploader = new FileUploader({
              autoUpload: true,
              method: 'PUT',
              headers: {
                 Authorization: 'Bearer ' + AuthenticationService.getToken()
              }
         });
         //file name filter
         uploader.filters.push({
               name: 'imageFilter',
               fn: function(item /*{File|FileLikeObject}*/, options) {
                   var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                   return '|vnd.openxmlformats-officedocument.spreadsheetml.sheet|vnd.ms-excel|vnd.openxmlformats-officedocument.wordprocessingml.document|msword|pdf|plain|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
               }
         });
         //keep just the last element in the queue
         uploader.onAfterAddingFile = function(fileItem) {
             if(uploader.queue.length > 1) {
                //remove all elements in the queue except the last one
                uploader.queue.splice(0, uploader.queue.length - 1);
             }
             var fileNameParts = fileItem && fileItem.file && fileItem.file.name ? _.split(fileItem.file.name, '.') : [];
             var extension = "";
             if (fileNameParts.length > 1) {
                //append the extension file
                extension =  fileNameParts[fileNameParts.length - 1];
             }
             fileItem.url = settings.baseUrlSiteCamaraApi + '/publicFinances/file/upload/' + folderId + "/" + uuid.v4() + (extension !== "" ? "." + extension : "");
         };

         return uploader;
      };

      var _highlightObjectId = null;
      publicFinancesService.getHighlightObjectId = function() {
         return _highlightObjectId;
      }

      publicFinancesService.setHighlightObjectId = function(objectId) {
         _highlightObjectId = objectId;
      }
   }
})();
