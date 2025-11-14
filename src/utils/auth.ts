import {useSession, getSession} from "next-auth/react";

export const useCurrentUser = () => {
    const {data: session, status} = useSession();

    console.log("Status:", status, "Session:", session);

    if (status === "loading") {
        return undefined;
    }

    return session?.user || null;
}

export const getCurrentUser = async () => {
    const session = await getSession();
    return session?.user || null;
}

