const CustomCheckbox = ({ isChecked, setIsChecked, label }) => {
	// Function to handle change when the div or checkbox is clicked
	const handleChange = () => {
		// Toggle the current checked state
		setIsChecked(!isChecked);
	};

	return (
		<div className="flex items-center gap-2 cursor-pointer rounded" onClick={handleChange}>
			<input
				type="checkbox"
				name="Achieve it all"
				className="accent-blue-500"
				checked={isChecked}
				onChange={handleChange} // Using the same handleChange function for consistency
				onClick={(e) => e.stopPropagation()} // Prevent the event from bubbling up to the div's onClick
			/>
			<span className="font-medium">{label}</span>
		</div>
	);
};

export default CustomCheckbox;
