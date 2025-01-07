import type {
	TBoard,
	TColor,
	THistory,
	TPawn,
	TSquare,
	TValidationResult,
} from "../constants";
import { debug } from "../debug/debug";
import { objectEntries } from "../utils";
import { validateBishopPosition } from "./bishop";
import { validateKnightPosition } from "./knight";
import { validatePawnPosition } from "./pawn";
import { validateQueenPosition } from "./queen";
import { validateRookPosition } from "./rook";

export function isSquareUnderAttack({
	currentColor,
	board,
	toSquare,
	history,
}: {
	currentColor: TColor;
	board: TBoard;
	toSquare: TSquare;
	history: THistory;
}): boolean {
	const opponentColor = currentColor === "w" ? "b" : "w";
	debug(
		"check",
		`Checking if ${toSquare} is under attack by ${opponentColor} pieces`,
	);

	for (const [fromSquare, piece] of objectEntries(board)) {
		const [color, pieceInitial] = piece || [];
		if (color === opponentColor) {
			debug("check", `Checking ${piece} from ${fromSquare} to ${toSquare}`);

			let validationResult: TValidationResult;
			switch (pieceInitial) {
				case "p":
					debug("check", `Validating pawn attack from ${fromSquare}`);
					validationResult = validatePawnPosition(
						piece as TPawn,
						fromSquare,
						`${currentColor}p`,
						toSquare,
						history,
					);
					break;
				case "n":
					debug("check", `Validating knight attack from ${fromSquare}`);
					validationResult = validateKnightPosition(fromSquare, toSquare);
					break;
				case "b":
					debug("check", `Validating bishop attack from ${fromSquare}`);
					validationResult = validateBishopPosition(
						fromSquare,
						toSquare,
						board,
					);
					break;
				case "r":
					debug("check", `Validating rook attack from ${fromSquare}`);
					validationResult = validateRookPosition(fromSquare, toSquare, board);
					break;
				case "q":
					debug("check", `Validating queen attack from ${fromSquare}`);
					validationResult = validateQueenPosition(fromSquare, toSquare, board);
					break;
				case "k":
					debug("check", "Skipping king for attack validation");
					continue;
				default:
					debug("check", `Unknown piece type: ${pieceInitial}`);
					continue;
			}

			if (validationResult?.valid) {
				debug(
					"check",
					`Square ${toSquare} is under attack by ${piece} from ${fromSquare}`,
				);
				debug("check", "Validation result:", validationResult);
				return true;
			}

			debug("check", `${piece} from ${fromSquare} cannot attack ${toSquare}`);
			debug("check", "Failed validation:", validationResult);
		}
	}
	debug("check", `No pieces can attack square ${toSquare}`);
	return false;
}
