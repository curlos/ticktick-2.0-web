import classNames from 'classnames';

interface CustomInputProps {
	type?: string;
	value: any;
	setValue: React.Dispatch<React.SetStateAction<any>>;
	customClasses?: string;
	onChange?: any;
}

const CustomInput: React.FC<CustomInputProps> = ({ type, value, setValue, onChange, customClasses }) => (
	<input
		type={type || 'text'}
		className={classNames(
			`text-center text-[14px] p-1 bg-color-gray-200 placeholder:text-[#7C7C7C] mb-0 w-full resize-none outline-none rounded focus:outline-blue-500`,
			customClasses
		)}
		value={value}
		onChange={onChange ? onChange : (e) => setValue(Number(e.target.value))}
	/>
);

export default CustomInput;
