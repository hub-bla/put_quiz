export const stringToUint8 = (data: string, size: number) => {
	const textEncoder = new TextEncoder()
	const encodedData = textEncoder.encode(data)
	const paddedArray = new Uint8Array(size)
	paddedArray.set(encodedData, 0)

	return paddedArray
}
