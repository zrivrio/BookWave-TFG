import { CartStatus } from "./CartStatus";
import { SubscriptionType } from "./SubscriptionType";
import { User } from "./User";

export interface SubscriptionCart {
    id: number;
    user: {
      id: number;
      username: string;
  };
    userId: number;
    selectedSubscription: SubscriptionType;
    status: CartStatus;
    createdAt: Date;
    updatedAt: Date;
    isUpgrade?: boolean;  
    isCancellation?: boolean; 
  }