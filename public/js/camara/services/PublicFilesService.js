(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').service('PublicFilesService', PublicFilesService);

   PublicFilesService.$inject = [ 'HttpDispatcherService', 'settings',
                                  'FileUploader', 'uuid',
                                  'AuthenticationService', '$q'
                                   ];
   function PublicFilesService( HttpDispatcherService, settings,
                                FileUploader, uuid,
                                AuthenticationService, $q
                              ) {
      var publicFilesService = this;

      publicFilesService.getFolderContents = function (folderId) {
         return HttpDispatcherService.get(
                                          '/publicFiles/folder' + ( folderId ? '/' + folderId : '' )
                                      ).then(function(result) {
                                        return result.data;
                                     }).catch(function(error) {
                                        throw error
                                     });
      };

      publicFilesService.getFolderPath = function (folderId) {
         return HttpDispatcherService.get(
                                          '/publicFiles/folderPath/' + folderId
                                      ).then(function(result) {
                                        return result.data;
                                     }).catch(function(error) {
                                        throw error
                                     });
      };

      publicFilesService.moveFolderUp = function (folderId) {
         return HttpDispatcherService.get(
                                          '/publicFiles/moveFolder/up/' + folderId
                                      ).then(function(result) {
                                        return result.data;
                                     }).catch(function(error) {
                                        throw error
                                     });
      };

      publicFilesService.moveFolderDown = function (folderId) {
         return HttpDispatcherService.get(
                                          '/publicFiles/moveFolder/down/' + folderId
                                      ).then(function(result) {
                                        return result.data;
                                     }).catch(function(error) {
                                        throw error
                                     });
      };

      publicFilesService.moveFileUp = function (fileId) {
         return HttpDispatcherService.get(
                                          '/publicFiles/moveFile/up/' + fileId
                                      ).then(function(result) {
                                        return result.data;
                                     }).catch(function(error) {
                                        throw error
                                     });
      };

      publicFilesService.moveFileDown = function (fileId) {
         return HttpDispatcherService.get(
                                          '/publicFiles/moveFile/down/' + fileId
                                      ).then(function(result) {
                                        return result.data;
                                     }).catch(function(error) {
                                        throw error
                                     });
      };

      publicFilesService.newFile = function (file) {
         return HttpDispatcherService.put('/publicFiles/file',
                                          { 'file':  file }
                                     ).then(function(result) {
                                         return result.data;
                                     }).catch(function(error) {
                                         throw error
                                     });
      }

      publicFilesService.newFolder = function (folder) {
         return HttpDispatcherService.put('/publicFiles/folder',
                                          { 'folder':  folder }
                                     ).then(function(result) {
                                         return result.data;
                                     }).catch(function(error) {
                                         throw error
                                     });
      }

      publicFilesService.editFolder = function (folder) {
         return HttpDispatcherService.post('/publicFiles/folder',
                                          { 'folder' : folder }
                                     ).then(function(result) {
                                         return result.data;
                                     }).catch(function(error) {
                                         throw error
                                     });
      }

      publicFilesService.removeRawFile = function (filePath) {
         return HttpDispatcherService.delete(
                                       '/publicFiles/file/raw',
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

      publicFilesService.removeFile = function (fileId) {
         return HttpDispatcherService.delete(
                                       '/publicFiles/file/' + fileId
                                     ).then(function(result) {
                                         return result.data;
                                     }).catch(function(error) {
                                         throw error
                                     });
      }

      publicFilesService.removeFolder = function (folderId) {
         return HttpDispatcherService.delete(
                                       '/publicFiles/folder/' + folderId
                                     ).then(function(result) {
                                         return result.data;
                                     }).catch(function(error) {
                                         throw error
                                     });
      }

      publicFilesService.getAmountOfObjectsInFolder = function (folderId) {
         return HttpDispatcherService
                .get('/publicFiles/folder/amountOfElements' + (folderId ? "/" + folderId : ""))
                .then(function(result) {
                   return result.data;
                }).catch(function(error) {
                   throw error
                });
      }

      publicFilesService.checkUniqueDescription = function (folderId, description) {
         var defer = $q.defer();
         HttpDispatcherService
         .get('/publicFiles/checkUniqueDescription/' + folderId, {
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

      publicFilesService.getFileUploader = function (folderId) {
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
             fileItem.url = settings.baseUrlSiteCamaraApi + '/publicFiles/file/upload/' + folderId + "/" + uuid.v4() + (extension !== "" ? "." + extension : "");
         };

         return uploader;
      };

      var _highlightObjectId = null;
      publicFilesService.getHighlightObjectId = function() {
         return _highlightObjectId;
      }

      publicFilesService.setHighlightObjectId = function(objectId) {
         _highlightObjectId = objectId;
      }
   }
})();
