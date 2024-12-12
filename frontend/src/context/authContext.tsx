import { ReactNode, SetStateAction, createContext, useEffect, useContext } from "react"
import toast from "react-hot-toast";

type authUserType = {
    id: string,
    fullName: string, 
    email: string,
    profilePic: string,
    gender: string
}


const AuthContext = createContext<{
    authUser: authUserType | null;
    setAuthUser: Dispath<SetStateAction<authUserType | null>>;
    isLoading: boolean;
}>({
    authUser: null,
    setAuthUser: () => {},
    isLoading: true,
});

export const AuthContextProvider = ({children}:{children:ReactNode}) => {
    const [authUser, setAuthUser] = useState<authUserType | null>(null)
    const [isLoading, setIsLoading] = useState(true);
    useEffect(async () => {
        try {
            const res = await fetch("/api/auth/me");
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message);
            }
            setAuthUser(data);
            
        } catch (error : any) {
            console.error(error)
            toast.error(error.message);
        }finally{
            setIsLoading(false);
        }
    })
    return (
        <AuthContext.Provider value = {{
            authUser,
            isLoading,
            setAuthUser
        }}>
            {children}
        </AuthContext.Provider>
    )
};

export const useAuthContext = () => {
    return useContext(AuthContext);
}