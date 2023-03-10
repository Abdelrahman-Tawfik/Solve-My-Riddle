import {Form, Button,Container} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import {useState} from "react";


function AddForm(props) {
    const [name, setName] = useState('');
    const [text, setText] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [duration, setDuration] = useState(30);
    const [hint1, setHint1] = useState('');
    const [hint2, setHint2] = useState('');
    const [solution, setSolution] = useState('');

    const lcSolution = solution.toLowerCase(); //Lower Case Solution

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const riddle = {
            name: name,
            text: text,
            difficulty: difficulty,
            duration: duration,
            hint1: hint1,
            hint2: hint2,
            solution: lcSolution
        };
        try {
            props.addRiddle(riddle);
            navigate('/my-riddles');
        } catch (err) {
            console.log(err);
        }
    };


    return (
        <>
        <div className="add-form">
            <Container ><Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={name} placeholder="Enter Riddle Title"
                        onChange={(ev) => setName(ev.target.value)}
                        required={true}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="text">
                    <Form.Label>Text</Form.Label>
                    <Form.Control
                        type="text"
                        value={text} placeholder="Enter Your Riddle"
                        onChange={(ev) => setText(ev.target.value)}
                        required={true}
                    />
                </Form.Group>
                <Form.Label>Difficulty</Form.Label>
                <Form.Select aria-label="Difficulty" required title={'Choose a Difficulty level'}
                             onChange={event => setDifficulty(event.target.value)}>
                    <option value={''}>Select a difficulty level</option>
                    <option key={1} value={'Easy'}>Easy</option>
                    <option key={2} value={'Average'}>Average</option>
                    <option key={3} value={'Difficult'}>Difficult</option>
                </Form.Select>
                <br/>
                <Form.Group className="mb-3" controlId="duration">
                    <Form.Label>Duration</Form.Label>
                    <Form.Control
                        type="number"
                        value={duration} placeholder="Enter the duration in seconds"
                        onChange={(ev) => setDuration(ev.target.value)}
                        required={true} min={30} max={600}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="hint1">
                    <Form.Label>First Hint</Form.Label>
                    <Form.Control
                        type="text"
                        value={hint1} placeholder="Enter First Hint"
                        onChange={(ev) => setHint1(ev.target.value)}
                        required={true}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="hint2">
                    <Form.Label>Second Hint</Form.Label>
                    <Form.Control
                        type="text"
                        value={hint2} placeholder="Enter Second Hint"
                        onChange={(ev) => setHint2(ev.target.value)}
                        required={true}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="solution">
                    <Form.Label>Solution</Form.Label>
                    <Form.Control
                        type="text"
                        value={solution} placeholder="Enter the Solution"
                        onChange={(ev) => setSolution(ev.target.value)}
                        required={true}
                    />
                </Form.Group>
                <Button className="mt-3 " type="submit">Add Riddle</Button>
            </Form>
            </Container>
        </div>
        </>

    );


}

export default AddForm;
