(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').factory('ImageProcessingSocketIO', ImageProcessingSocketIOFactory);

   ImageProcessingSocketIOFactory.$inject = [ 'socketFactory', 'settings'];
   function ImageProcessingSocketIOFactory( socketFactory, settings ) {
      var imageProcessingIOSocket = io(settings.baseUrlSiteCamaraApi + "/image-processing");

      var imageProcessingSocket = socketFactory({
         ioSocket: imageProcessingIOSocket
      });

     return imageProcessingSocket;
   }
})();
