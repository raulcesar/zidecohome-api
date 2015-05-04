'use strict';
var _ = require('lodash');
var moment = require('moment');

function ZidecoUser(userOrusername) {
    if (_.isString(userOrusername)) {
        this.username = userOrusername;
    } else {
        _.assign(this, userOrusername);
    }
}

ZidecoUser.prototype = {
    hasValidRole: function(codigo) {
        var self = this;
        if (!self.historicoPerfis || self.historicoPerfis.length <= 0) {
            return false;
        }
        var index = self.perfilIndex[codigo];
        if (!_.isUndefined(index)) {
            var historicoPerfil = self.historicoPerfis[index];
            //Verifica se o perfil não está disabled
            if (historicoPerfil.perfil.disabled === true) {
                return false;
            }

            //verifica se o perfil está valido na data de hoje.
            if (!_.isNull(historicoPerfil.dataFim) &&
                !_.isUndefined(historicoPerfil.dataFim) &&
                moment(historicoPerfil.dataFim).isBefore(moment())) {
                return false;
            }

            //Tem o perfil e está valido.
            return true;

        }

        return false;
    },

    isValid: function() {
        var self = this;
        if (self.hidratedUser.disabled === true) {
            return false;
        }
        if (moment(self.hidratedUser.dataValidade).isBefore(moment())) {
            return false;
        }
        return true;
    }
};

module.exports = ZidecoUser;