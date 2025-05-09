import {useEffect, useState} from "react";
import axios from "../utils/axios.ts";

export {useState} from "react";

export const useActions = () => {
    const [score, setScore] = useState<number>(70)
    const [message, setMessage] = useState<string>("")

    useEffect(() => {
        const timer = setTimeout(() => {
            setScore(x => x+1)
            sendMessage(message)
        }, 1000);

        return () => {
            clearTimeout(timer)
        }
    }, [message])

    const sendMessage = async (message: string) => {
        try{
            const {data} = await axios.post("/predict", {
                text: message
            }) as {data: any}
            setScore(data.score)
        }
        catch(err){
            console.error(err)
        }
    }

    return {
        message,
        setMessage,
        score
    }
}