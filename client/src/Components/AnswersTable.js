import { Row, Table} from "react-bootstrap";
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import API from "../API";

function AnswersTable(props) {

    //Time States
    const [day, setDay] = useState(0); //Kept for Riddles that normally last longer
    const [hour, setHour] = useState(0);
    const [minute, setMinute] = useState(0);
    const [second, setSecond] = useState(0);



    const time = ('0' + hour).slice(-2) + ':' + ('0' + minute).slice(-2) + ':' + ('0' + second).slice(-2);

    useEffect(() => {

        if (!props.timeEnd && props.endDate !== null) {
            const interval = setInterval(() => {

                const target = dayjs(props.endDate).valueOf();
                const now = dayjs().valueOf();
                const difference = target - now;

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


                if (d <= 0 && h <= 0 && m <= 0 && s <= 0) {
                    clearInterval(interval);
                    const closeRiddle = async () => {
                        await API.closeRiddle(props.riddle.riddleId);
                        props.setTimeEnd(true);
                    }
                    closeRiddle().catch(err => {
                        console.log(err)
                    });

                }
            }, 1000);
            return () => clearInterval(interval);
        }


    }, [props.endDate , props.timeEnd]);




    return (

        <>
        <Row className="mb-4 text-center filter-title">
            {/*check if riddle closed or open with no endDate*/}
            {(props.endDate === null && props.riddle.state === 'Open') ? <h3 className="text-center">Riddle didn't start yet</h3>
                : (props.endDate === null && props.riddle.state === 'Closed') ? <h3 className="text-center">Riddle is closed</h3>
                    :
                        <h3 className="text-center " id="timer">Time left {time}</h3>
                    }
            </Row>
            <Row className="mb-4 text-center filter-title">
               <h3>Correct Answer : {props.riddle.solution}</h3>
            </Row>
        <Table className="table table-bordered table-dark">
            <thead>
            <tr>
                <th>User</th>
                <th>Answer</th>
            </tr>
            </thead>
            <tbody>
            {
                props.answers.map((ans) =>
                    <AnswerRow answer={ans} key={ans.answerId}/>
                )
            }
            </tbody>
        </Table>
        </>
    );
}

function AnswerRow(props) {
    return (
        <tr>
            <td className={(props.answer.correct !== 0 ? 'bg-success' : '')}>
                <p >
                    {`${props.answer.name}`}
                </p>
            </td>
            <td className={(props.answer.correct !== 0 ? 'bg-success' : '')}>
                <p >
                    {`${props.answer.text}`}
                </p>
            </td>
        </tr>
    );
}

export default AnswersTable;