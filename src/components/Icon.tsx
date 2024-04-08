interface IconProps {
    name: string;
    customClass?: string;
    fill?: number;
    wght?: number;
    grad?: number;
    opsz?: number;
    onClick?: () => void;
    onMouseOver?: React.MouseEventHandler<HTMLSpanElement> | undefined;
    onMouseLeave?: React.MouseEventHandler<HTMLSpanElement> | undefined;
}

const Icon: React.FC<IconProps> = ({ name, customClass, fill = 1, wght = 400, grad = 0, opsz = 24, onClick, onMouseOver, onMouseLeave }) => (
    <span onMouseOver className={"material-symbols-rounded" + (customClass ? ' ' + customClass : '')} style={{
        fontVariationSettings: `'FILL' ${fill}, 'wght' ${wght}, 'GRAD' ${grad}, 'opsz' ${opsz}`
    }} onClick={onClick} onMouseOver={onMouseOver} onMouseLeave={onMouseLeave}>{name}</span>
);

export default Icon;