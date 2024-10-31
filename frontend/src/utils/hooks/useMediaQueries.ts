import { useEffect, useMemo, useState } from "react"

function useMediaQuery(query: string) {
	const mediaQuery = useMemo(() => window.matchMedia(query), [query])
	const [match, setMatch] = useState(mediaQuery.matches)

	useEffect(() => {
		const onChange = () => setMatch(mediaQuery.matches)
		mediaQuery.addEventListener("change", onChange)

		return () => mediaQuery.removeEventListener("change", onChange)
	}, [mediaQuery])

	return match
}

function useMediaQueries() {
	const md = useMediaQuery("(max-width: 1080px)")

	return { md }
}

export default useMediaQueries
