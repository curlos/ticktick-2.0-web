interface ColorPickerProps {
	color: string;
	setColor: React.Dispatch<React.SetStateAction<string>>;
}

// TODO: I'm using the default HTML color picker but not sure if I want to stick with it. I don't think this is a big deal or anything so this'll probably be one of the last things I do but it should be looked at in the future. It's purely a frontend issue to resolve though, no backend involved.
const ColorPicker: React.FC<ColorPickerProps> = ({ color, setColor }) => {
	return (
		<div className="color-picker-wrapper">
			<input
				type="color"
				id="color-picker"
				name="color"
				value={color}
				onChange={(e) => setColor(e.target.value)}
			/>
		</div>
	);
};

export default ColorPicker;
