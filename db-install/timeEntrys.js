var moment = require('moment');
module.exports = 
    [
        //Lets put in some "invalids"
        // moment('04-05-2015 06:05', 'DD-MM-YYYY HH:mm'), //INVALID(for tests... did not really register this!)
        moment('04-05-2015 08:05', 'DD-MM-YYYY HH:mm'),
        moment('04-05-2015 18:24', 'DD-MM-YYYY HH:mm'),


        // moment('05-05-2015 06:05', 'DD-MM-YYYY HH:mm'),//INVALID(for tests... did not really register this!)
        // moment('05-05-2015 06:02', 'DD-MM-YYYY HH:mm'),//INVALID(for tests... did not really register this!)

        moment('05-05-2015 08:38', 'DD-MM-YYYY HH:mm'),
        moment('05-05-2015 14:28', 'DD-MM-YYYY HH:mm'),
        moment('05-05-2015 15:21', 'DD-MM-YYYY HH:mm'),
        moment('05-05-2015 19:08', 'DD-MM-YYYY HH:mm:ss'), //Entrada da noturna. Deve ser duplicado.
        moment('05-05-2015 21:01', 'DD-MM-YYYY HH:mm'), //Saida da noturna
        // moment('06-05-2015 00:02', 'DD-MM-YYYY HH:mm'),//POSSIBLE CAP... INVALID (for tests... did not really register this!)



        moment('06-05-2015 07:56', 'DD-MM-YYYY HH:mm'),
        moment('06-05-2015 11:51', 'DD-MM-YYYY HH:mm'),
        moment('06-05-2015 13:34', 'DD-MM-YYYY HH:mm'),
        moment('06-05-2015 19:05', 'DD-MM-YYYY HH:mm'),
        moment('06-05-2015 21:01', 'DD-MM-YYYY HH:mm'), //Saida da noturna


        moment('07-05-2015 07:49', 'DD-MM-YYYY HH:mm'),
        moment('07-05-2015 12:51', 'DD-MM-YYYY HH:mm'),
        moment('07-05-2015 14:18', 'DD-MM-YYYY HH:mm'),
        moment('07-05-2015 19:08', 'DD-MM-YYYY HH:mm'),


        moment('08-05-2015 08:11', 'DD-MM-YYYY HH:mm'),
        moment('08-05-2015 11:53', 'DD-MM-YYYY HH:mm'),
        moment('08-05-2015 13:32', 'DD-MM-YYYY HH:mm'),
        moment('08-05-2015 18:25', 'DD-MM-YYYY HH:mm'),

        moment('11-05-2015 08:03', 'DD-MM-YYYY HH:mm'),
        moment('11-05-2015 11:55', 'DD-MM-YYYY HH:mm'),
        moment('11-05-2015 15:19', 'DD-MM-YYYY HH:mm'),
        moment('11-05-2015 19:00', 'DD-MM-YYYY HH:mm'),

        moment('12-05-2015 07:59', 'DD-MM-YYYY HH:mm'),
        moment('12-05-2015 12:51', 'DD-MM-YYYY HH:mm'),
        moment('12-05-2015 14:31', 'DD-MM-YYYY HH:mm'),
        moment('12-05-2015 19:13', 'DD-MM-YYYY HH:mm'),
        moment('12-05-2015 21:01', 'DD-MM-YYYY HH:mm'),

        //TODO: Aqui, temos um atestado de comparecimento!!!!!
        moment('13-05-2015 08:44', 'DD-MM-YYYY HH:mm'),
        moment('13-05-2015 11:56', 'DD-MM-YYYY HH:mm'),
        moment('13-05-2015 13:31', 'DD-MM-YYYY HH:mm'),
        moment('13-05-2015 19:07', 'DD-MM-YYYY HH:mm'),
        moment('13-05-2015 21:04', 'DD-MM-YYYY HH:mm'),

        moment('14-05-2015 07:55', 'DD-MM-YYYY HH:mm'),
        moment('14-05-2015 12:48', 'DD-MM-YYYY HH:mm'),
        moment('14-05-2015 14:18', 'DD-MM-YYYY HH:mm')


    ];
