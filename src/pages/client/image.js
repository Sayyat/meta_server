import React, {useRef, useState} from "react";
import axios from "axios";
import Image from "next/image";

export default function Chat() {
    const description = useRef()
    const [file, setFile] = useState(null)
    const [urls, setUrls] = useState([])

    function ask() {
        fetch("/api/openai/image/variants", {
            method: "post",
            body: JSON.stringify({image: file})
        }).then((response => response.json()))
            .then((answer) => {
                console.log(answer)
            })
    }

    function uploadFile(e) {
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => {
            setFile(reader.result)
            console.log(reader.result)
        };
        reader.onerror = () => setFile(null);
    }

    return (
        <>
            <input type="file" onChange={(e) => uploadFile(e)} accept={'image/png'}/>
            <input type="text" ref={description}/>
            <div>
                {
                    urls.map((url, index) => (
                        <Image src={url.url} alt={"" + index} key={index}/>
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
