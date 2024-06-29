import CustomRadioButton from '../../CustomRadioButton';
import CustomCheckbox from './CustomCheckbox';

const PriorityMultiSelectSection = ({ allPriorities, setAllPriorities, selectedPriorities, setSelectedPriorities }) => {
	return (
		<div>
			<div className="flex items-center">
				<div className="text-color-gray-100 w-[96px]">Priority</div>
				<div className="flex-1 flex items-center gap-4">
					<CustomRadioButton
						label="All"
						name="All"
						checked={allPriorities}
						onChange={() => {
							setAllPriorities(true);

							const selectedPrioritiesClone = { ...selectedPriorities };
							Object.keys(selectedPriorities).forEach((key) => {
								selectedPrioritiesClone[key] = false;
							});
							setSelectedPriorities(selectedPrioritiesClone);
						}}
						customOuterCircleClasses="!border-blue-500"
						customInnerCircleClasses="!bg-blue-500"
					/>

					<CustomCheckbox
						name="High"
						values={selectedPriorities}
						setValues={setSelectedPriorities}
						allPriorities={allPriorities}
						setAllPriorities={setAllPriorities}
					/>
					<CustomCheckbox
						name="Medium"
						values={selectedPriorities}
						setValues={setSelectedPriorities}
						allPriorities={allPriorities}
						setAllPriorities={setAllPriorities}
					/>
					<CustomCheckbox
						name="Low"
						values={selectedPriorities}
						setValues={setSelectedPriorities}
						allPriorities={allPriorities}
						setAllPriorities={setAllPriorities}
					/>
					<CustomCheckbox
						name="None"
						values={selectedPriorities}
						setValues={setSelectedPriorities}
						allPriorities={allPriorities}
						setAllPriorities={setAllPriorities}
					/>
				</div>
			</div>
		</div>
	);
};

export default PriorityMultiSelectSection;
