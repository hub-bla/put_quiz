import { Standing } from "@/components/StandingTable/types"

type Answer = string

export interface Question {
	text: string
	correctAnswerIdx?: number
	answers: Answer[]
	start?: string
}

export interface Quiz {
	title: string
	questions: Question[]
}

export type Standings = {
	[username: string]: Standing
}

export interface StandingMessage {
	numberOfQuestions: number
	standings: Standings
}