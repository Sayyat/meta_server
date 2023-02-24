import {useRef, useState} from "react";


export default function Chat() {

    const question = useRef()
    const [answer, setAnswer] = useState("Answer")


    function ask(){
        console.log(question.current.value)
        fetch("/api/openai/",{
            method: "post",
            body: JSON.stringify({question : question.current.value})
        }).then((response => response.json()))
            .then((answer) => {
                console.log(answer)
                setAnswer(answer.answer)
            })
    }
    return(
        <>
            <input type="text"  ref={question}/>
            <div >
                {answer}
            </div>
            <button
            onClick={ask}>
                Ask
            </button>
        </>
    )
}
