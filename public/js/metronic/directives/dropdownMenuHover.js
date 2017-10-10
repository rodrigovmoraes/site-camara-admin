(function() {
   'use strict';

   // Handle Dropdown Hover Plugin Integration
   angular.module("SiteCamaraAdminApp").directive('dropdownMenuHover', dropdownMenuHover);

   function dropdownMenuHover() {
       return {
          link: function (scope, elem) {
            elem.dropdownHover();
          }
       };
   }

}());
