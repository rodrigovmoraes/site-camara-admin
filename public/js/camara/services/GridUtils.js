(function() {
"use strict";

   //*****************************************************************
   //******************** Methods for grid UI ************************
   //*****************************************************************
   angular.module('SiteCamaraAdminApp').service('GridUtils', GridUtils);

   GridUtils.$inject = [];
   function GridUtils() {
      var GridUtils = this;

      GridUtils.populateSelectFiltersOptions = function(selectFilters, gridOptions) {
         var i;
         for(i = 0; i < selectFilters.length; i++) {
            var selectFilter = selectFilters[i];
            var column = _.find(gridOptions.columnDefs, { field: selectFilter.field });
            if(column.filter && column.filter.selectOptions) {
                  column.filter.selectOptions = selectFilter.values;
            }
         }
      }

      //builtOptions: this function can be used in angular ui grids to create
      //a select filter based in the values of a specific field
      //of a data source.
      //It builds an array of objects with two fields: value and label.
      //value and label have the values of the specific field in the data source
      //and the elements in this array are unique.
      //For example, for an array of objects (data source)
      //
      //   datasource = [ {field1: 'v1', field2, 'v2'},
      //                  {field1: 'v3', field2, 'v4'},
      //                  {field1: 'v5', field2, 'v4'},
      //                  {field1: 'v6', field2, 'v2'}
      //                ]
      // builtOptions(datasource, 'field2') would return
      //
      // [ {value: 'v2', label: 'v2'},
      //   {value: 'v4', label: 'v4'}
      // ]
      GridUtils.builtOptions = function(dataSource, fieldName) {
         var options = [];
         for(var i = 0; i < dataSource.length; i++) {
            var dataSourceItem = dataSource[i];
            if(! _.find(options, Utils. fieldEqualsTo('value', dataSourceItem[fieldName])) ){
               options.push({ value: dataSourceItem[fieldName], label: dataSourceItem[fieldName] });
            }
         }
         return _.sortBy(options, function(e){ return e.value });
      };

      //dateCondition: it creates a condition that can be used in
      //angular ui grids to create a date condition to filters.
      //
      //cell values in the grid in the field of the filter
      //must be a date (the type of the column must be date) and the search
      //term must be an array of two dates (begin date and end date)

      //minDefaultDate is the date value used when searchTerm[0] is undefined
      //and maxDefaultDate is the date value used when
      //searchTerm[1] is undefined
      GridUtils.dateCondition = function (minDefaultDate, maxDefaultDate) {
            return function(searchTerm, cellValue) {
                  var date1, date2;
                  //from
                  if(!searchTerm[0]) {
                     date1 = new Date(0);
                  } else {
                     date1 = searchTerm[0];
                  }
                  //to
                  if(!searchTerm[1]) {
                     date2 = new Date(2100, 1, 1);
                  } else {
                     date2 = searchTerm[1];
                  }
                  //filter
                  return cellValue >= date1 &&
                           cellValue <= date2;
            }
      }

      //*********************************************
      //* Methods for mocking
      //*********************************************
      GridUtils.applyFiltering = function(dataSource, paginationOptions, dateCondition) {
         var filteredDataSource = dataSource;

         if(paginationOptions !== undefined && paginationOptions.filtering !== null) {
            var filtering = paginationOptions.filtering;

            for(var i = 0; i < filtering.length; i++) {
               var filter = filtering[i];
               if(filter.type === 'string'){
                  //combobox filter
                  if(filter.filterType === 'select') {
                     if(filter.term !== null) {
                        filteredDataSource = _.filter(filteredDataSource, [filter.field, filter.term]);
                     }
                  }
                  //filter typed by the user
                  else{
                     filteredDataSource = _.filter(filteredDataSource, function(value) {
                        var cellValue = value[filter.field];
                        cellValue = cellValue !== undefined && cellValue !== null ? cellValue.trim().toLowerCase() : "";
                        var term = filter.term !== undefined && filter.term !== null ? filter.term.trim().toLowerCase() : "";
                       return cellValue.startsWith(term);
                     });
                  }
               }
               //custom date filter, the term is an array of two date: begin date and end date
               else if(filter.type === 'date') {
                  dateCondition
                  filteredDataSource = _.filter(filteredDataSource, function(value) {
                     var cellValue = value[filter.field];
                     if(dateCondition) {
                        return dateCondition(filter.term, cellValue)
                     } else {
                        return GridUtils.dateCondition(new Date(0), new Date(2050, 0, 1))(filter.term, cellValue);
                     }

                  });
               } else {
                  if(filter.term !== null) {
                     filteredDataSource = _.filter(filteredDataSource, [filter.field, filter.term]);
                  }
               }
            }
         }

         return filteredDataSource;
      }

      GridUtils.applySorting = function(dataSource, paginationOptions) {
         paginationOptions.sortColumns = _.orderBy(paginationOptions.sortColumns,['priority'],['asc']);
         if(paginationOptions !== undefined && paginationOptions.sortColumns !== null) {
            return _.orderBy(dataSource, _.map(paginationOptions.sortColumns, 'field'), _.map(paginationOptions.sortColumns, 'direction'));
         } else {
            return dataSource;
         }
      }

      GridUtils.applyPagination = function(dataSource, paginationOptions) {
         var offset = 0;
         var limit = dataSource.length;

         if(paginationOptions !== undefined) {
            offset = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
            limit = paginationOptions.pageSize;
         }

         var rDataSource = dataSource.slice(offset, offset + limit);
         rDataSource.totalLength = dataSource.length;
         return rDataSource;
      }
      //*********************************************
      //END: Methods for mocking
      //*********************************************

      //Util functions for applyGrid
      //_handleFiltering
      GridUtils._handleFiltering = function(instance, controllerInstance) {
         var grid = instance.grid;
         var filtering = [];
         //for each column in the grid
         var i;
         for(i = 0; i < grid.columns.length; i++) {
            var column = grid.columns[i];
            //for each filter in the column
            var j;
            for(j = 0; j < column.filters.length; j++) {
               var filter = column.filters[j];
               if(filter.term !== undefined) {
                  filtering.push({
                     field: column.colDef.field,
                     type: column.colDef.type,
                     term: filter.term,
                     filterType: filter.type !== undefined && filter.type === 'select' ? 'select' : 'ordinary'
                  });
               }
            }
         }
         controllerInstance.paginationOptions.filtering = filtering;
         controllerInstance.getPage();
      }
      //_handleSorting
      GridUtils._handleSorting = function(controllerInstance, sortColumns) {
         if (sortColumns.length == 0) {
           controllerInstance.paginationOptions.sortColumns = null;
         } else {
           //sort by sort priority
           //trasform the sortColumns in to a simplified array
           //of objects which is accepted by the API
           //[ { field: 'field1', direction: 'asc', priority: 1 },
           //      ..]
           var paginationOptionsSortColumns = [];
           var j;
           for(j = 0; j < sortColumns.length; j++) {
              var sorting = sortColumns[j];
              paginationOptionsSortColumns.push({ 'field': sorting.field,
                                                  'direction': sorting.sort.direction ? sorting.sort.direction : 'asc',
                                                  'priority' : sorting.sort.priority,
                                                });
           }
           controllerInstance.paginationOptions.sortColumns = paginationOptionsSortColumns;
           controllerInstance.getPage();
         }
      }
      //END: Util functions for applyGrid

      //Generic function to handle Grid component
      //@param callback function which is called for
      //       refreshing the grid, it accepts
      //       two arguments: lPage, lPageSize.
      //                     -lPage is the page number chosen by the users
      //                     -lPageSize is the page size of the pagination
      //                      options
      //
      // An example of callback function:
      //
      // function(page, pageSize) {
      //    UserService.getUsers($ctrl.paginationOptions).then(function(result) {
      //       ...
      //    }
      // }
      GridUtils.applyGrid = function($scope, controllerInstance, options, callback) {

         controllerInstance.paginationOptions = {
            pageNumber: 1,
            pageSize: 10,
            sortColumns: null,
            filtering: null
         };

         controllerInstance.pager = {
             totalItems: 1,
             currentPage: controllerInstance.paginationOptions.pageNumber,
             pageChanged : function() {
                 controllerInstance.paginationOptions.pageNumber = controllerInstance.pager.currentPage;
                 controllerInstance.getPage();
             },
             itemsPerPage: controllerInstance.paginationOptions.pageSize,
             maxSize: 5,
             totalPages: 1
         };

         controllerInstance.instanceGrid = {
            enablePaginationControls: false,
            enableFiltering: true,
            useExternalPagination: true,
            useExternalSorting: true,
            useExternalFiltering: true,
            paginationPageSize: 10,
            minRowsToShow: 13,
            data: [],
            columnDefs: [],
            onRegisterApi: function(gridApi) {
                 controllerInstance.gridApi = gridApi;
                 //grid filtering
                 controllerInstance.gridApi.core.on.filterChanged($scope, function() {
                    GridUtils._handleFiltering(this, controllerInstance);
                 });
                 //grid sorting
                 controllerInstance.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                    GridUtils._handleSorting(controllerInstance, sortColumns);
                 });
            }
         };

         controllerInstance.instanceGrid = _.assignIn(controllerInstance.instanceGrid, options);

         controllerInstance.getPage = function(message) {
            var lPage = controllerInstance.paginationOptions.pageNumber;
            var lPageSize = controllerInstance.paginationOptions.pageSize;

            callback(lPage, lPageSize, message);
         };

         controllerInstance.refresh = function(message){
            controllerInstance.getPage(message);
         }

        controllerInstance.getPage();
      }
      //END: GridUtils.applyGrid

      GridUtils.setDataNotFound = function(ctrlInstance) {
         ctrlInstance.instanceGrid.data = [];
         ctrlInstance.instanceGrid.totalItems = 0;
         //update pager
         ctrlInstance.pager.totalItems = ctrlInstance.instanceGrid.totalItems;
         ctrlInstance.pager.itemsPerPage = 1;
         ctrlInstance.pager.totalPages = Math.ceil(ctrlInstance.pager.totalItems / ctrlInstance.pager.itemsPerPage);
      }

      GridUtils.setFoundData = function(ctrlInstance, data, totalLength, pageSize, selectFilters) {
         ctrlInstance.instanceGrid.data = data;
         ctrlInstance.instanceGrid.totalItems = totalLength;
         if(selectFilters){
            GridUtils.populateSelectFiltersOptions(selectFilters, ctrlInstance.instanceGrid);
         }

         //update pager
         ctrlInstance.pager.totalItems = ctrlInstance.instanceGrid.totalItems;
         ctrlInstance.pager.itemsPerPage = pageSize;
         ctrlInstance.pager.totalPages = Math.ceil(ctrlInstance.pager.totalItems / ctrlInstance.pager.itemsPerPage);
         if(ctrlInstance.paginationOptions.pageNumber > ctrlInstance.pager.totalPages) {
             ctrlInstance.pager.currentPage = ctrlInstance.pager.totalPages;
             ctrlInstance.paginationOptions.pageNumber = ctrlInstance.pager.totalPages;
             ctrlInstance.getPage();
         }
      }

      //templating
      GridUtils.columnFieldTemplate = function(fieldName) {
         return '<div class="ui-grid-cell-contents" ng-attr-title="{{COL_FIELD.' + fieldName + '}}">{{COL_FIELD.' + fieldName + '}}</div>';
      }

      GridUtils.booleanColumnTemplate = function(trueValue, falseValue) {
         return '<div class="ui-grid-cell-contents">{{COL_FIELD ? "' + trueValue + '" : "' + falseValue + '"}}</div>';
      }

      GridUtils.filterHeaderTemplate = function() {
         return '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters">' +
                   '<camara-grid-date-filter filter="colFilter">' +
                   '</camara-grid-date-filter>' +
                '</div>'
      }

      GridUtils.editButtonCellTemplate = function(ngClick) {
         return '<div class="div-buttons">' +
                  '<button type="button" class="btn btn-primary btn-in-cell" ng-click="'+ ngClick + '">Editar</button>' +
                '</div>'
      }
   }

})();
