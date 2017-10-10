(function() {
"use strict";

   //register the service as SidebarMenuServiceReal,
   //because the SidebarMenuService name will be used for the provider
   angular.module('SiteCamaraAdminApp').service('SidebarMenuServiceReal', SidebarMenuService);

   SidebarMenuService.$inject = [];
   function SidebarMenuService() {
      var sidebarMenuService = this;

      sidebarMenuService.getItems = function() {
         return {
                  menuItems :
                  [{
                     title: 'Dashboard - Not Mock',
                     sref: 'dashboard',
                     icon: 'icon-home',
                     hasChild: false
                   },
                   {
                      icon: 'icon-settings',
                      title: 'AngularJS Features',
                      hasChild: true,
                      menuItems:
                         [ {
                              title: 'UI Bootstrap',
                              icon: 'icon-home',
                              sref: 'uibootstrap',
                              hasChild: false
                            },
                            {
                              title: 'UI Bootstrap',
                              icon: 'icon-puzzle',
                              sref: 'fileupload',
                              hasChild: false
                            },
                            {
                              title: 'File Upload',
                              icon: 'icon-paper-clip',
                              sref: 'uiselect',
                              hasChild: false
                            }
                          ]
                   },
                   {
                      icon: 'icon-wrench',
                      title: 'jQuery Plugins',
                      hasChild: true,
                      menuItems:
                           [{
                              title: 'Form Tools',
                              icon: 'icon-puzzle',
                              sref: 'formtools',
                              hasChild: false
                            },
                            {
                              title: 'Date & Time Pickers',
                              icon: 'icon-calendar',
                              sref: 'pickers',
                              hasChild: false
                            },
                            {
                              title: 'Custom Dropdowns',
                              icon: 'icon-refresh',
                              sref: 'dropdowns',
                              hasChild: false
                            },
                            {
                              title: 'Tree View',
                              icon: 'icon-share',
                              sref: 'tree',
                              hasChild: false
                            },
                            {
                              icon: 'icon-briefcase',
                              title: 'Datatables',
                              hasChild: true,
                              menuItems:
                                [{
                                   title: 'Managed Datatables',
                                   icon: 'icon-tag',
                                   sref: 'datatablesmanaged',
                                   hasChild: false
                                 },
                                 {
                                   title: 'Ajax Datatables',
                                   icon: 'icon-refresh',
                                   sref: 'datatablesajax',
                                   hasChild: false
                                 }]
                            }]
                   },
                   {
                       title: 'User Profile',
                        icon: 'icon-user',
                        sref: 'profile.dashboard',
                        hasChild: false
                   },
                   {
                       title: 'Task & Todo',
                        icon: 'icon-check',
                        sref: 'todo',
                        hasChild: false
                   },
                   {
                       title: 'Blank Page',
                        icon: 'icon-refresh',
                        sref: 'todo',
                        hasChild: false
                   }]
                };
      }
   }
})();
