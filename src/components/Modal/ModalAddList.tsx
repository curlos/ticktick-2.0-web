import Modal from "./Modal";
import Icon from "../Icon";
import { useState } from "react";
import Dropdown from "../Dropdown/Dropdown";

interface ModalAddListProps {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalAddList: React.FC<ModalAddListProps> = ({ isModalOpen, setIsModalOpen }) => {
    const [name, setName] = useState('');
    const [listColor, setListColor] = useState('');
    const [selectedView, setSelectedView] = useState('list');
    const [selectedFolder, setSelectedFolder] = useState('None');
    const [isDropdownFolderVisible, setIsDropdownFolderVisible] = useState(false);
    const [isModalNewFolderOpen, setIsModalNewFolderOpen] = useState(false);

    const DEFAULT_COLORS = ['#ff6161', '#FFAC37', '#FFD323', '#E6EA48', '#33D870', '#4BA1FF', '#6D75F4'];
    const DEFAULT_COLORS_LOWERCASE = DEFAULT_COLORS.map((color) => color.toLowerCase());

    interface ColorPickerProps {
        color: string;
        setColor: React.Dispatch<React.SetStateAction<string>>;
    }

    // TODO: I'm using the default HTML color picker but not sure if I want to stick with it. I don't think this is a big deal or anything so this'll probably be one of the last things I do but it should be looked at in the future. It's purely a frontend issue to resolve though, no backend involved.
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

    // TODO: Setup backend to add lists. Should take all the properties in an object: name, color, view, and folder.
    const handleAddList = () => {
        return;
    };

    const [isNameInputFocused, setIsNameInputFocused] = useState(false);

    return (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} position="top-center" customClasses="!w-[400px]">
            <div className="bg-color-gray-650 rounded-lg shadow-lg py-4 px-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-[16px]">Add List</h3>
                    <Icon name="close" customClass={"!text-[20px] text-color-gray-100 hover:text-white cursor-pointer"} onClick={() => setIsModalOpen(false)} />
                </div>

                <div className={`border border-[#4c4c4c] rounded-md flex items-center ${isNameInputFocused ? 'border-blue-500' : ''}`}>
                    <Icon name="menu" customClass="!text-[16px] text-color-gray-100 hover:text-white p-[6px]" />
                    <div className="border-l border-[#4c4c4c] p-[6px] flex-1">
                        <input
                            value={name}
                            placeholder="Name"
                            className="placeholder-color-gray-100 outline-none bg-transparent w-full"
                            onChange={(e) => setName(e.target.value)}
                            onFocus={() => setIsNameInputFocused(true)}
                            onBlur={() => setIsNameInputFocused(false)}
                        />
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

                    <div className="flex items-center">
                        <div className="text-color-gray-100 w-[96px]">Folder</div>
                        <div className="flex-1">
                            <div className="border border-color-gray-200 rounded p-1 px-2 flex justify-between items-center hover:border-blue-500 rounded-md cursor-pointer" onClick={() => {
                                setIsDropdownFolderVisible(!isDropdownFolderVisible);
                            }}>
                                <div>{selectedFolder}</div>
                                <Icon name="expand_more" fill={0} customClass={'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'} />
                            </div>

                            <DropdownFolder isVisible={isDropdownFolderVisible} setIsVisible={setIsDropdownFolderVisible} selectedFolder={selectedFolder} setSelectedFolder={setSelectedFolder} isModalNewFolderOpen={isModalNewFolderOpen} setIsModalNewFolderOpen={setIsModalNewFolderOpen} />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-2 mt-5">
                    <button className="border border-color-gray-200 rounded py-[2px] cursor-pointer hover:bg-color-gray-200 min-w-[114px]" onClick={() => {
                        setIsModalOpen(false);
                    }}>Close</button>
                    <button className={"bg-blue-500 rounded py-[2px] cursor-pointer hover:bg-blue-600 min-w-[114px]" + (!name ? ' opacity-50' : '')} onClick={() => {
                        setIsModalOpen(false);
                        handleAddList();
                    }}>Save</button>
                </div>
            </div>

            <ModalNewFolder isModalOpen={isModalNewFolderOpen} setIsModalOpen={setIsModalNewFolderOpen} />
        </Modal>
    );
};

interface DropdownFolderProps {
    isVisible: boolean;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
    selectedFolder: string;
    setSelectedFolder: React.Dispatch<React.SetStateAction<string>>;
    isModalNewFolderOpen: boolean;
    setIsModalNewFolderOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DropdownFolder: React.FC<DropdownFolderProps> = ({ isVisible, setIsVisible, selectedFolder, setSelectedFolder, setIsModalNewFolderOpen }) => {

    const foldersArray = ['None', 'GreatFrontEnd', 'Hobbies & Interests', 'Tech Interview Prep'];

    return (
        <Dropdown isVisible={isVisible} setIsVisible={setIsVisible} customClasses={' mt-[5px] shadow-2xl border border-color-gray-200 rounded-lg'}>
            <div className="w-[232px] p-1 rounded" onClick={(e) => e.stopPropagation()}>
                <div className="overflow-auto gray-scrollbar">
                    {foldersArray.map((folder) => {
                        const isFolderSelected = (selectedFolder == folder);

                        return (
                            <div
                                key={folder}
                                className="flex items-center justify-between hover:bg-color-gray-300 p-2 rounded-lg cursor-pointer"
                                onClick={() => {
                                    setSelectedFolder(folder);
                                    setIsVisible(false);
                                }}
                            >
                                <div className={isFolderSelected ? 'text-blue-500' : ''}>{folder}</div>
                                {isFolderSelected && <Icon name="check" fill={0} customClass={'text-blue-500 !text-[18px] hover:text-white cursor-pointer'} />}
                            </div>
                        );
                    })}
                </div>

                <div className="flex items-center gap-1 mt-2 hover:bg-color-gray-300 p-2 rounded-lg cursor-pointer" onClick={() => {
                    setIsModalNewFolderOpen(true);
                    setIsVisible(false);
                }}>
                    <Icon name="add" fill={0} customClass={'text-color-gray-50 !text-[20px] hover:text-white cursor-pointer'} />
                    <div>New Folder</div>
                </div>
            </div>
        </Dropdown>
    );
};

interface ModalNewFolderProps {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalNewFolder: React.FC<ModalNewFolderProps> = ({ isModalOpen, setIsModalOpen }) => {
    const [folderName, setFolderName] = useState('');
    const [isFolderNameInputFocused, setIsFolderNameInputFocused] = useState(false);

    // TODO: Setup backend to add new folders
    const handleCreateNewFolder = () => {
        setFolderName('');
        return;
    };

    return (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} position="top-center" customClasses="!w-[400px]">
            <div className="bg-color-gray-650 rounded-lg shadow-lg py-4 px-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-[16px]">New Folder</h3>
                    <Icon name="close" customClass={"!text-[20px] text-color-gray-100 hover:text-white cursor-pointer"} onClick={() => setIsModalOpen(false)} />
                </div>

                <div className={`border border-[#4c4c4c] rounded-md focus:outline-blue-500 flex items-center` + (isFolderNameInputFocused ? ' border-blue-500' : '')}>
                    <Icon name="folder_open" customClass={"!text-[16px] text-color-gray-100 hover:text-white p-[6px]"} />

                    <div className="p-[6px] flex-1">
                        <input
                            placeholder="Name"
                            value={folderName}
                            onChange={(e) => setFolderName(e.target.value)}
                            onFocus={() => setIsFolderNameInputFocused(true)}
                            onBlur={() => setIsFolderNameInputFocused(false)}
                            className="placeholder-color-gray-100 outline-none bg-transparent w-full" />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-2 mt-5">
                    <button className="border border-color-gray-200 rounded py-[2px] cursor-pointer hover:bg-color-gray-200 min-w-[114px]" onClick={() => {
                        setIsModalOpen(false);
                    }}>Close</button>
                    <button className={"bg-blue-500 rounded py-[2px] cursor-pointer hover:bg-blue-600 min-w-[114px]" + (!folderName ? ' opacity-50' : '')} onClick={() => {
                        setIsModalOpen(false);
                        handleCreateNewFolder();
                    }}>Save</button>
                </div>
            </div>
        </Modal>
    );
};

export default ModalAddList;