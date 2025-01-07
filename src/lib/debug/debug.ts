type TDebugKey =
	| "moves" // Basic movement validation
	| "castle" // Castling logic
	| "check" // Check/checkmate validation
	| "board" // Board state changes
	| "drag" // Drag and drop events
	| "all"; // Enable all debug logs

const debugFlags: { [key in TDebugKey]?: boolean } = {
	all: true,
	moves: false,
	castle: false,
	check: false,
	board: false,
	drag: false,
};

export function setDebug(key: TDebugKey, value: boolean): void {
	if (key === "all") {
		for (const k of Object.keys(debugFlags)) {
			debugFlags[k as TDebugKey] = value;
		}
	} else {
		debugFlags[key] = value;
	}
}

export function isDebugEnabled(key: TDebugKey): boolean {
	return debugFlags.all || debugFlags[key] || false;
}

const colors = {
	reset: "\x1b[0m",
	red: "\x1b[31m",
	green: "\x1b[32m",
	yellow: "\x1b[33m",
	blue: "\x1b[34m",
	magenta: "\x1b[35m",
	cyan: "\x1b[36m",
};

export function debug(key: TDebugKey, message: string, data?: unknown) {
	if (isDebugEnabled(key)) {
		const timestamp = new Date().toISOString();
		const color =
			colors[
				Object.keys(colors)[
					Math.abs(key.length) % (Object.keys(colors).length - 1)
				] as keyof typeof colors
			];
		console.log(
			`${color}[${timestamp}][${key.toUpperCase()}] ${message}${colors.reset}`,
			data ? data : "",
		);
	}
}
