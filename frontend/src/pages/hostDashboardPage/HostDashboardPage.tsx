import StandingTable from "@/components/StandingTable/StandingTable"
import { QuestionPreview } from "@/components/QuestionPreview"
import { StandingMessage, Question, useSocketContext, useUserContext } from "@/utils"
import { useEffect, useState } from "react"
import "./HostDashboardPage.css"
import { useNavigate } from "react-router-dom"

export const HostDashboardPage: React.FC = () => {
	const { preprocessMessage, sendMessage, newMessage } = useSocketContext()
	const { userType } = useUserContext()
	const navigate = useNavigate()

	if (userType !== "host") {
		navigate("/")
	}

	const [standingsData, setStandingsData] = useState<StandingMessage>({
		numberOfQuestions: 0,
		standings: {},
	})

	const [currentQuestionData, setCurrentQuestionData] = useState<Question>({
		text: "",
		answers: [],
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
			} else if (type === "standing") {
				const { data } = newMessage as {
					type: string
					data: StandingMessage
				}
				if (!data["standings"]) {
					data["standings"] = {}
				}
				setStandingsData(data)
			} else if (type === "question") {
				const { data } = newMessage as {
					type: string
					data: Question
				}
				setCurrentQuestionData(data)
			}
		}
	}, [newMessage])

	return (
		<div className="dashboard">
			<div className="dashboard-header">
				<button onClick={() => nextQuestion()}>Next question</button>
				
				{}
				{currentQuestionData.text ? (
					<div className="current-question">
						<QuestionPreview question={currentQuestionData} />
					</div>
				) : (
					<h2>Question not available</h2>
					/*todo handle quiz finish*/
				)}
			</div>
			{}
			<StandingTable standingsData={standingsData} />	
		</div>
	)
}
