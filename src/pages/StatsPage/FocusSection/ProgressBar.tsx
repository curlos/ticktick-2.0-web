import classNames from 'classnames';

const ProgressBar = ({ item, fromDropdown = false }) => {
	return (
		<div>
			<div className="flex justify-between items-center mb-1">
				<div className="flex-1 w-full">
					<div className={classNames(!fromDropdown ? 'truncate w-[120px]' : 'w-[180px]')}>{item.name}</div>
				</div>
				<div className="text-[#8C8C8C]">
					{item.value} • {item.percentage}%
				</div>
			</div>
			<div key={item.name} className="rounded-full dark:bg-[#232323]">
				<div
					className={`text-xs font-medium text-blue-100 text-center p-[3px] leading-none rounded-full`}
					style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
				/>
			</div>
		</div>
	);
};

export default ProgressBar;
