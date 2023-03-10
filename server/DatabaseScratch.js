/*This file was used to create and test the Database*/

const sqlite3 = require("sqlite3");
const crypto = require("crypto");

class DatabaseScratch {
    static db = null;

    static async createConnection() {
        if (this.db===null){
            this.db = new sqlite3.Database("./riddles.sqlite", (err) => err && console.log(err));
            await this.createTables();
            console.log("Creating");
            await this.createHardcodedUsers();
            console.log("done Creating");
            await this.runSQL(`PRAGMA foreign_keys=on;`);
        }
    }

    static async createTables() {
        for (let tableSQL of this.tables) {
            await this.runSQL(tableSQL);
        }
    }


    static runSQL(SQL) {
        return new Promise((resolve, reject) => {
            this.db.run(SQL, (err) => {
                if (err) {
                    console.log("Error running SQL", err);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    static tables = [
        `CREATE TABLE Users (
    		userId INTEGER NOT NULL,
    		name TEXT NOT NULL,
    		email TEXT NOT NULL,
    		salt TEXT NOT NULL,
    		hash TEXT NOT NULL,
    		score INTEGER  DEFAULT 0,
    		PRIMARY KEY (userId)
		    );`,

        `CREATE TABLE Riddles (
            riddleId INTEGER NOT NULL,
            name TEXT NOT NULL,
            text TEXT NOT NULL,
            difficulty TEXT NOT NULL,
            duration INTEGER NOT NULL,
            state TEXT  DEFAULT "Open",
            hint1 TEXT NOT NULL,
            hint2 TEXT NOT NULL,
            solution TEXT NOT NULL,
            authorId INTEGER NOT NULL,
            endDate TEXT DEFAULT NULL,
            PRIMARY KEY(riddleId),
            FOREIGN KEY(authorId) REFERENCES Users(userId)
            );`,

        `CREATE TABLE Answers (
    		answerId INTEGER NOT NULL,
    		userId INTEGER NOT NULL,
    		riddleId INTEGER NOT NULL,
    		text TEXT NOT NULL,
    		score INTEGER NOT NULL,
    		correct INTEGER NOT NULL,
    		PRIMARY KEY (answerId),
    		UNIQUE (userId,riddleId),
    		FOREIGN KEY (userId) REFERENCES Users(userId),
    		FOREIGN KEY (riddleId) REFERENCES Riddles(riddleId)
		    );`
    ]


    static async createHardcodedUsers() {
        try {
            await this.createUser(1,"Michael Scott","Michael@dundlerMifflin.com","1BestBoss");
            await this.createUser(2,"Dwight Shrute","Dwight@dundlerMifflin.com","2RegionalAssistantManager");
            await this.createUser(3,"Jim Halpert","Jim@dundlerMifflin.com","SMaRtPantSxx");
            await this.createUser(4,"Pam beasly","Pam@dundlerMifflin.com","PamyPamy");
            await this.createUser(5,"Jan Levinson","Jan@dundlerMifflin.com","PassWord");

        } catch (err) {
            console.log(err);
        }
    }
     static async hash(password){
        return new Promise((resolve,reject)=>{
            let salt = crypto.randomBytes(16).toString('hex');
            crypto.scrypt(password,salt,32,(err,hashedPassword)=>{
                if(err) reject(err);
                resolve([salt,hashedPassword]);

            });
        })
    }



    static async createUser (id, name, email,password) {
        let fullHash = await this.hash(password);
        let salt = fullHash[0];
        let hash= fullHash[1];
        return new Promise((resolve, reject) => {
            const dbConnection = require("./DatabaseScratch.js").db;
            const sql = `INSERT INTO Users (userId,name,email,salt,hash)
      VALUES (?, ?, ?, ?,?)`;
            dbConnection.run(sql, [id,name,email,salt,hash], function (err) {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
    }
}


module.exports = DatabaseScratch;


