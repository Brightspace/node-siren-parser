export default function(expectation, msg) {
	if (!expectation) {
		console.error(msg);
		throw new Error(msg);
	}
}
