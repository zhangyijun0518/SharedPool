package edu.sjsu.cmpe275.finalproject.service;

import java.util.HashMap;
import java.util.List;

import edu.sjsu.cmpe275.finalproject.model.CartItem;
import edu.sjsu.cmpe275.finalproject.model.Store;

public interface CartService {

    public HashMap<Store, List<CartItem>> getCartByPooler(Long poolerId);

    public HashMap<String, Double> getCartTotalByPooler(Long poolerId);

    public CartItem getCartItemByPooler(Long poolerId, Long productId);

    public CartItem addProductToCart(Long poolerId, Long productId, int quantity);

    public CartItem updateProductQuantityInCart(Long poolerId, Long productId, int quantity);

    public CartItem deleteCartItem(Long poolerId, Long productId);

    public void checkout(Long poolerId);

    public void clearCart(Long poolerId);

    public List<CartItem> getAllCartItems();

    public Boolean[] canAddToCart(Long poolerId, Long productId);

}