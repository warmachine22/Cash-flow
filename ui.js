import { TimePeriod, TransactionType, ICONS } from './constants.js';
import { storageService } from './storageService.js';

// --- UTILITY FUNCTIONS ---
const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

function createElement(tag, classNames, children) {
    const el = document.createElement(tag);
    if (classNames) {
        el.className = classNames;
    }
    if (children) {
        if (!Array.isArray(children)) children = [children];
        children.forEach(child => {
            if (typeof child === 'string') {
                el.appendChild(document.createTextNode(child));
            } else if (child) {
                el.appendChild(child);
            }
        });
    }
    return el;
}

function createIcon(iconName, classNames) {
    const i = document.createElement('i');
    i.className = `fa-solid ${iconName} ${classNames || ''}`;
    return i;
}


// --- COMPONENT FUNCTIONS ---

export function createHeader() {
    const h1 = createElement('h1', 'text-xl font-semibold text-gray-700 dark:text-gray-300', 'Cashflow Journal');
    return createElement('header', 'text-center py-4', h1);
}

export function createTimePeriodTabs(selectedPeriod, onSelectPeriod) {
    const container = createElement('div', 'bg-gray-200 dark:bg-gray-700 rounded-full p-1 flex items-center justify-between');
    Object.values(TimePeriod).forEach(period => {
        const button = createElement('button', `w-full py-2 text-sm font-medium rounded-full transition-colors duration-200 focus:outline-none`, period);
        if (selectedPeriod === period) {
            button.classList.add('bg-white', 'dark:bg-gray-600', 'text-primary', 'shadow');
        } else {
            button.classList.add('text-gray-600', 'dark:text-gray-300', 'hover:bg-gray-300/50', 'dark:hover:bg-gray-600/50');
        }
        button.onclick = () => onSelectPeriod(period);
        container.appendChild(button);
    });
    return container;
}

export function createNetCashFlowCard(transactions) {
    const totalIncome = transactions.filter(t => t.type === TransactionType.INCOME).reduce((acc, t) => acc + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === TransactionType.EXPENSE).reduce((acc, t) => acc + t.amount, 0);
    const netCashFlow = totalIncome - totalExpense;

    const card = createElement('div', 'bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 space-y-4');
    
    const breakdownContainer = createElement('div', 'flex justify-around text-center');
    breakdownContainer.innerHTML = `
        <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Income</p>
            <p class="font-bold text-green-500">${formatCurrency(totalIncome)}</p>
        </div>
        <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Expenses</p>
            <p class="font-bold text-red-500">${formatCurrency(totalExpense)}</p>
        </div>
    `;

    const netContainer = createElement('div', 'text-center pt-4 border-t border-gray-200 dark:border-gray-700');
    netContainer.innerHTML = `
        <p class="text-sm text-gray-500 dark:text-gray-400">Net Cash Flow</p>
        <p class="text-4xl font-bold ${netCashFlow >= 0 ? 'text-green-500' : 'text-red-500'}">
            ${formatCurrency(netCashFlow)}
        </p>
    `;
    
    card.append(breakdownContainer, netContainer);
    return card;
}

export function createTransactionButtons(onAddIncome, onAddExpense) {
    const container = createElement('div', 'grid grid-cols-2 gap-4');
    const expenseButton = createElement('button', 'flex items-center justify-center gap-2 w-full py-3 text-white bg-danger rounded-lg font-semibold shadow hover:bg-red-600 transition-colors', [createIcon('fa-minus', 'w-4 h-4'), 'Add Expense']);
    expenseButton.onclick = onAddExpense;
    const incomeButton = createElement('button', 'flex items-center justify-center gap-2 w-full py-3 text-white bg-primary rounded-lg font-semibold shadow hover:bg-green-600 transition-colors', [createIcon('fa-plus', 'w-4 h-4'), 'Add Income']);
    incomeButton.onclick = onAddIncome;
    container.append(expenseButton, incomeButton);
    return container;
}

function createCollapsibleSection(title, iconName, isOpen, onToggle, children) {
    const container = createElement('div', 'bg-white dark:bg-gray-800 rounded-xl shadow-md');
    const button = createElement('button', 'w-full flex justify-between items-center p-4 text-left font-semibold text-gray-700 dark:text-gray-200');
    button.setAttribute('aria-expanded', isOpen);
    button.onclick = onToggle;
    
    const titleDiv = createElement('div', 'flex items-center gap-3', [
        createIcon(iconName, 'w-5 h-5 text-gray-500'),
        createElement('span', null, title)
    ]);
    const chevronIcon = createIcon(isOpen ? 'fa-chevron-up' : 'fa-chevron-down', 'w-5 h-5 text-primary');
    button.append(titleDiv, chevronIcon);
    container.appendChild(button);

    if (isOpen && children) {
        const contentDiv = createElement('div', 'px-4 pb-4 border-t border-gray-200 dark:border-gray-700', children);
        container.appendChild(contentDiv);
    }
    
    return container;
}


function createTransactionItem(transaction, category, onEdit) {
    const isIncome = transaction.type === TransactionType.INCOME;
    
    const container = createElement('div', 'flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0');
    const leftDiv = createElement('div', 'flex items-center gap-4');
    const iconContainer = createElement('div', 'bg-gray-100 dark:bg-gray-700 p-2 rounded-lg', createIcon(category?.icon || 'fa-tag', 'w-5 h-5 text-gray-500 dark:text-gray-400'));
    const textDiv = createElement('div', null, [
        createElement('p', 'font-semibold', category?.name || 'Uncategorized'),
        createElement('p', 'text-sm text-gray-500 dark:text-gray-400', transaction.description),
    ]);
    leftDiv.append(iconContainer, textDiv);
    
    const rightDiv = createElement('div', 'flex items-center');
    const amountP = createElement('p', `font-semibold ${isIncome ? 'text-green-500' : 'text-gray-800 dark:text-gray-200'}`, `${isIncome ? '+' : '-'}${formatCurrency(transaction.amount)}`);
    const editButton = createElement('button', 'ml-3 p-1 text-gray-400 hover:text-primary dark:hover:text-primary');
    editButton.setAttribute('aria-label', 'Edit transaction');
    editButton.onclick = () => onEdit(transaction);
    editButton.appendChild(createIcon('fa-pen', 'w-4 h-4'));
    rightDiv.append(amountP, editButton);

    container.append(leftDiv, rightDiv);
    return container;
}


export function createTransactionHistory(transactions, categories, onEditTransaction, openSection, onToggle) {
    const categoryMap = new Map(categories.map(c => [c.id, c]));
    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    let content;
    if (sortedTransactions.length > 0) {
        content = sortedTransactions.map(t => createTransactionItem(t, categoryMap.get(t.categoryId), onEditTransaction));
    } else {
        content = createElement('p', 'text-center text-gray-500 dark:text-gray-400 py-4', 'No transactions for this period.');
    }

    return createCollapsibleSection('Transaction History', 'fa-receipt', openSection === 'history', () => onToggle('history'), content);
}

export function createSpendingSummary(transactions, categories, onEditTransaction, openSection, onToggle) {
    const expenseTransactions = transactions.filter(t => t.type === TransactionType.EXPENSE);
    const totalSpending = expenseTransactions.reduce((acc, t) => acc + t.amount, 0);

    const spendingByCategory = expenseTransactions.reduce((acc, t) => {
        acc[t.categoryId] = (acc[t.categoryId] || 0) + t.amount;
        return acc;
    }, {});

    const sortedSpending = Object.entries(spendingByCategory)
        .map(([categoryId, amount]) => ({
            categoryId,
            amount,
            category: categories.find(c => c.id === categoryId),
        }))
        .filter(item => item.category)
        .sort((a, b) => b.amount - a.amount);
    
    let content;
    if (sortedSpending.length > 0) {
        content = sortedSpending.map(item => {
            const itemContainer = createElement('div', 'border-b border-gray-200 dark:border-gray-700 last:border-b-0');
            itemContainer.innerHTML = `
                <div class="flex items-center justify-between py-3">
                    <div class="flex items-center gap-4">
                        <div class="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                            <i class="fa-solid ${item.category?.icon || 'fa-tag'} w-5 h-5 text-gray-500 dark:text-gray-400"></i>
                        </div>
                        <div>
                            <p class="font-semibold">${item.category?.name}</p>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                                ${totalSpending > 0 ? `${Math.round((item.amount / totalSpending) * 100)}% of total` : ''}
                            </p>
                        </div>
                    </div>
                    <p class="font-semibold">${formatCurrency(item.amount)}</p>
                </div>`;
            return itemContainer;
        });
    } else {
        content = createElement('p', 'text-center text-gray-500 dark:text-gray-400 py-4', 'No spending data for this period.');
    }
    
    return createCollapsibleSection('Spending Summary', 'fa-chart-pie', openSection === 'summary', () => onToggle('summary'), content);
}


export function createRecurringExpensesList(recurringExpenses, categories, openSection, onToggle) {
    const categoryMap = new Map(categories.map(c => [c.id, c]));
    let content;
    if (recurringExpenses.length > 0) {
        content = recurringExpenses.map(expense => {
            const category = categoryMap.get(expense.categoryId);
            const item = createElement('div', 'flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0');
            item.innerHTML = `
                <div class="flex items-center gap-4">
                    <div class="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                        <i class="fa-solid ${category?.icon || 'fa-tag'} w-5 h-5 text-gray-500 dark:text-gray-400"></i>
                    </div>
                    <div>
                        <p class="font-semibold">${category?.name || 'Uncategorized'}</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">${expense.description}</p>
                    </div>
                </div>
                <p class="font-semibold">-${formatCurrency(expense.amount)}</p>
            `;
            return item;
        });
    } else {
        content = createElement('p', 'text-center text-gray-500 dark:text-gray-400 py-4', 'No recurring expenses set up.');
    }
    return createCollapsibleSection('Recurring Expenses', 'fa-repeat', openSection === 'recurring', () => onToggle('recurring'), content);
}


// --- SETTINGS SUB-COMPONENTS ---
function createCategoryForm({ type, onSave, onCancel, categoryToEdit }) {
    let categoryData = categoryToEdit ? { name: categoryToEdit.name, icon: categoryToEdit.icon } : { name: '', icon: 'fa-tag' };
    
    const form = createElement('div', 'p-3 my-2 bg-gray-100 dark:bg-gray-700/50 rounded-lg space-y-3');
    const nameInput = createElement('input', 'w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2');
    nameInput.type = 'text';
    nameInput.placeholder = 'Category Name';
    nameInput.value = categoryData.name;
    nameInput.oninput = (e) => categoryData.name = e.target.value;

    const iconPickerContainer = createElement('div', 'relative');
    const iconPickerButton = createElement('button', 'w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 flex items-center justify-between');
    
    function updateIconButton() {
        iconPickerButton.innerHTML = '';
        const iconPreview = createElement('div', 'flex items-center gap-2', [
            createIcon(categoryData.icon, 'w-5 h-5'),
            createElement('span', 'capitalize', categoryData.icon.replace('fa-', '').replace(/-/g, ' '))
        ]);
        iconPickerButton.append(iconPreview, createIcon('fa-chevron-down', 'w-5 h-5 text-gray-400'));
    }
    updateIconButton();

    iconPickerButton.onclick = () => {
        const existingPicker = document.getElementById('icon-picker-popover');
        if (existingPicker) existingPicker.remove();

        const picker = createIconPicker(categoryData.icon, (icon) => {
            categoryData.icon = icon;
            updateIconButton();
            picker.remove();
        });
        picker.id = 'icon-picker-popover';
        iconPickerContainer.appendChild(picker);
        
        // Close on outside click
        setTimeout(() => {
            document.addEventListener('click', (e) => {
                if (!picker.contains(e.target) && e.target !== iconPickerButton) {
                    picker.remove();
                }
            }, { once: true });
        }, 0);
    };
    iconPickerContainer.append(
        createElement('label', 'text-sm font-medium text-gray-600 dark:text-gray-400', 'Icon'),
        iconPickerButton
    );

    const buttons = createElement('div', 'flex gap-2');
    const saveButton = createElement('button', 'w-full text-sm bg-primary text-white px-3 py-1 rounded-md', 'Save');
    saveButton.onclick = () => onSave(type, categoryData);
    const cancelButton = createElement('button', 'w-full text-sm bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded-md', 'Cancel');
    cancelButton.onclick = onCancel;
    buttons.append(saveButton, cancelButton);

    form.append(nameInput, iconPickerContainer, buttons);
    return form;
}

function createIconPicker(selectedIcon, onSelect) {
    const iconNames = Object.values(ICONS).filter(name => name.startsWith('fa-') && !['fa-plus', 'fa-minus', 'fa-chevron-up', 'fa-chevron-down', 'fa-xmark', 'fa-delete-left'].includes(name));
    const uniqueIcons = [...new Set(iconNames)];

    const container = createElement('div', 'absolute z-10 w-full mt-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-3');
    const grid = createElement('div', 'grid grid-cols-6 gap-2 max-h-48 overflow-y-auto');

    uniqueIcons.forEach(name => {
        const button = createElement('button', `flex items-center justify-center p-2 rounded-md transition-colors ${selectedIcon === name ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`);
        button.type = 'button';
        button.setAttribute('aria-label', `Select icon ${name}`);
        button.appendChild(createIcon(name, 'w-5 h-5'));
        button.onclick = () => onSelect(name);
        grid.appendChild(button);
    });

    container.appendChild(grid);
    return container;
}


function createManageCategoriesSection(props, openSettingsSection, handleSettingsToggle) {
    const content = createElement('div', 'py-2 space-y-4');
    
    ['income', 'expense'].forEach(type => {
        const typeStr = type.charAt(0).toUpperCase() + type.slice(1);
        const section = createElement('div');
        const heading = createElement('h3', 'font-semibold text-gray-600 dark:text-gray-400 mb-2', typeStr);
        section.appendChild(heading);
        
        const categories = type === 'income' ? props.incomeCategories : props.expenseCategories;
        categories.forEach(cat => {
            if (props.editingCategoryId === cat.id) {
                section.appendChild(createCategoryForm({
                    type: cat.type,
                    onSave: (type, data) => props.onUpdateCategory(data),
                    onCancel: () => props.setEditingCategoryId(null),
                    categoryToEdit: cat,
                }));
            } else {
                const item = createElement('div', 'flex items-center justify-between py-2');
                const left = createElement('div', 'flex items-center gap-3', [createIcon(cat.icon, 'w-5 h-5 text-gray-500'), createElement('span', null, cat.name)]);
                const right = createElement('div', 'flex gap-2');
                const editBtn = createElement('button');
                editBtn.onclick = () => props.setEditingCategoryId(cat.id);
                editBtn.appendChild(createIcon('fa-pen', 'w-4 h-4 text-gray-500 hover:text-primary'));
                const deleteBtn = createElement('button');
                deleteBtn.onclick = () => props.onDeleteCategory(cat.id);
                deleteBtn.appendChild(createIcon('fa-trash', 'w-4 h-4 text-gray-500 hover:text-danger'));
                right.append(editBtn, deleteBtn);
                item.append(left, right);
                section.appendChild(item);
            }
        });

        if (props.showAddForm === type) {
            section.appendChild(createCategoryForm({
                type: type === 'income' ? TransactionType.INCOME : TransactionType.EXPENSE,
                onSave: props.onAddCategory,
                onCancel: () => props.setShowAddForm(null),
            }));
        } else {
            const addBtn = createElement('button', 'text-sm text-primary font-semibold mt-2', '+ Add New Category');
            addBtn.onclick = () => props.setShowAddForm(type);
            section.appendChild(addBtn);
        }
        content.appendChild(section);
    });

    return createCollapsibleSection('Manage Categories', 'fa-gear', openSettingsSection === 'categories', () => handleSettingsToggle('categories'), content);
}

function createRecurringExpensesSection(props, openSettingsSection, handleSettingsToggle) {
    const content = createElement('div', 'py-2 space-y-2');
    
    props.recurringExpenses.forEach(re => {
        const category = props.expenseCategories.find(c => c.id === re.categoryId);
        const item = createElement('div', 'flex items-center justify-between py-2');
        const left = createElement('div', 'flex items-center gap-3', [
            createIcon(category?.icon || 'fa-tag', 'w-5 h-5 text-gray-500'),
            createElement('div', null, [
                createElement('p', null, category?.name),
                createElement('p', 'text-xs text-gray-400', `$${re.amount} - ${re.description}`)
            ])
        ]);
        const right = createElement('div', 'flex gap-2');
        const editBtn = createElement('button');
        editBtn.onclick = () => renderAddRecurringExpenseModal({
            onSave: props.onSaveRecurringExpense,
            expenseCategories: props.expenseCategories,
            expenseToEdit: re,
        });
        editBtn.appendChild(createIcon('fa-pen', 'w-4 h-4 text-gray-500 hover:text-primary'));
        const deleteBtn = createElement('button');
        deleteBtn.onclick = () => props.onDeleteRecurringExpense(re.id);
        deleteBtn.appendChild(createIcon('fa-trash', 'w-4 h-4 text-gray-500 hover:text-danger'));
        right.append(editBtn, deleteBtn);
        item.append(left, right);
        content.appendChild(item);
    });

    const addBtn = createElement('button', 'text-sm text-primary font-semibold mt-2', '+ Add New Recurring Expense');
    addBtn.onclick = () => renderAddRecurringExpenseModal({
        onSave: props.onSaveRecurringExpense,
        expenseCategories: props.expenseCategories,
    });
    content.appendChild(addBtn);

    return createCollapsibleSection('Set up Recurring Expenses', 'fa-repeat', openSettingsSection === 'recurring', () => handleSettingsToggle('recurring'), content);
}


function createDataManagementSection(props, openSettingsSection, handleSettingsToggle) {
    const content = createElement('div', 'space-y-4 pt-4');
    
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
    
    const handleRestoreRequest = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            renderConfirmationModal({
                title: "Restore Data?",
                message: "This will overwrite all current data. Are you sure you want to continue?",
                onConfirm: () => {
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
                                } else { throw new Error("Invalid backup file format."); }
                            } catch (error) { alert("Error restoring data. Please make sure the file is a valid backup."); }
                        }
                    };
                    closeModal();
                },
                confirmButtonText: 'Restore', confirmButtonVariant: 'danger'
            });
        }
        event.target.value = '';
    };

    const backupRestoreDiv = createElement('div');
    backupRestoreDiv.innerHTML = `
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">Save your data to a file or restore it from a backup.</p>
        <div class="flex gap-4">
            <button id="backup-btn" class="text-sm bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">Backup</button>
            <label class="text-sm bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer">
                Restore <input type="file" accept=".json" id="restore-input" class="hidden" />
            </label>
        </div>
    `;
    backupRestoreDiv.querySelector('#backup-btn').onclick = handleBackup;
    backupRestoreDiv.querySelector('#restore-input').onchange = handleRestoreRequest;
    
    const clearDiv = createElement('div', 'border-t border-gray-200 dark:border-gray-700 pt-4 mt-4');
    clearDiv.innerHTML = `<p class="text-sm text-gray-500 dark:text-gray-400 mb-2">Permanently delete all data from the app.</p>`;
    const clearBtn = createElement('button', 'text-sm bg-red-100 dark:bg-red-900/50 text-danger px-4 py-2 rounded-md hover:bg-red-200 dark:hover:bg-red-800/50', 'Clear All Data');
    clearBtn.onclick = props.clearAllData;
    clearDiv.appendChild(clearBtn);

    content.append(backupRestoreDiv, clearDiv);
    return createCollapsibleSection('Data Backup & Restore', 'fa-cloud-arrow-up', openSettingsSection === 'data', () => handleSettingsToggle('data'), content);
}

function createAppearanceSection(props, openSettingsSection, handleSettingsToggle) {
    const content = createElement('div', 'flex items-center justify-between pt-4');
    content.innerHTML = `<p class="text-sm text-gray-500 dark:text-gray-400">Switch between light and dark themes.</p>`;
    const themeButton = createElement('button', 'text-sm bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600', `Switch to ${props.darkMode ? 'Light' : 'Dark'}`);
    themeButton.onclick = () => props.setDarkMode(!props.darkMode);
    content.appendChild(themeButton);
    const iconName = props.darkMode ? 'fa-moon' : 'fa-sun';
    return createCollapsibleSection('Appearance', iconName, openSettingsSection === 'appearance', () => handleSettingsToggle('appearance'), content);
}

function createSampleDataSection(props, openSettingsSection, handleSettingsToggle) {
    const content = createElement('div', 'pt-4');
    content.innerHTML = `<p class="text-sm text-gray-500 dark:text-gray-400">Populate the app with sample data to see how it works. This will overwrite all your current data.</p>`;
    const buttonDiv = createElement('div', 'flex justify-end pt-2');
    const sampleButton = createElement('button', 'text-sm bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 px-4 py-2 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800/50', 'Load Sample Data');
    sampleButton.onclick = props.loadSampleData;
    buttonDiv.appendChild(sampleButton);
    content.appendChild(buttonDiv);
    return createCollapsibleSection('Load Sample Data', 'fa-database', openSettingsSection === 'sample', () => handleSettingsToggle('sample'), content);
}


export function createSettings(props, openSection, onToggle) {
    const settingsContent = createElement('div', 'space-y-4 pt-4');
    const { openSettingsSection, handleSettingsToggle } = props;

    settingsContent.appendChild(createManageCategoriesSection(props, openSettingsSection, handleSettingsToggle));
    settingsContent.appendChild(createRecurringExpensesSection(props, openSettingsSection, handleSettingsToggle));
    settingsContent.appendChild(createDataManagementSection(props, openSettingsSection, handleSettingsToggle));
    settingsContent.appendChild(createAppearanceSection(props, openSettingsSection, handleSettingsToggle));
    settingsContent.appendChild(createSampleDataSection(props, openSettingsSection, handleSettingsToggle));

    return createCollapsibleSection('Settings', 'fa-gear', openSection === 'settings', () => onToggle('settings'), settingsContent);
}



// --- MODAL FUNCTIONS ---

const modalContainer = document.getElementById('modal-container');

export function closeModal() {
    if (modalContainer) modalContainer.innerHTML = '';
}

export function renderAddTransactionModal({ type, onSave, categories, transactionToEdit }) {
    closeModal();
    let amountStr = transactionToEdit ? String(transactionToEdit.amount) : '0';
    let selectedCategoryId = transactionToEdit ? transactionToEdit.categoryId : categories[0]?.id || '';
    let description = transactionToEdit ? transactionToEdit.description : '';

    const modal = createElement('div', 'fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50');
    const modalContent = createElement('div', 'bg-white dark:bg-gray-800 w-full max-w-2xl rounded-t-2xl p-6 transform transition-transform duration-300 translate-y-0');
    
    const isEditing = !!transactionToEdit;
    const titleText = isEditing ? 'Edit' : 'Add';
    const buttonText = isEditing ? 'Save Changes' : `Add ${type === TransactionType.INCOME ? 'Income' : 'Expense'}`;
    const buttonClass = type === TransactionType.INCOME ? 'bg-primary hover:bg-green-600' : 'bg-danger hover:bg-red-600';

    function updateAmountDisplay() {
        const amountEl = modalContent.querySelector('#amount-display');
        if (amountEl) {
            amountEl.textContent = parseFloat(amountStr).toLocaleString(undefined, {
                minimumFractionDigits: amountStr.endsWith('.') ? 1 : (amountStr.split('.')[1] || []).length, 
                maximumFractionDigits: 2
            });
        }
    }

    modalContent.innerHTML = `
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">${titleText} ${type === TransactionType.INCOME ? 'Income' : 'Expense'}</h2>
          <button id="close-btn" class="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
             <i class="fa-solid fa-xmark w-6 h-6"></i>
          </button>
        </div>
        <div class="text-center mb-6">
            <span class="text-2xl font-semibold text-gray-500 dark:text-gray-400">$</span>
            <span id="amount-display" class="text-5xl font-bold ml-1">0</span>
        </div>
        <div class="space-y-4 mb-6">
            <div class="relative">
                <select id="category-select" class="w-full bg-gray-100 dark:bg-gray-700 border-none rounded-lg p-4 appearance-none font-semibold focus:ring-2 focus:ring-primary">
                    ${categories.map(cat => `<option value="${cat.id}" ${cat.id === selectedCategoryId ? 'selected' : ''}>${cat.name}</option>`).join('')}
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700 dark:text-gray-300">
                    <i class="fa-solid fa-chevron-down w-5 h-5"></i>
                </div>
            </div>
            <input id="description-input" type="text" placeholder="Short description (optional)" value="${description}" class="w-full bg-gray-100 dark:bg-gray-700 border-none rounded-lg p-4 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary"/>
        </div>
        <div id="keypad" class="grid grid-cols-3 gap-2 mb-6"></div>
        <div class="grid grid-cols-2 gap-4">
            <button id="cancel-btn" class="w-full py-4 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">Cancel</button>
            <button id="save-btn" class="w-full py-4 text-white font-semibold rounded-lg transition-colors ${buttonClass}">${buttonText}</button>
        </div>
    `;

    updateAmountDisplay();

    // Keypad
    const keypad = modalContent.querySelector('#keypad');
    const keypadKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'backspace'];
    keypadKeys.forEach(key => {
        const keyBtn = createElement('button', 'py-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-2xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors');
        keyBtn.innerHTML = key === 'backspace' ? '<i class="fa-solid fa-delete-left w-6 h-6 mx-auto"></i>' : key;
        keyBtn.onclick = () => {
            if (key === 'backspace') amountStr = amountStr.length > 1 ? amountStr.slice(0, -1) : '0';
            else if (key === '.') { if (!amountStr.includes('.')) amountStr += '.'; }
            else {
                if (amountStr === '0' && key !== '.') amountStr = key;
                else {
                    const decimalIndex = amountStr.indexOf('.');
                    if (decimalIndex === -1 || amountStr.length - decimalIndex <= 2) amountStr += key;
                }
            }
            updateAmountDisplay();
        };
        keypad.appendChild(keyBtn);
    });

    // Event Listeners
    modalContent.querySelector('#close-btn').onclick = closeModal;
    modalContent.querySelector('#cancel-btn').onclick = closeModal;
    modalContent.querySelector('#save-btn').onclick = () => {
        const transactionData = {
            amount: parseFloat(amountStr),
            categoryId: modalContent.querySelector('#category-select').value,
            description: modalContent.querySelector('#description-input').value,
            type,
        };
        onSave(isEditing ? { ...transactionToEdit, ...transactionData } : transactionData);
    };

    modal.appendChild(modalContent);
    modalContainer.appendChild(modal);
}

export function renderAddRecurringExpenseModal({ onSave, expenseCategories, expenseToEdit }) {
    closeModal();
    let amountStr = expenseToEdit ? String(expenseToEdit.amount) : '0';
    let selectedCategoryId = expenseToEdit ? expenseToEdit.categoryId : expenseCategories[0]?.id || '';
    let description = expenseToEdit ? expenseToEdit.description : '';
    let dayOfMonth = expenseToEdit ? expenseToEdit.dayOfMonth : 1;

    const modal = createElement('div', 'fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50');
    const content = createElement('div', 'bg-white dark:bg-gray-800 w-full max-w-2xl rounded-t-2xl p-6');
    const title = expenseToEdit ? 'Edit Recurring Expense' : 'Add Recurring Expense';

    function updateAmountDisplay() {
        content.querySelector('#amount-display').textContent = parseFloat(amountStr).toLocaleString();
    }
    
    function updateDayDisplay() {
        content.querySelector('#day-display').textContent = dayOfMonth;
    }

    content.innerHTML = `
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">${title}</h2>
          <button id="close-btn" class="text-gray-500"><i class="fa-solid fa-xmark w-6 h-6"></i></button>
        </div>
        <div class="text-center mb-6">
            <span class="text-2xl text-gray-500">$</span>
            <span id="amount-display" class="text-5xl font-bold ml-1">0</span>
        </div>
        <div class="space-y-4 mb-6">
            <div class="grid grid-cols-2 gap-4">
                <div class="relative">
                    <select id="category-select" class="w-full h-full bg-gray-100 dark:bg-gray-700 border-none rounded-lg p-4 appearance-none font-semibold">
                        ${expenseCategories.map(c => `<option value="${c.id}" ${c.id === selectedCategoryId ? 'selected' : ''}>${c.name}</option>`).join('')}
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4"><i class="fa-solid fa-chevron-down w-5 h-5"></i></div>
                </div>
                <button id="day-picker-btn" class="w-full h-full bg-gray-100 dark:bg-gray-700 border-none rounded-lg p-4 font-semibold text-left">
                    Day of Month: <span id="day-display" class="text-primary font-bold">1</span>
                </button>
            </div>
            <input id="description-input" type="text" placeholder="Description" value="${description}" class="w-full bg-gray-100 dark:bg-gray-700 border-none rounded-lg p-4"/>
        </div>
        <div id="keypad" class="grid grid-cols-3 gap-2 mb-6"></div>
        <div class="grid grid-cols-2 gap-4">
            <button id="cancel-btn" class="w-full py-4 bg-gray-200 dark:bg-gray-600 rounded-lg font-semibold">Cancel</button>
            <button id="save-btn" class="w-full py-4 text-white bg-primary rounded-lg font-semibold">Save Expense</button>
        </div>`;
    
    updateAmountDisplay();
    updateDayDisplay();

    const keypad = content.querySelector('#keypad');
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'backspace'].forEach(key => {
        const keyBtn = createElement('button', 'py-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-2xl font-semibold');
        keyBtn.innerHTML = key === 'backspace' ? '<i class="fa-solid fa-delete-left mx-auto"></i>' : key;
        keyBtn.onclick = () => {
             if (key === 'backspace') amountStr = amountStr.length > 1 ? amountStr.slice(0, -1) : '0';
            else if (key === '.') { if (!amountStr.includes('.')) amountStr += '.'; }
            else {
                if (amountStr === '0' && key !== '.') amountStr = key;
                else {
                    const decimalIndex = amountStr.indexOf('.');
                    if (decimalIndex === -1 || amountStr.length - decimalIndex <= 2) amountStr += key;
                }
            }
            updateAmountDisplay();
        };
        keypad.appendChild(keyBtn);
    });

    content.querySelector('#day-picker-btn').onclick = () => {
        renderDayPickerModal(dayOfMonth, (selectedDay) => {
            dayOfMonth = selectedDay;
            updateDayDisplay();
        });
    };

    content.querySelector('#close-btn').onclick = closeModal;
    content.querySelector('#cancel-btn').onclick = closeModal;
    content.querySelector('#save-btn').onclick = () => {
        const expenseData = {
            amount: parseFloat(amountStr),
            categoryId: content.querySelector('#category-select').value,
            description: content.querySelector('#description-input').value,
            dayOfMonth,
        };
        onSave(expenseToEdit ? { ...expenseData, id: expenseToEdit.id } : expenseData);
    };

    modal.appendChild(content);
    modalContainer.appendChild(modal);
}

function renderDayPickerModal(initialDay, onSelect) {
    const modal = createElement('div', 'fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4');
    modal.id = 'day-picker-modal'; // Give it an ID to allow closing it
    const content = createElement('div', 'bg-white dark:bg-gray-800 w-full max-w-xs rounded-2xl p-6 shadow-xl flex flex-col');
    let currentDay = initialDay;

    content.innerHTML = `
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">Select Day</h2>
          <button id="close-day-picker" class="text-gray-500"><i class="fa-solid fa-xmark w-5 h-5"></i></button>
        </div>
        <div class="relative h-48 my-4">
            <div id="day-scroll-container" class="absolute inset-0 overflow-y-scroll" style="scroll-snap-type: y mandatory; -ms-overflow-style: none; scrollbar-width: none;"></div>
            <div class="absolute top-1/2 left-0 w-full h-12 -translate-y-1/2 rounded-lg pointer-events-none border-y-2 border-primary/50"></div>
        </div>
        <div class="grid grid-cols-2 gap-4 mt-auto pt-4">
            <button id="cancel-day-picker" class="w-full py-3 bg-gray-200 dark:bg-gray-600 rounded-lg font-semibold">Cancel</button>
            <button id="select-day-btn" class="w-full py-3 text-white bg-primary rounded-lg font-semibold">Select</button>
        </div>`;
    content.querySelector('#day-scroll-container').style.cssText += '::-webkit-scrollbar { display: none; }';
    
    const scrollContainer = content.querySelector('#day-scroll-container');
    const itemHeight = 48; // h-12
    scrollContainer.appendChild(createElement('div', `h-[calc(50%-24px)]`)); // top spacer

    const dayElements = [];
    for (let i = 1; i <= 31; i++) {
        const dayEl = createElement('div', `flex items-center justify-center text-3xl font-bold h-12 transition-all duration-200`, String(i));
        dayEl.style.scrollSnapAlign = 'center';
        scrollContainer.appendChild(dayEl);
        dayElements.push(dayEl);
    }
    scrollContainer.appendChild(createElement('div', `h-[calc(50%-24px)]`)); // bottom spacer
    
    const updateStyles = () => {
        const center = scrollContainer.scrollTop + scrollContainer.clientHeight / 2;
        const closest = dayElements.reduce((prev, curr) => 
            (Math.abs(curr.offsetTop + itemHeight/2 - center) < Math.abs(prev.offsetTop + itemHeight/2 - center) ? curr : prev)
        );
        dayElements.forEach(el => {
            el.classList.toggle('text-primary', el === closest);
            el.classList.toggle('scale-100', el === closest);
            el.classList.toggle('text-gray-400', el !== closest);
            el.classList.toggle('dark:text-gray-500', el !== closest);
            el.classList.toggle('scale-90', el !== closest);
            el.classList.toggle('opacity-60', el !== closest);
        });
        currentDay = parseInt(closest.textContent, 10);
    };

    scrollContainer.onscroll = updateStyles;
    scrollContainer.scrollTop = (initialDay - 1) * itemHeight; // Initial scroll
    updateStyles();

    const closeDayPicker = () => modalContainer.querySelector('#day-picker-modal')?.remove();
    content.querySelector('#close-day-picker').onclick = closeDayPicker;
    content.querySelector('#cancel-day-picker').onclick = closeDayPicker;
    content.querySelector('#select-day-btn').onclick = () => {
        onSelect(currentDay);
        closeDayPicker();
    };
    
    modal.appendChild(content);
    modalContainer.appendChild(modal);
}

export function renderConfirmationModal({ title, message, onConfirm, confirmButtonText = 'Confirm', confirmButtonVariant = 'primary' }) {
    closeModal();

    const confirmButtonClass = confirmButtonVariant === 'danger' ? 'bg-danger hover:bg-red-600' : 'bg-primary hover:bg-green-600';
    
    const modal = createElement('div', 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4');
    const modalContent = createElement('div', 'bg-white dark:bg-gray-800 w-full max-w-sm rounded-2xl p-6 transform transition-transform duration-300 scale-100');
    modalContent.innerHTML = `
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">${title}</h2>
            <button id="close-btn" class="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
                <i class="fa-solid fa-xmark w-5 h-5"></i>
            </button>
        </div>
        <p class="text-gray-600 dark:text-gray-300 mb-6">${message}</p>
        <div class="grid grid-cols-2 gap-4">
            <button id="cancel-btn" class="w-full py-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">Cancel</button>
            <button id="confirm-btn" class="w-full py-3 text-white font-semibold rounded-lg transition-colors ${confirmButtonClass}">${confirmButtonText}</button>
        </div>
    `;

    modalContent.querySelector('#close-btn').onclick = closeModal;
    modalContent.querySelector('#cancel-btn').onclick = closeModal;
    modalContent.querySelector('#confirm-btn').onclick = onConfirm;

    modal.appendChild(modalContent);
    modalContainer.appendChild(modal);
}