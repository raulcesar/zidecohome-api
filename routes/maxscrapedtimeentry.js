/**
 * Created by raul on 22/05/2015.
 */
'use strict';

function handleGet(req, res) {
    var orm = req.ormmodels.orm;
    var filtro = req.query;

    //Get the current user and include id in where clause.
    var query = req.app.get('zUtils').getOrm2UserIdFindFilter(req);
    if (!query) {
        res.sendStatus(500);
        return;
    }

    if (filtro.start) {
        query.and = query.and || [];
        query.and.push({
            entryTime: orm.gte(filtro.start)
        });
    }
    if (filtro.end) {
        query.and = query.and || [];
        query.and.push({
            entryTime: orm.lt(filtro.end)
        });
    }

    req.ormmodels.TimeEntry.getLastScrapedEntry(query).then(function(maxdate) {
        if (!maxdate) {
            res.sendStatus(204);
            return;
        }
        res.send(maxdate);
    });
    return;


}

//Return API
module.exports = {
    version: '1.0',
    get: handleGet
};
