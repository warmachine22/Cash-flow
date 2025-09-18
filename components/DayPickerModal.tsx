import React, { useRef, useEffect, useState } from 'react';
import Icon from './Icon';

interface DayPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (day: number) => void;
  initialDay: number;
}

const DayPickerModal: React.FC<DayPickerModalProps> = ({ isOpen, onClose, onSelect, initialDay }) => {
  if (!isOpen) return null;

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const dayElementsRef = useRef<Map<number, HTMLDivElement>>(new Map());
  const [currentDay, setCurrentDay] = useState(initialDay);

  const itemHeight = 48; // h-12 = 3rem = 48px

  // Scroll to initial day when modal opens
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollPosition = (initialDay - 1) * itemHeight - (container.clientHeight / 2) + (itemHeight / 2);
      container.scrollTop = scrollPosition;
    }
  }, [isOpen, initialDay]);

  // Use IntersectionObserver to find the centered day
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const day = parseInt(entry.target.getAttribute('data-day') || '1', 10);
            setCurrentDay(day);
          }
        });
      },
      {
        root: container,
        rootMargin: `-${container.clientHeight / 2 - 1}px 0px -${container.clientHeight / 2 - 1}px 0px`,
        threshold: 0.5,
      }
    );

    const dayElements = Array.from(dayElementsRef.current.values());
    dayElements.forEach((el) => observer.observe(el));

    return () => {
      dayElements.forEach((el) => observer.unobserve(el));
    };
  }, [isOpen]);

  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4" aria-modal="true" role="dialog">
      <div className="bg-white dark:bg-gray-800 w-full max-w-xs rounded-2xl p-6 shadow-xl flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold" id="modal-title">Select Day</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
            <Icon name="times" className="w-5 h-5" />
          </button>
        </div>
        
        <div className="relative h-48 my-4">
            <div 
                ref={scrollContainerRef}
                className="absolute inset-0 overflow-y-scroll no-scrollbar"
                style={{ scrollSnapType: 'y mandatory' }}
            >
                <div style={{ height: `calc(50% - ${itemHeight / 2}px)` }}></div> {/* Top Spacer */}
                {days.map(day => (
                    <div 
                        key={day}
                        ref={node => {
                            if (node) dayElementsRef.current.set(day, node);
                            else dayElementsRef.current.delete(day);
                        }}
                        data-day={day}
                        className={`flex items-center justify-center text-3xl font-bold h-12 transition-all duration-200 ${currentDay === day ? 'text-primary scale-100' : 'text-gray-400 dark:text-gray-500 scale-90 opacity-60'}`}
                        style={{ scrollSnapAlign: 'center' }}
                    >
                        {day}
                    </div>
                ))}
                <div style={{ height: `calc(50% - ${itemHeight / 2}px)` }}></div> {/* Bottom Spacer */}
            </div>
            <div className="absolute top-1/2 left-0 w-full h-12 -translate-y-1/2 rounded-lg pointer-events-none border-y-2 border-primary/50"></div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-auto pt-4">
            <button 
                onClick={onClose}
                className="w-full py-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                aria-label="Cancel"
            >
                Cancel
            </button>
            <button 
                onClick={() => onSelect(currentDay)}
                className="w-full py-3 text-white font-semibold rounded-lg transition-colors bg-primary hover:bg-green-600"
            >
                Select
            </button>
        </div>
      </div>
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default DayPickerModal;