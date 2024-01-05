var mysql = require('mysql2')
var con = mysql.createPool({
        host: "localhost",
        user: "root",
        password: "Pandey@131",
        database: "expense_app"
        
    });
    
    module.exports = con.promise();
    