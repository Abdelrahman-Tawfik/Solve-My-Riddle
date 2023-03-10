import { useState } from 'react';
import {Form, Button, Alert, FloatingLabel} from 'react-bootstrap';
import {useLocation, useNavigate} from 'react-router-dom';


function LoginForm(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [show, setShow] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const location = useLocation();
    // useLocation hook is used to remember what link was selected when we reached this form

    const navigate = useNavigate();
    const oldPath = location?.state?.pathname || '/';

    const handleSubmit = (event) => {
        event.preventDefault();
        const credentials = { username, password };

        props.login(credentials)
            .then( () => navigate(oldPath))
            .catch((err) => {
                setErrorMessage(err.error); setShow(true);
            });
    };


    return (
                <div className="login">
                <h1 className="pb-3 text-center">Hi Again!</h1>

                <Form  onSubmit={handleSubmit}>
                    <Alert
                        dismissible
                        show={show}
                        onClose={() => setShow(false)}
                        variant="danger">
                        {errorMessage}
                    </Alert>
                    <Form.Group className="mb-3" controlId="username">
                        <FloatingLabel label="Email Address" controlId="email" className="mb-3">
                        <Form.Control
                            type="email"
                            value={username} placeholder="Example: john.doe@polito.it"
                            onChange={(ev) => setUsername(ev.target.value)}
                            required={true}
                        /></FloatingLabel>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="password">
                        <FloatingLabel label="Password" controlId="password" className="mb-3">
                        <Form.Control
                            type="password"
                            value={password} placeholder="Enter the password."
                            onChange={(ev) => setPassword(ev.target.value)}
                            required={true}
                        /></FloatingLabel>
                    </Form.Group>
                    <Button className="btn btn-success w-100 mt-4" type="submit">Login</Button>
                </Form>
                </div>
    );
}

function LogoutButton(props) {
    const navigate = useNavigate();
    const handleClick = async (event) => {
        event.preventDefault();
       props.logout()
           .then( () => navigate('/'))
           .catch((err) => {
               console.log(err);
           });
    };
    return (
        <Button className="logout-btn" variant="outline-light" onClick={handleClick}>Logout</Button>
    )
}

export { LoginForm, LogoutButton };
