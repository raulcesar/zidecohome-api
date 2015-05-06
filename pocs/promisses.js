'use strict';
var Q = require('q');
var etapas = [];
var transactCB = function(etapa) {
    etapas.push(etapa);
    console.log(etapa);
    if (etapas.length === 3) {
        console.log('terminei as 3 etapas');
        for (var i = 0; i < etapas.length; i++) {
            console.log(etapas[i]);
        }
    }
};

var imprimeOpcao = function(opcaoChamada) {
    var funcOpcao;
    (function() {
        var opcao = opcaoChamada;
        funcOpcao = function() {
            var msg = 'Opcao: ' + opcao;
            console.log(msg);
            return msg;
        };

    })();
    return funcOpcao;

};


var objeto = {
    impremeOpcaoTrue: imprimeOpcao(true),
    impremeOpcaoFalse: imprimeOpcao(false)
};


var funcaoBanco = function(resultado) {
    console.log('resultado na funcao banco: ' + JSON.stringify(resultado));
    var deferred = Q.defer();
    var cb = function() {
        var msg = 'concluida etapa Banco';
        transactCB(msg);
        deferred.resolve(msg);
    };
    setTimeout(cb, 500);
    console.log('called funcaoBanco. Opcao true');
    objeto.impremeOpcaoTrue();
    return deferred.promise;
};

var funcaoSocket = function(resultado) {
    console.log('resultado na funcao socket: ' + JSON.stringify(resultado));
    var deferred = Q.defer();
    var cb = function() {
        var msg = 'concluida etapa Socket';
        transactCB(msg);
        deferred.resolve(msg);
    };
    setTimeout(cb, 300);
    console.log('called funcaoSocket Opcao false');

    objeto.impremeOpcaoFalse();
    return deferred.promise;
};

var funcaoEmail = function(resultado) {
    console.log('resultado na funcao email: ' + JSON.stringify(resultado));
    var deferred = Q.defer();
    var cb = function() {
        var msg = 'concluida etapa Email';
        transactCB(msg);
        deferred.resolve(msg);

    };
    setTimeout(cb, 100);
    console.log('called funcaoEmail. Opcao default');
    imprimeOpcao();
    return deferred.promise;
};



//This test will run socket and email in paralel, but only after banco.
// funcaoBanco()
//     .then(function() {
//         funcaoSocket();
//         funcaoEmail();
//     });



//This test will run banco, then socket, then email
var rodaSocket = true;
var rodaEmail = true;
// var funcs = [];
// if (rodaSocket) {
//     funcs.push(funcaoSocket);
// }
// if (rodaEmail) {
//     funcs.push(funcaoEmail);
// }

// var result = funcaoBanco();
// funcs.forEach(function (f) {
//     result = result.then(f);
// });


funcaoBanco()
    .then(function(resultado) {
        var dbDefered = Q.defer();

        if (rodaSocket) {
            funcaoSocket(resultado).then(function() {
                dbDefered.resolve(resultado);
            });
        } else {
            dbDefered.resolve(resultado);
        }
        return dbDefered.promise;


        // if (!rodaSocket) {
        //     console.log('Não vou rodar socket!');
        //     return 'ok';
        // }
        // return funcaoSocket(resultado);

    })
    .then(function(resultado) {
        if (!rodaEmail) {
            console.log('Não vou rodar email!');
            return 'ok';
        }
        return funcaoEmail(resultado);
    });


// ;
// funcaoEmail();
