import classNames from 'classnames';
import { SuperMarioPixelHTML } from '../utils/superMarioPixelArt.utils';

interface PixelArtProps {
	gap?: string;
}

const PixelArt: React.FC<PixelArtProps> = ({ gap }) => {
	const colors = extractColorsFromHTML(SuperMarioPixelHTML);
	const filledInColors = colors.filter((color) => color !== 'transparent');
	const timerProgress = 0.9;
	let foundFilledInColors = 0;
	let lastFilledInColorLessThanOrEqualTimerProgressIndex = null;

	return (
		<div
			id="grid"
			className="grid"
			style={{
				display: 'grid',
				gridTemplateColumns: 'repeat(20, 1fr)',
				gridTemplateRows: 'repeat(20, 1fr)',
				gap: gap ? gap : '0px',
			}}
		>
			{colors.map((color, index) => {
				const isFilledInColor = color !== 'transparent';
				let opacity = 0.5;
				let showBlinkingOpacity = false;

				if (isFilledInColor) {
					const isFirstFilledinColor = foundFilledInColors === 0;
					foundFilledInColors += 1;

					const currentProgress = foundFilledInColors / filledInColors.length;

					// Show the filled in color with the full opacity if enough time has progressed to already fill it in.
					if (currentProgress <= timerProgress) {
						opacity = 1;
						lastFilledInColorLessThanOrEqualTimerProgressIndex = index;

						// If not enough time has progressed and this is EITHER the first filled in color in the pixel art OR the color AFTER the last filled in color, then show the blinking opacity animation on that color to show that it is in the process of being filled.
					} else if (
						index === lastFilledInColorLessThanOrEqualTimerProgressIndex + 1 ||
						isFirstFilledinColor
					) {
						showBlinkingOpacity = true;
					}
				}

				return (
					<div
						key={index}
						className={classNames('grid-element', showBlinkingOpacity ? 'blinking-opacity' : '')}
						style={{ backgroundColor: color, width: '20px', height: '20px', opacity }}
					/>
				);
			})}
		</div>
	);
};

function extractColorsFromHTML(htmlString: string) {
	// This regex matches any div with or without a style attribute
	const divRegex = /<div class(?:Name)?="grid-element"(?: style="background-color: (.*?)")?><\/div>/g;
	const colors = [];
	let match;

	// Iterate over all matches and add the appropriate color or 'transparent' to the array
	while ((match = divRegex.exec(htmlString)) !== null) {
		const color = match[1] || 'transparent'; // If no style attribute, use 'transparent'
		colors.push(color.replace(';', ''));
	}

	return colors;
}

export default PixelArt;
