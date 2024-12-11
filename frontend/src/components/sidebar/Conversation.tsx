const Conversation = ({conversation} : {conversation: any}) => {
    return (
        <>
        <div className="flex gap-2 items-center hover:bg-sky rounded p-2 py-1 cursor-poiner">
            <div className="w-8 md:w-12 rounded-full">
                <p className="font-bold text-gray-200 text-sm md:text-md">{conversation.fullName}</p>
                <span className="text-x1 hidden md:inline-block">{conversation.emoji}</span>
            </div>
        </div>
        <div className="divider my-0 py-0 h-1"></div>
        </>

    )
};
export default Conversation;