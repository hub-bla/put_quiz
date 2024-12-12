import { StandingMessage } from "@/utils"
import "./AnsweredSidebar.css"

interface AnsweredSidebarProps {
	standingsData: StandingMessage
}

export const AnsweredSidebar: React.FC<AnsweredSidebarProps> = ({
	standingsData,
}) => {
	const { standings } = standingsData
	let playersThatAnswered = 0
	const playersStates = Object.entries(standings).map((player, idx) => {
		const [username, answersObj] = player
		const { answered } = answersObj
		playersThatAnswered += answered
		return (
			<div key={idx}>
				{username}: {answered ? "answered" : "thinking..."}
			</div>
		)
	})
	return (
		<div className='answer-sidebar'>
			<h3>
				Answered: {playersThatAnswered}/{Object.keys(standings).length}
			</h3>
			{playersStates}
		</div>
	)
}
