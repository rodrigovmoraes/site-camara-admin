var SiteCamaraAdmin = {}; //used to hang global stuffs, like util functions

(function() {
"use strict";

/***
SiteCamaraAdmin App Main Script
***/

/* SiteCamaraAdminApp App */
var SiteCamaraAdminApp = angular.module("SiteCamaraAdminApp", [
    "ui.router",
    "ui.bootstrap",
    "oc.lazyLoad",
    "ngSanitize",
    "ui.grid",
    "ui.grid.pagination",
    "ui.select",
    "validation.match",
    "ui.validate",
    "toggle-switch",
    "ui.tree",
    "ui.grid.autoResize"
]);

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
SiteCamaraAdminApp.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
    });
}]);

//AngularJS v1.3.x workaround for old style controller declarition in HTML
SiteCamaraAdminApp.config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  $controllerProvider.allowGlobals();
}]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/

/***
Layout Partials.
By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial
initialization can be disabled and Layout.init() should be called on page load complete as explained above.
***/

/* Setup Rounting For All Pages */
SiteCamaraAdminApp.config([ '$stateProvider',
                            '$urlRouterProvider',
                            'SidebarMenuServiceProvider',
                            'AuthenticationServiceProvider',
                            'HttpDispatcherServiceProvider',
                            function( $stateProvider,
                                      $urlRouterProvider,
                                      SidebarMenuServiceProvider,
                                      AuthenticationServiceProvider,
                                      HttpDispatcherServiceProvider ) {
    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/dashboard.html");

    $stateProvider

         // Login
         .state('login', {
           url: "/login.html",
           params: {
             page: null,
             errorMessage: null
           },
           templateUrl: "views/login.html",
           controller: "LoginController",
           controllerAs: 'loginCtrl',
           resolve: {
               deps: ['$ocLazyLoad', function($ocLazyLoad) {
                   return $ocLazyLoad.load({
                       name: 'SiteCamaraAdminApp',
                       insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                       files: [
                           'css/camara/login.css',
                           '../assets/pages/css/login.min.css',
                           'js/camara/controllers/LoginController.js',
                           'js/camara/controllers/LoginModalInstanceCtrl.js'
                       ]
                   });
               }]
           }
         })
         //Logout
         .state('logout', {
            url: "/logout.html",
            onEnter: function() {
               //do something
            },
            controller: "LogoutController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SiteCamaraAdminApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'js/camara/controllers/LogoutController.js'
                        ]
                    });
                }]
            }
        })
        //Users management page
        .state('users', {
           url: "/users.html",
           templateUrl: "views/users.html",
           data: {pageTitle: 'Gerenciamento de Usuários'},
           controller: "UsersController as $ctrl",
           resolve: {
               deps: ['$ocLazyLoad', function($ocLazyLoad) {
                   return $ocLazyLoad.load({
                       name: 'SiteCamaraAdminApp',
                       insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                       files: [
                           'js/camara/directives/CamaraGridDateFilter.js',
                           'js/camara/controllers/UsersController.js',
                           'js/camara/controllers/NewUserModalInstanceController.js',
                           'js/camara/controllers/EditUserModalInstanceController.js'
                       ]
                   });
               }]
           }
        })
        .state('userGroups', {
           url: "/groupusers.html",
           templateUrl: "views/groupusers.html",
           data: {pageTitle: 'Gerenciamento de Grupos de Usuários'},
           controller: "UserGroupsController as $ctrl",
           resolve: {
               deps: ['$ocLazyLoad', function($ocLazyLoad) {
                   return $ocLazyLoad.load( {
                       name: 'SiteCamaraAdminApp',
                       insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                       files: [
                          'js/camara/controllers/UserGroupsController.js',
                          'js/camara/controllers/NewSubgroupModalInstanceController.js',
                          'js/camara/controllers/AddRoleToGroupModalInstanceController.js',
                          'js/camara/controllers/ShowUsersInTheGroupModalInstanceController.js',
                          'js/camara/controllers/NewRootGroupModalInstanceController.js',
                          'js/camara/controllers/EditGroupNameModalInstanceController.js',
                          'js/camara/controllers/ConfirmModalInstanceController.js'
                       ]
                   });
               }]
           }
        })
        // Dashboard
        .state('dashboard', {
            url: "/dashboard.html",
            templateUrl: "views/dashboard.html",
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "DashboardController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SiteCamaraAdminApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',
                            '../assets/global/plugins/jquery.sparkline.min.js',
                            '../assets/pages/scripts/dashboard.min.js',
                            'js/metronic/controllers/toberemoved/DashboardController.js',
                        ]
                    });
                }]
            }
        })
        // test role
        .state('testsecurity', {
            url: "/testsecurity",
            templateUrl: "views/testsecurity.html",
            data: {pageTitle: 'Test testsecurity'},
            controller: "TestSecurityController as $ctrl",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SiteCamaraAdminApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                           'js/camara/controllers/TestSecurityController.js'
                        ]
                    });
                }]
            }
        })

        // Blank Page
        .state('blank', {
            url: "/blank",
            templateUrl: "views/blank.html",
            data: {pageTitle: 'Blank Page Template'},
            controller: "BlankController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SiteCamaraAdminApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'js/metronic/controllers/toberemoved/BlankController.js'
                        ]
                    });
                }]
            }
        })

        // AngularJS plugins
        .state('fileupload', {
            url: "/file_upload.html",
            templateUrl: "views/file_upload.html",
            data: {pageTitle: 'AngularJS File Upload'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'angularFileUpload',
                        files: [
                            '../assets/global/plugins/angularjs/plugins/angular-file-upload/angular-file-upload.min.js',
                        ]
                    }, {
                        name: 'SiteCamaraAdminApp',
                        files: [
                            'js/metronic/controllers/toberemoved/GeneralPageController.js'
                        ]
                    }]);
                }]
            }
        })

        // UI Select
        .state('uiselect', {
            url: "/ui_select.html",
            templateUrl: "views/ui_select.html",
            data: {pageTitle: 'AngularJS Ui Select'},
            controller: "UISelectController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'ui.select',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                            '../assets/global/plugins/angularjs/plugins/ui-select/select.min.js'
                        ]
                    }, {
                        name: 'SiteCamaraAdminApp',
                        files: [
                            'js/metronic/controllers/toberemoved/UISelectController.js'
                        ]
                    }]);
                }]
            }
        })

        // UI Bootstrap
        .state('uibootstrap', {
            url: "/ui_bootstrap.html",
            templateUrl: "views/ui_bootstrap.html",
            data: {pageTitle: 'AngularJS UI Bootstrap'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'SiteCamaraAdminApp',
                        files: [
                            'js/metronic/controllers/toberemoved/GeneralPageController.js'
                        ]
                    }]);
                }]
            }
        })

        // Tree View
        .state('tree', {
            url: "/tree",
            templateUrl: "views/tree.html",
            data: {pageTitle: 'jQuery Tree View'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'SiteCamaraAdminApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/jstree/dist/themes/default/style.min.css',

                            '../assets/global/plugins/jstree/dist/jstree.min.js',
                            '../assets/pages/scripts/ui-tree.min.js',
                            'js/metronic/controllers/toberemoved/GeneralPageController.js'
                        ]
                    }]);
                }]
            }
        })

        // Form Tools
        .state('formtools', {
            url: "/form-tools",
            templateUrl: "views/form_tools.html",
            data: {pageTitle: 'Form Tools'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'SiteCamaraAdminApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            '../assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                            '../assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                            '../assets/global/plugins/typeahead/typeahead.css',

                            '../assets/global/plugins/fuelux/js/spinner.min.js',
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                            '../assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                            '../assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                            '../assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                            '../assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                            '../assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                            '../assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                            '../assets/global/plugins/typeahead/handlebars.min.js',
                            '../assets/global/plugins/typeahead/typeahead.bundle.min.js',
                            '../assets/pages/scripts/components-form-tools-2.min.js',

                            'js/metronic/controllers/toberemoved/GeneralPageController.js'
                        ]
                    }]);
                }]
            }
        })

        // Date & Time Pickers
        .state('pickers', {
            url: "/pickers",
            templateUrl: "views/pickers.html",
            data: {pageTitle: 'Date & Time Pickers'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'SiteCamaraAdminApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/clockface/css/clockface.css',
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            '../assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                            '../assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                            '../assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',

                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                            '../assets/global/plugins/clockface/js/clockface.js',
                            '../assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                            '../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',

                            '../assets/pages/scripts/components-date-time-pickers.min.js',

                            'js/metronic/controllers/toberemoved/GeneralPageController.js'
                        ]
                    }]);
                }]
            }
        })

        // Custom Dropdowns
        .state('dropdowns', {
            url: "/dropdowns",
            templateUrl: "views/dropdowns.html",
            data: {pageTitle: 'Custom Dropdowns'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'SiteCamaraAdminApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                            '../assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                            '../assets/global/plugins/select2/js/select2.full.min.js',

                            '../assets/pages/scripts/components-bootstrap-select.min.js',
                            '../assets/pages/scripts/components-select2.min.js',

                            'js/metronic/controllers/toberemoved/GeneralPageController.js'
                        ]
                    }]);
                }]
            }
        })

        // Advanced Datatables
        .state('datatablesmanaged', {
            url: "/datatables/managed.html",
            templateUrl: "views/datatables/managed.html",
            data: {pageTitle: 'Advanced Datatables'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SiteCamaraAdminApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',

                            '../assets/global/plugins/datatables/datatables.all.min.js',

                            '../assets/pages/scripts/table-datatables-managed.min.js',

                            'js/metronic/controllers/toberemoved/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })

        // Ajax Datetables
        .state('datatablesajax', {
            url: "/datatables/ajax.html",
            templateUrl: "views/datatables/ajax.html",
            data: {pageTitle: 'Ajax Datatables'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SiteCamaraAdminApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',

                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/global/scripts/datatable.js',

                            'js/metronic/table-ajax.js',
                            'js/metronic/controllers/toberemoved/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })

        // User Profile
        .state("profile", {
            url: "/profile",
            templateUrl: "views/profile/main.html",
            data: {pageTitle: 'User Profile'},
            controller: "UserProfileController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SiteCamaraAdminApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            '../assets/pages/css/profile.css',

                            '../assets/global/plugins/jquery.sparkline.min.js',
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',

                            '../assets/pages/scripts/profile.min.js',

                            'js/metronic/controllers/toberemoved/UserProfileController.js'
                        ]
                    });
                }]
            }
        })

        // User Profile Dashboard
        .state("profile.dashboard", {
            url: "/dashboard",
            templateUrl: "views/profile/dashboard.html",
            data: {pageTitle: 'User Profile'}
        })

        // User Profile Account
        .state("profile.account", {
            url: "/account",
            templateUrl: "views/profile/account.html",
            data: {pageTitle: 'User Account'}
        })

        // User Profile Help
        .state("profile.help", {
            url: "/help",
            templateUrl: "views/profile/help.html",
            data: {pageTitle: 'User Help'}
        })

        // Todo
        .state('todo', {
            url: "/todo",
            templateUrl: "views/todo.html",
            data: {pageTitle: 'Todo'},
            controller: "TodoController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SiteCamaraAdminApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            '../assets/apps/css/todo-2.css',
                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                            '../assets/global/plugins/select2/js/select2.full.min.js',

                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',

                            '../assets/apps/scripts/todo-2.min.js',

                            'js/metronic/controllers/toberemoved/TodoController.js'
                        ]
                    });
                }]
            }
        });
}]);

/* Init global settings and run the app */
SiteCamaraAdminApp.run(["$rootScope",
                        "settings",
                        "$state",
                        "AuthenticationService",
                        function($rootScope,
                                 settings,
                                 $state,
                                 AuthenticationService) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = settings; // state to be accessed from view
    //capture state changes in order to handle security issues
    $rootScope.$on('$stateChangeStart', function(evt, toState, toParams, fromState, fromParams) {
        //check that the user is logged and he has access to the state page
        if ( toState.name !== "login" &&
             toState.name !== "logout" &&
             !AuthenticationService.checkAccess(toState.name) ) {
            //if not, invalidate the authentication that was already obtained
            //and redirect him to login page
            AuthenticationService.logout();
            evt.preventDefault();
            $state.go('login', { 'page': toState.name }, { reload: true });
        } else {
           //if it has access to the state page, then
           //allow the page flow and revalidate the session
           AuthenticationService.revalidateSession();
        }
   });
}]);

})();
