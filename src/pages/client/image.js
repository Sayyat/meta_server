import React, { useState} from "react";
export default function Chat() {
    const [question, setQuestion] = useState('')
    const [urls, setUrls] = useState([{}])

    function ask() {
        fetch("/api/openai/image", {
            method: "post",
            body: JSON.stringify({description: question})
        }).then((response => response.json()))
            .then((result) => {
                setUrls(result)
                console.log(urls)
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
                {
                    urls.map((url, index) => (
                        <img src={url.url} alt={"" + index} key={index}/>
                    ))
                }
            </div>
            <button
                onClick={ask}>
                Ask
            </button>
        </>
    )
}
