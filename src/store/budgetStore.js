import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'

export const useBudgetStore = create(persist(
    (set) => ({
        budgets: [],

        addBudget: (budget) =>
            set((state) => ({
                budgets: [...state.budgets, { id: uuidv4(), ...budget }]
            })),

        deleteBudget: (id) =>
            set((state) => ({
                budgets: state.budgets.filter(b => b.id !== id)
            }))
    }),
    {
        name: 'budget-storage' // saves to localStorage
    }
))
