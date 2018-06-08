(function() {
"use strict";

   //register the service as SidebarMenuServiceReal,
   //because the SidebarMenuService name will be used for the provider
   angular.module('SiteCamaraAdminApp').service('MenuAdminService', MenuAdminService);

   MenuAdminService.$inject = ['HttpDispatcherService'];
   function MenuAdminService(HttpDispatcherService) {
      var menuAdminService = this;

      menuAdminService.getMenuAdminTree = function() {
         return HttpDispatcherService.get('/menuAdminTree').then(function(result) {
                                            return result.data;
                                         }).catch(function(error) {
                                            throw error
                                         });
      }

      menuAdminService.getUserMenuAdminTree = function() {
         return HttpDispatcherService.get('/userMenuAdminTree').then(function(result) {
                                            return result.data;
                                         }).catch(function(error) {
                                            throw error
                                         });
      }

      menuAdminService.saveMenuItem = function(menuItem) {
         return HttpDispatcherService.post( '/menuItemAdmin',
                                            { 'menuItem':  menuItem }
                                          ).then(function(result) {
                                             return result.data;
                                          }).catch(function(error) {
                                             throw error
                                          });
      }

      menuAdminService.newMenuItem = function(menuItem) {
         return HttpDispatcherService.put( '/menuItemAdmin',
                                           { 'menuItem':  menuItem }
                                         ).then(function(result) {
                                           return result.data;
                                         }).catch(function(error) {
                                           throw error
                                         });
      }

      menuAdminService.deleteDeeplyMenuItem = function(menutItemId) {
         return HttpDispatcherService.delete( '/menuItemAdmin/deeply/' + menutItemId )
                                     .then( function(result) {
                                              return result.data;
                                          }).catch(function(error) {
                                              throw error
                                          });
      }

      menuAdminService.updateMenuItemsOrders = function(menuItemsOrders) {
         return HttpDispatcherService.post( '/menuItemAdmin/updateOrders',
                                            { 'menuItemsOrders':  menuItemsOrders }
                                          )
                                     .then( function(result) {
                                              return result.data;
                                          }).catch(function(error) {
                                              throw error
                                          });
      }

      var _groupsToggleStatus = {};
      menuAdminService.saveGroupsToggleStatus = function(groupsToggleStatus) {
         _groupsToggleStatus = groupsToggleStatus;
      }

      menuAdminService.getGroupsToggleStatus = function() {
         return _groupsToggleStatus;
      }

   }
})();
