(function() {
"use strict";

   angular.module('SiteCamaraAdminApp')
          .controller('ListLegislativePropositionsController', ListLegislativePropositionsController);

   ListLegislativePropositionsController.$inject = [ '$scope', 'messages',
                                                     'Utils', '$stateParams',
                                                     'LegislativePropositionService',
                                                     'settings', 'legislativePropositionTypes' ];
   function ListLegislativePropositionsController( $scope, messages,
                                                   Utils, $stateParams,
                                                   LegislativePropositionService,
                                                   settings, legislativePropositionTypes ) {
      var $listLegislativePropositionsCtrl = this;

      //messages control
      Utils.applyMessageControls($listLegislativePropositionsCtrl);

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      var _updateLegislativePropositionsList = function() {
         var paginationOptions = {
            page: $listLegislativePropositionsCtrl.pager.currentPage,
            pageSize: $listLegislativePropositionsCtrl.pager.itemsPerPage
         };
         var date1 = $listLegislativePropositionsCtrl.filter.date1
                                    ? $listLegislativePropositionsCtrl.filter.date1 : null;
         var date2 = $listLegislativePropositionsCtrl.filter.date2
                                    ? $listLegislativePropositionsCtrl.filter.date2 : null;
         if(date1) {
            date1.setMilliseconds(0);
            date1.setSeconds(0);
            date1.setMinutes(0);
            date1.setHours(0);
         }
         if(date2) {
            date2.setMilliseconds(999);
            date2.setSeconds(59);
            date2.setMinutes(59);
            date2.setHours(23);
         }
         var filterOptions = {
            'keywords': $listLegislativePropositionsCtrl.filter.keywords
                              ? $listLegislativePropositionsCtrl.filter.keywords : null,
            'year' : $listLegislativePropositionsCtrl.filter.year,
            'number' : $listLegislativePropositionsCtrl.filter.number,
            'date1': date1,
            'date2': date2,
            'type' : $listLegislativePropositionsCtrl.filter.type
         };
         var sortOptions = {
            field: $listLegislativePropositionsCtrl.sort.field,
            direction: $listLegislativePropositionsCtrl.sort.direction
         }
         if ($listLegislativePropositionsCtrl.filter.id) {
            filterOptions.id = $listLegislativePropositionsCtrl.filter.id;
            $listLegislativePropositionsCtrl.filter.id = null; //reset this filter id
            sortOptions.field = null;
         }
         return LegislativePropositionService
                  .getLegislativePropositions(paginationOptions, filterOptions, sortOptions)
                  .then(function(result) {
            $listLegislativePropositionsCtrl.legislativePropositions = result.legislativePropositions;
            $listLegislativePropositionsCtrl.pager.totalItems = result.totalLength;
            $listLegislativePropositionsCtrl.pager.currentPage = result.page;
            $listLegislativePropositionsCtrl.pager.totalPages = Math.ceil(result.totalLength / $listLegislativePropositionsCtrl.pager.itemsPerPage);
            $listLegislativePropositionsCtrl.errorMessage = "";
         });
      }

      //messages
      $listLegislativePropositionsCtrl.errorMessage = $stateParams.errorMessage;
      $listLegislativePropositionsCtrl.infoMessage = $stateParams.infoMessage;
      $listLegislativePropositionsCtrl.notFoundMessage = messages.legislativePropositionsNotFound;
      $listLegislativePropositionsCtrl.highlightPageId = LegislativePropositionService.getHighlightLegislativePropositionId();
      $listLegislativePropositionsCtrl.date = new Date();
      $listLegislativePropositionsCtrl.legislativePropositionTypes = legislativePropositionTypes;
      $listLegislativePropositionsCtrl.highlightLegislativePropositionId = LegislativePropositionService.getHighlightLegislativePropositionId();
      LegislativePropositionService.clearHighlightLegislativePropositionId();

      //pager setup
      $listLegislativePropositionsCtrl.pager = LegislativePropositionService.getPaginationOptions();

      $listLegislativePropositionsCtrl.pager.pageChanged = function() {
          //update
          $listLegislativePropositionsCtrl.clearMessage();
          _updateLegislativePropositionsList().catch(function(error) {
            $listLegislativePropositionsCtrl.errorMessage = error.message;
          });
      }
      //filter setup
      $listLegislativePropositionsCtrl.filter = LegislativePropositionService.getFilterOptions();
      //order setup
      $listLegislativePropositionsCtrl.sort = LegislativePropositionService.getSortOptions();

      //initial load of the legislativePropositions
      _updateLegislativePropositionsList();

      $listLegislativePropositionsCtrl.formatLegislativePropositionNumber = function(number, year) {
         return _.padStart(number, 3, "0") + "/" + year
      }

      $listLegislativePropositionsCtrl.setTypeFilter = function(type) {
         $listLegislativePropositionsCtrl.filter.type = type;
      }

      $listLegislativePropositionsCtrl.setSortField = function(field) {
         $listLegislativePropositionsCtrl.sort.field = field;
      }

      $listLegislativePropositionsCtrl.setSortDirection = function(direction) {
         $listLegislativePropositionsCtrl.sort.direction = direction;
      }

      //filter update
      //keywords
      $scope.$watch("$listLegislativePropositionsCtrl.filter.keywords", function (newValue, oldValue) {
         //keywords updated
         if(newValue != oldValue) {
            $listLegislativePropositionsCtrl.clearMessage();
            _updateLegislativePropositionsList().catch(function (error) {
               $listLegislativePropositionsCtrl.errorMessage = error.message;
            });
         }
      });
      //number filter
      $scope.$watch("$listLegislativePropositionsCtrl.filter.number", function (newValue, oldValue) {
         //number filter updated
         if(newValue != oldValue) {
            $listLegislativePropositionsCtrl.clearMessage();
            _updateLegislativePropositionsList().catch(function(error) {
               $listLegislativePropositionsCtrl.errorMessage = error.message;
            });
         }
      });
      //year filter
      $scope.$watch("$listLegislativePropositionsCtrl.filter.year", function (newValue, oldValue) {
         //year filter updated
         if(newValue != oldValue) {
            $listLegislativePropositionsCtrl.clearMessage();
            _updateLegislativePropositionsList().catch(function(error) {
               $listLegislativePropositionsCtrl.errorMessage = error.message;
            });
         }
      });
      //publication date, begin
      $scope.$watch("$listLegislativePropositionsCtrl.filter.date1", function (newValue, oldValue) {
         //keywords updated
         if(newValue != oldValue) {
            $listLegislativePropositionsCtrl.clearMessage();
            _updateLegislativePropositionsList().catch(function (error) {
               $listLegislativePropositionsCtrl.errorMessage = error.message;
            });
         }
      });

      //publication date, end
      $scope.$watch("$listLegislativePropositionsCtrl.filter.date2", function (newValue, oldValue) {
         //keywords updated
         if(newValue != oldValue) {
            $listLegislativePropositionsCtrl.clearMessage();
            _updateLegislativePropositionsList().catch(function(error) {
               $listLegislativePropositionsCtrl.errorMessage = error.message;
            });
         }
      });

      //type filter
      $scope.$watch("$listLegislativePropositionsCtrl.filter.type", function (newValue, oldValue) {
         //type filter updated
         if(newValue != oldValue) {
            $listLegislativePropositionsCtrl.clearMessage();
            _updateLegislativePropositionsList().catch(function(error) {
               $listLegislativePropositionsCtrl.errorMessage = error.message;
            });
         }
      });

      //sort field
      $scope.$watch("$listLegislativePropositionsCtrl.sort.field", function (newValue, oldValue) {
         //sort field filter updated
         if(newValue != oldValue) {
            $listLegislativePropositionsCtrl.clearMessage();
            _updateLegislativePropositionsList().catch(function(error) {
               $listLegislativePropositionsCtrl.errorMessage = error.message;
            });
         }
      });

      $scope.$watch("$listLegislativePropositionsCtrl.sort.direction", function (newValue, oldValue) {
         //sort direction updated
         if(newValue != oldValue) {
            $listLegislativePropositionsCtrl.clearMessage();
            _updateLegislativePropositionsList().catch(function(error) {
               $listLegislativePropositionsCtrl.errorMessage = error.message;
            });
         }
      });
   }
})();
