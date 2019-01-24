(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').controller('EditEventModalInstanceController', EditEventModalInstanceController);

   EditEventModalInstanceController.$inject = [ '$uibModalInstance',
                                                '$scope', 'GoogleCalendarService',
                                                'messages', 'Utils', 'calendarEvent' ];
   function EditEventModalInstanceController( $uibModalInstance,
                                              $scope, GoogleCalendarService,
                                              messages, Utils, calendarEvent) {
      var $modalCtrl = this;

      //messages control
      Utils.applyMessageControls($modalCtrl);

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      //form data
      $modalCtrl.title = calendarEvent.title;
      $modalCtrl.url = calendarEvent.url ? calendarEvent.url : null;
      $modalCtrl.allDay = calendarEvent.allDay;
      $modalCtrl.date = calendarEvent.allDay ? Utils.YYYYMMDDFormatToDate(calendarEvent.start) : null;
      $modalCtrl.startDate = calendarEvent.allDay ? null : Utils.YYYYMMDDHHMMFormatToDate(calendarEvent.start);
      $modalCtrl.endDate = calendarEvent.allDay ? null : Utils.YYYYMMDDHHMMFormatToDate(calendarEvent.end);
      $modalCtrl.location = calendarEvent.location ? calendarEvent.location : null;
      $modalCtrl.description = calendarEvent.description;

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
         return $scope.editEventCalendarForm.$valid;
      }

      $modalCtrl.afterBeginValidator = function() {
         var afterDate = new Date($scope.editEventCalendarForm.endDate.$viewValue);
         if(afterDate && $modalCtrl.startDate) {
            return afterDate > $modalCtrl.startDate;
         } else {
            return true;
         }
      }

      $modalCtrl.ok = function () {
         $scope.editEventCalendarForm.$setSubmitted();

         if($modalCtrl.isValid()) {
            var endAllDay = $modalCtrl.allDay ? Utils.addDays($modalCtrl.date, 1)  : null;
            var startDate = $modalCtrl.allDay ? $modalCtrl.date : $modalCtrl.startDate ;
            var editedEvent = { "summary" : $modalCtrl.title,
                                "start" : $modalCtrl.allDay ? ( { date: Utils.dateToYYYYMMDDFormat($modalCtrl.date) } )
                                                            : ( { dateTime: $modalCtrl.startDate } ),
                                "end" : $modalCtrl.allDay ? ( { date: Utils.dateToYYYYMMDDFormat(endAllDay) } )
                                                          : ( { dateTime: $modalCtrl.endDate } ),
                                "location" : $modalCtrl.location ? $modalCtrl.location : null,
                                "description" : $modalCtrl.description ? $modalCtrl.description : null
                              };
            App.blockUI();
            GoogleCalendarService.editEvent(calendarEvent.id, editedEvent)
                                 .then(function(result) {
                                    $uibModalInstance.close( _templateMessage(messages.calendarEventChanged,
                                                                              { description: editedEvent.summary,
                                                                                date:  Utils.dateToDDMMYYYYFormat(startDate)}) );
                                 }).catch(function(error) {
                                    $modalCtrl.errorMessage = error.message;
                                    App.unblockUI();
                                 });
         }
      }

      $modalCtrl.remove = function () {
         $uibModalInstance.dismiss({ reason: 'remove', event: calendarEvent});
      }
   }
})();
