import classNames from 'classnames';
import Dropdown from '../../../components/Dropdown/Dropdown';
import { DropdownProps } from '../../../interfaces/interfaces';
import SmallLabel from './SmallLabel';

interface DropdownPrioritiesProps extends DropdownProps {
	customClasses: string;
}

const DropdownCompletedSmallLabeList: React.FC<DropdownPrioritiesProps> = ({
	toggleRef,
	isVisible,
	setIsVisible,
	customClasses,
	progressBarData,
}) => {
	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={classNames(
				'shadow-2xl border border-color-gray-200 rounded-lg max-h-[276px] overflow-auto gray-scrollbar',
				customClasses
			)}
		>
			<div className="w-[355px] p-3">
				<div className="text-[15px] font-bold mb-4">Classified Completion Statistics</div>

				<div className="space-y-2 w-full">
					{progressBarData.map((data) => (
						<SmallLabel key={data.name} data={data} fromDropdown={true} />
					))}
				</div>
			</div>
		</Dropdown>
	);
};

export default DropdownCompletedSmallLabeList;
