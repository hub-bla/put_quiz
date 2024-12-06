import { QuestionCard } from "@/components/QuestionCard"
import StandingTable from "@/components/StandingTable/StandingTable"
import { Question, useSocketContext } from "@/utils"
import { useEffect, useState } from "react"
import { ReadyState } from "react-use-websocket"

export const PlayPage: React.FC = () => {
	const [currentQuestionData, setCurrentQuestionData] = useState<Question>({
		text: "",
		answers: [],
	})
	const [standingPhase, setStandingPhase] = useState(false)
	const { readyState, newMessage } = useSocketContext()

	const setAnswered = () => {
		setStandingPhase(true)
	}

	const connectionStatus = {
		[ReadyState.CONNECTING]: "Connecting",
		[ReadyState.OPEN]: "Open",
		[ReadyState.CLOSING]: "Closing",
		[ReadyState.CLOSED]: "Closed",
		[ReadyState.UNINSTANTIATED]: "Uninstantiated",
	}[readyState]

	useEffect(() => {
		const { type, data } = newMessage as {
			type: string
			data: Question
		}
		if (type.length != 0) {
			if (type === "question") {
				setCurrentQuestionData(data)
				setStandingPhase(false)
			}
		}
	}, [newMessage])

	const question = (
		<QuestionCard question={currentQuestionData} setAnswered={setAnswered} />
	)

	return (
		<>
			{connectionStatus === "Closed" ? (
				<h1>Disconnected</h1>
			) : (
				<>
					{standingPhase ? (
						<StandingTable />
					) : (
						<>
							<h1>Waiting for the Host to Start the Game...</h1>
							{question}
						</>
					)}
				</>
			)}
		</>
	)
}
