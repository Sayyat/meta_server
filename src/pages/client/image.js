import React, {useEffect, useState} from "react";
import Form from "react-bootstrap/Form";
import {Button, Col, Container, Row} from "react-bootstrap";

export default function ImageGenerator() {
    const [taskId, setTaskId] = useState('')
    const [description, setDescription] = useState('')
    const [ratio, setRatio] = useState('1x1')
    const [styles, setStyles] = useState([])
    const [style, setStyle] = useState(79)
    const [url, setUrl] = useState(null)

    const RATIOS = [
        "1x1",
        "1x2",
        "2x1",
        "2x3",
        "3x2",
        "3x4",
        "4x3",
        "3x5",
        "5x3",
        "9x16",
        "16x9",
        "10x16",
        "16x10",
        "9x19",
        "19x9",
        "9x20",
        "20x9",
    ]

    useEffect(() => {
        loadStyles()
    }, [])

    async function loadStyles() {
        const response = await fetch("/api/dream/styles")
        const result = await response.json()
        setStyles(result)
    }

    function handleStyleSelect(event) {
        event.preventDefault()
        setStyle(event.target.value)
    }

    function handleRatioSelect(event) {
        event.preventDefault()
        setRatio(event.target.value)
    }

    function generate() {
        fetch("/api/dream/generate", {
            method: "post",
            headers: {},
            body: JSON.stringify({
                description,
                style,
                ratio
            })
        }).then((response => response.json()))
            .then((result) => {
                console.log(result)
                setTaskId(result.id)
                setUrl(result.result)
            })
    }

    function edit() {
        fetch("/api/dream/generate", {
            method: "post",
            headers: {},
            body: JSON.stringify({
                taskId,
                description,
                style,
                ratio
            })
        }).then((response => response.json()))
            .then((result) => {
                console.log(result)
                setUrl(result.result)
            })
    }

    function changeDescription(e) {
        e.preventDefault()
        setDescription(e.target.value)
    }

    function changeStyle(e) {
        e.preventDefault()
        setStyle(e.target.value)
    }


    return (
        <>
            <Container>
                <Row>
                    <Col>
                        <select name="styleSelect" id="styleSelect" onChange={handleStyleSelect}>
                            {styles.map(style => (
                                <option key={`style_${style.id}`} value={style.id}>
                                    {style.name}
                                </option>
                            ))}
                        </select>
                    </Col>

                    <Col>
                        <select name="ratioSelect" id="ratioSelect" onChange={handleRatioSelect}>
                            {RATIOS.map((ratio, index) => (
                                <option key={`style_${index}`} value={ratio}>
                                    {ratio}
                                </option>
                            ))}
                        </select>
                    </Col>
                </Row>
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
                        onClick={generate}>
                        Сгенерировать
                    </Button>
                    <Button
                        onClick={edit}>
                        Изменить
                    </Button>
                </Row>
                <Row>
                    <div>
                        <img className={"img-fluid"} src={url} alt={"image"}/>
                    </div>
                </Row>
            </Container>
        </>
    )
}
