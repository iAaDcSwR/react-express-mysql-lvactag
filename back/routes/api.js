var express = require('express');
var router = express.Router();
var mysql = require('mysql');

// ============ DEAR TESTER ============
// PLEASE CHANGE SETTINGS HERE IF NEEDED

var sets = {

    user: 'root',
    password: 'root',
    host: 'localhost',
    port: 3306,
    db: 'lvactag'

}; // ==================================


var idCols = {
    users: 'UserID',
    vacations: 'VacationID'
};

var pool = mysql.createPool({
    connectionLimit: 10,
    host: sets.host,
    user: sets.user,
    password: sets.password,
    multipleStatements: true
});

function handleError(err, res) {
    var desiredProps = ['code', 'sqlMessage', 'sql'];
    let myErr = {};
    desiredProps.forEach((val) => {
        if (!(typeof err[val] == 'undefined')) {
            myErr[val] = err[val];
        }
    });
    console.error(myErr);
    res.status(400).json(myErr);
    return null;
}

router.get('/createdb', function (req, res, next) {
    pool.query("CREATE DATABASE `" + sets.db + "` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */; CREATE TABLE `" + sets.db + "`.`users` ( `UserID` int(11) NOT NULL AUTO_INCREMENT, `LastName` varchar(45) NOT NULL DEFAULT '', `FirstName` varchar(45) NOT NULL DEFAULT '', `UserName` varchar(45) NOT NULL, `Password` varchar(45) NOT NULL DEFAULT '', `IsAdmin` tinyint(1) NOT NULL DEFAULT '0', `Follows` varchar(255) NOT NULL DEFAULT '', PRIMARY KEY (`UserID`), UNIQUE KEY `UserName_UNIQUE` (`UserName`) ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci; INSERT INTO `" + sets.db + "`.`users` (`LastName`, `FirstName`, `UserName`, `Password`, `IsAdmin`) VALUES ('Amsterdamer', 'Lior', 'admin', 'admin', 1); CREATE TABLE `" + sets.db + "`.`vacations` ( `VacationID` int(11) NOT NULL AUTO_INCREMENT, `Description` varchar(255) NOT NULL DEFAULT '', `Destination` varchar(45) NOT NULL, `Picture` varchar(512) NOT NULL DEFAULT '', `StartDate` date NOT NULL, `EndDate` date NOT NULL, `Price` decimal(11,2) NOT NULL DEFAULT '0.00', `Followers` int(11) NOT NULL DEFAULT '0', PRIMARY KEY (`VacationID`) ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;", function (err, results, fields) {
        if (err) return handleError(err, res);
        res.json({'info': 'Database created successfully.', 'results': results});
    });
});

router.get('/:table', function (req, res, next) {
    let table = mysql.escapeId(sets.db + '.' + req.params.table);
    pool.query('SELECT * FROM ' + table + ';', function (err, results, fields) {
        if (err) return handleError(err, res);
        res.json(results);
    });
});

router.get('/vacations/report', function (req, res, next) {
    let table = mysql.escapeId(sets.db + '.' + 'vacations');
    pool.query('SELECT * FROM ' + table + ' WHERE Followers > 0;', function (err, results, fields) {
        if (err) return handleError(err, res);
        res.json(results);
    });
});

router.post('/users/login', function (req, res, next) {
    let table = mysql.escapeId(sets.db + '.' + 'users');
    pool.query('SELECT * FROM ' + table + 'WHERE UserName = ' + mysql.escape(req.body.UserName) + ' AND Password = ' + mysql.escape(req.body.Password) + ';', function (err, results, fields) {
        if (err) return handleError(err, res);
        res.json(results);
    });
});

router.post('/:table', function (req, res, next) {
    let table = mysql.escapeId(sets.db + '.' + req.params.table),
        dataVals = [],
        dataKeysEscaped = [];
    for (let key in req.body) { // Object prototype functions keys() and values() not fully supported
        // dataKeys.push(key); // collect keys for query
        dataVals.push(req.body[key]); // collect values for query
        dataKeysEscaped.push(mysql.escapeId(key));
    }
    pool.query('INSERT INTO ' + table + ' ' + '(' + dataKeysEscaped.join(', ') + ')' + ' VALUES (' + mysql.escape(dataVals) + ')' + ';', function (err, results, fields) {
        if (err) return handleError(err, res);
        let msgToSend = {
            info: 'New record inserted successfuly',
            newRecordId: results.insertId,
            newRecord: req.body
        };
        res.json(msgToSend);
    });
});

router.get('/:table/:id', function (req, res, next) {
    let table = mysql.escapeId(sets.db + '.' + req.params.table),
        id = mysql.escape(req.params.id),
        idCol = idCols[req.params.table] ||
        handleError({
            sqlMessage: 'Table \'' + sets.db + '.' + req.params.table + '\' doesn\'t exist'
        }, res);
    !idCol || pool.query('SELECT * FROM ' + table + ' WHERE ' + idCol + ' = ' + id + ';', function (err, results, fields) {
        if (err) return handleError(err, res);
        res.json(results);
    });
});

router.put('/:table/:id', function (req, res, next) {
    let table = mysql.escapeId(sets.db + '.' + req.params.table),
        id = mysql.escape(req.params.id),
        idCol = idCols[req.params.table] ||
        handleError({
            sqlMessage: 'Table \'' + sets.db + '.' + req.params.table + '\' doesn\'t exist'
        }, res),
        body = mysql.escape(req.body);
    !idCol || pool.query('UPDATE ' + table + ' SET ' + body + ' WHERE ' + idCol + '=' + id + ';', function (err, results, fields) {
        if (err) return handleError(err, res);
        let msgToSend = {
            info: 'Record updated successfuly',
            recordId: parseInt(req.params.id),
            record: req.body
        };
        res.json(msgToSend);
    });
});

router.put('/:table/:id/follow', function (req, res, next) {
    let table = mysql.escapeId(sets.db + '.' + req.params.table),
        id = mysql.escape(req.params.id),
        idCol = idCols[req.params.table] ||
        handleError({
            sqlMessage: 'Table \'' + sets.db + '.' + req.params.table + '\' doesn\'t exist'
        }, res);
    !idCol || pool.query('UPDATE ' + table + ' SET `Followers` = `Followers` + 1 WHERE ' + idCol + '=' + id + ';', function (err, results, fields) {
        if (err) return handleError(err, res);
        let msgToSend = {
            info: 'Tag (follow) success',
            recordId: parseInt(req.params.id)
        };
        res.json(msgToSend);
    });
});

router.put('/:table/:id/unfollow', function (req, res, next) {
    let table = mysql.escapeId(sets.db + '.' + req.params.table),
        id = mysql.escape(req.params.id),
        idCol = idCols[req.params.table] ||
        handleError({
            sqlMessage: 'Table \'' + sets.db + '.' + req.params.table + '\' doesn\'t exist'
        }, res);
    !idCol || pool.query('UPDATE ' + table + ' SET `Followers` = `Followers` - 1 WHERE ' + idCol + '=' + id + ';', function (err, results, fields) {
        if (err) return handleError(err, res);
        let msgToSend = {
            info: 'Untag (unfollow) success',
            recordId: parseInt(req.params.id)
        };
        res.json(msgToSend);
    });
});

router.delete('/:table/:id', function (req, res, next) {
    let table = mysql.escapeId(sets.db + '.' + req.params.table),
        id = mysql.escape(req.params.id),
        idCol = idCols[req.params.table] ||
        handleError({
            sqlMessage: 'Table \'' + sets.db + '.' + req.params.table + '\' doesn\'t exist'
        }, res);
    pool.query('DELETE FROM ' + table + ' WHERE ' + idCol + ' = ' + id + ';', function (err, results, fields) {
        if (err) return handleError(err, res);
        let msgToSend = null;
        if (results.affectedRows) {
            msgToSend = {
                info: 'Record deleted successfuly',
                deletedId: parseInt(req.params.id)
            };
        } else {
            msgToSend = {
                info: 'Record doesn\'t exist',
                requestedId: parseInt(req.params.id)
            };
            res.status(400);
        }
        res.json(msgToSend);
    });
});

module.exports = router;