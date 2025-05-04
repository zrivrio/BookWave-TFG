package com.BookWave.bookstreaming.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.BookWave.bookstreaming.domain.SubscriptionCart;
import com.BookWave.bookstreaming.domain.SubscriptionType;
import com.BookWave.bookstreaming.service.SubscriptionCartService;



@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/cart")
public class SubscriptionCartController {
    @Autowired
    private SubscriptionCartService cartService;

    @GetMapping()
    public SubscriptionCart getCart(@RequestParam Long userId) {
        return cartService.getOrCreateUserCart(userId);
    }

    @PostMapping("/select-subscription")
    public SubscriptionCart selectSubscription(
            @RequestParam Long userId,
            @RequestParam SubscriptionType subscriptionType) {
        return cartService.updateSelectedSubscription(userId, subscriptionType);
    }

    @PostMapping("/checkout")
    public SubscriptionCart checkout(@RequestParam Long cartId) {
        return cartService.processCheckout(cartId);
    }
}