export interface IBaseField {
    $createdAt: string;
    $id: string;
}

export interface ICustomer extends IBaseField {
    name: string;
    email: string;
    avatar_url: string;
    from_source?: string;
}

export interface IComment extends IBaseField {
    text: string;
    deal: IDeal | string;
    user_id: string;
    user_name: string;
}

export enum EnumStatus {
    'todo' = 'todo',
    'to-be-agreed' = 'to-be-agreed',
    'in-progress' = 'in-progress',
    'produced' = 'produced',
    'done' = 'done'
}

export interface IDeal extends IBaseField {
    name: string;
    price: number;
    status: EnumStatus;
    customer: ICustomer | string;
    comments: IComment[];
}