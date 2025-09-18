import React, { useState, ReactNode } from 'react';
import Icon from './Icon';

interface CollapsibleSectionProps {
  title: string;
  iconName?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  iconName,
  children,
  defaultOpen = false,
  isOpen: controlledIsOpen,
  onToggle,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen);

  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    }
    if (!isControlled) {
      setInternalIsOpen(prev => !prev);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md">
      <button
        onClick={handleToggle}
        className="w-full flex justify-between items-center p-4 text-left font-semibold text-gray-700 dark:text-gray-200"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          {iconName && <Icon name={iconName} className="w-5 h-5 text-gray-500" />}
          <span>{title}</span>
        </div>
        <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} className="w-5 h-5 text-primary" />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700">
          {children}
        </div>
      )}
    </div>
  );
};

export default CollapsibleSection;