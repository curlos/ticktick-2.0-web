interface IconProps {
    name: string;
    customClass?: string;
    fill?: number;
    wght?: number;
    grad?: number;
    opsz?: number;
}

const Icon: React.FC<IconProps> = ({ name, customClass, fill = 1, wght = 400, grad = 0, opsz = 48 }) => (
    <span className={"material-symbols-rounded" + (customClass ? ' ' + customClass : '')} style={{
        fontVariationSettings: `'FILL' ${fill}, 'wght' ${wght}, 'GRAD' ${grad}, 'opsz' ${opsz}`
    }}>{name}</span>
);

export default Icon;