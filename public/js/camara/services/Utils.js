(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').service('Utils', Utils);

   Utils.$inject = [];
   function Utils() {
      var Utils = this;

      Utils.randomFrom = function(arr) {
         var i = Math.floor((Math.random() * arr.length));
         return arr[i];
      };

      Utils.random = function(rangeStart, rangeEnd) {
         return  Math.floor( Math.random() * (rangeEnd - rangeStart + 1) + rangeStart );
      };

      Utils.randomDate = function(ys, ms, ds, ye, me, de) {
         var rdate = new Date( _random( (new Date(ys,ms,ds)).getTime(),
                                        (new Date(ye,me,de)).getTime()
                                      )
                             );
         rdate.setHours(0);
         rdate.setMinutes(0);
         rdate.setSeconds(0);
         rdate.setMilliseconds(0);
         return rdate;
      };

      //fieldEqualsTo: returns a function which can be used to compare
      //a field of objects in an array
      //with a specific value.

      //For example: given a function called filter wich accepts an array and
      //another function as parameters and returns all
      //elements in the array which when passed as parameter of fp,
      //fp returns true then fieldEqualsTo can be used to filter
      //elements which have a specific value in a specific field.

      //For example: for an array of objects
      //   arr = [ {field1: 'xxxx', field2, 'xxxx12'},
      //           {field1: 'xxxx21', field2, 'xxxx22'},
      //           {field1: 'xxxx31', field2, 'xxxx32'},
      //           {field1: 'xxxx', field2, 'xxxx42'}
      //         ]
      //
      // filter(arr, fieldEqualsTo('field1', 'xxxx')) would return
      //
      //   [ {field1: 'xxxx', field2, 'xxxx12'},
      //     {field1: 'xxxx', field2, 'xxxx42'}
      //   ]
      Utils.fieldEqualsTo = function(fieldName, value){
         return function(element) {
            return element[fieldName] === value;
         }
      }

      //define functions for message control in a controller
      Utils.applyMessageControls = function(controller) {
         controller.clearMessage = function() {
            controller.errorMessage = "";
            controller.warnMessage = "";
            controller.message = "";
         }

         controller.setErrorMessage = function(message) {
            controller.clearMessage();
            controller.errorMessage = message;
         }

         controller.setMessage = function(message) {
            controller.clearMessage();
            controller.message = message;
         }

         controller.setWarnMessage = function(message) {
            controller.clearMessage();
            controller.warnMessage = message;
         }
      }

      Utils.templateMessage = function(messageTemplate, config) {
         return _.template(messageTemplate)(config);
      }

      //return the objects in objects wich has not the id in excludeIds
      Utils.filterAlreadyAddedElements = function(objects, excludeIds) {
         var r = [];
         if(!excludeIds) {
            excludeIds = [];
         }
         if(objects) {
            objects.forEach(function(obj) {
               //if the object id is not in excludeIds
               if(_.indexOf(excludeIds, obj._id) < 0) {
                  r.push(obj);
               }
            });
         }
         return r;
      }

   }
})();
