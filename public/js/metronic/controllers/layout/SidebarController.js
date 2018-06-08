(function() {
"use strict";

      angular.module("SiteCamaraAdminApp").controller('SidebarController', SidebarController);

      /* Setup Layout Part - Sidebar */
      SidebarController.$inject = [ '$state',
                                    '$rootScope',
                                    'MenuAdminService',
                                    'AuthenticationService']
      function SidebarController( $state,
                                  $rootScope,
                                  MenuAdminService,
                                  AuthenticationService) {
          var sidebarController =  this;

          sidebarController.refresh = function() {
             return MenuAdminService.getUserMenuAdminTree().then(function(result) {
               var items = result.menuAdminTree;
               sidebarController.firsItem = items[0];
               sidebarController.items = items.slice(1);
            });
          }

          if(AuthenticationService.isLoggedIn()) {
             sidebarController.refresh();
          }

          $rootScope.$on('metronicReloadSidebar', function(event, args) {
              sidebarController.refresh();
          });

          sidebarController.finishLoading = function() {
             Layout.initSidebar($state); // init sidebar
          }
      }

})();
