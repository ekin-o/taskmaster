export interface List {
    id: number;
    name: string;
    starred: boolean;
    deleted: boolean;
}

export interface Task {
    id: number;
    name: string;
    done: boolean;
    deleted: boolean;
    starred: boolean;
    dueDate?: Date;
}