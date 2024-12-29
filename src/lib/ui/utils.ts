export function isHTMLElement(node: null | unknown) {
	return node instanceof HTMLElement;
}

export function getEventPosition(e: MouseEvent | TouchEvent) {
	if (e instanceof MouseEvent) {
		return { clientX: e.clientX, clientY: e.clientY };
	}
	if (e instanceof TouchEvent && e.touches.length > 0) {
		return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
	}
	throw Error("Invalid getEventPosition argument");
}
