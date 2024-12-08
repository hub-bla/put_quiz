import { ANS_TIME_MS } from "@/utils"
import "./Timebar.css"

interface TimebarProps {
    timeLeftMs: number
}

export const Timebar:React.FC<TimebarProps> = ({timeLeftMs}) => {
    const precentageLeft = 100*(timeLeftMs/ANS_TIME_MS)

    return <div style={{width: `${precentageLeft}%`}} className="timebar"></div>
}