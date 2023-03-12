import React, {useState} from "react";
import Form from "react-bootstrap/Form";
import {Button, Col, Container, Row} from "react-bootstrap";

export default function ImageGenerator() {
    const [description, setDescription] = useState('')
    const [size, setSize] = useState('256')
    const [count, setCount] = useState(4)
    const [urls, setUrls] = useState([])

    function ask() {
        fetch("/api/openai/image", {
            method: "post",
            body: JSON.stringify({
                description: description,
                size: size,
                count: count
            })
        }).then((response => response.json()))
            .then((result) => {
                setUrls(result)
                console.log(urls)
            })
    }

    function changeDescription(e) {
        e.preventDefault()
        setDescription(e.target.value)
        console.log(description)
    }

    function changeCount(e) {
        e.preventDefault()

        setCount(e.target.value)
        console.log(description)
    }


    return (
        <>
            <Container>
                <Row>
                    <Form>
                        <Form.Label htmlFor="description">Описание</Form.Label>

                        <Form.Control
                            id={"description"}
                            aria-label={"description"}
                            onChange={changeDescription}
                        />
                    </Form>
                </Row>
                <Row>

                    <Button
                        onClick={ask}>
                        Сгенерировать
                    </Button>
                </Row>
                <Row>
                    <div>
                        <Row>
                            {
                                urls.map((url, index) => (
                                    <Col className={"col-3"} key={index}>
                                        <img className={"img-fluid"} src={url.url} alt={"" + index}/>
                                    </Col>
                                ))
                            }
                        </Row>
                    </div>

                </Row>
            </Container>
        </>
    )
}
