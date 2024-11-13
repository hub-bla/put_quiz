type Answer = string

export interface Question {
	text: string
	correctAnswerIdx?: number
	answers: Answer[]
}

export interface Quiz {
	title: string
	questions: Question[]
}
