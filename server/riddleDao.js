'use strict';
const db = require("./db");
const {Riddle} = require("./Modules/Riddle");



exports.listAllRiddles = ()=>{
    return new Promise((resolve,reject)=>{
        const sql = 'SELECT * From Riddles';
        db.all(sql,[],(err,rows)=>{
            if(err){
                reject(err.toString());

            }
            else{
                const riddles = rows.map((r)=> new Riddle(
                    r.riddleId,
                    r.name,
                    r.text,
                    r.difficulty,
                    r.duration,
                    r.state,
                    r.hint1,
                    r.hint2,
                    r.solution,
                    r.authorId,
                    r.endDate
                ));
                resolve(riddles);
            }
        })
    })
}

exports.getRiddleById = (id)=>{
    return new Promise((resolve,reject)=>{
        const sql = 'SELECT * From Riddles WHERE riddleId= ?';
        db.get(sql,[id],(err,row)=>{
            if(err){
                reject(err.toString());

            }
            else if(row === undefined){
                resolve(row);
            }
            else{
                const riddle =new Riddle(
                    row.riddleId,
                    row.name,
                    row.text,
                    row.difficulty,
                    row.duration,
                    row.state,
                    row.hint1,
                    row.hint2,
                    row.solution,
                    row.authorId,
                    row.endDate) ;
                resolve(riddle);
            }
        })
    })
}

exports.createRiddle = ( name, text, difficulty, duration, hint1, hint2, solution, userId)=>{
    return new Promise((resolve,reject)=>{
        const sql = 'INSERT INTO Riddles(name, text , difficulty, duration, hint1, hint2, solution, authorId) VALUES (?,?,?,?,?,?,?,?);';
        db.run(sql,[name, text, difficulty, duration, hint1, hint2, solution, userId],(err)=>{
            if(err){
                reject(err.toString());
            }
            else{
                resolve(this.lastID);
            }
        })
    })
}

//Return only solution and score depending on difficulty
exports.getRiddleAnswerAndScore = (riddleId)=>{
    return new Promise((resolve,reject)=>{
        const sql = 'SELECT * From Riddles WHERE riddleId= ?';
        db.get(sql,[riddleId],(err,row)=>{
            if(err){
                reject(err.toString());

            }
            else if(row === undefined){
                resolve(row);
            }
            else{
                const solution = row.solution;
                const difficulty = row.difficulty;
                let score = 0;
                if(difficulty === "Easy")  score = 1;
                else if(difficulty === "Average")  score = 2;
                else if(difficulty === "Difficult")  score = 3;
                let object = {
                    SOL : solution,
                    SC : score
                }
                resolve(object);
            }
        })
    })
}

//close riddle by setting closed state and null end date
exports.closeRiddle = (riddleId)=>{
    return new Promise((resolve,reject)=>{
        const sql = `UPDATE Riddles SET state= 'Closed' , endDate=null WHERE riddleId = ?;`;
        db.run(sql,[riddleId],(err)=>{
            if(err){
                reject(err.toString());

            }
            else{
                resolve('success');

            }
        })
    })
}

//Add end date on first answer to start countdown
exports.setEndDate = (riddleId, endDate)=>{
    return new Promise((resolve,reject)=>{
        const sql = `UPDATE Riddles SET endDate= ? WHERE riddleId = ?;`;
        db.run(sql,[endDate, riddleId],(err)=>{
            if(err){
                reject(err.toString());

            }
            else{
                resolve();

            }
        })
    })
}