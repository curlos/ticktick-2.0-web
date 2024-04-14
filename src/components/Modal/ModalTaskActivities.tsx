import Icon from "../Icon";
import Modal from "./Modal";

interface ModalTaskActivitiesProps {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalTaskActivities: React.FC<ModalTaskActivitiesProps> = ({ isModalOpen, setIsModalOpen }) => {

    return (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} position="top-center">
            <div className="bg-color-gray-650 rounded-lg shadow-lg py-4 px-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-[16px]">Task Activities</h3>
                    <Icon name="close" customClass={"!text-[20px] text-color-gray-100 hover:text-white cursor-pointer"} onClick={() => setIsModalOpen(false)} />
                </div>
            </div>
        </Modal>
    );
};

export default ModalTaskActivities;