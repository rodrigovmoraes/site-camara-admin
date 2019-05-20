'use strict';

/**
 * Class to provide the machine functionality
 * in synchronous mode.
 *
 * @param {Object} $q
 * @param {Object} $injector
 * @constructor
 */
function SyncStrategy($q, $injector) {
    MachineStrategy.call(this);
    this.currentState = null;

    this.$q = $q;
    this.$injector = $injector;

    // Handles the promises to create a chain.
    this.lastPromise = null;
}

/**
 * Initializes the prototype.
 *
 * @type {MachineStrategy}
 */
MachineStrategy.prototype = new MachineStrategy();

/**
 * Initializes the machine and sets the current state with the init state.
 *
 * @param {MachineConfiguration} machineConfiguration
 */
SyncStrategy.prototype.initialize = function(machineConfiguration) {
    machineConfiguration.configure();
    var states = machineConfiguration.getStates();
    this.currentState = states['init'];
    this.currentState.params = {};
};

/**
 * Gets the current state.
 *
 * @returns {String}
 */
SyncStrategy.prototype.getCurrentState = function() {
    var fsm = this;
    return this.$q.when(this.lastPromise)
      .then(function(){
          return fsm.currentState.name;
      })
      .catch(function(){
          return fsm.$q.when(fsm.currentState.name);
      });
};

/**
 * Gets an array of the states.
 *
 * @param {MachineConfiguration} machineConfiguration
 * @returns {Array}
 */
SyncStrategy.prototype.getStates = function(machineConfiguration) {
    return Object.keys(machineConfiguration.getStates());
};

/**
 * Gets an array of the messages.
 *
 * @param {MachineConfiguration} machineConfiguration
 * @returns {Array}
 */
SyncStrategy.prototype.getMessages = function(machineConfiguration) {
    return machineConfiguration.getMessages();
};

/**
 * Checks if the specific message is one of the messages of the machine.
 *
 * @param {MachineConfiguration} machineConfiguration
 * @param {String} message
 * @returns {boolean}
 */
SyncStrategy.prototype.hasMessage = function(machineConfiguration, message) {
    var messages = machineConfiguration.getMessages();
    return (messages.indexOf(message) >= 0);
};

/**
 * Checks if the specific message is available for the current state.
 *
 * @param {MachineConfiguration} machineConfiguration
 * @param {String} message
 * @returns {boolean}
 */
SyncStrategy.prototype.isAvailable = function(machineConfiguration, message) {
    var fsm = this;
    var transitions = machineConfiguration.getTransitions();
    return this.$q.when(this.lastPromise)
      .then(function(){
          console.log('available');
          var edges = transitions[fsm.currentState.name];
          return edges.hasOwnProperty(message);
      })
      .catch(function(){
          var edges = transitions[fsm.currentState.name];
          return fsm.$q.when(edges.hasOwnProperty(message));
      });
};

/**
 * Gets an array of the messages available for the current state.
 *
 * @param {MachineConfiguration} machineConfiguration
 * @returns {Array}
 */
SyncStrategy.prototype.available = function(machineConfiguration) {
    var fsm = this;
    var transitions = machineConfiguration.getTransitions();
    return this.$q.when(this.lastPromise)
      .then(function(){
          var edges = transitions[fsm.currentState.name];
          return Object.keys(edges);
      })
      .catch(function(){
          var edges = transitions[fsm.currentState.name];
          return fsm.$q.when(Object.keys(edges));
      });
};

/**
 * Sends a message to the state machine and changes
 * the current state according to the transitions.
 *
 * @param {MachineConfiguration} machineConfiguration
 * @param {String} message
 * @param {Object} [parameters]
 */
SyncStrategy.prototype.send = function(machineConfiguration, message, parameters) {

    var fsm = this;

    this.lastPromise = this.$q.when(this.lastPromise).then(function(){

        // TODO: isAvailable depends on lastPromise, but it should use inside this function. Cycle.
        // Retrieves all transitions.
        var transitions = machineConfiguration.getTransitions();
        var edges = transitions[fsm.currentState.name];

        // Checks if the configuration has the message and it is available for the current state.
        if (!fsm.hasMessage(machineConfiguration, message) || !edges.hasOwnProperty(message)) {
            // If the action is rejected we delete the promise stack.
            fsm.lastPromise = null;
            return fsm.$q.reject();
        }

        // Gets the edge related with the message.
        var edge = edges[message];

        // If the edge is an array it defines a list of transitions that should have a predicate
        // and a final state. The predicate is a function that returns true or false and for each message
        // only one predicate should return true.
        if (edge instanceof Array) {
            var passed = [];
            // Checks the predicate for each transition in the edge.
            for (var i in edge) {
                var transition = edge[i];
                // Checks predicate and if it passes add the final state to the passed ones.
                if (fsm.$injector.invoke(transition.predicate, this, fsm.currentState)) {
                    passed.push(transition.to);
                }
            }

            // Checks if more than one predicate returned true. It is an error.
            if (passed.length > 1) {
                throw 'Unable to execute transition in state \'' + fsm.currentState.name + '\'. ' +
                'More than one predicate is passed.';
            }

            // Replace the edge with the unique finale state.
            edge = passed[0];
        }

        // Retrieves the next state that will be the final one for this transition.
        var states = machineConfiguration.getStates();
        var state = states[edge];

        // Creates a copy of the current state. It is more secure against accidental changes.
        var args = {};
        args = angular.merge(args, fsm.currentState);
        delete args.action;

        // If some parameters are provided it merges them into the current state.
        if (parameters) {
            angular.merge(args.params, parameters);
        }

        var result = undefined;
        if (state.action && (typeof state.action === 'function' || Object.prototype.toString.call(state.action) === '[object Array]')) {
            result = fsm.$injector.invoke(state.action, fsm, args);
        }

        // Executes the action defined in the state by passing the current state with the parameters. Since it is not
        // possible to determine if the result is a promise or not it is wrapped using $q.when and treated as a promise
       return fsm.$q.when(result)
         .then(function (result) {

            // Checks the result of the action and sets the parameters of the new current state.
            if (!result && fsm.currentState.params) {
                state.params = fsm.currentState.params;
            }
            else {
                // Creates the parameters if the state doesn't have them.
                if (!state.hasOwnProperty('params')) {
                    state.params = {};
                }

                // Merges the state parameters with the result.
                angular.merge(state.params, result);
            }

            // Sets the new current state.
            fsm.currentState = state;
        })
         .catch(function () {
             // If the action is rejected we delete the promise stack.
             fsm.lastPromise = null;
             return fsm.$q.reject();
         });
    });

    return this.lastPromise;
};
