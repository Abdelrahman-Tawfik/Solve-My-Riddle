(async ()=>{
    const dbConnection = require("./DatabaseScratch");
    await dbConnection.createConnection();
    let connectionTest = dbConnection.db;
    if (connectionTest !== null)
        console.log("DB INITIALIZED AND CHECKED !");
    else {
        console.log("Problems initializing db");
    }
})();