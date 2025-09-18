
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { TimePeriod, Transaction, Category, RecurringExpense, TransactionType } from './types';
import { INITIAL_INCOME_CATEGORIES, INITIAL_EXPENSE_CATEGORIES, SAMPLE_TRANSACTIONS, SAMPLE_RECURRING_EXPENSES } from './constants';
import { storageService } from './services/storageService';
import Header from './components/Header';
import TimePeriodTabs from './components/TimePeriodTabs';
import NetCashFlowCard from './components/NetCashFlowCard';
import TransactionButtons from './components/TransactionButtons';
import TransactionHistory from './components/TransactionHistory';
import SpendingSummary from './components/SpendingSummary';
import RecurringExpensesList from './components/RecurringExpensesList';
import Settings from './components/Settings';
import AddTransactionModal from './components/AddTransactionModal';
import CollapsibleSection from './components/CollapsibleSection';

const App: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [incomeCategories, setIncomeCategories] = useState<Category[]>([]);
    const [expenseCategories, setExpenseCategories] = useState<Category[]>([]);
    const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpense[]>([]);

    const [timePeriod, setTimePeriod] = useState<TimePeriod>(TimePeriod.MONTH);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<TransactionType>(TransactionType.INCOME);
    const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
    const [darkMode, setDarkMode] = useState(false);
    const [openSection, setOpenSection] = useState<string>('history'); // 'history', 'summary', 'recurring', 'settings'

    useEffect(() => {
        const loadedData = storageService.loadData();
        if (loadedData) {
            setTransactions(loadedData.transactions);
            setIncomeCategories(loadedData.incomeCategories);
            setExpenseCategories(loadedData.expenseCategories);
            setRecurringExpenses(loadedData.recurringExpenses);
            setDarkMode(loadedData.darkMode === true);
        } else {
            // Initialize with default values if no data is in storage
            setIncomeCategories(INITIAL_INCOME_CATEGORIES);
            setExpenseCategories(INITIAL_EXPENSE_CATEGORIES);
            // Set initial theme based on system preference
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            setDarkMode(prefersDark);
        }
    }, []);

    useEffect(() => {
        const appState = {
            transactions,
            incomeCategories,
            expenseCategories,
            recurringExpenses,
            darkMode,
        };
        storageService.saveData(appState);
    }, [transactions, incomeCategories, expenseCategories, recurringExpenses, darkMode]);
    
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    const handleOpenModal = (type: TransactionType, transaction?: Transaction) => {
        setModalType(type);
        setTransactionToEdit(transaction || null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTransactionToEdit(null);
    };
    
    const handleSaveTransaction = (transactionData: Omit<Transaction, 'id' | 'date'> | Transaction) => {
        if ('id' in transactionData) {
            // Editing an existing transaction
            if (transactionData.amount === 0) {
                 // If amount is 0, delete the transaction
                setTransactions(prev => prev.filter(t => t.id !== transactionData.id));
            } else {
                // Otherwise, update it
                setTransactions(prev => prev.map(t => t.id === transactionData.id ? transactionData : t));
            }
        } else {
            // Adding a new transaction
             if (transactionData.amount > 0) {
                const newTransaction: Transaction = {
                    ...transactionData,
                    id: `trans-${new Date().getTime()}`,
                    date: new Date().toISOString(),
                };
                setTransactions(prev => [...prev, newTransaction]);
            }
        }
        handleCloseModal();
    };


    const filteredTransactions = useMemo(() => {
        const now = new Date();
        return transactions.filter(t => {
            const transactionDate = new Date(t.date);
            if (timePeriod === TimePeriod.LIFETIME) return true;
            
            let startDate = new Date(now);
            switch (timePeriod) {
                case TimePeriod.WEEK:
                    startDate.setDate(now.getDate() - now.getDay());
                    break;
                case TimePeriod.MONTH:
                    startDate.setDate(1);
                    break;
                case TimePeriod.QUARTER:
                    const quarter = Math.floor(now.getMonth() / 3);
                    startDate = new Date(now.getFullYear(), quarter * 3, 1);
                    break;
                case TimePeriod.YEAR:
                    startDate = new Date(now.getFullYear(), 0, 1);
                    break;
            }
            startDate.setHours(0, 0, 0, 0);
            return transactionDate >= startDate;
        });
    }, [transactions, timePeriod]);


    const loadSampleData = useCallback(() => {
        setTransactions(SAMPLE_TRANSACTIONS);
        setIncomeCategories(INITIAL_INCOME_CATEGORIES);
        setExpenseCategories(INITIAL_EXPENSE_CATEGORIES);
        setRecurringExpenses(SAMPLE_RECURRING_EXPENSES);
    }, []);

    const clearAllData = useCallback(() => {
        setTransactions([]);
        setIncomeCategories(INITIAL_INCOME_CATEGORIES);
        setExpenseCategories(INITIAL_EXPENSE_CATEGORIES);
        setRecurringExpenses([]);
        storageService.clearData();
    }, []);

    const allCategories = useMemo(() => [...incomeCategories, ...expenseCategories], [incomeCategories, expenseCategories]);
    
    const handleEditTransaction = (transaction: Transaction) => {
        handleOpenModal(transaction.type, transaction);
    }
    
    const handleSectionToggle = (sectionId: string) => {
        setOpenSection(prevOpenSection => (prevOpenSection === sectionId ? '' : sectionId));
    };

    return (
        <div className="bg-light dark:bg-dark min-h-screen text-gray-800 dark:text-gray-200 font-sans">
            <div className="container mx-auto max-w-2xl p-4 space-y-6">
                <Header />
                <TimePeriodTabs selectedPeriod={timePeriod} onSelectPeriod={setTimePeriod} />
                <NetCashFlowCard transactions={filteredTransactions} />
                <TransactionButtons onAddIncome={() => handleOpenModal(TransactionType.INCOME)} onAddExpense={() => handleOpenModal(TransactionType.EXPENSE)} />
                <TransactionHistory 
                    transactions={filteredTransactions} 
                    categories={allCategories} 
                    onEditTransaction={handleEditTransaction}
                    isOpen={openSection === 'history'}
                    onToggle={() => handleSectionToggle('history')}
                />
                <SpendingSummary 
                    transactions={filteredTransactions} 
                    categories={expenseCategories} 
                    onEditTransaction={handleEditTransaction}
                    isOpen={openSection === 'summary'}
                    onToggle={() => handleSectionToggle('summary')}
                />
                <RecurringExpensesList 
                    recurringExpenses={recurringExpenses} 
                    categories={expenseCategories}
                    isOpen={openSection === 'recurring'}
                    onToggle={() => handleSectionToggle('recurring')}
                />
                <CollapsibleSection 
                    title="Settings" 
                    iconName="cog"
                    isOpen={openSection === 'settings'}
                    onToggle={() => handleSectionToggle('settings')}
                >
                    <Settings 
                      incomeCategories={incomeCategories}
                      setIncomeCategories={setIncomeCategories}
                      expenseCategories={expenseCategories}
                      setExpenseCategories={setExpenseCategories}
                      recurringExpenses={recurringExpenses}
                      setRecurringExpenses={setRecurringExpenses}
                      loadSampleData={loadSampleData}
                      transactions={transactions}
                      darkMode={darkMode}
                      setDarkMode={setDarkMode}
                      clearAllData={clearAllData}
                    />
                </CollapsibleSection>
            </div>
            {isModalOpen && (
                <AddTransactionModal
                    type={modalType}
                    onClose={handleCloseModal}
                    onSave={handleSaveTransaction}
                    categories={modalType === TransactionType.INCOME ? incomeCategories : expenseCategories}
                    transactionToEdit={transactionToEdit}
                />
            )}
        </div>
    );
};

export default App;