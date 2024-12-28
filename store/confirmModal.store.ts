interface ConfirmationData {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
}

export const useConfirmModalStore = defineStore('confirmationModal', {
    state: () => ({
        isOpen: false,
        confirmationData: {} as ConfirmationData,
    }),
    actions: {
        open(data: ConfirmationData) {
            this.confirmationData = data;
            this.isOpen = true;
        },
        close() {
            this.isOpen = false;
            this.confirmationData = {} as ConfirmationData;
        },
        confirm() {
            this.confirmationData.onConfirm();
            this.close();
        },
        cancel() {
            if (this.confirmationData.onCancel) {
                this.confirmationData.onCancel();
            }
            this.close();
        },
    },
});