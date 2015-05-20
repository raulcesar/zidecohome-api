'use strict';
/**
 * Este arquivo configura os recursos (resources)  das aplciacoes. 
 * Aqui determina se são protegidos ou publicos por ambiente.
 * Cada recurso pode ter uma árvore de sub-recursos.



 * Sub-Recursos podem ser aninhados indefinidamente.
 * Comentado abaixo, segue um exemplo indicando um sub-recurso DEPENDENTE com seu próprio historicolotacao.
 * Perceba que o sub-recurso do dependente (historicolotacao) tem o mesmo nome do sub-recurso da pessoa (historicolotacao)
 * Isso NÃO gera conflito, pois os handlers teriam os seguintes nomes:
 * Para /pessoa/:id/historicolotacao ---> pessoahistoricolotacao.js
 * Para /pessoa/:id/dependente/:id/historicolotacao ---> pessoadependentehistoricolotacao.js


 * O sub-recurso abaixo é apenas um exemplo. 
 * Ele não existe, mas não deve ser eliminado o comentario para efeitos de documentação.
 * {
 *     resourceName: 'dependente',
 *     validOperations : [
 *         {verb: 'get', func: 'get', idInRoute:false},
 *         {verb: 'get', func: 'find', idInRoute:true},
 *         {verb: 'post', func: 'ins', idInRoute:false},
 *         {verb: 'put', func: 'upd', idInRoute:true},
 *         {verb: 'delete', func: 'del', idInRoute:true}
 *     ],
 *     subresources: [
 *         'historicolotacao'
 *     ]
 * }
*/
var conf = {};

conf.defaults = {
    // resources: {

    protegido: [
    'timeentry',
    'timeperiod'

        // 'pocpool',
        // 'pochello',

        // {
        //     resourceName: 'usuariocorrente',
        //     validOperations: [{
        //         verb: 'get',
        //         func: 'get',
        //         idInRoute: false
        //     }, {
        //         verb: 'get',
        //         func: 'find',
        //         idInRoute: true
        //     }],
        //     subresources: [{
        //         resourceName: 'foto',
        //         validOperations: [{
        //             verb: 'get',
        //             func: 'find',
        //             idInRoute: true
        //         }, {
        //             verb: 'post',
        //             func: 'ins',
        //             idInRoute: true
        //         }, {
        //             verb: 'delete',
        //             func: 'del',
        //             idInRoute: true
        //         }]
        //     }]
        // },




    ],


    public: [
        'simpleroute',
        'currency',
        'scrape',
        
        'zidecouser', {
            resourceName: 'servicerequest',
            validOperations: [{
                    verb: 'get',
                    func: 'find',
                    idInRoute: true
                }, {
                    verb: 'get',
                    func: 'get',
                    idInRoute: false
                }, {
                    verb: 'post',
                    func: 'ins',
                    idInRoute: false
                }
            ]

        }

    ]
};

module.exports = conf;
