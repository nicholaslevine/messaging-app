import { useAuthContext } from "../../context/authContext";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { MessageCircle } from "lucide-react";

const MessageContainer = () => {
    const {selectedConversation} = useConversation();
    
    return (
        <div className="w-full flex flex-col">
            {!selectedConversation ? (
                <NoChatSelected />) :
                (
                    <>
                    <div className="bg-slate-500 px-4 mb-2">
                        <span className="label-text">To: </span><span className="text-gray-900 font-bold">{selectedConversation.fullName}</span>
                    </div>
                    <Messages />
                    <MessageInput />
                </>
                )
            }
        </div>
    )
};

export default MessageContainer;


const NoChatSelected = () => {
    const {authUser} = useAuthContext();
    return (
        <div className="flex items-center justify-center w-full h-full">
            <div className="px-4 text-center sm:text-lg md:text-x1 text-gray-200 font-semibold">
                <p>Welcome {authUser?.fullName}</p>
                <p>Select a chat to start messages</p>
                <MessageCircle className="text-3x1 md:text-6x1 text-center" />
            </div>
        </div>
    )
}