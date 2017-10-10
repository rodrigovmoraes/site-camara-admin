(function() {
"use strict";

      angular.module("SiteCamaraAdminApp").controller('SidebarController', SidebarController);

      /* Setup Layout Part - Sidebar */
      SidebarController.$inject = ['$state', 'SidebarMenuService']
      function SidebarController($state, SidebarMenuService) {
          var sidebarController =  this;
          var items = SidebarMenuService.getItems();

          sidebarController.firsItem = items.menuItems[0];
          sidebarController.items = items.menuItems.slice(1);
          sidebarController.finishLoading = function() {
            Layout.initSidebar($state); // init sidebar
          }
      }

})();
