import React, {useRef, useState} from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {Col, Container, Row} from "react-bootstrap";
import {forEach} from "react-bootstrap/ElementChildren";

export default function Chat() {
    const [dialogue, setDialogue] = useState([])
    const [question, setQuestion] = useState('')
    const [addition, setAddition] = useState('')
    const [answer, setAnswer] = useState('')

    function ask() {
        let newMessage = [
            {role: 'user', content: question}
        ]

        fetch("/api/openai/", {
            method: "post",
            body: JSON.stringify({dialogue: [...dialogue, ...newMessage]})
        }).then((response => response.json()))
            .then((result) => {
                console.log(result)
                console.log(typeof result)
                setDialogue(result)
            })
    }

    function changeQuestion(e) {
        e.preventDefault()
        setQuestion(e.target.value)
        // console.log(question)
    }

    return (
        <>
            <Container>
                <Row>
                    <h2>Вопрос</h2>
                    <Form.Control as="textarea" rows={5} onChange={(e) => changeQuestion(e)}/>

                    <Button
                        onClick={ask}>
                        Отправить
                    </Button>
                </Row>

                {
                    dialogue.length > 0 && dialogue.map((message, index) => {
                        return (
                            <div key={index}>
                                <Row>
                                    <Col sm={3}>
                                        <Form.Control type="text" value={message.role === "user" ? "You" : "AI"} readOnly/>

                                    </Col>
                                    <Col sm={9}>
                                        <Form.Control type="text" value={message.content} readOnly/>
                                    </Col>
                                </Row>
                            </div>
                        )
                    })
                }


            </Container>
        </>
    )
}
