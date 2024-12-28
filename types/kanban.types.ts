import type { EnumStatus, IDeal } from '@/types/deals.types'

export interface IColumn {
    id: EnumStatus,
    name: string,
    deals: IDeal[]
}