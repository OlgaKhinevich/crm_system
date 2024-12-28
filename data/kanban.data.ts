import { EnumStatus } from '@/types/deals.types';
import type { IColumn } from '@/types/kanban.types'

export const KANBAN_DATA:IColumn[] = [
    {
        id: EnumStatus['todo'],
        name: 'To Do',
        deals: []
    },
    {
        id: EnumStatus['to-be-agreed'],
        name: 'To Be Agreed',
        deals: []
    },
    {
        id: EnumStatus['in-progress'],
        name: 'In Progress',
        deals: []
    },
    {
        id: EnumStatus['produced'],
        name: 'Produced',
        deals: []
    },
    {
        id: EnumStatus['done'],
        name: 'Done',
        deals: []
    }
]