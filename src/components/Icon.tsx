interface IconProps {
    name: string;
    customClass?: string;
    fill?: number;
    wght?: number;
    grad?: number;
    opsz?: number;
    toggleRef?: React.MutableRefObject<null>;
    onClick?: () => void;
    onMouseOver?: React.MouseEventHandler<HTMLSpanElement> | undefined;
    onMouseLeave?: React.MouseEventHandler<HTMLSpanElement> | undefined;
    key?: string;
}

const Icon: React.FC<IconProps> = ({ name, customClass, fill = 1, wght = 400, grad = 0, opsz = 24, toggleRef, onClick, onMouseOver, onMouseLeave, key }) => (
    <span
        ref={toggleRef}
        key={key}
        className={"material-symbols-rounded" + (customClass ? ' ' + customClass : '')}
        style={{
            fontVariationSettings: `'FILL' ${fill}, 'wght' ${wght}, 'GRAD' ${grad}, 'opsz' ${opsz}`
        }}
        onClick={onClick}
        onMouseOver={onMouseOver}
        onMouseLeave={onMouseLeave}
    >
        {name}
    </span>
);

export default Icon;