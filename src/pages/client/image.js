import React, {useState} from "react";
import Form from "react-bootstrap/Form";
import {Button, Col, Container, Row} from "react-bootstrap";

export default function ImageGenerator() {
    const [description, setDescription] = useState('')
    const [size, setSize] = useState('256')
    const [count, setCount] = useState(1)
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
                    <Col>
                        <Form>
                            <Form.Label htmlFor="description">Description</Form.Label>

                            <Form.Control
                                id={"description"}
                                aria-label={"description"}
                                onChange={changeDescription}
                            />
                        </Form>

                    </Col>
                    <Col>
                        <Form>
                            <Form.Label>Size</Form.Label>
                            <div className={"mb-3 inline-radio"}>
                                <Form.Check inline type="radio" name={"size"} label={"256"} id={"256"}
                                            onClick={() => setSize("256")}/>
                                <Form.Check inline type="radio" name={"size"} label={"512"} id={"512"}
                                            onClick={() => setSize("512")}/>
                                <Form.Check inline type="radio" name={"size"} label={"1024"} id={"1024"}
                                            onClick={() => setSize("1024")}/>
                            </div>
                        </Form>

                    </Col>
                    <Col>
                        <Form>

                            <Form.Label htmlFor="count">Count</Form.Label>
                            <Form.Control id={"count"} type="number" min={1} max={10} onChange={changeCount}/>

                        </Form>
                    </Col>
                </Row>
                <Row>
                    <Button
                        onClick={ask}>
                        Generate
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
