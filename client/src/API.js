import {Riddle} from "./Modules/Riddle";
import {Answer} from "./Modules/Answer";
import {User} from "./Modules/User";

const SERVER_URL = 'http://localhost:3001/api/';

function getJson(httpResponsePromise) {
    return new Promise((resolve, reject) => {
        httpResponsePromise
            .then((response) => {
                if (response.ok) {
                    response.json()
                        .then( json => resolve(json))
                        .catch( err => console.log(err))

                } else {
                    response.json()
                        .then(obj =>
                            reject(obj)
                        )
                        .catch(err => reject({ error: "Cannot parse server response" }))
                }
            })
            .catch(err =>
                reject({ error: "Cannot communicate"  })
            )
    });
}

/*** SESSION AND LOGIN REQUESTS ***/

const logIn = async (credentials) => {
    return getJson(fetch(SERVER_URL + 'sessions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(credentials),

        })

    );
};

const logOut = async() => {
    return getJson(fetch(SERVER_URL + 'sessions/current', {
            method: 'DELETE',
            credentials: 'include'
        })
    )
};

const getUserInfo = async () => {
    return getJson(fetch(SERVER_URL + 'sessions/current', {
            credentials: 'include',
        })
    )
};

/*** RIDDLES REQUESTS ***/
const addRiddle = async(riddle)=>{
    return getJson(fetch(SERVER_URL + 'new-riddle/', {
        method : 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(riddle)

    }))
}

const getAllRiddles = async()=>{
    return getJson(fetch(SERVER_URL + 'riddles/' ,{credentials: 'include'}))
        .then(json => {
            return json.map((riddle)=> new Riddle(
                riddle.riddleId,
                riddle.name,
                riddle.text,
                riddle.difficulty,
                riddle.duration,
                riddle.state,
                riddle.hint1,
                riddle.hint2,
                riddle.authorId,
                riddle.solution,
                riddle.endDate
                ))
        })
}

//when called by logged in user , also his answer is returned
const getRiddleById = async(riddleId)=>{
    return getJson(fetch(SERVER_URL + `riddles/${riddleId}` ,{credentials: 'include'}))
        .then(json => {
            return [new Riddle(
                json[0].riddleId,
                json[0].name,
                json[0].text,
                json[0].difficulty,
                json[0].duration,
                json[0].state,
                json[0].hint1,
                json[0].hint2,
                json[0].authorId,
                json[0].solution,
                json[0].endDate

            ) , json[1]]
        });
}

const addAnswer = async(riddleId, answer)=>{
    return getJson(fetch(SERVER_URL + `riddles/${riddleId}`, {
        method : 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(answer)

    }))
}

const getMyRiddles = async()=>{
    return getJson(fetch(SERVER_URL + 'my-riddles/' ,{credentials: 'include'}))
        .then(json => {
            return json.map((riddle)=> new Riddle(
                riddle.riddleId,
                riddle.name,
                riddle.text,
                riddle.difficulty,
                riddle.duration,
                riddle.state,
                riddle.hint1,
                riddle.hint2,
                riddle.authorId,
                riddle.solution,
                riddle.endDate
            ))
        })
}

const getAnswersForRiddle = async(riddleId)=>{
    return getJson(fetch(SERVER_URL + `riddles/${riddleId}/answers` ,{credentials: 'include'}))
        .then(json => {
            return json.map((ans)=>
                new Answer(
                    ans.answerId,
                    ans.name,
                    ans.text,
                    ans.correct)
            )
        })
}

const closeRiddle = async(riddleId)=>{
    return getJson(fetch(SERVER_URL + `${riddleId}/close`, {
        method : 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',

    }))
}

const getRanking = async()=>{
    return getJson(fetch(SERVER_URL + `ranking` ,{credentials: 'include'}))
        .then(json => {
            return json.map((u)=>
                new User(u.userId , u.name , u.score)
            )
        })
}


const API = {closeRiddle, logIn, getUserInfo,logOut,addRiddle,addAnswer, getAllRiddles,getRiddleById, getMyRiddles, getAnswersForRiddle , getRanking};

export default API;