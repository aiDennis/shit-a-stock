export function getArchiveNav(
	count: number,
	index: number,
	posts: any[]
): { prev: any; next: any } {
	 
	if (count < 2) return { prev: null, next: null }
	if (count === 2 && index === 0) return { prev: null, next: posts[1] }
	if (count === 2 && index === 1) return { prev: posts[0], next: null }
	
	if (index < 1) return { prev: posts[count - 1], next: posts[index + 1] }
	if (index === count - 1) return { prev: posts[index - 1], next: posts[0] }
	return {
		prev: posts[index - 1],
		next: posts[index + 1]
	}
}