import {Send} from "lucide-react";


const MessageInput = () => {
    return (
        <form className="px-4 mb-3">
            <div className="w-full relative">
                <input type="text" placeholder="Send a message" className="border text-sm rounded-lg block w-full pg-2 5 bg-gray-700 border-gray-600 text-white" />
                <button type="submit" className="absolute inset-y-0 end-0 flex items-center pe-3">
                    <Send className="w-6 h-6 text-white" />
                </button>
            </div>
        </form>
    )
}

export default MessageInput;