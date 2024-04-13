import Modal from "./Modal";
import Icon from "../Icon";
import { useState } from "react";

interface ModalAddListProps {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalAddList: React.FC<ModalAddListProps> = ({ isModalOpen, setIsModalOpen }) => {
    const [listColor, setListColor] = useState('');
    const [selectedView, setSelectedView] = useState('list');

    const DEFAULT_COLORS = ['#ff6161', '#FFAC37', '#FFD323', '#E6EA48', '#33D870', '#4BA1FF', '#6D75F4'];
    const DEFAULT_COLORS_LOWERCASE = DEFAULT_COLORS.map((color) => color.toLowerCase());

    interface ColorPickerProps {
        color: string;
        setColor: React.Dispatch<React.SetStateAction<string>>;
    }

    const ColorPicker: React.FC<ColorPickerProps> = ({ color, setColor }) => {
        return (
            <div className="color-picker-wrapper">
                <input
                    type="color"
                    id="color-picker"
                    name="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                />
            </div>
        );
    };

    const views = [
        {
            type: 'list',
            iconName: 'list'
        },
        {
            type: 'kanban',
            iconName: 'view_kanban'
        },
        {
            type: 'timeline',
            iconName: 'timeline'
        },
    ];

    return (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} position="top-center" customClasses="!w-[400px]">
            <div className="bg-color-gray-650 rounded-lg shadow-lg py-4 px-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-[16px]">Add List</h3>
                    <Icon name="close" customClass={"!text-[20px] text-color-gray-100 hover:text-white cursor-pointer"} onClick={() => setIsModalOpen(false)} />
                </div>

                <div className="border border-[#4c4c4c] rounded-md focus:outline-blue-500 flex items-center peer-focus:border-blue-500">
                    <Icon name="menu" customClass={"!text-[16px] hover:text-white p-[6px]"} />

                    <div className="border-l border-[#4c4c4c] p-[6px] flex-1">
                        <input placeholder="Name" className="placeholder-[#4c4c4c] outline-none bg-transparent w-full peer" />
                    </div>
                </div>

                <div className="space-y-4 mt-3">
                    <div className="flex items-center">
                        <div className="text-color-gray-100 w-[96px]">Color</div>
                        <div className="flex items-center gap-1">
                            <div className={'border-[2px] rounded-full p-[2px] cursor-pointer' + (listColor === '' ? ' border-blue-500' : ' border-transparent')} onClick={() => setListColor('')}>
                                <div className="circle-with-line" />
                            </div>

                            {DEFAULT_COLORS_LOWERCASE.map((color) => (
                                <div className={'border-[2px] rounded-full p-[2px]'} style={{ borderColor: listColor === color ? color : 'transparent' }} onClick={() => setListColor(color)}>
                                    <div className={`h-[14px] w-[14px] rounded-full cursor-pointer`} style={{ backgroundColor: color }} />
                                </div>
                            ))}

                            <ColorPicker color={listColor} setColor={setListColor} />

                            {/* <div className={'border-[2px] rounded-full p-[2px] cursor-pointer' + (listColor === '' ? ' border-blue-500' : ' border-transparent')} onClick={() => setListColor('')}>
                                <div className="gradient-circle" />
                            </div> */}
                        </div>
                    </div>

                    <div className="flex items-center">
                        <div className="text-color-gray-100 w-[96px]">View</div>
                        <div className="flex items-center gap-1">
                            {views.map((view) => (
                                <Icon name={view.iconName} customClass={"!text-[22px] px-3 py-1 text-color-gray-100 bg-color-gray-300 rounded-md cursor-pointer border border-transparent" + (selectedView === view.type ? ' !border-blue-500 !text-blue-500' : '')} onClick={() => setSelectedView(view.type)} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ModalAddList;