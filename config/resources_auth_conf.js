var conf = {};

//Este arquivo define autorizacao de rotas por verbo.
//Vale observar que estas autorizacoes só valem para recursos PROTEGIDOS.

conf.defaults = {
    //Define permissoes DEFAULT para leitura e escrita
    defaultPermissionsPerVerb: {
        get: ['CONSULTA', 'HOMOLOGAKD'],
        post: ['ADM', 'HOMOLOGAKD'],
        put: ['ADM', 'HOMOLOGAKD'],
        delete: ['ADM', 'HOMOLOGAKD']
    },

    autorizacoes: {
        //Este recuros usa a permissao default para GETs, e especifica que somente o perfil "ADM" pode fazer post, put ou delete.
        // pessoa: {
        //     // get: ['CONSULTA', 'SERADCEDI'],
        //     post: ['SERADCEDI'],
        //     put: ['SERADCEDI'],
        //     delete: ['SERADCEDI']
        // }

    }


};


module.exports = conf;
