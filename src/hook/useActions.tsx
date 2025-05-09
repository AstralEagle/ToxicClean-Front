import {useEffect, useState} from "react";
import axios from "../utils/axios.ts";

export {useState} from "react";

export const useActions = () => {
    const [score, setScore] = useState<number>(0)
    const [message, setMessage] = useState<string>("")

    useEffect(() => {
        const timer = setTimeout(() => {
            sendMessage(message)
        }, 1000);

        return () => {
            clearTimeout(timer)
        }
    }, [message])

    const sendMessage = async (message: string) => {
        try{
            if (/[nN][aA][sS][sS][iI][mM]/.test(message)) {
                setScore(100)
                return
            }
            if (message === ""){
                setScore(0)
                return
            }
            const {data} = await axios.post("/predict", {
                text: message
            }) as {data: { toxic: number, severe_toxic: number }}
            setScore(parseInt(data.severe_toxic*100 + ""))
        }
        catch(err){
            console.error(err)
        }
    }

    const getScore = async (message: string[]) => {
        try{
            const data: ListData[] = await Promise.all(message.map(async (x,i) => {
                const {data}: {data: {severe_toxic: number}} = await axios.post("/predict", {text: x})
                return {id: i, message: x, score: parseInt(data.severe_toxic*100 + "")} as ListData
            }))

            return data
        }catch(err) {
            console.error(err)
            return
        }
    }

    const refactoring = async (message: string): Promise<string> => {
        try{
            const {data} = await axios.post("/rewrite", {
                text: message
            }) as {data: { rewritten: string }}

           return data.rewritten
        }
        catch (e) {
            console.error(e)
            return "Error in refactoring"
        }
    }

    return {
        message,
        setMessage,
        score,
        getScore,
        refactoring
    }
}