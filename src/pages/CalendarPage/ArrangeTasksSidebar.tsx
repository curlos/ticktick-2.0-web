import Icon from '../../components/Icon';
import { useCalendarContext } from '../../contexts/useCalendarContext';

const ArrangeTasksSidebar = () => {
	const { setShowArrangeTasksSidebar } = useCalendarContext();
	const iconClassName = 'text-color-gray-50 !text-[18px] cursor-pointer p-1 hover:bg-color-gray-300 rounded';

	return (
		<div className="px-3 py-5">
			<div className="flex items-center justify-between">
				<div>Arrange Tasks</div>
				<div className="flex items-center">
					<Icon
						name="filter_alt"
						fill={0}
						customClass={iconClassName}
						onClick={() => {
							setShowArrangeTasksSidebar(false);
						}}
					/>

					<Icon
						name="close"
						fill={0}
						customClass={iconClassName}
						onClick={() => {
							setShowArrangeTasksSidebar(false);
						}}
					/>
				</div>
			</div>
		</div>
	);
};

export default ArrangeTasksSidebar;
