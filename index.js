import { TimePeriod, TransactionType, INITIAL_INCOME_CATEGORIES, INITIAL_EXPENSE_CATEGORIES, SAMPLE_TRANSACTIONS, SAMPLE_RECURRING_EXPENSES } from './constants.js';
import { storageService } from './storageService.js';
import * as ui from './ui.js';

const state = {
    transactions: [],
    incomeCategories: [],
    expenseCategories: [],
    recurringExpenses: [],
    timePeriod: TimePeriod.MONTH,
    darkMode: false,
    openSection: 'history',
    // State for settings UI
    openSettingsSection: null,
    editingCategoryId: null,
    showAddForm: null, // 'income' | 'expense' | null
    editingRecurringExpense: null,
};

function setState(newState) {
    Object.assign(state, newState);
    renderApp();
    storageService.saveData({
        transactions: state.transactions,
        incomeCategories: state.incomeCategories,
        expenseCategories: state.expenseCategories,
        recurringExpenses: state.recurringExpenses,
        darkMode: state.darkMode,
    });
}

function handleSectionToggle(sectionId) {
    setState({ openSection: state.openSection === sectionId ? '' : sectionId });
}

function handleSettingsToggle(sectionId) {
    setState({ openSettingsSection: state.openSettingsSection === sectionId ? null : sectionId });
}


function handleSaveTransaction(transactionData) {
    if (transactionData.id) { // Editing
        if (transactionData.amount === 0) {
            setState({ transactions: state.transactions.filter(t => t.id !== transactionData.id) });
        } else {
            setState({ transactions: state.transactions.map(t => t.id === transactionData.id ? transactionData : t) });
        }
    } else { // Adding
        if (transactionData.amount > 0) {
            const newTransaction = {
                ...transactionData,
                id: `trans-${new Date().getTime()}`,
                date: new Date().toISOString(),
            };
            setState({ transactions: [...state.transactions, newTransaction] });
        }
    }
    ui.closeModal();
}

function handleOpenModal(type, transaction) {
    const allCategories = type === TransactionType.INCOME ? state.incomeCategories : state.expenseCategories;
    ui.renderAddTransactionModal({
        type,
        onSave: handleSaveTransaction,
        categories: allCategories,
        transactionToEdit: transaction,
    });
}

function handleEditTransaction(transaction) {
    handleOpenModal(transaction.type, transaction);
}

// --- Category Management ---
function handleAddCategory(type, categoryData) {
     if (!categoryData.name.trim()) {
        alert("Category name cannot be empty.");
        return;
    }
    const newCategory = { ...categoryData, type, id: `cat-${Date.now()}` };
    if (type === TransactionType.INCOME) {
        setState({ incomeCategories: [...state.incomeCategories, newCategory] });
    } else {
        setState({ expenseCategories: [...state.expenseCategories, newCategory] });
    }
    setState({ showAddForm: null, editingCategoryId: null });
}

function handleUpdateCategory(categoryData) {
     if (!categoryData.name.trim()) {
        alert("Category name cannot be empty.");
        return;
    }
    const update = (categories) => categories.map(c => c.id === state.editingCategoryId ? { ...c, ...categoryData } : c);
    setState({
        incomeCategories: update(state.incomeCategories),
        expenseCategories: update(state.expenseCategories),
        editingCategoryId: null,
    });
}

function handleDeleteCategory(id) {
    if (state.recurringExpenses.some(re => re.categoryId === id)) {
        alert("Cannot delete a category that is used by a recurring expense.");
        return;
    }
    ui.renderConfirmationModal({
        title: 'Delete Category?',
        message: 'Are you sure you want to delete this category? This action cannot be undone.',
        onConfirm: () => {
            setState({
                incomeCategories: state.incomeCategories.filter(c => c.id !== id),
                expenseCategories: state.expenseCategories.filter(c => c.id !== id),
            });
            ui.closeModal();
        },
        confirmButtonText: 'Delete',
        confirmButtonVariant: 'danger'
    });
}

// --- Recurring Expense Management ---
function handleSaveRecurringExpense(expense) {
    if (expense.id) { // Update
        setState({ recurringExpenses: state.recurringExpenses.map(re => re.id === expense.id ? expense : re) });
    } else { // Add new
        const newRecurring = { ...expense, id: `re-${Date.now()}` };
        setState({ recurringExpenses: [...state.recurringExpenses, newRecurring] });
    }
    ui.closeModal();
}

function handleDeleteRecurringExpense(id) {
    ui.renderConfirmationModal({
        title: 'Delete Recurring Expense?',
        message: 'Are you sure you want to delete this recurring expense?',
        onConfirm: () => {
            setState({ recurringExpenses: state.recurringExpenses.filter(re => re.id !== id) });
            ui.closeModal();
        },
        confirmButtonText: 'Delete',
        confirmButtonVariant: 'danger'
    });
}

function loadSampleData() {
    ui.renderConfirmationModal({
        title: "Load Sample Data?",
        message: "This will overwrite all current data. Are you sure you want to continue?",
        onConfirm: () => {
            setState({
                transactions: SAMPLE_TRANSACTIONS,
                incomeCategories: INITIAL_INCOME_CATEGORIES,
                expenseCategories: INITIAL_EXPENSE_CATEGORIES,
                recurringExpenses: SAMPLE_RECURRING_EXPENSES,
            });
            ui.closeModal();
            alert("Sample data loaded successfully!");
        },
        confirmButtonText: 'Load Data',
        confirmButtonVariant: 'danger'
    });
}

function clearAllData() {
    ui.renderConfirmationModal({
        title: "Clear All Data?",
        message: "This will permanently delete all transactions, categories, and settings. This action cannot be undone.",
        onConfirm: () => {
            setState({
                transactions: [],
                incomeCategories: INITIAL_INCOME_CATEGORIES,
                expenseCategories: INITIAL_EXPENSE_CATEGORIES,
                recurringExpenses: [],
            });
            storageService.clearData();
            ui.closeModal();
            alert("All data has been cleared.");
        },
        confirmButtonText: 'Clear Data',
        confirmButtonVariant: 'danger'
    });
}

function setDarkMode(isDark) {
    setState({ darkMode: isDark });
    if (isDark) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

function getFilteredTransactions() {
    const now = new Date();
    return state.transactions.filter(t => {
        const transactionDate = new Date(t.date);
        if (state.timePeriod === TimePeriod.LIFETIME) return true;
        
        let startDate = new Date(now);
        switch (state.timePeriod) {
            case TimePeriod.WEEK:
                startDate.setDate(now.getDate() - (now.getDay() || 7)); // Sunday is 0, make it start of week
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
}

function renderApp() {
    const root = document.getElementById('root');
    if (!root) return;

    root.innerHTML = '';

    const filteredTransactions = getFilteredTransactions();
    const allCategories = [...state.incomeCategories, ...state.expenseCategories];
    
    const appContainer = document.createElement('div');
    appContainer.className = 'container mx-auto max-w-2xl p-4 space-y-6';

    appContainer.appendChild(ui.createHeader());
    appContainer.appendChild(ui.createTimePeriodTabs(state.timePeriod, period => setState({ timePeriod: period })));
    appContainer.appendChild(ui.createNetCashFlowCard(filteredTransactions));
    appContainer.appendChild(ui.createTransactionButtons(
        () => handleOpenModal(TransactionType.INCOME),
        () => handleOpenModal(TransactionType.EXPENSE)
    ));
    appContainer.appendChild(ui.createTransactionHistory(filteredTransactions, allCategories, handleEditTransaction, state.openSection, handleSectionToggle));
    appContainer.appendChild(ui.createSpendingSummary(filteredTransactions, state.expenseCategories, handleEditTransaction, state.openSection, handleSectionToggle));
    appContainer.appendChild(ui.createRecurringExpensesList(state.recurringExpenses, state.expenseCategories, state.openSection, handleSectionToggle));
    
    const settingsProps = {
        ...state,
        setIncomeCategories: (cats) => setState({ incomeCategories: cats }),
        setExpenseCategories: (cats) => setState({ expenseCategories: cats }),
        setRecurringExpenses: (res) => setState({ recurringExpenses: res }),
        loadSampleData,
        clearAllData,
        setDarkMode,
        handleSettingsToggle,
        onAddCategory: handleAddCategory,
        onUpdateCategory: handleUpdateCategory,
        onDeleteCategory: handleDeleteCategory,
        setEditingCategoryId: (id) => setState({ editingCategoryId: id, showAddForm: null }),
        setShowAddForm: (type) => setState({ showAddForm: type, editingCategoryId: null }),
        onSaveRecurringExpense: handleSaveRecurringExpense,
        onDeleteRecurringExpense: handleDeleteRecurringExpense,
    };
    appContainer.appendChild(ui.createSettings(settingsProps, state.openSection, handleSectionToggle));

    root.appendChild(appContainer);
}

function init() {
    const loadedData = storageService.loadData();
    if (loadedData) {
        state.transactions = loadedData.transactions || [];
        state.incomeCategories = loadedData.incomeCategories || INITIAL_INCOME_CATEGORIES;
        state.expenseCategories = loadedData.expenseCategories || INITIAL_EXPENSE_CATEGORIES;
        state.recurringExpenses = loadedData.recurringExpenses || [];
        state.darkMode = loadedData.darkMode === true;
    } else {
        state.incomeCategories = INITIAL_INCOME_CATEGORIES;
        state.expenseCategories = INITIAL_EXPENSE_CATEGORIES;
        state.darkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    if (state.darkMode) {
        document.documentElement.classList.add('dark');
    }

    renderApp();
}

document.addEventListener('DOMContentLoaded', init);