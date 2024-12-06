import StandingTable from "@/components/StandingTable/StandingTable"
import { useSocketContext } from "@/utils"
import { useEffect } from "react"
import "./HostDashboardPage.css"

export const HostDashboardPage: React.FC = () => {
	const { preprocessMessage, sendMessage, newMessage } = useSocketContext()

	const nextQuestion = () => {
		const message = preprocessMessage("next_question", {})
		sendMessage(message)
	}

	useEffect(() => {
		const { type, data } = newMessage
		if (type.length != 0) {
			if (type === "player_answer") {
			}
		}
	}, [newMessage])

	return (
		<div className='dashboard'>
			<button onClick={() => nextQuestion()}>Next question</button>
			<StandingTable />
		</div>
	)
}
