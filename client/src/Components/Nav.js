import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Navbar, Nav, Container} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {LogoutButton} from "./Authentication";

const TopNav = (props) => {

    if (props.loggedIn) {
        return (
            <Navbar className="nav-bar" variant="dark" fixed="top"
            >
                <Container >
                    <Navbar.Brand as={Link} to='/'><img src="/logo.png" width="200" height="40" alt="Solve-My-Riddle" className="nav-link nav-fill"/></Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to='/'>All Riddles</Nav.Link>
                        <Nav.Link as={Link} to="/ranking">Ranking</Nav.Link>
                        <Nav.Link as={Link} to="/my-riddles">My Riddles</Nav.Link>
                        <Nav.Link as={Link} to="/new-riddle">Add Riddle</Nav.Link>

                    </Nav>
                    <Nav>
                        <Navbar.Text className="mx-auto">
                            {props.user && props.user.name && `Welcome, ${props.user.name}!`}
                        </Navbar.Text>
                        <LogoutButton className="logout-btn" logout={props.logout}/>
                    </Nav>
                </Container>
            </Navbar>
        );

    } else {
        return (
            <Navbar bg="dark" variant="dark" fixed="top"
            >
                <Container className="nav-link">
                    <Navbar.Brand as={Link} to='/'><img src="/logo.png" width="200" height="40" alt="Solve-My-Riddle" className="nav-link nav-fill"/></Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to='/'>All Riddles</Nav.Link>
                        <Nav.Link as={Link} to="/ranking">Ranking</Nav.Link>
                    </Nav>
                    <Nav>
                        <Navbar.Text className="mx-auto">
                            Already Registered ?
                        </Navbar.Text>
                        <Nav.Link as={Link} to="/login" >Login</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        );
    }

}

export
{
    TopNav
}
    ;