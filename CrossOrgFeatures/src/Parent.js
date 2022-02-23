import React from 'react';
import Home from './github';
import { useState } from 'react';
import { Container, Row, Col, Card, Accordion, Alert, Badge, Form, Button } from 'react-bootstrap';

export default function Parent() {

    const [inputField, setInputField] = useState({
        username: '',
        pat: ''
    })

    const [data, setData] = useState({ username: '', pat: '' })
    const [visible, setVisilbility] = useState("")
    const inputsHandler = (e) => {
        setInputField({ ...inputField, [e.target.id]: e.target.value })
    }

    const submitButton = () => {

        setData({ ...data, username: inputField.username, pat: inputField.pat })
        setVisilbility("true")
    }

    return (
        <>
            <link href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css" rel="stylesheet" />
            <Container>
                <Row className="g-12" className="d-flex align-items-end justify-content-md-center">
                    <Col md={4}>
                        <Form.Group className="mb-5">
                            <Form.Label htmlFor="disabledTextInput">User Name</Form.Label>
                            <Form.Control id="username" onChange={inputsHandler} value={inputField.username} required />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-5">
                            <Form.Label htmlFor="disabledTextInput">Personal Access Token</Form.Label>
                            <Form.Control type="password" id="pat" onChange={inputsHandler} value={inputField.pat} required />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-5">
                            <Button style={{ backgroundColor: "#e87722" }} onClick={submitButton}   >Get Repositories</Button>
                        </Form.Group>
                    </Col>

                </Row>
            </Container>
            {visible === 'true' ? <Home {...data} /> : undefined}


            {/* <Row className="g-12" className="justify-content-md-center">
            <Col md={4}>
                <Container>
                    <fieldset>
                        <Form.Group className="mb-5">
                            <Form.Label htmlFor="disabledTextInput">Name</Form.Label>
                            <Form.Control id="username" onChange={inputsHandler} value={inputField.username} required />
                        </Form.Group>
                    </fieldset>

                </Container>
            </Col>

            {/* <input
                type="text"
                name="username"
                onChange={inputsHandler}
                placeholder="Username"
                value={inputField.username} /> */}


            {/* <Col md={4}>
                <Container>
                    <fieldset>
                        <Form.Group className="mb-5">
                            <Form.Label htmlFor="disabledTextInput">Name</Form.Label>
                            <Form.Control id="username" onChange={inputsHandler} value={inputField.username} required />
                        </Form.Group>
                    </fieldset>

                </Container>

            </Col>
            <input
                type="password"
                name="pat"
                onChange={inputsHandler}
                placeholder="Personal Access Token"
                value={inputField.pat} />

            <br />


            <button onClick={submitButton}>Submit Now</button>
            <>


            {visible === 'true' ? <Home {...data} /> : undefined}
        </Row> */}
        </>
    )
}