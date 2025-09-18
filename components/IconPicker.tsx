import React from 'react';
import Icon, { ICONS_SVG } from './Icon';

const iconNames = Object.keys(ICONS_SVG);

interface IconPickerProps {
  selectedIcon: string;
  onSelectIcon: (iconName: string) => void;
  onClose: () => void;
}

const IconPicker: React.FC<IconPickerProps> = ({ selectedIcon, onSelectIcon, onClose }) => {
  return (
    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-3">
      <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto">
        {iconNames.map(name => (
          <button
            key={name}
            type="button"
            onClick={() => {
              onSelectIcon(name);
              onClose();
            }}
            className={`flex items-center justify-center p-2 rounded-md transition-colors ${
              selectedIcon === name
                ? 'bg-primary text-white'
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            aria-label={`Select icon ${name}`}
          >
            <Icon name={name} className="w-5 h-5" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default IconPicker;
