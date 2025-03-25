import { Role } from "./Role";
import { SubscriptionType } from "./SubscriptionType";

export interface UserSignupRequest {
    username: string;
    email: string;
    password: string;
    role: Role;
    subscriptionType: SubscriptionType;
    reviews: any[];
    readingLists: any[];
}