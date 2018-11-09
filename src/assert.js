export default function(expectation, msg) {
	if (!expectation) {
		throw new Error(msg);
	}
}
