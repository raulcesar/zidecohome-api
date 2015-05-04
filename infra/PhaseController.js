/**
 * Created by raul on 09/04/2015
 */

'use strict';
var _ = require('lodash');

function PhaseController(phases) {
    this.phases = {};
    if (phases) {
        if (_.isArray(phases)) {
            for (var i = 0; i < phases.length; i++) {
                var etapaName;
                if (_.isString(phases[i])) {
                 etapaName = phases[i];
                } else {
                    etapaName = phases[i].nome;
                }
                
                //Must be string.
                var etapa = {concluida: false};
                this.phases[etapaName] = etapa;
            }


        } else {
            this.phases = phases;
        }

    }
}

PhaseController.prototype = {
    allPhasesDone: function(cbOrObjectOnEndAllPhases) {

        for (var key in this.phases) {
            
            // check also if property is not inherited from prototype
            if (this.phases.hasOwnProperty(key)) {
                var value = this.phases[key].concluida;
                if (value === false) {
                    return false;
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
        this.phases[phaseName].concluida = true;
        return this.allPhasesDone(cbOrObjectOnEndAllPhases);
    }

};


module.exports = PhaseController;
