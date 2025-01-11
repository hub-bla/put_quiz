import { createContext, useContext, useState } from "react"

type UserType = "client" | "player" | "host"

interface IUserContext {
    userType: UserType
    setUserTypeToHost: () => void
    setUserTypeToPlayer: () => void
}

export const UserContext = createContext<IUserContext | null>(null)

export const useUserContext = () => {
    const context = useContext(UserContext)

    if (!context) {
        throw new Error(
            "useUserContext must be used withing UserContext.Provider"
        )
    }

    return context
}

export const useUserContextValues = () => {
    const [userType, setUserType] = useState<UserType>("client")


    const setUserTypeToHost = () => {
        setUserType("host")
    }

    const setUserTypeToPlayer = () => {
        setUserType("player")
    }

    return {userType, setUserTypeToHost, setUserTypeToPlayer}
}