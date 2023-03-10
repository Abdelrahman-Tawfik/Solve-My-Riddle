import React, {useState, useEffect} from 'react';
import {Row, Col, Button} from 'react-bootstrap';
import API from '../API';
import AddForm from "./AddForm";
import {LoginForm} from "./Authentication";
import RiddleItem from "./RiddleItem";
import {Link, useParams} from "react-router-dom";
import AnswersTable from "./AnswersTable";
import RankingTable from "./RankingTable";
import dayjs from "dayjs";

//props : loggedIn
function MainLayout(props) {

    //updateMain is used to call api again on change for answer or timeout
    const [riddles, setRiddles] = useState([]);
    const [updateMain, setUpdateMain] = useState(false);


    const openRiddles = riddles.filter((r) => {
        return r.state === 'Open'
    });
    const closedRiddles = riddles.filter((r) => {
        return r.state === 'Closed'
    });

    useEffect(() => {
        API.getAllRiddles()
            .then(riddles => {
                setRiddles(riddles);
            })
            .catch(e => {
                console.log(e)
            });

    }, [updateMain]);

    return (
        <Row className="below-nav">
            <Row className="mx-auto text-center filter-title"><h1>Open Riddles</h1></Row>
            <Col>
                <Row>
                    <Col md={8} className="mt-5 mx-auto">
                        {openRiddles.length === 0 ?
                            <h4 className="text-center">No open riddles at the moment</h4> : openRiddles.map((r) =>
                                <RiddleItem loggedIn={props.loggedIn} riddle={r} key={r.riddleId}
                                            setUpdateMain={setUpdateMain} user={props.user}/>)}
                    </Col>
                </Row>
            </Col>
            <Row className="mx-auto mt-5 d-flex  text-center filter-title"><h1>Closed Riddles</h1></Row>
            <Col>
                <Row>
                    <Col md={8} className="mt-5 mx-auto">
                        {closedRiddles.length === 0 ?
                            <h4 className="text-center">No closed riddles at the moment</h4> : closedRiddles.map((r) =>
                                <RiddleItem loggedIn={props.loggedIn} riddle={r} key={r.riddleId}
                                             setUpdateMain={setUpdateMain} user={props.user}/>)}
                    </Col>
                </Row>
            </Col>

        </Row>);

}

function AddLayout() {

    const addRiddle = (riddle) => {
        API.addRiddle(riddle)
            .catch(e => console.log(e));
    }
    return (<div className="vh-100 below-nav">
            <Row className="mx-auto mb-4 text-center filter-title"><h1>Add New Riddle</h1></Row>
            <Col>
                <AddForm addRiddle={addRiddle}/>
            </Col>
        </div>

    );

}

function LoginLayout(props) {
    return (<Row className="min-vh-100">
        <Col md={12} className="below-nav">
            <LoginForm login={props.login}/>
            <div className="d-flex justify-content-center mt-5"><img src="/Ed-Nygma.gif" width="360" height="360" alt="The Riddler"
                                                                     className="GIF"/></div>
        </Col>
    </Row>);
}


function MyLayout(props) {
    const [riddles, setRiddles] = useState([]);
    const [updateMain, setUpdateMain] = useState(false);

    const openRiddles = riddles.filter((r) => {
        return r.state === 'Open'
    });
    const closedRiddles = riddles.filter((r) => {
        return r.state === 'Closed'
    });


    useEffect(() => {
        API.getMyRiddles()
            .then(riddles => {
                setRiddles(riddles);
            })
            .catch(e => {
                console.log(e)
            });

    }, [updateMain]);

    return (<>
            <div className="below-nav min-vh-100">
                <Row className="text-center filter-title"><h1>Your Open Riddles</h1></Row>
                <Col>
                    <Row>
                        <Col md={8} className="mt-5 mx-auto">
                            {openRiddles.length === 0 ?
                                <h4 className="text-center">No open riddles at the moment</h4> : openRiddles.map((r) =>
                                    <RiddleItem loggedIn={props.loggedIn} user={props.user}
                                                setUpdateMain={setUpdateMain} riddle={r} key={r.riddleId}/>)}
                        </Col>
                    </Row>
                </Col>
                <Col>
                    <Row className="mt-5 d-flex  text-center filter-title"><h1> Your Closed Riddles</h1></Row>
                    <Row>
                        <Col md={8} className="mt-5 mx-auto">
                            {closedRiddles.length === 0 ? <h4 className="text-center">No closed riddles at the
                                moment</h4> : closedRiddles.map((r) => <RiddleItem loggedIn={props.loggedIn}
                                                                                   user={props.user}
                                                                                   setUpdateMain={setUpdateMain} riddle={r}
                                                                                   key={r.riddleId}/>)}
                        </Col>
                    </Row>
                </Col>

            </div>
        </>
    );

}

function AnswerLayout(props) {

    const {riddleId} = useParams();
    const [riddle, setRiddle] = useState({});
    const [endDate, setEndDate] = useState(null);
    const [timeEnd, setTimeEnd] = useState(false);
    const [answers, setAnswers] = useState([]);

    useEffect(() => {
        //to get Riddle to check if author
        API.getRiddleById(riddleId).then(response => {
            if (response[0].endDate === null) {
                setEndDate(null);
            } else {
                setEndDate(dayjs(response[0].endDate));
            }
            setRiddle(response[0]);
        }).catch(e => {
            console.log(e)
        });

    }, [riddleId, timeEnd])


    useEffect(() => {
        API.getAnswersForRiddle(riddleId)
            .then(response => {
                setAnswers(response);
            })
            .catch(e => {
                console.log(e)
            });

        if (riddle.authorId === props.user.userId && riddle.state === 'Open') { //Condition to limit requests to server
            const intervalId = setInterval(() => {
                API.getAnswersForRiddle(riddleId) //Call API every second to update answers
                    .then(response => {
                        setAnswers(response);
                    })
                    .catch(e => {
                        console.log(e)
                    });

            }, 1000);

            return () => clearInterval(intervalId);

        }

    }, [riddle.state , timeEnd]);

    return (<div className="min-vh-100 below-nav">
        <Row className="mb-4 text-center filter-title"><h2>Users' answers for the "{riddle.name}" Riddle</h2></Row>
        <Row className="vh-100">
            <Col md={8} className="mt-5 mx-auto">
                <AnswersTable answers={answers} timeEnd={timeEnd} setTimeEnd={setTimeEnd} riddle={riddle}
                              endDate={endDate}/>
            </Col>
        </Row>
    </div>);

}

function RankingLayout() {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        API.getRanking().then(response => {
            setUsers(response);
        }).catch(e => {
            console.log(e)
        });

    }, [])


    return (<div className="vh-100 below-nav">
        <Row className="mb-4 text-center filter-title"><h1>Current Top 3 users</h1></Row>
        <Col>
            <RankingTable users={users}/>
        </Col>
    </div>);

}

function NotFoundLayout() {
    return (
            <Row className="min-vh-100">
                <Col md={12} className="below-nav">
                    <Row className="mb-4 text-center filter-title"><h1>Wrong Route!</h1></Row>
                    <div className="d-flex justify-content-center mt-5"><img src="/Angry-Riddler.gif" width="540" height="300" alt="Angry Riddler"
                                                                             className="GIF"/></div>
                    <div className="d-flex justify-content-center mt-5">
                    <Link to="/">
                        <Button variant="primary">Go Home!</Button>
                    </Link>
                    </div>
                </Col>
            </Row>

    );
}


export {MainLayout, AddLayout, LoginLayout, MyLayout, AnswerLayout, RankingLayout, NotFoundLayout};