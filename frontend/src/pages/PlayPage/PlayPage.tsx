import { useSocketContext } from "@/utils"
import { ReadyState } from 'react-use-websocket';
export const PlayPage:React.FC = () => {
    const { readyState } = useSocketContext()

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
      }[readyState];

    return <>
    
    {connectionStatus === "Closed" ? <h1>Disconnected</h1> : <h1>Waiting for the Host to Start the Game...</h1>}
    </>
}