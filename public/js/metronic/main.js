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
    "ui.grid.autoResize",
    "froala",
    "angularFileUpload",
    "angular-uuid",
    "btford.socket-io",
    "ui.calendar",
    "ngClipboard"
]);

//Froala config
SiteCamaraAdminApp.value('froalaConfig', {
        toolbarInline: false,
        placeholderText: 'Enter Text Here'
});

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
                            function( $stateProvider,
                                      $urlRouterProvider ) {
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
                       insertBefore: '#ng_load_plugins_before', // load the above css files
                                                                // before a LINK element with this ID.
                                                                // Dynamic CSS files must be loaded between
                                                                // core and theme css files
                       files: [
                           'css/camara/login.css',
                           '../assets/pages/css/login.min.css',
                           'js/camara/controllers/login/LoginController.js',
                           'js/camara/controllers/login/LoginModalInstanceCtrl.js'
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
                            'js/camara/controllers/login/LogoutController.js'
                        ]
                    });
                }]
            }
        })
        //Users management page
        .state('users', {
           url: "/users.html",
           templateUrl: "views/users.html",
           data: { pageTitle: 'Gerenciamento de Usuários' },
           controller: "UsersController as $ctrl",
           resolve: {
               deps: ['$ocLazyLoad', function($ocLazyLoad) {
                   return $ocLazyLoad.load( {
                       name: 'SiteCamaraAdminApp',
                       insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                       files: [
                           'js/camara/directives/CamaraGridDateFilter.js',
                           'js/camara/controllers/users/UsersController.js',
                           'js/camara/controllers/users/NewUserModalInstanceController.js',
                           'js/camara/controllers/users/EditUserModalInstanceController.js'
                       ]
                   });
               }]
           }
        })
        //User groups management page
        .state('userGroups', {
           url: "/group_users.html",
           templateUrl: "views/group_users.html",
           data: { pageTitle: 'Gerenciamento de Grupos de Usuários' },
           controller: "UserGroupsController as $ctrl",
           resolve: {
               deps: ['$ocLazyLoad', function($ocLazyLoad) {
                   return $ocLazyLoad.load( {
                       name: 'SiteCamaraAdminApp',
                       insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                       files: [
                          'js/camara/controllers/user_groups/UserGroupsController.js',
                          'js/camara/controllers/user_groups/NewSubgroupModalInstanceController.js',
                          'js/camara/controllers/user_groups/AddRoleToGroupModalInstanceController.js',
                          'js/camara/controllers/user_groups/ShowUsersInTheGroupModalInstanceController.js',
                          'js/camara/controllers/user_groups/NewRootGroupModalInstanceController.js',
                          'js/camara/controllers/user_groups/EditGroupNameModalInstanceController.js',
                          'js/camara/controllers/ConfirmModalInstanceController.js'
                       ]
                   });
               }]
           }
        })
        //Menu (Admin) management page
        .state('menuAdmin', {
           url: "/menu_admin.html",
           templateUrl: "views/menu_admin/index.html",
           data: { pageTitle: 'Gerenciamento do Menu do Módulo de Administração do Portal' },
           controller: "MenuAdminController as $ctrl",
           resolve: {
               deps: ['$ocLazyLoad', function($ocLazyLoad) {
                   return $ocLazyLoad.load( {
                       name: 'SiteCamaraAdminApp',
                       insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                       files: [
                          'js/camara/controllers/menu_admin/MenuAdminController.js',
                          'js/camara/controllers/menu_admin/MenuAdminListItemsController.js',
                          'js/camara/controllers/menu_admin/EditMenuItemModalInstanceController.js',
                          'js/camara/controllers/menu_admin/NewMenuItemModalInstanceController.js',
                          'js/camara/controllers/menu_admin/NewRootMenuItemModalInstanceController.js',
                          'js/camara/controllers/ConfirmModalInstanceController.js'
                       ]
                   });
               }]
           }
        })
        //New admin item
        .state('menuAdmin.new', {
            url: "/new",
            templateUrl: "views/menu_admin/new.html",
            controller: "NewRootMenuItemModalInstanceController as $modalCtrl"
        })
        .state('menuAdmin.newSub', {
            url: "/newSub",
            templateUrl: "views/menu_admin/new_sub.html",
            params: {
              parentMenuItem: null
            },
            controller: "NewMenuItemModalInstanceController as $modalCtrl",
            resolve: {
               parentMenuItem: ['$stateParams', function ($stateParams) {
                  return $stateParams.parentMenuItem;
               }]
            }

        })
        .state('menuAdmin.edit', {
             url: "/edit",
             templateUrl: "views/menu_admin/edit.html",
             controller: "EditMenuItemModalInstanceController as $modalCtrl",
             params: {
                menuItem: null
             },
             resolve: {
               menuItem: ['$stateParams', function ($stateParams) {
                  return $stateParams.menuItem;
               }]
             }
         })
         .state('menuAdmin.list', {
              url: "/list",
              templateUrl: "views/menu_admin/list.html",
              controller: "MenuAdminListItemsController as $ctrl",
              params: {
                infoMessage: null,
                errorMessage: null
              }
        })
        //Menu (Portal) management page
        .state('menuPortal', {
           url: "/menu_portal.html",
           templateUrl: "views/menu_portal/index.html",
           data: { pageTitle: 'Gerenciamento do Menu do Portal' },
           controller: "MenuPortalController as $ctrl",
           resolve: {
               deps: ['$ocLazyLoad', function($ocLazyLoad) {
                   return $ocLazyLoad.load( {
                       name: 'SiteCamaraAdminApp',
                       insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                       files: [
                          'js/camara/controllers/menu_portal/MenuPortalController.js',
                          'js/camara/controllers/menu_portal/MenuPortalListItemsController.js',
                          'js/camara/controllers/menu_portal/PortalEditMenuItemModalInstanceController.js',
                          'js/camara/controllers/menu_portal/PortalNewMenuItemModalInstanceController.js',
                          'js/camara/controllers/menu_portal/PortalNewRootMenuItemModalInstanceController.js',
                          'js/camara/controllers/access_selectors/SelectYoutubeVideoModalInstanceController.js',
                          'js/camara/controllers/access_selectors/SelectFlickrPhotosetModalInstanceController.js',
                          'js/camara/controllers/access_selectors/SelectNewsItemModalInstanceController.js',
                          'js/camara/controllers/access_selectors/SelectPageModalInstanceController.js',
                          'js/camara/controllers/access_selectors/SelectYoutubeLiveChannelModalInstanceController.js',
                          'js/camara/controllers/ConfirmModalInstanceController.js'
                       ]
                   });
               }]
           }
        })
        //New banner
        .state('menuPortal.new', {
            url: "/new",
            templateUrl: "views/menu_portal/new.html",
            controller: "PortalNewRootMenuItemModalInstanceController as $modalCtrl"
        })
        .state('menuPortal.newSub', {
            url: "/newSub",
            templateUrl: "views/menu_portal/new_sub.html",
            params: {
              parentMenuItem: null
            },
            controller: "PortalNewMenuItemModalInstanceController as $modalCtrl",
            resolve: {
               parentMenuItem: ['$stateParams', function ($stateParams) {
                  return $stateParams.parentMenuItem;
               }]
            }

        })
        .state('menuPortal.edit', {
             url: "/edit",
             templateUrl: "views/menu_portal/edit.html",
             controller: "PortalEditMenuItemModalInstanceController as $modalCtrl",
             params: {
                menuItem: null
             },
             resolve: {
               menuItem: ['$stateParams', function ($stateParams) {
                  return $stateParams.menuItem;
               }]
             }
         })
         .state('menuPortal.list', {
              url: "/list",
              templateUrl: "views/menu_portal/list.html",
              controller: "MenuPortalListItemsController as $ctrl",
              params: {
                infoMessage: null,
                errorMessage: null
              }
        })
        //News management page
        .state('newsItem', {
           url: "/newsItem.html",
           abstract: true,
           templateUrl: "views/news/index.html",
           data: { pageTitle: 'Gerenciamento de Notícias' },
           controller: "NewsController as $ctrl",
           resolve: {
               deps: ['$ocLazyLoad', function($ocLazyLoad) {
                   return $ocLazyLoad.load( {
                       name: 'SiteCamaraAdminApp',
                       insertBefore: '#ng_load_plugins_before',
                       files: [
                           'js/camara/controllers/news/NewsController.js',
                           'js/camara/controllers/news/NewNewsItemController.js',
                           'js/camara/controllers/news/EditNewsItemController.js',
                           'js/camara/controllers/news/ListNewsItemsController.js',
                           'js/camara/controllers/ConfirmModalInstanceController.js'
                       ]
                   });
               }]
           }
        })
        //New News
        .state('newsItem.new', {
           url: "/new",
           templateUrl: "views/news/new.html",
           controller: "NewNewsItemController as $newNewsItemCtrl"
        })
        .state('newsItem.edit', {
           url: "/edit/:newsItemId",
           templateUrl: "views/news/edit.html",
           controller: "EditNewsItemController as $editNewsItemCtrl",
           params: {
             newsItemId: null
          },
          resolve: {
              newsItem: ['$stateParams', 'NewsService', function ($stateParams, NewsService) {
                 return NewsService.getNewsItem($stateParams.newsItemId).then(function(result) {
                    return result.newsItem;
                 }).catch(function(error) {
                    console.error(error);
                    throw error;
                 });
              }]
          }
        })
        //News List
        .state('newsItem.list', {
           url: "/list",
           templateUrl: "views/news/list.html",
           controller: "ListNewsItemsController as $listNewsItemsCtrl",
           params: {
             infoMessage: null,
             errorMessage: null
           }
        })
        //Pages management
        .state('page', {
           url: "/pages.html",
           abstract: true,
           templateUrl: "views/pages/index.html",
           data: { pageTitle: 'Gerenciamento de Páginas' },
           controller: "PagesController as $ctrl",
           resolve: {
               deps: ['$ocLazyLoad', function($ocLazyLoad) {
                   return $ocLazyLoad.load( {
                       name: 'SiteCamaraAdminApp',
                       insertBefore: '#ng_load_plugins_before',
                       files: [
                           'js/camara/controllers/pages/PagesController.js',
                           'js/camara/controllers/pages/NewPageController.js',
                           'js/camara/controllers/pages/EditPageController.js',
                           'js/camara/controllers/pages/ListPagesController.js',
                           'js/camara/controllers/ConfirmModalInstanceController.js'
                       ]
                   });
               }]
           }
        })
        //New page
        .state('page.new', {
           url: "/new",
           templateUrl: "views/pages/new.html",
           controller: "NewPageController as $newPageCtrl"
        })
        //Edit page
        .state('page.edit', {
           url: "/edit/:pageId",
           templateUrl: "views/pages/edit.html",
           controller: "EditPageController as $editPageCtrl",
           params: {
             pageId: null
           },
           resolve: {
               page: ['$stateParams', 'PagesService', function ($stateParams, PagesService) {
                  return PagesService.getPage($stateParams.pageId).then(function(result) {
                     return result.page;
                  }).catch(function(error) {
                     console.error(error);
                     throw error;
                  });
               }]
           }
        })
        //Page list
        .state('page.list', {
           url: "/list",
           templateUrl: "views/pages/list.html",
           controller: "ListPagesController as $listPagesCtrl",
           params: {
             infoMessage: null,
             errorMessage: null
           }
        })
        .state('banner', {
           url: "/banner.html",
           templateUrl: "views/banners/index.html",
           controller: "BannersController as $bannersController",
           resolve: {
               deps: ['$ocLazyLoad', function($ocLazyLoad) {
                   return $ocLazyLoad.load({
                       name: 'SiteCamaraAdminApp',
                       insertBefore: '#ng_load_plugins_before',
                       files: [
                           'js/camara/controllers/banners/BannersController.js',
                           'js/camara/controllers/banners/ListBannersController.js',
                           'js/camara/controllers/banners/EditBannerController.js',
                           'js/camara/controllers/banners/NewBannerController.js',
                           'js/camara/controllers/access_selectors/SelectYoutubeVideoModalInstanceController.js',
                           'js/camara/controllers/access_selectors/SelectFlickrPhotosetModalInstanceController.js',
                           'js/camara/controllers/access_selectors/SelectNewsItemModalInstanceController.js',
                           'js/camara/controllers/access_selectors/SelectPageModalInstanceController.js',
                           'js/camara/controllers/access_selectors/SelectYoutubeLiveChannelModalInstanceController.js',
                           'js/camara/controllers/ConfirmModalInstanceController.js'
                       ]
                   });
               }]
           }
        })
        //New banner
        .state('banner.new', {
            url: "/new",
            templateUrl: "views/banners/new.html",
            controller: "NewBannerController as $newBannerCtrl"
        })
        .state('banner.edit', {
             url: "/edit/:bannerId",
             templateUrl: "views/banners/edit.html",
             controller: "EditBannerController as $editBannerCtrl",
             params: {
              bannerId: null
             },
             resolve: {
                 banner: ['$stateParams', 'BannersService', function ($stateParams, BannersService) {
                    return BannersService.getBanner($stateParams.bannerId).then(function(result) {
                       return result.banner;
                    }).catch(function(error) {
                       console.error(error);
                       throw error;
                    });
                 }]
             }
         })
         .state('banner.list', {
              url: "/list",
              templateUrl: "views/banners/list.html",
              controller: "ListBannersController as $listBannersCtrl",
              params: {
                infoMessage: null,
                errorMessage: null
              }
         })
         .state('breakingNews', {
            url: "/breaking_news.html",
            templateUrl: "views/breaking_news/index.html",
            controller: "BreakingNewsController as $breakingNewsController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SiteCamaraAdminApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'js/camara/controllers/breaking_news/BreakingNewsController.js',
                            'js/camara/controllers/breaking_news/ListBreakingNewsController.js',
                            'js/camara/controllers/breaking_news/EditBreakingNewsItemController.js',
                            'js/camara/controllers/breaking_news/NewBreakingNewsItemController.js',
                            'js/camara/controllers/access_selectors/SelectYoutubeVideoModalInstanceController.js',
                            'js/camara/controllers/access_selectors/SelectFlickrPhotosetModalInstanceController.js',
                            'js/camara/controllers/access_selectors/SelectNewsItemModalInstanceController.js',
                            'js/camara/controllers/access_selectors/SelectPageModalInstanceController.js',
                            'js/camara/controllers/access_selectors/SelectYoutubeLiveChannelModalInstanceController.js',
                            'js/camara/controllers/ConfirmModalInstanceController.js'
                        ]
                    });
                }]
            }
         })
         //New breaking news
         .state('breakingNews.new', {
             url: "/new",
             templateUrl: "views/breaking_news/new.html",
             controller: "NewBreakingNewsItemController as $newBreakingNewsItemCtrl"
         })
         .state('breakingNews.edit', {
              url: "/edit/:breakingNewsItemId",
              templateUrl: "views/breaking_news/edit.html",
              controller: "EditBreakingNewsItemController as $editBreakingNewsItemCtrl",
              params: {
                 breakingNewsItemId: null
              },
              resolve: {
                  breakingNewsItem: ['$stateParams', 'BreakingNewsService', function ($stateParams, BreakingNewsService) {
                     return BreakingNewsService.getBreakingNewsItem($stateParams.breakingNewsItemId).then(function(result) {
                        return result.breakingNewsItem;
                     }).catch(function(error) {
                        console.error(error);
                        throw error;
                     });
                  }]
              }
          })
          .state('breakingNews.list', {
               url: "/list",
               templateUrl: "views/breaking_news/list.html",
               controller: "ListBreakingNewsController as $listBreakingNewsCtrl",
               params: {
                 infoMessage: null,
                 errorMessage: null
               }
          })
          .state('fixedBreakingNews', {
             url: "/fixed_breaking_news.html",
             templateUrl: "views/fixed_breaking_news/index.html",
             controller: "FBreakingNewsController as $fbreakingNewsController",
             resolve: {
                 deps: ['$ocLazyLoad', function($ocLazyLoad) {
                     return $ocLazyLoad.load({
                         name: 'SiteCamaraAdminApp',
                         insertBefore: '#ng_load_plugins_before',
                         files: [
                             'js/camara/controllers/fixed_breaking_news/FBreakingNewsController.js',
                             'js/camara/controllers/fixed_breaking_news/ListFBreakingNewsController.js',
                             'js/camara/controllers/fixed_breaking_news/EditFBreakingNewsItemController.js',
                             'js/camara/controllers/access_selectors/SelectYoutubeVideoModalInstanceController.js',
                             'js/camara/controllers/access_selectors/SelectFlickrPhotosetModalInstanceController.js',
                             'js/camara/controllers/access_selectors/SelectNewsItemModalInstanceController.js',
                             'js/camara/controllers/access_selectors/SelectPageModalInstanceController.js',
                             'js/camara/controllers/access_selectors/SelectYoutubeLiveChannelModalInstanceController.js',
                             'js/camara/controllers/ConfirmModalInstanceController.js'
                         ]
                     });
                 }]
             }
          })
          .state('fixedBreakingNews.edit', {
               url: "/edit/:fbreakingNewsItemId",
               templateUrl: "views/fixed_breaking_news/edit.html",
               controller: "EditFBreakingNewsItemController as $editFBreakingNewsItemCtrl",
               params: {
                  fbreakingNewsItemId: null
               },
               resolve: {
                   fbreakingNewsItem: ['$stateParams', 'FBreakingNewsService', function ($stateParams, FBreakingNewsService) {
                      return FBreakingNewsService.getFBreakingNewsItem($stateParams.fbreakingNewsItemId).then(function(result) {
                         return result.fbreakingNewsItem;
                      }).catch(function(error) {
                         console.error(error);
                         throw error;
                      });
                   }]
               }
           })
           .state('fixedBreakingNews.list', {
                url: "/list",
                templateUrl: "views/fixed_breaking_news/list.html",
                controller: "ListFBreakingNewsController as $listFBreakingNewsCtrl",
                params: {
                  infoMessage: null,
                  errorMessage: null
                }
         })
         .state('hotNews', {
            url: "/hotNews.html",
            templateUrl: "views/hot_news/index.html",
            controller: "HotNewsController as $hotNewsController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SiteCamaraAdminApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'js/camara/controllers/hot_news/HotNewsController.js',
                            'js/camara/controllers/hot_news/ListHotNewsController.js',
                            'js/camara/controllers/hot_news/EditHotNewsItemController.js',
                            'js/camara/controllers/hot_news/NewHotNewsItemController.js',
                            'js/camara/controllers/access_selectors/SelectYoutubeVideoModalInstanceController.js',
                            'js/camara/controllers/access_selectors/SelectFlickrPhotosetModalInstanceController.js',
                            'js/camara/controllers/access_selectors/SelectNewsItemModalInstanceController.js',
                            'js/camara/controllers/access_selectors/SelectPageModalInstanceController.js',
                            'js/camara/controllers/access_selectors/SelectYoutubeLiveChannelModalInstanceController.js',
                            'js/camara/controllers/ConfirmModalInstanceController.js'
                        ]
                    });
                }]
            }
         })
         .state('hotNews.new', {
             url: "/new",
             templateUrl: "views/hot_news/new.html",
             controller: "NewHotNewsItemController as $newHotNewsItemCtrl"
         })
         .state('hotNews.edit', {
              url: "/edit/:hotNewsItemId",
              templateUrl: "views/hot_news/edit.html",
              controller: "EditHotNewsItemController as $editHotNewsItemCtrl",
              params: {
               hotNewsItemId: null
              },
              resolve: {
                  hotNewsItem: ['$stateParams', 'HotNewsService', function ($stateParams, HotNewsService) {
                     return HotNewsService.getHotNewsItem($stateParams.hotNewsItemId).then(function(result) {
                        return result.hotNewsItem;
                     }).catch(function(error) {
                        console.error(error);
                        throw error;
                     });
                  }]
              }
          })
          .state('hotNews.list', {
               url: "/list",
               templateUrl: "views/hot_news/list.html",
               controller: "ListHotNewsController as $listHotNewsCtrl",
               params: {
                 infoMessage: null,
                 errorMessage: null
               }
          })
          .state('eventsCalendar', {
             url: "/eventsCalendar.html",
             templateUrl: "views/events_calendar/index.html",
             controller: "EventsCalendarController as $eventsCalendarController",
             resolve: {
                 deps: ['$ocLazyLoad', function($ocLazyLoad) {
                     return $ocLazyLoad.load({
                         name: 'SiteCamaraAdminApp',
                         insertBefore: '#ng_load_plugins_before',
                         files: [
                             'js/camara/controllers/events_calendar/EventsCalendarController.js',
                             'js/camara/controllers/events_calendar/ListEventsCalendarController.js',
                             'js/camara/controllers/events_calendar/NewEventModalInstanceController.js',
                             'js/camara/controllers/events_calendar/EditEventModalInstanceController.js',
                             'js/camara/controllers/ConfirmModalInstanceController.js',
                             'https://apis.google.com/js/api.js'
                         ]
                     });
                 }]
             }
         })
         .state('eventsCalendar.list', {
                url: "/list",
                templateUrl: "views/events_calendar/list.html",
                controller: "ListEventsCalendarController as $listEventsCalendarCtrl"
         })
         //Licitacoes management
         .state('licitacao', {
            url: "/licitacoes.html",
            abstract: true,
            templateUrl: "views/licitacoes/index.html",
            data: { pageTitle: 'Gerenciamento de Licitações' },
            controller: "LicitacoesController as $ctrl",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load( {
                        name: 'SiteCamaraAdminApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'js/camara/controllers/licitacoes/LicitacoesController.js',
                            'js/camara/controllers/licitacoes/NewLicitacaoController.js',
                            'js/camara/controllers/licitacoes/NewLicitacaoEventController.js',
                            'js/camara/controllers/licitacoes/EditLicitacaoEventController.js',
                            'js/camara/controllers/licitacoes/ViewLicitacaoController.js',
                            'js/camara/controllers/licitacoes/EditLicitacaoController.js',
                            'js/camara/controllers/licitacoes/ListLicitacoesController.js',
                            'js/camara/controllers/licitacoes/PublishLicitacaoController.js',
                            'js/camara/controllers/ConfirmModalInstanceController.js',
                            'js/camara/controllers/MessageModalInstanceController.js',
                            '../assets/apps/css/todo-2.css'
                        ]
                    });
                }]
            }
         })
         //New licitacao
         .state('licitacao.new', {
            url: "/new",
            templateUrl: "views/licitacoes/new.html",
            controller: "NewLicitacaoController as $newLicitacaoCtrl",
            resolve: {
                licitacoesCategories: [ 'LicitacoesService', function (LicitacoesService) {
                   return LicitacoesService.getLicitacoesCategories().then(function(result) {
                      return result.categories;
                   }).catch(function(error) {
                      console.error(error);
                      throw error;
                   });
                }]
            }
         })
         .state('licitacao.publish', {
            url: "/publish/:licitacaoId",
            templateUrl: "views/licitacoes/publish.html",
            controller: "PublishLicitacaoController as $publishLicitacaoCtrl",
            params: {
              licitacaoId: null
            },
            resolve: {
               licitacao: ['$stateParams', 'LicitacoesService', function ($stateParams, LicitacoesService) {
                   return LicitacoesService.getLicitacao($stateParams.licitacaoId).then(function(result) {
                      return result.licitacao;
                   }).catch(function(error) {
                      console.error(error);
                      throw error;
                   });
               }]
            }
         })
         .state('licitacao.newEvent', {
            url: "/new/event/:licitacaoId",
            templateUrl: "views/licitacoes/new_event.html",
            controller: "NewLicitacaoEventController as $newLicitacaoEventCtrl",
            params: {
              licitacaoId: null
            },
            resolve: {
                licitacao: ['$stateParams', 'LicitacoesService', function ($stateParams, LicitacoesService) {
                   return LicitacoesService.getLicitacao($stateParams.licitacaoId).then(function(result) {
                      return result.licitacao;
                   }).catch(function(error) {
                      console.error(error);
                      throw error;
                   });
                }]
            }
         })
         .state('licitacao.editEvent', {
            url: "/edit/event/:licitacaoId/:eventId",
            templateUrl: "views/licitacoes/edit_event.html",
            controller: "EditLicitacaoEventController as $editLicitacaoEventCtrl",
            params: {
              licitacaoId: null,
              eventId: null
            },
            resolve: {
                licitacao: ['$stateParams', 'LicitacoesService', function ($stateParams, LicitacoesService) {
                   return LicitacoesService.getLicitacao($stateParams.licitacaoId)
                                           .then(function(result) {
                                              return result.licitacao;
                                           }).catch(function(error) {
                                              console.error(error);
                                              throw error;
                                           });
                }],
                licitacaoEvent: ['$stateParams', 'LicitacoesService', function ($stateParams, LicitacoesService) {
                   return LicitacoesService.getLicitacaoEvent($stateParams.eventId)
                                           .then(function(result) {
                                              return result.licitacaoEvent;
                                           }).catch(function(error) {
                                              console.error(error);
                                              throw error;
                                           });
                }]

            }
         })
         //Edit licitacao
         .state('licitacao.edit', {
            url: "/edit/:licitacaoId",
            templateUrl: "views/licitacoes/edit.html",
            controller: "EditLicitacaoController as $editLicitacaoCtrl",
            params: {
              licitacaoId: null
            },
            resolve: {
                licitacao: ['$stateParams', 'LicitacoesService', function ($stateParams, LicitacoesService) {
                   return LicitacoesService.getLicitacao($stateParams.licitacaoId).then(function(result) {
                      return result.licitacao;
                   }).catch(function(error) {
                      console.error(error);
                      throw error;
                   });
                }],
                licitacoesCategories: [ 'LicitacoesService', function (LicitacoesService) {
                  return LicitacoesService.getLicitacoesCategories().then(function(result) {
                     return result.categories;
                  }).catch(function(error) {
                     console.error(error);
                     throw error;
                  });
               }]
            }
         })
         //View licitacao
         .state('licitacao.view', {
            url: "/view/:licitacaoId",
            templateUrl: "views/licitacoes/view.html",
            controller: "ViewLicitacaoController as $viewLicitacaoCtrl",
            params: {
              licitacaoId: null,
              infoMessage: null,
              errorMessage: null
            },
            resolve: {
                licitacao: ['$stateParams', 'LicitacoesService', function ($stateParams, LicitacoesService) {
                   return LicitacoesService.getLicitacao($stateParams.licitacaoId).then(function(result) {
                      return result.licitacao;
                   }).catch(function(error) {
                      console.error(error);
                      throw error;
                   });
                }]
            }
         })
         //Licitacoes list
         .state('licitacao.list', {
            url: "/list",
            templateUrl: "views/licitacoes/list.html",
            controller: "ListLicitacoesController as $listLicitacoesCtrl",
            params: {
              infoMessage: null,
              errorMessage: null
           },
           resolve: {
               licitacoesCategories: [ 'LicitacoesService', function (LicitacoesService) {
                  return LicitacoesService.getLicitacoesCategories().then(function(result) {
                     return result.categories;
                  }).catch(function(error) {
                     console.error(error);
                     throw error;
                  });
               }]
           }
         })
         //Legislative proposition management
         .state('legislativeProposition', {
            url: "/legislativeProposition.html",
            abstract: true,
            templateUrl: "views/legislative_proposition/index.html",
            data: { pageTitle: 'Gerenciamento de Proposituras' },
            controller: "LegislativePropositionController as $ctrl",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load( {
                        name: 'SiteCamaraAdminApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'js/camara/controllers/legislative_proposition/LegislativePropositionController.js',
                            'js/camara/controllers/legislative_proposition/NewLegislativePropositionController.js',
                            'js/camara/controllers/legislative_proposition/ViewLegislativePropositionController.js',
                            'js/camara/controllers/legislative_proposition/EditLegislativePropositionController.js',
                            'js/camara/controllers/legislative_proposition/ListLegislativePropositionsController.js',
                            'js/camara/controllers/legislative_proposition/NewRelationshipModalInstanceController.js',
                            'js/camara/controllers/ConfirmModalInstanceController.js',
                            'js/camara/controllers/MessageModalInstanceController.js',
                            '../assets/apps/css/todo-2.css'
                        ]
                    });
                }]
            }
         })
         //New legislative proposition
         .state('legislativeProposition.new', {
            url: "/new",
            templateUrl: "views/legislative_proposition/new.html",
            controller: "NewLegislativePropositionController as $newLegislativePropositionCtrl",
            resolve: {
               legislativePropositionTypes: ['$stateParams', 'LegislativePropositionService', function ($stateParams, LegislativePropositionService) {
                  return LegislativePropositionService
                                       .getLegislativePropositionTypes()
                                       .then(function(result) {
                     return result.legislativePropositionTypes;
                  }).catch(function(error) {
                     console.error(error);
                     throw error;
                  });
               }]
            }
         })
         //Edit legislative proposition
         .state('legislativeProposition.edit', {
            url: "/edit/:legislativePropositionId",
            templateUrl: "views/legislative_proposition/edit.html",
            controller: "EditLegislativePropositionController as $editLegislativePropositionCtrl",
            params: {
              legislativePropositionId: null
            },
            resolve: {
                legislativeProposition: ['$stateParams', 'LegislativePropositionService', function ($stateParams, LegislativePropositionService) {
                   return LegislativePropositionService
                              .getLegislativeProposition($stateParams.legislativePropositionId)
                              .then(function(result) {
                      return result.legislativeProposition;
                   }).catch(function(error) {
                      console.error(error);
                      throw error;
                   });
                }],
                legislativePropositionTypes: ['$stateParams', 'LegislativePropositionService', function ($stateParams, LegislativePropositionService) {
                  return LegislativePropositionService
                              .getLegislativePropositionTypes()
                              .then(function(result) {
                     return result.legislativePropositionTypes;
                  }).catch(function(error) {
                     console.error(error);
                     throw error;
                  });
               }]
            }
         })
         //View legislative proposition
         .state('legislativeProposition.view', {
            url: "/view/:legislativePropositionId",
            templateUrl: "views/legislative_proposition/view.html",
            controller: "ViewLegislativePropositionController as $viewLegislativePropositionCtrl",
            params: {
              legislativePropositionId: null,
              infoMessage: null,
              errorMessage: null
            },
            resolve: {
                legislativeProposition: ['$stateParams', 'LegislativePropositionService', function ($stateParams, LegislativePropositionService) {
                   return LegislativePropositionService.getLegislativeProposition($stateParams.legislativePropositionId).then(function(result) {
                      return result.legislativeProposition;
                   }).catch(function(error) {
                      console.error(error);
                      throw error;
                   });
                }]
            }
         })
         //Legislative propositions list
         .state('legislativeProposition.list', {
            url: "/list",
            templateUrl: "views/legislative_proposition/list.html",
            controller: "ListLegislativePropositionsController as $listLegislativePropositionsCtrl",
            params: {
              infoMessage: null,
              errorMessage: null
           },
           resolve: {
             legislativePropositionTypes: ['LegislativePropositionService', function (LegislativePropositionService) {
                return LegislativePropositionService
                                     .getLegislativePropositionTypes()
                                     .then(function(result) {
                   return result.legislativePropositionTypes;
                }).catch(function(error) {
                   console.error(error);
                   throw error;
                });
             }]
           }
         })
         .state('legislativePropositionTags', {
            url: "/legislativePropositionTags.html",
            templateUrl: "views/legislative_proposition_tags.html",
            controller: "LegislativePropositionTagsController as $ctrl",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SiteCamaraAdminApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'js/camara/controllers/legislative_proposition_tags/LegislativePropositionTagsController.js',
                            'js/camara/controllers/legislative_proposition_tags/NewLegislativePropositionTagModalInstanceController.js',
                            'js/camara/controllers/legislative_proposition_tags/EditLegislativePropositionTagModalInstanceController.js',
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
            data: { pageTitle: 'Admin Dashboard Template' },
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
            data: {
               pageTitle: 'Test testsecurity',
               role: 'role10'
            },
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
            data: { pageTitle: 'Blank Page Template' },
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
            data: { pageTitle: 'User Profile' }
        })

        // User Profile Account
        .state("profile.account", {
            url: "/account",
            templateUrl: "views/profile/account.html",
            data: { pageTitle: 'User Account' }
        })

        // User Profile Help
        .state("profile.help", {
            url: "/help",
            templateUrl: "views/profile/help.html",
            data: { pageTitle: 'User Help' }
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
                        "messages",
                        "$state",
                        "AuthenticationService",
                        function($rootScope,
                                 settings,
                                 messages,
                                 $state,
                                 AuthenticationService) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = settings; // state to be accessed from view
    //capture state changes in order to handle security issues
    $rootScope.$on('$stateChangeStart', function(evt, toState, toParams, fromState, fromParams) {
        var _redirectOrRevalidate = function (prmToState, prmHasAccess) {
           if ( prmToState.name !== "login" &&
                prmToState.name !== "logout"  && !prmHasAccess ) {
               //if not, invalidate the authentication that was already obtained
               //and redirect him to login page
               AuthenticationService.logout();
               evt.preventDefault();
               $state.go( 'login',
                          { 'page': prmToState.name },
                          { reload: true });
           } else {
              //if it has access to the state page, then
              //allow the page flow and revalidate the session
              AuthenticationService.revalidateSession();
           }
        }

        //check that the user is logged and he has access to the state page
        var role = null;
        if(toState.data) {
           role = toState.data.role ? toState.data.role : null;
        }
        if(role) {
           AuthenticationService.checkAccess(role).then(function(result) {
             _redirectOrRevalidate(toState, result);
          }).catch(function(err) {
             _redirectOrRevalidate(toState, false);
          });
        } else {
           _redirectOrRevalidate(toState, AuthenticationService.isLoggedIn());
        }

   });
}]);

})();
