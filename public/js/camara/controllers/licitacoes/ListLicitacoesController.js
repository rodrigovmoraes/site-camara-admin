(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').controller('ListLicitacoesController', ListLicitacoesController);

   ListLicitacoesController.$inject = [ '$scope', 'messages',
                                        'Utils', '$stateParams',
                                        'LicitacoesService', 'settings',
                                        'licitacoesCategories'];
   function ListLicitacoesController( $scope, messages,
                                      Utils, $stateParams,
                                      LicitacoesService, settings,
                                      licitacoesCategories ) {
      var $listLicitacoesCtrl = this;

      //messages control
      Utils.applyMessageControls($listLicitacoesCtrl);

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      var _updateLicitacoesList = function() {
         var paginationOptions = {
            page: $listLicitacoesCtrl.pager.currentPage,
            pageSize: $listLicitacoesCtrl.pager.itemsPerPage
         };
         var publicationDate1 = $listLicitacoesCtrl.filter.publicationDate1 ? $listLicitacoesCtrl.filter.publicationDate1 : null;
         var publicationDate2 = $listLicitacoesCtrl.filter.publicationDate2 ? $listLicitacoesCtrl.filter.publicationDate2 : null;
         if(publicationDate1) {
            publicationDate1.setMilliseconds(0);
            publicationDate1.setSeconds(0);
            publicationDate1.setMinutes(0);
            publicationDate1.setHours(0);
         }
         if(publicationDate2) {
            publicationDate2.setMilliseconds(999);
            publicationDate2.setSeconds(59);
            publicationDate2.setMinutes(59);
            publicationDate2.setHours(23);
         }
         var filterOptions = {
            'keywords': $listLicitacoesCtrl.filter.keywords ? $listLicitacoesCtrl.filter.keywords : null,
            'year' : $listLicitacoesCtrl.filter.year,
            'number' : $listLicitacoesCtrl.filter.number,
            'publicationDate1': publicationDate1,
            'publicationDate2': publicationDate2,
            'state': $listLicitacoesCtrl.filter.state,
            'category' : $listLicitacoesCtrl.filter.category
         };
         var sortOptions = {
            field: $listLicitacoesCtrl.sort.field,
            direction: $listLicitacoesCtrl.sort.direction
         }
         if($listLicitacoesCtrl.filter.id) {
            filterOptions.id = $listLicitacoesCtrl.filter.id;
            $listLicitacoesCtrl.filter.id = null; //reset this filter id
            sortOptions.field = null;
         }
         return LicitacoesService
                  .getLicitacoes(paginationOptions, filterOptions, sortOptions)
                  .then(function(result) {
            $listLicitacoesCtrl.licitacoes = result.licitacoes;
            $listLicitacoesCtrl.pager.totalItems = result.totalLength;
            $listLicitacoesCtrl.pager.currentPage = result.page;
            $listLicitacoesCtrl.pager.totalPages = Math.ceil(result.totalLength / $listLicitacoesCtrl.pager.itemsPerPage);
            $listLicitacoesCtrl.errorMessage = "";
         });
      }

      //licitacoes categoriesMap
      $listLicitacoesCtrl.licitacoesCategories = licitacoesCategories;

      //messages
      $listLicitacoesCtrl.errorMessage = $stateParams.errorMessage;
      $listLicitacoesCtrl.infoMessage = $stateParams.infoMessage;
      $listLicitacoesCtrl.notFoundMessage = messages.licitacaoNotFound;
      $listLicitacoesCtrl.highlightPageId = LicitacoesService.getHighlightLicitacaoId();
      LicitacoesService.clearHighlightLicitacaoId();

      //pager setup
      $listLicitacoesCtrl.pager = LicitacoesService.getPaginationOptions();

      $listLicitacoesCtrl.pager.pageChanged = function() {
          //update
          $listLicitacoesCtrl.clearMessage();
          _updateLicitacoesList().catch(function(error) {
            $listLicitacoesCtrl.errorMessage = error.message;
          });
      }
      //filter setup
      $listLicitacoesCtrl.filter = LicitacoesService.getFilterOptions();
      //order setup
      $listLicitacoesCtrl.sort = LicitacoesService.getSortOptions();

      //initial load of the licitacoes
      _updateLicitacoesList();

      $listLicitacoesCtrl.formatLicitacaoNumber = function(number, year) {
         return _.padStart(number, 2, "0") + "/" + year
      }

      $listLicitacoesCtrl.setCategoryFilter = function(category) {
         $listLicitacoesCtrl.filter.category = category;
      }

      $listLicitacoesCtrl.setSortField = function(field) {
         $listLicitacoesCtrl.sort.field = field;
      }

      $listLicitacoesCtrl.setSortDirection = function(direction) {
         $listLicitacoesCtrl.sort.direction = direction;
      }

      //filter update
      //keywords
      $scope.$watch("$listLicitacoesCtrl.filter.keywords", function (newValue, oldValue) {
         //keywords updated
         if(newValue != oldValue) {
            $listLicitacoesCtrl.clearMessage();
            _updateLicitacoesList().catch(function (error) {
               $listLicitacoesCtrl.errorMessage = error.message;
            });
         }
      });
      //number filter
      $scope.$watch("$listLicitacoesCtrl.filter.number", function (newValue, oldValue) {
         //number filter updated
         if(newValue != oldValue) {
            $listLicitacoesCtrl.clearMessage();
            _updateLicitacoesList().catch(function(error) {
               $listLicitacoesCtrl.errorMessage = error.message;
            });
         }
      });
      //year filter
      $scope.$watch("$listLicitacoesCtrl.filter.year", function (newValue, oldValue) {
         //year filter updated
         if(newValue != oldValue) {
            $listLicitacoesCtrl.clearMessage();
            _updateLicitacoesList().catch(function(error) {
               $listLicitacoesCtrl.errorMessage = error.message;
            });
         }
      });
      //publication date, begin
      $scope.$watch("$listLicitacoesCtrl.filter.publicationDate1", function (newValue, oldValue) {
         //keywords updated
         if(newValue != oldValue) {
            $listLicitacoesCtrl.clearMessage();
            _updateLicitacoesList().catch(function (error) {
               $listLicitacoesCtrl.errorMessage = error.message;
            });
         }
      });

      //publication date, end
      $scope.$watch("$listLicitacoesCtrl.filter.publicationDate2", function (newValue, oldValue) {
         //keywords updated
         if(newValue != oldValue) {
            $listLicitacoesCtrl.clearMessage();
            _updateLicitacoesList().catch(function(error) {
               $listLicitacoesCtrl.errorMessage = error.message;
            });
         }
      });

      //state filter
      $scope.$watch("$listLicitacoesCtrl.filter.state", function (newValue, oldValue) {
         //state filter updated
         if(newValue != oldValue) {
            $listLicitacoesCtrl.clearMessage();
            _updateLicitacoesList().catch(function(error) {
               $listLicitacoesCtrl.errorMessage = error.message;
            });
         }
      });

      //category filter
      $scope.$watch("$listLicitacoesCtrl.filter.category", function (newValue, oldValue) {
         //category filter updated
         if(newValue != oldValue) {
            $listLicitacoesCtrl.clearMessage();
            _updateLicitacoesList().catch(function(error) {
               $listLicitacoesCtrl.errorMessage = error.message;
            });
         }
      });

      //sort field
      $scope.$watch("$listLicitacoesCtrl.sort.field", function (newValue, oldValue) {
         //category filter updated
         if(newValue != oldValue) {
            $listLicitacoesCtrl.clearMessage();
            _updateLicitacoesList().catch(function(error) {
               $listLicitacoesCtrl.errorMessage = error.message;
            });
         }
      });

      $scope.$watch("$listLicitacoesCtrl.sort.direction", function (newValue, oldValue) {
         //category filter updated
         if(newValue != oldValue) {
            $listLicitacoesCtrl.clearMessage();
            _updateLicitacoesList().catch(function(error) {
               $listLicitacoesCtrl.errorMessage = error.message;
            });
         }
      });
   }
})();
