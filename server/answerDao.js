'use strict';

const db = require("./db");
const {Answer} = require("./Modules/Answer");

exports.createAnswer = ( riddleId, userId , text , score , correct)=>{
    return new Promise((resolve,reject)=>{
        const sql = 'INSERT INTO Answers(userId, riddleId, text, score, correct) VALUES (?,?,?,?,?);';
        db.run(sql,[ userId, riddleId, text , score , correct],(err)=>{
            if(err){
                reject(err.toString());
            }
            else{
                if(correct === true) resolve(true);
                else resolve(false);
            }
        })
    })
}

exports.alreadyAnswered = (riddleId, userId)=>{
    return new Promise((resolve,reject)=>{
        const sql = 'SELECT * FROM Answers Where userId=? AND riddleId=?;';
        db.get(sql,[userId, riddleId],(err,row)=>{
            if(err){
                reject(err.toString());
            }
            else{
                resolve(row);
            }
        })
    })
}

exports.getAnswersForRiddle = (riddleId)=>{
    return new Promise((resolve,reject)=>{
        const sql = 'SELECT * From Answers join Users on Answers.userId = Users.userId WHERE riddleId=?';
        db.all(sql,[riddleId],(err,rows)=>{
            if(err){
                reject(err.toString());

            }
            else{
                const answers = rows.map((r)=> new Answer(
                        r.answerId,
                        r.name,
                        r.text,
                        r.correct
                    ));
                resolve(answers);
            }
        })
    })
}



