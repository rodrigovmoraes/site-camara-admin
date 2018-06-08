(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').filter('highlight', HighlightFilter);

   HighlightFilter.$inject = ['$sce'];
   function HighlightFilter($sce) {
      return function(input, term) {
         if(input) {
            if(term && term !== '') {
               return $sce.trustAsHtml(input.replace(new RegExp(term, "gi"), "<mark>" + term + "</mark>"));
            } else {
               return input;
            }
         } else {
            return "";
         }
      }
   }

})();
