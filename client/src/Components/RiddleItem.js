import {Badge, Button, Card} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import RiddleModal from "./RiddleModal";
import API from "../API";
import dayjs from "dayjs";


function RiddleItem(props) {
    const [answered, setAnswered] = useState({});
    const [endDate, setEndDate] = useState(null);
    const [timeEnd, setTimeEnd] = useState(false); //kept here to automatically update riddle from database
    const [updateItem, setUpdateItem] = useState(false);
    const [riddle1, setRiddle1] = useState({});


    useEffect(() => {
        if (props.loggedIn) {
            API.getRiddleById(props.riddle.riddleId)
                .then(response => {
                    if (response[0].endDate === null) {
                        setEndDate(null);
                        setRiddle1(response[0]);
                        setAnswered(response[1]);
                    } else {
                        setEndDate(dayjs(response[0].endDate));
                        setRiddle1(response[0]);
                        setAnswered(response[1]);
                    }

                })
        }
    }, [timeEnd, updateItem])

    const navigate = useNavigate();


    const handleClickAns = (event) => {
        event.preventDefault();
        setUpdateItem(prev => !prev);
        navigate(`/riddles/${props.riddle.riddleId}/answers`);

    };


    return (<Card text="white" className="mt-4 card-special">
        <Card.Header as="h5" className="d-flex justify-content-between"> {`${props.riddle.name}`}
            <Badge pill className="diff-badge"
                   bg={props.riddle.difficulty === 'Easy' ? "success" : props.riddle.difficulty === 'Average' ? "warning" : "danger"}>{props.riddle.difficulty}</Badge>
        </Card.Header>
        <Card.Body className="card-body">
            <Card.Text className="card-text">
                {`${props.riddle.text}`}
            </Card.Text>
        </Card.Body>
        <Card.Footer className="d-flex justify-content-around">
            {/*Check if riddles is cloesd to show answers , check if person is author to allow to see answers even when open r*/}
            {((props.riddle.state === 'Closed' && props.loggedIn) || (props.loggedIn && (props.riddle.authorId === props.user.userId))) ?
                <Button className="item-btn" onClick={handleClickAns}>Show Answers</Button> : <></>}
            {/*show Modal only when logged In*/}
            {props.loggedIn ? <RiddleModal riddle={riddle1} timeEnd={timeEnd} setTimeEnd={setTimeEnd}
                                           setUpdateMain={props.setUpdateMain}
                                           setUpdateItem={setUpdateItem} user={props.user} answered={answered}
                                           setAnswered={setAnswered} endDate={endDate}
                                           /> : <></>}
        </Card.Footer>
    </Card>);
}

export default RiddleItem;