import StandingTable from "@/components/StandingTable/StandingTable"
import { StandingMessage, useSocketContext } from "@/utils"
import { useEffect, useState } from "react"
import "./HostDashboardPage.css"

export const HostDashboardPage: React.FC = () => {
	const { preprocessMessage, sendMessage, newMessage } = useSocketContext()
	const [standingsData, setStandingsData] = useState<StandingMessage>({
		numberOfQuestions: 0,
		standings: {},
	})
	const nextQuestion = () => {
		const message = preprocessMessage("next_question", {})
		sendMessage(message)
	}

	useEffect(() => {
		const { type } = newMessage
		if (type.length != 0) {
			if (type === "player_answer") {
				return
			} else if (type === "standing"){
				const { data } = newMessage as {
					type: string
					data: StandingMessage
				}
				if (!data["standings"]) {
						data["standings"] = {}
				}
				setStandingsData(data)
			}
		}
	}, [newMessage])

	return (
		<div className='dashboard'>
			<button onClick={() => nextQuestion()}>Next question</button>
			<StandingTable standingsData={standingsData}/>
		</div>
	)
}
