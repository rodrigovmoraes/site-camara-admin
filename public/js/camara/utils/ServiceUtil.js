(function(){

   //used to register services with real and mock versions to angular
   function _createServiceProviderWithMock(providerInstance, serviceName) {
      providerInstance._useMock = false;

      providerInstance.useMock = function(value) {
         providerInstance._useMock = value;
      }

      providerInstance.$get = [ serviceName + "Mock",
                                serviceName + "Real",
                                function (serviceMock, serviceReal) {
                                    if(providerInstance._useMock) {
                                       return serviceMock;
                                    }else {
                                       return serviceReal;
                                    }
                              }];

   }

   return {
      createServiceProviderWithMock: _createServiceProviderWithMock
   }

})();
