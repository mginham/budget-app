import { useForm } from 'react-hook-form'
import { useBudgetStore } from '../store/budgetStore'

export default function AddBudget() {
    const { register, handleSubmit, reset } = useForm()
    const addBudget = useBudgetStore((state) => state.addBudget)

    const onSubmit = (data) => {
        // Convert strings to numbers where needed
        addBudget({
            category: data.category,
            spendingLimit: parseFloat(data.spendingLimit),
            expectedDate: data.expectedDate || null,
            actualSpending: data.actualSpending
                ? parseFloat(data.actualSpending)
                : null
        })
        reset()
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto p-4 border rounded shadow">
            <h2 className="text-xl font-semibold">Create Budget</h2>

            <input
                type="text"
                placeholder="Category"
                {...register('category', { required: true })}
                className="w-full p-2 border rounded"
            />

            <input
                type="number"
                step="0.01"
                placeholder="Spending Limit"
                {...register('spendingLimit', { required: true })}
                className="w-full p-2 border rounded"
            />

            <input
                type="date"
                {...register('expectedDate')}
                className="w-full p-2 border rounded"
            />

            <input
                type="number"
                step="0.01"
                placeholder="Actual Spending (optional)"
                {...register('actualSpending')}
                className="w-full p-2 border rounded"
            />

            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
                Save Budget
            </button>
        </form>
    )
}
