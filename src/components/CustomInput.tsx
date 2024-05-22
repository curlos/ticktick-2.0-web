interface CustomInputProps {
	type?: string;
	value: any;
	setValue: React.Dispatch<React.SetStateAction<any>>;
	customClasses?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({ type, value, setValue, customClasses }) => (
	<input
		type={type || 'text'}
		className={
			`text-center text-[14px] p-1 bg-color-gray-200 placeholder:text-[#7C7C7C] mb-0 w-full resize-none outline-none rounded focus:outline-blue-500` +
			(customClasses ? ` ${customClasses}` : '')
		}
		value={value}
		onChange={(e) => setValue(Number(e.target.value))}
	/>
);

export default CustomInput;
