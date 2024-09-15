const SmallLabel = ({ data }) => {
	const { name, value, color } = data;

	return (
		<div className="flex items-center gap-2">
			<div
				className="w-[15px] h-[15px] rounded-full"
				style={{
					backgroundColor: color,
				}}
			></div>
			<div className="w-[25px]">{value}</div>
			<div className="border-l border-color-gray-100 pl-2">{name}</div>
		</div>
	);
};

export default SmallLabel;
