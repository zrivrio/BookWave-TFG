package com.BookWave.bookstreaming.domain;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "subscription_carts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionCart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    private SubscriptionType selectedSubscription;

    @Enumerated(EnumType.STRING)
    private CartStatus status = CartStatus.PENDING;

    private Date createdAt = new Date();
    private Date updatedAt = new Date();

    // Métodos para manejar el proceso de checkout
    public boolean isUpgrade() {
        return user.getSubscriptionType() == SubscriptionType.Free && 
               selectedSubscription == SubscriptionType.Premium;
    }

    public boolean isCancellation() {
        return user.getSubscriptionType() == SubscriptionType.Premium && 
               selectedSubscription == SubscriptionType.Free;
    }
}