import { useEffect, useMemo, useState } from "react"

const useMediaQuery = (query: string) => {
	const mediaQuery = useMemo(() => window.matchMedia(query), [query])
	const [match, setMatch] = useState(mediaQuery.matches)

	useEffect(() => {
		const onChange = () => setMatch(mediaQuery.matches)
		mediaQuery.addEventListener("change", onChange)

		return () => mediaQuery.removeEventListener("change", onChange)
	}, [mediaQuery])

	return match
}

export const useMediaQueries = () => {
	const md = useMediaQuery("(max-width: 1080px)")

	return { md }
}
