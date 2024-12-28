interface ErrorState {
    message: string | null;
    type: 'success' | 'error' | 'warning' | 'info' | null
    show: boolean;
}

export const useErrorStore = defineStore('error', {
    state: (): ErrorState => ({
        message: null,
        type: null,
        show: false,
    }),
    actions: {
        setError(message: string, type: 'success' | 'error' | 'warning' | 'info') {
            this.message = message;
            this.type = type
            this.show = true;
        },
        clearError() {
            this.message = null;
            this.type = null;
            this.show = false;
        },
    },
});
