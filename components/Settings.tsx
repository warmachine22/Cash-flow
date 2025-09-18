
import React, { useState } from 'react';
import CollapsibleSection from './CollapsibleSection';
import { storageService } from '../services/storageService';
import { Category, RecurringExpense, Transaction, TransactionType } from '../types';
import Icon from './Icon';
import IconPicker from './IconPicker';
import AddRecurringExpenseModal from './AddRecurringExpenseModal';
import ConfirmationModal from './ConfirmationModal';

interface SettingsProps {
    incomeCategories: Category[];
    setIncomeCategories: React.Dispatch<React.SetStateAction<Category[]>>;
    expenseCategories: Category[];
    setExpenseCategories: React.Dispatch<React.SetStateAction<Category[]>>;
    recurringExpenses: RecurringExpense[];
    setRecurringExpenses: React.Dispatch<React.SetStateAction<RecurringExpense[]>>;
    loadSampleData: () => void;
    transactions: Transaction[];
    darkMode: boolean;
    setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
    clearAllData: () => void;
}

const Settings: React.FC<SettingsProps> = ({ 
    incomeCategories, setIncomeCategories,
    expenseCategories, setExpenseCategories,
    recurringExpenses, setRecurringExpenses,
    loadSampleData, darkMode, setDarkMode,
    clearAllData
}) => {
  
    const [openSettingsSection, setOpenSettingsSection] = useState<string | null>(null);
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState<'income' | 'expense' | null>(null);
    const [categoryFormData, setCategoryFormData] = useState({ name: '', icon: 'tag' });
    
    const [isRecurringModalOpen, setIsRecurringModalOpen] = useState(false);
    const [expenseToEdit, setExpenseToEdit] = useState<RecurringExpense | null>(null);

    const [confirmationProps, setConfirmationProps] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        confirmButtonText?: string;
        confirmButtonVariant?: 'primary' | 'danger';
    } | null>(null);

    const handleSettingsToggle = (sectionId: string) => {
        setOpenSettingsSection(prev => (prev === sectionId ? null : sectionId));
    };

    const handleBackup = () => {
        const data = storageService.loadData();
        if (data) {
            const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
            const link = document.createElement("a");
            link.href = jsonString;
            link.download = `cashflow-journal-backup-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
        } else {
            alert("No data available to backup.");
        }
    };
    
    const handleRestoreRequest = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setConfirmationProps({
                isOpen: true,
                title: "Restore Data?",
                message: "This will overwrite all current data. Are you sure you want to continue?",
                onConfirm: () => {
                    processRestoreFile(file);
                    setConfirmationProps(null);
                },
                confirmButtonText: 'Restore',
                confirmButtonVariant: 'danger'
            });
        }
        event.target.value = ''; // Reset file input
    };

    const processRestoreFile = (file: File) => {
        const fileReader = new FileReader();
        fileReader.readAsText(file, "UTF-8");
        fileReader.onload = e => {
            if (e.target && typeof e.target.result === 'string') {
                try {
                    const restoredData = JSON.parse(e.target.result);
                    if (restoredData.transactions && restoredData.incomeCategories) {
                       storageService.saveData(restoredData);
                       alert("Data restored successfully! The app will now reload.");
                       window.location.reload();
                    } else {
                        throw new Error("Invalid backup file format.");
                    }
                } catch (error) {
                    alert("Error restoring data. Please make sure the file is a valid backup.");
                }
            }
        };
    };

    const handleLoadSampleData = () => {
        setConfirmationProps({
            isOpen: true,
            title: "Load Sample Data?",
            message: "This will overwrite all current data. Are you sure you want to continue?",
            onConfirm: () => {
                loadSampleData();
                alert("Sample data loaded successfully!");
                setConfirmationProps(null);
            },
            confirmButtonText: 'Load Data',
            confirmButtonVariant: 'danger'
        });
    }

    const handleClearDataRequest = () => {
        setConfirmationProps({
            isOpen: true,
            title: "Clear All Data?",
            message: "This will permanently delete all transactions, categories, and settings. This action cannot be undone.",
            onConfirm: () => {
                clearAllData();
                alert("All data has been cleared.");
                setConfirmationProps(null);
            },
            confirmButtonText: 'Clear Data',
            confirmButtonVariant: 'danger'
        });
    };
    
    // Category Actions
    const handleAddCategory = (type: TransactionType) => {
        if (!categoryFormData.name.trim()) {
            alert("Category name cannot be empty.");
            return;
        }
        const newCategory = { ...categoryFormData, type, id: `cat-${Date.now()}` };
        if (type === TransactionType.INCOME) {
            setIncomeCategories(prev => [...prev, newCategory]);
        } else {
            setExpenseCategories(prev => [...prev, newCategory]);
        }
        setCategoryFormData({ name: '', icon: 'tag' });
        setShowAddForm(null);
    };

    const handleUpdateCategory = () => {
        if (!categoryFormData.name.trim()) {
            alert("Category name cannot be empty.");
            return;
        }
        const update = (categories: Category[]) => categories.map(c => c.id === editingCategoryId ? { ...c, ...categoryFormData } : c);
        setIncomeCategories(update);
        setExpenseCategories(update);
        setEditingCategoryId(null);
        setCategoryFormData({ name: '', icon: 'tag' });
    };
    
    const handleDeleteCategory = (id: string) => {
        if (recurringExpenses.some(re => re.categoryId === id)) {
            alert("Cannot delete a category that is used by a recurring expense.");
            return;
        }
        setConfirmationProps({
            isOpen: true,
            title: 'Delete Category?',
            message: 'Are you sure you want to delete this category? This action cannot be undone.',
            onConfirm: () => {
                setIncomeCategories(prev => prev.filter(c => c.id !== id));
                setExpenseCategories(prev => prev.filter(c => c.id !== id));
                setConfirmationProps(null);
            },
            confirmButtonText: 'Delete',
            confirmButtonVariant: 'danger'
        });
    };
    
    // Recurring Expense Actions
    const handleSaveRecurring = (expense: Omit<RecurringExpense, 'id'> | RecurringExpense) => {
        if ('id' in expense) {
            // Update existing
            setRecurringExpenses(prev => prev.map(re => re.id === expense.id ? expense : re));
        } else {
            // Add new
            const newRecurring = { ...expense, id: `re-${Date.now()}` };
            setRecurringExpenses(prev => [...prev, newRecurring]);
        }
        setIsRecurringModalOpen(false);
    };

    const handleDeleteRecurring = (id: string) => {
        setConfirmationProps({
            isOpen: true,
            title: 'Delete Recurring Expense?',
            message: 'Are you sure you want to delete this recurring expense?',
            onConfirm: () => {
                setRecurringExpenses(prev => prev.filter(re => re.id !== id));
                setConfirmationProps(null);
            },
            confirmButtonText: 'Delete',
            confirmButtonVariant: 'danger'
        });
    };
    
    const openEditRecurringModal = (expense: RecurringExpense) => {
        setExpenseToEdit(expense);
        setIsRecurringModalOpen(true);
    };

    const openAddRecurringModal = () => {
        setExpenseToEdit(null);
        setIsRecurringModalOpen(true);
    };


    const CategoryForm = ({ type }: { type: TransactionType }) => {
        const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
        return (
            <div className="p-3 my-2 bg-gray-100 dark:bg-gray-700/50 rounded-lg space-y-3">
                <input type="text" placeholder="Category Name" value={categoryFormData.name} onChange={e => setCategoryFormData({...categoryFormData, name: e.target.value})} className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2" />
                <div 
                    className="relative"
                    onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsIconPickerOpen(false); }}
                >
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Icon</label>
                    <button
                        onClick={() => setIsIconPickerOpen(prev => !prev)}
                        className="w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 flex items-center justify-between"
                        type="button"
                        aria-haspopup="true"
                        aria-expanded={isIconPickerOpen}
                    >
                        <div className="flex items-center gap-2">
                            <Icon name={categoryFormData.icon} className="w-5 h-5" />
                            <span className="capitalize">{categoryFormData.icon.replace(/-/g, ' ')}</span>
                        </div>
                        <Icon name={isIconPickerOpen ? 'chevron-up' : 'chevron-down'} className="w-5 h-5 text-gray-400" />
                    </button>
                    {isIconPickerOpen && (
                        <IconPicker 
                            selectedIcon={categoryFormData.icon}
                            onSelectIcon={(icon) => setCategoryFormData({...categoryFormData, icon: icon})}
                            onClose={() => setIsIconPickerOpen(false)}
                        />
                    )}
                </div>
                <div className="flex gap-2">
                    <button onClick={editingCategoryId ? handleUpdateCategory : () => handleAddCategory(type)} className="w-full text-sm bg-primary text-white px-3 py-1 rounded-md">Save</button>
                    <button onClick={() => { setEditingCategoryId(null); setShowAddForm(null); }} className="w-full text-sm bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded-md">Cancel</button>
                </div>
            </div>
        );
    };

    return (
    <>
        <div className="space-y-4 pt-4">
            <CollapsibleSection title="Manage Categories" iconName="cog" isOpen={openSettingsSection === 'categories'} onToggle={() => handleSettingsToggle('categories')}>
                <div className="py-2 space-y-4">
                    <div>
                        <h3 className="font-semibold text-gray-600 dark:text-gray-400 mb-2">Income</h3>
                        {incomeCategories.map(cat => editingCategoryId === cat.id ? <CategoryForm key={cat.id} type={cat.type} /> : (
                            <div key={cat.id} className="flex items-center justify-between py-2">
                                <div className="flex items-center gap-3"><Icon name={cat.icon} className="w-5 h-5 text-gray-500" /><span>{cat.name}</span></div>
                                <div className="flex gap-2">
                                    <button onClick={() => { setEditingCategoryId(cat.id); setCategoryFormData({ name: cat.name, icon: cat.icon }); setShowAddForm(null); }}><Icon name="pen" className="w-4 h-4 text-gray-500 hover:text-primary" /></button>
                                    <button onClick={() => handleDeleteCategory(cat.id)}><Icon name="trash" className="w-4 h-4 text-gray-500 hover:text-danger" /></button>
                                </div>
                            </div>
                        ))}
                        {showAddForm === 'income' ? <CategoryForm type={TransactionType.INCOME} /> : <button onClick={() => { setShowAddForm('income'); setEditingCategoryId(null); setCategoryFormData({ name: '', icon: 'tag' })}} className="text-sm text-primary font-semibold mt-2">+ Add New Category</button>}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-600 dark:text-gray-400 mb-2">Expenses</h3>
                        {expenseCategories.map(cat => editingCategoryId === cat.id ? <CategoryForm key={cat.id} type={cat.type} /> : (
                            <div key={cat.id} className="flex items-center justify-between py-2">
                                <div className="flex items-center gap-3"><Icon name={cat.icon} className="w-5 h-5 text-gray-500" /><span>{cat.name}</span></div>
                                <div className="flex gap-2">
                                    <button onClick={() => { setEditingCategoryId(cat.id); setCategoryFormData({ name: cat.name, icon: cat.icon }); setShowAddForm(null); }}><Icon name="pen" className="w-4 h-4 text-gray-500 hover:text-primary" /></button>
                                    <button onClick={() => handleDeleteCategory(cat.id)}><Icon name="trash" className="w-4 h-4 text-gray-500 hover:text-danger" /></button>
                                </div>
                            </div>
                        ))}
                        {showAddForm === 'expense' ? <CategoryForm type={TransactionType.EXPENSE} /> : <button onClick={() => { setShowAddForm('expense'); setEditingCategoryId(null); setCategoryFormData({ name: '', icon: 'tag' })}} className="text-sm text-primary font-semibold mt-2">+ Add New Category</button>}
                    </div>
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Set up Recurring Expenses" iconName="sync" isOpen={openSettingsSection === 'recurring'} onToggle={() => handleSettingsToggle('recurring')}>
                <div className="py-2 space-y-2">
                    {recurringExpenses.map(re => {
                        const category = expenseCategories.find(c => c.id === re.categoryId);
                        return (
                            <div key={re.id} className="flex items-center justify-between py-2">
                                <div className="flex items-center gap-3">
                                    <Icon name={category?.icon || 'tag'} className="w-5 h-5 text-gray-500" />
                                    <div>
                                        <p>{category?.name}</p>
                                        <p className="text-xs text-gray-400">${re.amount} - {re.description}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => openEditRecurringModal(re)}><Icon name="pen" className="w-4 h-4 text-gray-500 hover:text-primary"/></button>
                                    <button onClick={() => handleDeleteRecurring(re.id)}><Icon name="trash" className="w-4 h-4 text-gray-500 hover:text-danger"/></button>
                                </div>
                            </div>
                        );
                    })}
                   <button onClick={openAddRecurringModal} className="text-sm text-primary font-semibold mt-2">+ Add New Recurring Expense</button>
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Data Backup & Restore" iconName="cloud-upload-alt" isOpen={openSettingsSection === 'data'} onToggle={() => handleSettingsToggle('data')}>
                <div className="space-y-4 pt-4">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Save your data to a file or restore it from a backup.</p>
                        <div className="flex gap-4">
                            <button onClick={handleBackup} className="text-sm bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">Backup</button>
                            <label className="text-sm bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer">
                                Restore
                                <input type="file" accept=".json" onChange={handleRestoreRequest} className="hidden" />
                            </label>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700"></div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Permanently delete all data from the app.</p>
                        <button 
                            onClick={handleClearDataRequest} 
                            className="text-sm bg-red-100 dark:bg-red-900/50 text-danger px-4 py-2 rounded-md hover:bg-red-200 dark:hover:bg-red-800/50"
                        >
                            Clear All Data
                        </button>
                    </div>
                </div>
            </CollapsibleSection>
            
            <CollapsibleSection title="Appearance" iconName={darkMode ? 'moon' : 'sun'} isOpen={openSettingsSection === 'appearance'} onToggle={() => handleSettingsToggle('appearance')}>
                <div className="flex items-center justify-between pt-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Switch between light and dark themes.</p>
                    <button onClick={() => setDarkMode(!darkMode)} className="text-sm bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">
                    Switch to {darkMode ? 'Light' : 'Dark'}
                    </button>
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Load Sample Data" iconName="database" isOpen={openSettingsSection === 'sample'} onToggle={() => handleSettingsToggle('sample')}>
                <p className="text-sm text-gray-500 dark:text-gray-400 pt-4">Populate the app with sample data to see how it works. This will overwrite all your current data.</p>
                <div className="flex justify-end pt-2">
                    <button onClick={handleLoadSampleData} className="text-sm bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 px-4 py-2 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800/50">
                    Load Sample Data
                    </button>
                </div>
            </CollapsibleSection>
        </div>
        {isRecurringModalOpen && (
            <AddRecurringExpenseModal 
                onClose={() => setIsRecurringModalOpen(false)}
                onSave={handleSaveRecurring}
                expenseCategories={expenseCategories}
                expenseToEdit={expenseToEdit}
            />
        )}
        {confirmationProps && confirmationProps.isOpen && (
            <ConfirmationModal 
                isOpen={confirmationProps.isOpen}
                onClose={() => setConfirmationProps(null)}
                onConfirm={confirmationProps.onConfirm}
                title={confirmationProps.title}
                message={confirmationProps.message}
                confirmButtonText={confirmationProps.confirmButtonText}
                confirmButtonVariant={confirmationProps.confirmButtonVariant}
            />
        )}
    </>
    );
};

export default Settings;
