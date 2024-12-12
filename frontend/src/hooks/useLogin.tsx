import toast from "react-hot-toast";
import { useAuthContext } from "../context/authContext";
import { useState } from "react";

const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const {setAuthUser} = useAuthContext();

    const login = async (username: string, password : string) => {
        setLoading(true)
        try {
            const res = await fetch('/api/auth/login', {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({username, password})
            });
            const data = await res.json();

            if (!res.ok){
                throw new Error(data.error);
            };

            setAuthUser()

        } catch (error : any) {
            throw new Error(error);
            toast.error(error.message);
            
        } finally{
            setLoading(false);
        }
    };
    return {loading, login}
};

export default useLogin;