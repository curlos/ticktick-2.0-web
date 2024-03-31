import Modal from "./Modal";
import AddTaskForm from "../AddTaskForm";

interface ModalAddTaskFormProps {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalAddTaskForm: React.FC<ModalAddTaskFormProps> = ({ isModalOpen, setIsModalOpen }) => {

    return (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} position="top-center">
            <div className="rounded-xl shadow-lg">
                <AddTaskForm setShowAddTaskForm={setIsModalOpen} />
            </div>
        </Modal>
    );
};

export default ModalAddTaskForm;