package edu.sjsu.cmpe275.finalproject.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.sjsu.cmpe275.finalproject.model.CartItem;
import edu.sjsu.cmpe275.finalproject.model.Order;
import edu.sjsu.cmpe275.finalproject.model.OrderItem;
import edu.sjsu.cmpe275.finalproject.model.Pool;
import edu.sjsu.cmpe275.finalproject.model.Pooler;
import edu.sjsu.cmpe275.finalproject.model.Product;
import edu.sjsu.cmpe275.finalproject.model.Store;
import edu.sjsu.cmpe275.finalproject.repository.CartItemRepository;
import edu.sjsu.cmpe275.finalproject.repository.OrderItemRepository;
import edu.sjsu.cmpe275.finalproject.repository.OrderRepository;
import edu.sjsu.cmpe275.finalproject.repository.PoolerRepository;
import edu.sjsu.cmpe275.finalproject.repository.ProductRepository;

@Service
public class CartServiceImpl implements CartService {
    static final double TAX_RATE = 0.0925;
    static final double FEE_RATE = 0.005;

    @Autowired
    private CartItemRepository cartItemRepo;

    @Autowired
    private PoolerRepository poolerRepo;

    @Autowired
    private ProductRepository productRepo;

    @Autowired
    private OrderRepository orderRepo;

    @Autowired
    private OrderItemRepository orderItemRepo;

    public HashMap<Store, List<CartItem>> getCartByPooler(Long poolerId) {
        List<CartItem> cartItems = cartItemRepo.findAllByPoolerId(poolerId);

        // HashMap<Store, List<CartItem>> storeItemsMap = new HashMap<>();
        HashMap<Store, List<CartItem>> storeItemsMap = new HashMap<>();

        for (CartItem item : cartItems) {
            Product product = item.getProduct();
            Store store = product.getStore();
            if (storeItemsMap.containsKey(store)) {
                List<CartItem> itemList = storeItemsMap.get(store);
                itemList.add(item);
            } else {
                List<CartItem> itemList = new ArrayList<CartItem>();
                itemList.add(item);
                storeItemsMap.put(store, itemList);
            }
        }
        return storeItemsMap;
    }

    public HashMap<String, Double> getCartTotalByPooler(Long poolerId) {
        HashMap<Store, List<CartItem>> storeItemsMap = getCartByPooler(poolerId);
        HashMap<String, Double> storeCostsMap = new HashMap<>();
        double subtotal = 0;

        for (Map.Entry<Store, List<CartItem>> entry : storeItemsMap.entrySet()) {
            Store store = entry.getKey();
            double store_subtotal = 0;
            for (CartItem item : entry.getValue()) {
                Product product = item.getProduct();
                store_subtotal += product.getPrice() * item.getquantity();
            }
            storeCostsMap.put(store.getStoreName(), store_subtotal);
            subtotal += store_subtotal;
        }

        double tax = TAX_RATE * subtotal;
        double service_fee = FEE_RATE * subtotal;
        storeCostsMap.put("Subtotal", subtotal);
        storeCostsMap.put("Tax", tax);
        storeCostsMap.put("Service fee", service_fee);
        storeCostsMap.put("Total", subtotal + tax + service_fee);
        return storeCostsMap;
    }

    public CartItem getCartItemByPooler(Long poolerId, Long productId) {
        return cartItemRepo.findCartItemByPoolerId(poolerId, productId);
    }

    public CartItem addProductToCart(Long poolerId, Long productId, int quantity) {

        CartItem cartItem = getCartItemByPooler(poolerId, productId);
        if (cartItem == null) {
            Pooler pooler = poolerRepo.findById(poolerId).orElse(null);
            Product product = productRepo.findById(productId).orElse(null);
            cartItem = new CartItem(pooler, product, quantity);
        } else {
            int new_quantity = quantity + cartItem.getquantity();
            cartItem.setquantity(new_quantity);
        }
        return cartItemRepo.save(cartItem);
    }

    public CartItem updateProductQuantityInCart(Long poolerId, Long productId, int quantity) {
        if (quantity > 0) {
            CartItem cartItem = getCartItemByPooler(poolerId, productId);
            cartItem.setquantity(quantity);
            return cartItemRepo.save(cartItem);
        } else {
            return deleteCartItem(poolerId, productId);
        }
    }

    public CartItem deleteCartItem(Long poolerId, Long productId) {
        CartItem itemToDelete = getCartItemByPooler(poolerId, productId);
        if (itemToDelete != null) {
            cartItemRepo.deleteById(itemToDelete.getId());
        }
        return itemToDelete;
    }

    public void checkout(Long poolerId) {
        HashMap<Store, List<CartItem>> storeItemsMap = getCartByPooler(poolerId);
        Pooler pooler = poolerRepo.findById(poolerId).orElse(null);
        Pool pool = pooler.getPool();
        HashMap<String, Double> costs = getCartTotalByPooler(poolerId);
        for (Store store : storeItemsMap.keySet()) {
            double subtotal = costs.get(store.getStoreName());
            double tax = subtotal * TAX_RATE;
            double fee = subtotal * FEE_RATE;
            double total = subtotal + tax + fee;
            Order order = new Order(pooler, pool, store, Order.Status.PLACED, LocalDateTime.now(), subtotal, tax, fee,
                    total);
            orderRepo.save(order);
            List<CartItem> storeCartItems = storeItemsMap.get(store);
            for (CartItem item : storeCartItems) {
                OrderItem orderItem = new OrderItem(order, item.getProduct(), item.getquantity());
                orderItemRepo.save(orderItem);
            }
        }
        clearCart(poolerId);
    }

    public void clearCart(Long poolerId) {
        cartItemRepo.deleteByPoolerId(poolerId);
    }

    public List<CartItem> getAllCartItems() {
        return cartItemRepo.findAll();
    }

    public Boolean[] canAddToCart(Long poolerId, Long productId) {
        Boolean[] canAdd = new Boolean[2];
        // check if in pool
        Pooler pooler = poolerRepo.findById(poolerId).orElse(null);
        if ((pooler != null) && (pooler.getPool() != null)) {
            canAdd[0] = true;
        } else {
            canAdd[0] = false;
        }
        // check if same store product or empty cart
        CartItem item = cartItemRepo.findFirstByPoolerId(poolerId);
        if (item == null) {
            canAdd[1] = true;
        } else {
            Product product = productRepo.findById(productId).orElse(null);
            canAdd[1] = (product.getStore() == item.getProduct().getStore());
        }
        return canAdd;
    }

}