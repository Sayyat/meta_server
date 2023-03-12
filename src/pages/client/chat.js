import React, {useRef, useState} from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {Container, Row} from "react-bootstrap";

export default function Chat() {
    const [question, setQuestion] = useState('')
    const [answer, setAnswer] = useState('')

    function ask() {
        fetch("/api/openai/", {
            method: "post",
            body: JSON.stringify({question: question})
        }).then((response => response.json()))
            .then((result) => {
                setAnswer(result.answer)
            })
    }

    function changeQuestion(e) {
        e.preventDefault()
        setQuestion(e.target.value)
        console.log(question)
    }

    return (
        <>
            <Container>
                <Row>
                    <h2>Question</h2>
                    <Form.Control as="textarea" rows={5} onChange={(e) => changeQuestion(e)}/>

                    <Button
                        onClick={ask}>
                        Ask
                    </Button>
                </Row>
                <Row>
                    <h2>Answer</h2>
                    <Form.Control as="textarea" rows={10} readOnly/>

                </Row>
            </Container>
        </>
    )
}
