import React, {useRef, useState} from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {Container, Row} from "react-bootstrap";

export default function Chat() {
    const [question, setQuestion] = useState('')
    const [addition, setAddition] = useState('')
    const [answer, setAnswer] = useState('')

    function ask() {
        fetch("/api/openai/", {
            method: "post",
            body: JSON.stringify({question: question})
        }).then((response => response.json()))
            .then((result) => {
                const answer = result.answer.split("\n\n")
                if(answer.length > 1)
                    setAddition(question + answer[0])
                else setAddition('')
                setAnswer(answer[answer.length - 1])
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
