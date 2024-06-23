import ColorPicker from './ColorPicker';

const ColorList = ({ colorList, color, setColor }) => {
	return (
		<div className="flex items-center">
			<div className="text-color-gray-100 w-[96px]">Color</div>
			<div className="flex items-center gap-1">
				<div
					className={
						'border-[2px] rounded-full p-[2px] cursor-pointer' +
						(color === '' ? ' border-blue-500' : ' border-transparent')
					}
					onClick={() => setColor('')}
				>
					<div className="circle-with-line" />
				</div>

				{colorList.map((currColor) => (
					<div
						key={currColor}
						className={'border-[2px] rounded-full p-[2px]'}
						style={{ borderColor: color === currColor ? currColor : 'transparent' }}
						onClick={() => setColor(currColor)}
					>
						<div
							className={`h-[14px] w-[14px] rounded-full cursor-pointer`}
							style={{ backgroundColor: currColor }}
						/>
					</div>
				))}

				<ColorPicker color={color} setColor={setColor} />
			</div>
		</div>
	);
};

export default ColorList;
