import { createContext, useContext, useState } from "react"

type UserType = "client" | "player" | "host"

interface IUserContext {
    userType: UserType
    username: string
    setUserTypeToHost: () => void
    setUserTypeToPlayer: () => void
    setUsernameIfPlayer: (username: string) => void
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
    const [username, setUsername] = useState("")

    const setUserTypeToHost = () => {
        setUserType("host")
    }

    const setUserTypeToPlayer = () => {
        setUserType("player")
    }

    const setUsernameIfPlayer = (un: string) => (userType == "player" && setUsername(un))

    return {userType, setUserTypeToHost, setUserTypeToPlayer, setUsernameIfPlayer, username}
}