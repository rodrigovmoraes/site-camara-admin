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
            controller.infoMessage = "";
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

      //get the ratio based on the image size
      Utils.getImageRatio = function(width, height) {
         var _mdc = function (x, y) {
              if (y == 0) {
                return x;
              } else {
                return _mdc(y, x % y);
              }
          }

          var __mdc = _mdc(width, height)

          return {
             width: width / __mdc,
             height: height / __mdc
          }
      }

      //check if the string has
      //just one token (separated by space)
      Utils.hasJustOneToken = function(strValue) {
         if(strValue) {
            return _.split(strValue, ' ').length === 1;
         } else {
            return false;
         }
      }

      Utils.isHex = function(strValue) {
         var value = parseInt(strValue, 16);
         return (value.toString(16).toLowerCase() === strValue.toLowerCase())
      }

      //check if the string has the mongo id format
      Utils.isMongoId = function(strValue) {
         if(Utils.hasJustOneToken(strValue) && strValue.length === 24) {
            var i;
            for(i = 0; i < strValue.length; i++) {
               if(!Utils.isHex(strValue.charAt(i))) {
                  return false;
               }
            }
            return true;
         } else {
            return false;
         }
      }

      //add days to a date
      Utils.addDays = function(date, days) {
         var result = new Date(date);
         result.setDate(result.getDate() + days);
         return result;
      }

      //add hours to a date
      Utils.addHours = function(date, hours) {
         var result = new Date(date);
         result.setHours(result.getHours() + hours);
         return result;
      }

      Utils.dateToYYYYMMDDFormat = function(date) {
         if (date) {
            var s = _.padStart(date.getFullYear(), 4, '0') + "-" +
                    _.padStart(date.getMonth() + 1, 2, '0') + "-" +
                    _.padStart(date.getDate(), 2, '0');
            return s;
         } else {
            return "";
         }
      }

      Utils.UTCDateToYYYYMMDDFormat = function(date) {
         if (date) {
            var s = _.padStart(date.getUTCFullYear(), 4, '0') + "-" +
                    _.padStart(date.getUTCMonth() + 1, 2, '0') + "-" +
                    _.padStart(date.getUTCDate(), 2, '0');
            return s;
         } else {
            return "";
         }
      }

      Utils.UTCDateToYYYYMMDDHHMIFormat = function(date, utcHoursOffset) {
         if (date) {
            var s = _.padStart(date.getUTCFullYear(), 4, '0') + "-" +
                    _.padStart(date.getUTCMonth() + 1, 2, '0') + "-" +
                    _.padStart(date.getUTCDate(), 2, '0') + "T" +
                    _.padStart(date.getUTCHours(), 2, '0') + ":" +
                    _.padStart(date.getUTCMinutes(), 2, '0') + ":00" +
                    (utcHoursOffset >= 0 ? "+" : "-") +
                    _.padStart(Math.abs(utcHoursOffset), 2, '0') + ":00"
            return s;
         } else {
            return "";
         }
      }

      Utils.UTCDateToDDMMYYYYFormat = function(date) {
         if (date) {
            var s = _.padStart(date.getUTCDate(), 2, '0') + "/" +
                    _.padStart(date.getUTCMonth() + 1, 2, '0') + "/" +
                    _.padStart(date.getUTCFullYear(), 4, '0');
            return s;
         } else {
            return "";
         }
      }

      Utils.UTCDateToHHhMIminFormat = function(date) {
         if (date) {
            var s = _.padStart(date.getUTCHours(), 2, '0') + "h";
            if(date.getUTCMinutes() > 0) {
               s += _.padStart(date.getUTCMinutes(), 2, '0') + "min";
            }
            return s;
         } else {
            return "";
         }
      }

      Utils.dateToDDMMYYYYFormat = function(date) {
         if (date) {
            var s = _.padStart(date.getDate(), 2, '0') + "/" +
                    _.padStart(date.getMonth() + 1, 2, '0') + "/" +
                    _.padStart(date.getFullYear(), 4, '0');
            return s;
         } else {
            return "";
         }
      }

      Utils.YYYYMMDDFormatToDate = function(str) {
         var year = parseInt(str.substr(0, 4));
         var month = parseInt(str.substr(5, 2)) - 1;
         var day = parseInt(str.substr(8, 2));

         return new Date(year, month, day);
      }

      Utils.YYYYMMDDHHMMFormatToDate = function(str) {
         return new Date(str);
      }

      var sizeInkB = function(sizeInBytes) {
         return sizeInBytes / 1024;
      }

      var sizeInMB = function(sizeInBytes) {
         return sizeInBytes / (1024 * 1024);
      }

      var sizeInGB = function(sizeInBytes) {
         return sizeInBytes / (1024 * 1024 * 1024);
      }

      Utils.formatFileSize = function(sizeInBytes) {
         //bytes
         var size = sizeInBytes;
         //try kbytes
         var auxSize = sizeInkB(sizeInBytes);
         if (auxSize < 1) {
            return _.round(size, 2) + " B";
         } else {
            size = auxSize;
         }
         //try Mbytes
         auxSize = sizeInMB(sizeInBytes);
         if (auxSize < 1) {
            return _.round(size, 2) + " kB";
         } else {
            size = auxSize;
         }
         //try Gbytes
         auxSize = sizeInGB(sizeInBytes);
         if (auxSize < 1) {
            return _.round(size, 2) + " MB";
         } else {
            size = auxSize;
            return _.round(size, 2) + " GB"
         }
      }
   }
})();
