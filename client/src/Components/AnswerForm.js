import {Button, Form, OverlayTrigger, Popover} from "react-bootstrap";
import API from "../API";
import {useState} from "react";

function AnswerForm(props) {
    const [popHeader, setPopHeader] = useState('');
    const [popText, setPopText] = useState('');
    const [answer, setAnswer] = useState('');

    const addAnswer = async (answer) => {
        return await API.addAnswer(props.riddle.riddleId, answer);
    }

    const lcAnswer = answer.toLowerCase(); //convert inserted to lowercase

    const handleSubmit = async (event) => {
        event.preventDefault();
        const answerJ = {
            text: lcAnswer
        };

        //Check if user has already answered , or if the riddle is already closed
        if (props.answered.hasAnswered || props.riddle.state === 'Closed') {
            setPopHeader("You can't answer now");
            setPopText("The riddle is either closed or you have already answered")
        } else {
            try {
                let result = await addAnswer(answerJ);
                if (result) {
                    setPopHeader("CORRECT!");
                    setPopText("Congrats! That was the correct answer");
                }
                if (!result) {
                    setPopHeader("WRONG!");
                    setPopText("That was a wrong answer , check the answer after the timeout");
                }
                props.setUpdateItem(prev => !prev ); //Reset item states with new values

            } catch (err) {
               console.log(err);

            }
        }

    };

    const popover = (
        <Popover id="answer-popover">
            <Popover.Header as="h3">{popHeader}</Popover.Header>
            <Popover.Body>
                {popText}
            </Popover.Body>
        </Popover>
    );



    return (
        <>
            {props.riddle.authorId === props.user.userId ? <></> : <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="answer">
                    <Form.Label>Your Answer</Form.Label>
                    {props.answered.hasAnswered ?
                        <><Form.Control
                            type="text"
                            disabled
                            value={answer} placeholder={props.answered.answer}
                        /><Form.Text className="text-muted">
                            Your Answer is registered , you can't modify it
                        </Form.Text></>
                        : props.riddle.state === 'Closed' ? <><Form.Control
                                type="text"
                                disabled
                                value={answer} placeholder={props.answered.answer}
                            />
                                <Form.Text className="text-muted">
                                    Riddle is now closed , no more answers !
                                </Form.Text></> :
                            <Form.Control
                                type="text"
                                required
                                value={answer} placeholder="Enter the answer."
                                onChange={(ev) => setAnswer(ev.target.value)}
                            />}
                </Form.Group>
                <OverlayTrigger trigger="click" placement="left" overlay={popover} >
                <Button className="mt-3 btn-success" type="submit">Answer</Button>
                </OverlayTrigger>
            </Form>}
        </>


    );
}

export default AnswerForm;

