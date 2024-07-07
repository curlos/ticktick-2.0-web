import Icon from '../Icon';

const TitleSection = ({ habit }) => (
	<div className="flex items-center justify-between">
		<div className="flex items-center gap-1">
			<Icon
				name="no_drinks"
				fill={1}
				customClass={'text-color-gray-50 !text-[30px] hover:text-white cursor-pointer'}
			/>

			<h2 className="text-[18px] font-medium">{habit.name}</h2>
		</div>

		<Icon
			name="more_horiz"
			fill={1}
			customClass={'text-color-gray-50 !text-[22px] hover:text-white cursor-pointer'}
		/>
	</div>
);

export default TitleSection;
