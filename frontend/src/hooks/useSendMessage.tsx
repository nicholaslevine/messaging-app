import {useState} from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useSendMessage = () => {
    const [loading, setLoading] = useState(false);
    const {messages, setMessages, selectedConversation} = useConversation();

    const sendMessage = async (message: string) => {
        setLoading(true);  
        if (!selectedConversation) return;
        try {
            const res = await fetch(`/api/messages/send/${selectedConversation.id}`, {
                method: "post",
                headers: {
                    "Content-Type": "Application/JSON",
                },
                body: JSON.stringify({message}),
        });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            setMessages([...messages, data]);
        } catch (error : any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };
    return {sendMessage, loading}

};

export default useSendMessage;