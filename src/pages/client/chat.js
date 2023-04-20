import React, { useState} from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {Col, Container, Row} from "react-bootstrap";

export default function Chat() {
    const [dialogue, setDialogue] = useState([])
    const [question, setQuestion] = useState('Сен қазақша түсінесің бе')
    const [mp3, setMp3] = useState('')
    const [addition, setAddition] = useState('')
    const [answer, setAnswer] = useState('')

    function ask() {
        dialogue.push({role: 'user', content: question})

        fetch("/api/openai/dialogue", {
            method: "post",
            body: JSON.stringify({dialogue: dialogue})
        }).then((response => response.json()))
            .then((result) => {
                setDialogue([...dialogue, result.text])
                const b64 = result.audio["audioData"]
                setMp3(b64)
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
                                        <Form.Control type="text" value={message.role} readOnly/>

                                    </Col>
                                    <Col sm={9}>
                                        <Form.Control as="textarea" rows={5} value={message.content} readOnly/>
                                    </Col>
                                </Row>
                            </div>
                        )
                    })
                }

                {mp3 && <audio controls src={`data:audio/wav;base64,${mp3}`} autoPlay={true}>
                </audio>}
            </Container>
        </>
    )
}
