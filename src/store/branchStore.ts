import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BranchState {
    selectedBranch: string | null;
    setBranch: (branchId: string) => void;
    clearBranch: () => void;
}

export const useBranchStore = create<BranchState>()(
    persist(
        (set) => ({
            selectedBranch: null,
            setBranch: (branchId) => set({ selectedBranch: branchId }),
            clearBranch: () => set({ selectedBranch: null }),
        }),
        {
            // guardar en localStorage
            name: 'selected-branch', 
        }
    )
);