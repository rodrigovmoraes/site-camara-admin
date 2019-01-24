(function() {
   'use strict';

   angular.module('SiteCamaraAdminApp').controller('EventsCalendarController', EventsCalendarController);

   EventsCalendarController.$inject = ['settings', '$scope']
   function EventsCalendarController(settings, $scope) {
      var $ctrl = this;

      $scope.isGoogleApiSignedIn = false;

      $ctrl.handleGoogleApiClientLoad = function () {
    	    gapi.load('client:auth2', $ctrl.initGoogleApiClient);
      }

      /**
      *  Called when the signed in status changes, to update the UI
      *  appropriately. After a sign-in, the API is called.
      */
	  $ctrl.updateSigninStatus = function (isSignedIn) {
	  		$scope.isGoogleApiSignedIn = isSignedIn;
	  		if (isSignedIn) {
	  			var googleUser = gapi.auth2.getAuthInstance().currentUser.get();
	  			var googleUserProfile = googleUser ? googleUser.getBasicProfile() : null;
	  			if (googleUserProfile) {
					$scope.googleUserApiSignedIn =  googleUserProfile.getEmail();
	  			} else {
	  				$scope.googleUserApiSignedIn = null;
	  			}
	  		} else {
	  			$scope.googleUserApiSignedIn = null;
	  		}

	  		$scope.$apply();
	  }

	  $scope.getCamaraGoogleApiUser = function() {
	  	    return settings.GoogleCalendarService.camaraProfile;
	  }

	  $scope.isCamaraLoggedInGoogleApi = function() {
	  	    return $scope.isGoogleApiSignedIn &&
	  				$scope.googleUserApiSignedIn == $scope.getCamaraGoogleApiUser();
	  }

 	  /**
       *  Initializes the API client library and sets up sign-in state
       *  listeners.
      */
      $ctrl.initGoogleApiClient = function () {
        gapi.client.init({
          apiKey: settings.GoogleCalendarService.apiKey,
          clientId: settings.GoogleCalendarService.clientId,
          discoveryDocs: settings.GoogleCalendarService.discoveryDocs,
          scope: settings.GoogleCalendarService.scope
        }).then(function () {
          // Listen for sign-in state changes.
          gapi.auth2.getAuthInstance().isSignedIn.listen($ctrl.updateSigninStatus);

          // Handle the initial sign-in state.
          $ctrl.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        });
      }

      $ctrl.handleGoogleApiClientLoad();
   }
})();
