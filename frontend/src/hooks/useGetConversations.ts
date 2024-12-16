import {useState, useEffect} from "react"
import { ConversationType } from "../zustand/useConversation";
import toast from "react-hot-toast";

const useGetConversations = () => {
    const [loading, setloading] = useState(false);
    const [conversations, setConversations] = useState<ConversationType[]>([])

    useEffect(() => {
        const getConversations = async () => {
            setloading(true);
            try {
                const res= await fetch("/api/messages/conversations");
                const data = await res.json();
                if (data.error){
                    throw new Error(data.error);
                }
                setConversations(data);
            } catch (error : any) {
                toast.error(error.message);
            } finally {
                setloading(false);
            }
        };

        getConversations();
    }, []);

    return {loading, conversations};
}

export default useGetConversations;