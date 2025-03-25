import { ReadingList } from "./ReadingList";
import { Review } from "./Review";
import { Role } from "./Role";

import { SubscriptionType } from "./SubscriptionType";

export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    role: Role;
    subscriptionType: SubscriptionType;
    reviews: Review[];
    readingLists: ReadingList[];
}
