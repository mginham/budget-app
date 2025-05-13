import { useBudgetStore } from '../../store/budgetStore'

export default function BudgetList() {
    const budgets = useBudgetStore((state) => state.budgets)
    const deleteBudget = useBudgetStore((state) => state.deleteBudget)

    return (
        <div className="max-w-xl mx-auto mt-6">
            <h2 className="text-xl mb-4">Budgets</h2>
            {budgets.length === 0 ? (
                <p>No budgets added.</p>
            ) : (
                <ul className="space-y-2">
                    {budgets.map((b) => (
                        <li key={b.id} className="border p-3 rounded shadow-sm">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p><strong>{b.category}</strong></p>
                                    <p>Limit: ${b.spendingLimit.toFixed(2)}</p>
                                    {b.expectedDate && <p>Expected: {b.expectedDate}</p>}
                                    {b.actualSpending !== null && <p>Spent: ${b.actualSpending.toFixed(2)}</p>}
                                </div>
                                <button
                                    onClick={() => deleteBudget(b.id)}
                                    className="text-red-500 text-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
