import type { IUser } from '@/types/auth.types'
import { useErrorStore } from '@/store/error.store';


export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: {
            id: '',
            email: '',
            name: '',
        } as IUser,
        isAuth: false as boolean,
        session: null as any,
    }),
    getters: {
        isAuthenficated: (state) => state.isAuth,
        userEmail: (state) => state.user?.email,
        userName: (state) => state.user?.name,
        userId: (state) => state.user?.id,
    },
    actions: {
        async register (email: string, password: string, name: string) {
            try {
                const { account, ID } = useAppwriteConfig();
                await account.create(ID.unique(), email, password, name);
                this.login(email, password);
            } catch(error: any) {
                useErrorStore().setError(error?.message || 'Error:', 'error');
            }
        },
        async login(email: string, password: string) {
            try {
                const { account } = useAppwriteConfig();
                const router = useRouter();
                const session = await account.createEmailPasswordSession(email, password);
                this.session = session;
                const userAccount = await account.get();
                this.user = {
                    id: userAccount.$id,
                    email: userAccount.email,
                    name: userAccount.name
                };
                this.isAuth = true;
                router.push('/');
            } catch (error: any) {
                useErrorStore().setError(error?.message || 'Error:', 'error');
                this.isAuth = false;
            }
        },
        async logout() {
            try {
                const { account } = useAppwriteConfig();
                const router = useRouter();
                await account.deleteSession('current');
                this.session = null;
                this.isAuth = false;
                router.push('/login');
                this.$reset();
            } catch (error: any) {
                useErrorStore().setError(error?.message || 'Error:', 'error');
            }
        },
        async fetchUserData() {
            try {
                const { account } = useAppwriteConfig();
                const session = await account.getSession('current');
                this.session = session;
                if (Date.now() > Date.parse(this.session.expire) ) {
                    this.session = await account.updateSession('current');
                    this.isAuth = true;
                } else {
                    const userAccount = await account.get();
                    this.user = {
                        id: userAccount.$id,
                        email: userAccount.email,
                        name: userAccount.name,
                    };
                    this.isAuth = true;
                }
            } catch (error: any) {
                useErrorStore().setError(error?.message || 'Error:', 'error');
                this.isAuth = false;
            }
        },
    },
});