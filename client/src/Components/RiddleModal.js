import {Button, Container, Modal, ProgressBar} from "react-bootstrap";
import {useEffect, useState} from "react";
import API from "../API";
import dayjs from "dayjs";
import AnswerForm from "./AnswerForm";


function RiddleModal(props) {
    const [show, setShow] = useState(false);

    //show hint
    const [showHint1, setShowHint1] = useState(false);
    const [showHint2, setShowHint2] = useState(false);


    //Time States
    const [day, setDay] = useState(0); //day is kept for other cases where riddle lasts for days
    const [hour, setHour] = useState(0);
    const [minute, setMinute] = useState(0);
    const [second, setSecond] = useState(0);
    const [now, setNow] = useState(0);

    const time = ('0' + hour).slice(-2) + ':' + ('0' + minute).slice(-2) + ':' + ('0' + second).slice(-2);


    useEffect(() => {

        if (!props.timeEnd && props.endDate !== null) {
            const interval = setInterval(() => {
                let x = dayjs().isBefore(dayjs(props.endDate).subtract((0.5 * props.riddle.duration), 'second'));
                let y = dayjs().isBefore(dayjs(props.endDate).subtract((0.25 * props.riddle.duration), 'second'));

                const target = dayjs(props.endDate).valueOf();
                const nows = dayjs().valueOf();
                const difference = target - nows;

                const d = Math.floor(difference / (1000 * 60 * 60 * 24));
                setDay(d);

                const h = Math.floor(
                    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                );
                setHour(h);

                const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                setMinute(m);

                const s = Math.floor((difference % (1000 * 60)) / 1000);
                setSecond(s);
                if (!x) setShowHint1(true);
                if (!y) setShowHint2(true);

                setNow(Math.floor(100 - ((((difference / 1000) / props.riddle.duration)) * 100)));

                if (d <= 0 && h <= 0 && m <= 0 && s <= 0) {
                    props.setTimeEnd(true);
                    clearInterval(interval);
                    const closeRiddle = async () => {
                        await API.closeRiddle(props.riddle.riddleId)
                        props.setUpdateMain(prev => !prev);
                    }
                    closeRiddle().catch(err => {
                        console.log(err)
                    });


                }
            }, 1000);
            return () => clearInterval(interval);
        }


    }, [props.endDate]);


    const handleShow = () => {
        setShow(true);
    }
    const handleHide = () => {
        //re-arrange the mainlayout on close of modal
        props.setUpdateMain(prev => !prev);
        setShow(false);
    }


    return (
        <>
            <Button className="item-btn" onClick={handleShow}>Open Riddle</Button>
            <Modal
                size="lg"
                show={show}
                onHide={handleHide}
                aria-labelledby="open-riddle"
            >

                <Modal.Header closeButton>
                    <Container className="d-flex justify-content-between">
                        <Modal.Title id="modal-title">
                            <p>{props.riddle.name}</p>
                        </Modal.Title>
                        {/*check if riddle closed or open with no endDate*/}
                        {(props.endDate === null && props.riddle.state === 'Open') ? <h4>Riddle didn't start</h4>
                            : (props.endDate === null && props.riddle.state === 'Closed') ? <h4>Riddle is closed</h4>
                                :
                                <>
                                    <h4 id="timer">Time left {time}</h4>
                                </>}
                    </Container>
                </Modal.Header>
                {props.riddle.state === 'Open' ? <ProgressBar animated now={now} label={`${now}%`}/> : <></>}
                <Modal.Body>
                    <RiddleData riddle={props.riddle} showHint1={showHint1} showHint2={showHint2} user={props.user}/>
                    <br/>
                    <AnswerForm setUpdateItem={props.setUpdateItem} setUpdateMain={props.setUpdateMain}
                                riddle={props.riddle}  answered={props.answered}
                                user={props.user}
                                />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleHide}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

function RiddleData(props) {


    return (
        <div className="text-center border-3 border-danger">
            <div><h3>{props.riddle.text}</h3></div>
            <br/>
            {props.showHint1 || props.riddle.state === 'Closed' || props.user.userId === props.riddle.authorId ?
                <h5 className="hint">First Hint : {props.riddle.hint1}</h5> : <></>}
            {props.showHint2 || props.riddle.state === 'Closed' || props.user.userId === props.riddle.authorId ?
                <h5 className="hint">Second Hint : {props.riddle.hint2}</h5> : <></>}
            {props.riddle.state === 'Closed' || props.user.userId === props.riddle.authorId ?
                <h5 className="hint">Solution : {props.riddle.solution}</h5> : <></>}
        </div>
    );
}

export default RiddleModal;