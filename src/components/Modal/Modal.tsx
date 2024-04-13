import React from 'react';

interface ModalProps {
    isOpen: boolean,
    onClose: () => void;
    position?: string;
    customClasses?: string;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, position, customClasses, children }) => {
    if (!isOpen) return null;

    let containerClasses = `z-50 relative p-3 max-w-full w-[500px]`;

    switch (position) {
        case 'top-center':
            containerClasses += ' mx-auto mt-[60px]';
            break;
        default:
            containerClasses += ' mx-auto my-auto';
            break;
    }

    if (position === 'center') {
        containerClasses += ' mx-auto my-auto';
    }

    return (
        <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
            <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
            <div className={containerClasses + (customClasses ? ` ${customClasses}` : '')}>
                {children}
            </div>
        </div>
    );
};

export default Modal;
