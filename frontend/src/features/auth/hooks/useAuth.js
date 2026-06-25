import { useAuth } from "../../../context/AuthContext.jsx";

export function useAuthHook() {
    return useAuth();
}

export { useAuth };
