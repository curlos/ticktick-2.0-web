import { SuperMarioPixelHTML } from "../utils/superMarioPixelArt.utils";

interface PixelArtProps {
    gap?: string;
}

const PixelArt: React.FC<PixelArtProps> = ({ gap }) => {
    const colors = extractColorsFromHTML(SuperMarioPixelHTML);

    return (
        <div
            id="grid"
            className="grid"
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(20, 1fr)',
                gridTemplateRows: 'repeat(20, 1fr)',
                gap: gap ? gap : '0px'
            }}
        >
            {colors.map((color, index) => (
                <div
                    key={index}
                    className="grid-element"
                    style={{ backgroundColor: color, width: '20px', height: '20px' }}
                />
            ))}
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