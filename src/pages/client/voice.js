import React, {useRef, useState} from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {Container, Row} from "react-bootstrap";
import {atob} from "next/dist/compiled/@edge-runtime/primitives/encoding";

export default function Voice() {
    const [text, setText] = useState('')
    const [mp3, setMp3] = useState('')
    const [answer, setAnswer] = useState('')

    function ask() {
        fetch("../api/voice",{
            method:"POST",
            body: JSON.stringify({

            })
        })
            .then(response => response.json())
            .then(result => {
                const b64 = result["audioData"]
                setMp3(b64)
                console.log(b64)
            })

    }

    function changeQuestion(e) {
        e.preventDefault()
        setText(e.target.value)
        console.log(text)
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
            </Container>
            {mp3 && <audio controls src={`data:audio/wav;base64,${mp3}`} autoPlay={true}>
            </audio>}
        </>
    )
}
