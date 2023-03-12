import React, {useRef, useState} from "react";
import axios from "axios";

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
            <input type="text" onChange={(e) => changeQuestion(e)}/>
            <div>
                {answer}
            </div>
            <button
                onClick={ask}>
                Ask
            </button>
        </>
    )
}
