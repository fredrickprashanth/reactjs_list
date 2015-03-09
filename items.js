var sqlite3 = require('sqlite3');
var items_db = new sqlite3.Database('items.db');
var md5 = require('MD5');
exports.list = function(req, res) {
    items_db.all('SELECT name, desc FROM items',
                  function(err, items) {
        console.log(items);
        res.json(items);
        
    });
}

exports.add = function(req, res) {
    var item_name = req.body.name;
    var item_desc = req.body.desc;
    var item_id = md5(item_name);
    items_db.run('INSERT INTO items VALUES( ?, ?, ?)',
            item_id, item_name, item_desc, function(err) {
                if (err) {
                    res.json({"status":"FAIL"});
                } else {
                    res.json({"status":"SUCCESS"});
                }
            });
}

exports.remove = function(req, res) {
    var item_name = req.body.name;
    var item_id = md5(item_name);
    console.log(item_name);
    console.log(item_id);
    items_db.run('DELETE FROM items WHERE id=?', item_id,
            function(err) {
                if (err) {
                    res.json({"status":"FAIL"});
                } else {
                    res.json({"status":"SUCCESS"});
                }
            });
}

