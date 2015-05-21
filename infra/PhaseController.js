/**
 * Created by raul on 09/04/2015
 */

'use strict';
var _ = require('lodash');

function PhaseController(phases) {
    this.phasecontrolIsCounter = false;
    this.fasesComplete = 0;

    if (_.isArray(phases)) {
        this.phases = _.zipObject(phases, _.fill(_.clone(phases), false));
        this.totalPhases = phases.length;
    } else if (_.isNumber(phases)) {
        this.phasecontrolIsCounter = true;
        this.totalPhases = phases;
        this.phases = {};
    } else {
        //If we send in a number, than the "phases" themselves do not matter. Instead we just have a counter.
        this.phases = phases || {};
        this.totalPhases = _.size(phases);
    }
}

PhaseController.prototype = {
    allPhasesDone: function(cbOrObjectOnEndAllPhases) {

        if (this.phasecontrolIsCounter === true) {
            //If the phasecontroller is based on counter, no need to check every key... just compare fasesComplete to total phases
            if (this.fasesComplete < this.totalPhases) {
                return false;
            }
        } else {
            for (var key in this.phases) {
                // check also if property is not inherited from prototype
                if (this.phases.hasOwnProperty(key)) {
                    var value = this.phases[key].concluida;
                    if (value === false) {
                        return false;
                    }
                }
            }
        }
        
        if (cbOrObjectOnEndAllPhases) {
            if (_.isFunction(cbOrObjectOnEndAllPhases)) {
                cbOrObjectOnEndAllPhases();
            } else {
                cbOrObjectOnEndAllPhases.cb(cbOrObjectOnEndAllPhases.valueObj);
            }
        }
        return true;
    },

    endPhase: function(phaseName, cbOrObjectOnEndAllPhases) {
        this.fasesComplete ++;
        if (this.phases[phaseName]) {
            this.phases[phaseName].concluida = true;
        }
        
        return this.allPhasesDone(cbOrObjectOnEndAllPhases);
    }

};


module.exports = PhaseController;
