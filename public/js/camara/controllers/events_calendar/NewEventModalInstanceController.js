(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').controller('NewEventModalInstanceController', NewEventModalInstanceController);

   NewEventModalInstanceController.$inject = [ '$uibModalInstance', '$scope',
                                               'GoogleCalendarService', 'messages',
                                               'Utils' ];
   function NewEventModalInstanceController( $uibModalInstance, $scope,
                                             GoogleCalendarService, messages,
                                             Utils ) {
      var $modalCtrl = this;

      //messages control
      Utils.applyMessageControls($modalCtrl);

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      //form data
      $modalCtrl.title = null;
      $modalCtrl.allDay = false;
      $modalCtrl.date = null;
      $modalCtrl.startDate = null;
      $modalCtrl.endDate = null;
      $modalCtrl.location = null;
      $modalCtrl.description = null;

      $modalCtrl.froalaOptions = {
        toolbarButtons : ["bold", "italic", "underline"],
        placeholderText: "Caso desejar, digite uma descrição para o evento.",
        charCounterMax: 300,
        pastePlain: true,
        enter: $.FroalaEditor.ENTER_BR
      };

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      $modalCtrl.close = function() {
         $uibModalInstance.dismiss('cancel');
      }

      $modalCtrl.isValid = function() {
         return $scope.newEventCalendarForm.$valid;
      }

      $modalCtrl.afterBeginValidator = function() {
         var afterDate = new Date($scope.newEventCalendarForm.endDate.$viewValue);
         if(afterDate && $modalCtrl.startDate) {
            return afterDate > $modalCtrl.startDate;
         } else {
            return true;
         }
      }

      $modalCtrl.ok = function () {
         $scope.newEventCalendarForm.$setSubmitted();

         if($modalCtrl.isValid()) {
            var endAllDay = $modalCtrl.allDay ? Utils.addDays($modalCtrl.date, 1)  : null;
            var startDate = $modalCtrl.allDay ? $modalCtrl.date : $modalCtrl.startDate ;
            var newEvent = { "summary" : $modalCtrl.title,
                             "start" : $modalCtrl.allDay ? ( { date: Utils.dateToYYYYMMDDFormat($modalCtrl.date) } ) : ( { dateTime: $modalCtrl.startDate } ),
                             "end" : $modalCtrl.allDay ? ( { date: Utils.dateToYYYYMMDDFormat(endAllDay) } ) : ( { dateTime: $modalCtrl.endDate } ),
                             "location" : $modalCtrl.location ? $modalCtrl.location : null,
                             "description" : $modalCtrl.description ? $modalCtrl.description : null
                           };
            App.blockUI();
            GoogleCalendarService.newEvent(newEvent)
                                 .then(function(result) {
                                    $uibModalInstance.close( _templateMessage(messages.calendarEventCreated,
                                                                              { description: newEvent.summary, date:  Utils.dateToDDMMYYYYFormat(startDate)}) );
                                 }).catch(function(error) {
                                    $modalCtrl.errorMessage = error.message;
                                    App.unblockUI();
                                 });
         }
      }
   }
})();
