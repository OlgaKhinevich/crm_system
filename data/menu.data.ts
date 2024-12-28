export interface IMenuItem {
    name: string,
    url: string,
    icon: string
}

export const MENU_DATA: IMenuItem[] = [
    {
        name: 'Home',
        url: '/',
        icon: 'bi:house-door-fill'
    },
    {
        name: 'Kanban Board',
        url: '/kanban',
        icon: 'bi:kanban-fill'
    },
    {
        name: 'Customers',
        url: '/customers',
        icon: 'bi:people-fill'
    }
]