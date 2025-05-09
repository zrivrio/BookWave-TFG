import { User } from './User';
import { HelpStatus } from './HelpStatus';

export interface Help {
    id: number;
    user: User;
    subject: string;
    message: string;
    status: HelpStatus;
    createdAt: Date;
    updatedAt: Date;
}

