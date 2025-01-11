import { AnsweredSidebar } from "@/components/AnsweredSidebar"
import { QuestionCard } from "@/components/QuestionCard"
import StandingTable from "@/components/StandingTable/StandingTable"
import { Timebar } from "@/components/Timebar"
import {
	ANS_TIME_MS,
	Question,
	StandingMessage,
	TIMEBAR_UPDATE_MS,
	useSocketContext,
	useUserContext,
} from "@/utils"
import { useEffect, useState } from "react"
import { ReadyState } from "react-use-websocket"
import "./PlayPage.css"
import { useNavigate } from "react-router-dom"

interface Timeout {
	timeLeft: number
	intervalId: NodeJS.Timeout | null
}

interface TimeoutMessage {
	question: string
}

export const PlayPage: React.FC = () => {
	const [currentQuestionData, setCurrentQuestionData] = useState<Question>({
		text: "",
		answers: [],
	})

	const [standingsData, setStandingsData] = useState<StandingMessage>({
		numberOfQuestions: 0,
		standings: {},
	})

	const [end, setEnd] = useState(false)

	const [timeLeftMs, setTimeLeftMs] = useState<Timeout>({
		timeLeft: ANS_TIME_MS,
		intervalId: null,
	})

	const [standingPhase, setStandingPhase] = useState(false)
	const { readyState, newMessage, sendMessage, preprocessMessage } =
		useSocketContext()

	const setAnswered = () => {
		setStandingPhase(true)
	}

	const { userType } = useUserContext()
	const navigate = useNavigate()

	if (userType !== "player") {
		navigate("/")
	}

	const connectionStatus = {
		[ReadyState.CONNECTING]: "Connecting",
		[ReadyState.OPEN]: "Open",
		[ReadyState.CLOSING]: "Closing",
		[ReadyState.CLOSED]: "Closed",
		[ReadyState.UNINSTANTIATED]: "Uninstantiated",
	}[readyState]

	const handleTimeLeft = () => {
		setTimeLeftMs((prevTimeLeftMs) => ({
			...prevTimeLeftMs,
			timeLeft: prevTimeLeftMs.timeLeft - TIMEBAR_UPDATE_MS,
		}))
	}

	useEffect(() => {
		const { type } = newMessage
		if (type.length != 0) {
			if (type === "question") {
				const { data } = newMessage as {
					type: string
					data: Question
				}

				if (timeLeftMs.intervalId) {
					clearInterval(timeLeftMs.intervalId)
				}

				setTimeLeftMs({
					timeLeft:
						ANS_TIME_MS -
						(new Date().getTime() - Number(data.start ? data.start : 0)),
					intervalId: setInterval(() => handleTimeLeft(), TIMEBAR_UPDATE_MS),
				})

				setCurrentQuestionData(data)
				setStandingPhase(false)
			} else if (type === "timeout") {
				const { data } = newMessage as {
					type: string
					data: TimeoutMessage
				}

				if (currentQuestionData.text === data.question) {
					setStandingPhase(true)
				}
			} else if (type === "standing") {
				const { data } = newMessage as {
					type: string
					data: StandingMessage
				}

				if (!data["standings"]) {
					data["standings"] = {}
				}
				setStandingsData(data)
			} else if (type === "end") {
				setEnd(true)
				setStandingPhase(true)
				const mess = preprocessMessage("DISCONNECT", {})
				sendMessage(mess)
			}
		}
	}, [newMessage])

	const question = (
		<QuestionCard question={currentQuestionData} setAnswered={setAnswered} />
	)

	if (timeLeftMs.timeLeft < 0 && timeLeftMs.intervalId) {
		clearInterval(timeLeftMs.intervalId)

		setTimeLeftMs({
			timeLeft: ANS_TIME_MS,
			intervalId: null,
		})
	}
	return (
		<>
			{connectionStatus === "Closed" && !end ? (
				<h1>Disconnected</h1>
			) : (
				<>
					{standingPhase ? (
						<div>
							{end && <h1>Final Standing</h1>}
							<StandingTable standingsData={standingsData} />
						</div>
					) : (
						<div>
							{!currentQuestionData.text && (
								<h1>Waiting for the Host to Start the Game...</h1>
							)}
							{!end && timeLeftMs.timeLeft > 0 && currentQuestionData.text && (
								<>
									<div className='question-panel'>
										<Timebar timeLeftMs={timeLeftMs.timeLeft} />
										{question}
									</div>
									<AnsweredSidebar standingsData={standingsData} />
								</>
							)}
						</div>
					)}
				</>
			)}
		</>
	)
}
