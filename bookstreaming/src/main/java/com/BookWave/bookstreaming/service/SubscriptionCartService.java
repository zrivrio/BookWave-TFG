package com.BookWave.bookstreaming.service;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.BookWave.bookstreaming.domain.CartStatus;
import com.BookWave.bookstreaming.domain.SubscriptionCart;
import com.BookWave.bookstreaming.domain.SubscriptionType;
import com.BookWave.bookstreaming.domain.User;
import com.BookWave.bookstreaming.repository.SubscriptionCartRepository;
import com.BookWave.bookstreaming.repository.UserRepository;

@Service
public class SubscriptionCartService {
    @Autowired
    private SubscriptionCartRepository cartRepository;
    
    @Autowired
    private UserRepository userRepository;

    public SubscriptionCart getOrCreateUserCart(Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + userId));
                
        return cartRepository.findByUser(user)
                .orElseGet(() -> {
                    SubscriptionCart newCart = new SubscriptionCart();
                    newCart.setUser(user);
                    newCart.setSelectedSubscription(user.getSubscriptionType());
                    newCart.setStatus(CartStatus.PENDING);
                    newCart.setCreatedAt(new Date());
                    newCart.setUpdatedAt(new Date());
                    return cartRepository.save(newCart);
                });
    }

    public SubscriptionCart updateSelectedSubscription(Long userId, SubscriptionType newSubscription) {
        if (newSubscription == null) {
            throw new IllegalArgumentException("New subscription type cannot be null");
        }

        SubscriptionCart cart = getOrCreateUserCart(userId);
        
              if (cart.getSelectedSubscription() == newSubscription) {
            return cart;
        }
        
        cart.setSelectedSubscription(newSubscription);
        cart.setUpdatedAt(new Date());
        cart.setStatus(CartStatus.PENDING);
        return cartRepository.save(cart);
    }

    public SubscriptionCart processCheckout(Long cartId) {
        if (cartId == null) {
            throw new IllegalArgumentException("Cart ID cannot be null");
        }

        SubscriptionCart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado con ID: " + cartId));
        
        if (cart.getStatus() == CartStatus.COMPLETED) {
            throw new IllegalStateException("Cart has already been processed");
        }
        
        User user = cart.getUser();
        
        if (cart.isUpgrade()) {
            user.setSubscriptionType(SubscriptionType.Premium);
        } else if (cart.isCancellation()) {
            user.setSubscriptionType(SubscriptionType.Free);
        }
        
        userRepository.save(user);
        cart.setStatus(CartStatus.COMPLETED);
        cart.setUpdatedAt(new Date());
        return cartRepository.save(cart);
    }

    //Métodos de Administrador
    public List<SubscriptionCart> getAllCarts() {
        return cartRepository.findAll();
    }

    public SubscriptionCart getCartById(Long id) {
        return cartRepository.findById(id).orElse(null);
    }

    public SubscriptionCart saveCart(SubscriptionCart cart) {
        return cartRepository.save(cart);
    }

    public void deleteCartById(Long id) {
        cartRepository.deleteById(id);
    }

    public SubscriptionCart updateCart(SubscriptionCart cart) {
        return cartRepository.save(cart);
    }
}