import { CartStatus } from "./CartStatus";
import { SubscriptionType } from "./SubscriptionType";

export interface SubscriptionCart {
    id: number;
    userId: number;
    selectedSubscription: SubscriptionType;
    status: CartStatus;
    createdAt: Date;
    updatedAt: Date;
    isUpgrade?: boolean;  
    isCancellation?: boolean; 
  }