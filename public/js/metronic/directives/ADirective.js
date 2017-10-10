(function() {
   'use strict';

   // Handle global LINK click
   angular.module("SiteCamaraAdminApp").directive('a', ADirective);

   function ADirective() {
       return {
           restrict: 'E',
           link: function(scope, elem, attrs) {
               if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                   elem.on('click', function(e) {
                       e.preventDefault(); // prevent link click for above criteria
                   });
               }
           }
       };
   }

}());
