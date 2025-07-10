import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BranchState {
    selectedBranch: string | null;
    isOpen: boolean | null;
    setBranch: (branchId: string) => void;
    clearBranch: () => void;
    setIsOpen: (isOpen: boolean) => void;
    clearIsOpen: () => void;
}

export const useBranchStore = create<BranchState>()(
    persist(
        (set) => ({
            selectedBranch: null,
            isOpen: null,
            setBranch: (branchId) => set({ selectedBranch: branchId }),
            clearBranch: () => set({ selectedBranch: null }),
            setIsOpen: (isOpen) => set({ isOpen }),
            clearIsOpen: () => set({ isOpen: null }),
        }),
        {
            // guardar en localStorage
            name: 'selected-branch', 
        }
    )
);