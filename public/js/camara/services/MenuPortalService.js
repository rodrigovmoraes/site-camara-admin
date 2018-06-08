(function() {
"use strict";

   //register the service as SidebarMenuServiceReal,
   //because the SidebarMenuService name will be used for the provider
   angular.module('SiteCamaraAdminApp').service('MenuPortalService', MenuPortalService);

   MenuPortalService.$inject = ['HttpDispatcherService'];
   function MenuPortalService(HttpDispatcherService) {
      var menuPortalService = this;

      menuPortalService.getMenuPortalTree = function() {
         return HttpDispatcherService.get('/menuPortalTree').then(function(result) {
                                            return result.data;
                                         }).catch(function(error) {
                                            throw error
                                         });
      }

      menuPortalService.saveMenuItem = function(menuItem) {
         return HttpDispatcherService.post( '/menuItemPortal',
                                            { 'menuItem':  menuItem }
                                          ).then(function(result) {
                                             return result.data;
                                          }).catch(function(error) {
                                             throw error
                                          });
      }

      menuPortalService.newMenuItem = function(menuItem) {
         return HttpDispatcherService.put( '/menuItemPortal',
                                           { 'menuItem':  menuItem }
                                         ).then(function(result) {
                                           return result.data;
                                         }).catch(function(error) {
                                           throw error
                                         });
      }

      menuPortalService.deleteDeeplyMenuItem = function(menutItemId) {
         return HttpDispatcherService.delete( '/menuItemPortal/deeply/' + menutItemId )
                                     .then( function(result) {
                                              return result.data;
                                          }).catch(function(error) {
                                              throw error
                                          });
      }

      menuPortalService.updateMenuItemsOrders = function(menuItemsOrders) {
         return HttpDispatcherService.post( '/menuItemPortal/updateOrders',
                                            { 'menuItemsOrders':  menuItemsOrders }
                                          )
                                     .then( function(result) {
                                              return result.data;
                                          }).catch(function(error) {
                                              throw error
                                          });
      }

      var _groupsToggleStatus = {};
      menuPortalService.saveGroupsToggleStatus = function(groupsToggleStatus) {
         _groupsToggleStatus = groupsToggleStatus;
      }

      menuPortalService.getGroupsToggleStatus = function() {
         return _groupsToggleStatus;
      }

   }
})();
