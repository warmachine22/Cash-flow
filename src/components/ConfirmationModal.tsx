import React from 'react';
import Icon from './Icon';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmButtonText?: string;
  confirmButtonVariant?: 'primary' | 'danger';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText = 'Confirm',
  confirmButtonVariant = 'primary'
}) => {
  if (!isOpen) return null;
  
  const confirmButtonClass = confirmButtonVariant === 'danger'
    ? 'bg-danger hover:bg-red-600'
    : 'bg-primary hover:bg-green-600';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
      <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-2xl p-6 transform transition-transform duration-300 scale-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold" id="modal-title">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
            <Icon name="times" className="w-5 h-5" />
          </button>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-6" id="modal-description">{message}</p>
        
        <div className="grid grid-cols-2 gap-4">
            <button 
                onClick={onClose}
                className="w-full py-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                aria-label="Cancel"
            >
                Cancel
            </button>
            <button 
                onClick={onConfirm}
                className={`w-full py-3 text-white font-semibold rounded-lg transition-colors ${confirmButtonClass}`}
                aria-label={confirmButtonText}
            >
                {confirmButtonText}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;