import React, {useRef, useState} from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {Container, Row} from "react-bootstrap";

export default function Voice() {
    const [text, setText] = useState('')
    const [addition, setAddition] = useState('')
    const [answer, setAnswer] = useState('')

    function ask() {
        fetch("/api/voice", {
            method: "post",
            body: JSON.stringify({text: text})
        }).then((response => response.json()))
            .then((result) => {
                console.log(result)
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
                <Row>
                    <h2>Бот решил дополнить</h2>
                    <Form.Control as="textarea" rows={5} readOnly value={addition}/>
                    <h2>Ответ</h2>
                    <Form.Control as="textarea" rows={10} readOnly value={answer}/>

                </Row>
            </Container>
        </>
    )
}
