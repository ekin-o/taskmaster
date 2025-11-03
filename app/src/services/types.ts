export interface AuthCreds {
    userName: string;
    password: string;
}

export interface ListArgs {
    id: number;
    name: string;
    payload: any;
}

export interface TaskArgs {
    id: number;
    name: string;
    listId: number;
    payload: any;
}