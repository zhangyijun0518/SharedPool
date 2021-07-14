package edu.sjsu.cmpe275.finalproject.controller;

import org.springframework.web.bind.annotation.RestController;

import edu.sjsu.cmpe275.finalproject.model.CartItem;
import edu.sjsu.cmpe275.finalproject.model.Product;
import edu.sjsu.cmpe275.finalproject.model.Store;
import edu.sjsu.cmpe275.finalproject.service.CartService;
import edu.sjsu.cmpe275.finalproject.service.ProductService;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class CartController {

    // TODO add validation aspect, all cart controller need to be done when pooler
    // logged in and joined a pool

    @Autowired
    private CartService cartService;

    @Autowired
    private ProductService productService;

    @GetMapping("/carts")
    public ResponseEntity<Object> getAllCartItems() {
        List<CartItem> cartItems = cartService.getAllCartItems();
        return ResponseEntity.ok().body(cartItems);
    }

    /**
     * Get a pooler's shopping cart
     * 
     * @param poolerId
     * @return
     */
    @GetMapping("/cart/{poolerId}")
    public ResponseEntity<Object> getCartByName(@PathVariable(name = "poolerId", required = true) Long poolerId) {
        HashMap<Store, List<CartItem>> storeItemsMap = cartService.getCartByPooler(poolerId);
        if (storeItemsMap == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Pooler does not exist");
        } else {
            return ResponseEntity.ok().body(storeItemsMap);
        }
    }

    /**
     * Get a pooler's shopping cart price related data
     * 
     * @param poolerId
     * @return
     */
    @GetMapping("/carttotal/{poolerId}")
    public ResponseEntity<Object> getCartTotalByName(@PathVariable(name = "poolerId", required = true) Long poolerId) {
        HashMap<String, Double> costs = cartService.getCartTotalByPooler(poolerId);
        return ResponseEntity.ok().body(costs);
    }

    @GetMapping("/canAddToCart")
    public ResponseEntity<Object> canAddToCart(@RequestParam(value = "poolerId", required = true) Long poolerId,
            @RequestParam(value = "productId", required = true) Long productId) {

        Product product = productService.getProductById(productId);
        if (product == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product does not exist");
        }

        Boolean[] canAddToCart = cartService.canAddToCart(poolerId, productId);
        return ResponseEntity.ok().body(canAddToCart);
    }

    /**
     * add a product to a pooler's shopping cart
     * 
     * @param poolerId
     * @param productId
     * @param quantity
     * @return
     */
    @PostMapping("/cart/{poolerId}")
    public ResponseEntity<Object> addProductToCart(@PathVariable("poolerId") Long poolerId,
            @RequestParam(value = "productId", required = true) Long productId,
            @RequestParam(value = "quantity", required = true) int quantity) {

        // find product
        Product product = productService.getProductById(productId);

        if (product == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product does not exist");
        }

        if (quantity < 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Quantity can not be less than zero");
        }

        CartItem addedItem = cartService.addProductToCart(poolerId, productId, quantity);

        return ResponseEntity.ok().body(addedItem);
    }

    /**
     * clear current cart and add a product to a pooler's shopping cart
     * 
     * @param poolerId
     * @param productId
     * @param quantity
     * @return
     */
    @PostMapping("/clearandaddcart/{poolerId}")
    public ResponseEntity<Object> clearAndAddProductToCart(@PathVariable("poolerId") Long poolerId,
            @RequestParam(value = "productId", required = true) Long productId,
            @RequestParam(value = "quantity", required = true) int quantity) {

        cartService.clearCart(poolerId);
        return addProductToCart(poolerId, productId, quantity);
    }

    /**
     * update the quantity in pooler's cart
     * 
     * @param poolerId
     * @param productId
     * @param quantity
     * @return
     */
    @PutMapping("/cart/{poolerId}")
    public ResponseEntity<Object> updateCart(@PathVariable("poolerId") Long poolerId,
            @RequestParam(value = "productId", required = true) Long productId,
            @RequestParam(value = "quantity", required = true) int quantity) {

        Product product = productService.getProductById(productId);

        if (product == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cannot delete, Product does not exist");
        }

        if (quantity < 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Quantity can not be less than zero");
        }

        CartItem updatedItem = cartService.updateProductQuantityInCart(poolerId, productId, quantity);
        if (updatedItem == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cannot update, Product does not exist in cart");
        } else {
            return ResponseEntity.ok().body(updatedItem);
        }
    }

    /**
     * Delete a product from pooler's cart
     * 
     * @param poolerId
     * @param productId
     * @return
     */
    @DeleteMapping("/cart/{poolerId}")
    public ResponseEntity<Object> deleteCart(@PathVariable("poolerId") Long poolerId,
            @RequestParam(value = "productId", required = true) Long productId) {
        Product product = productService.getProductById(productId);

        if (product == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cannot delete, Product does not exist");
        }

        CartItem cartItem = cartService.deleteCartItem(poolerId, productId);
        if (cartItem == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cannot delete, Product does not exist in cart");
        } else {
            return ResponseEntity.ok().body(cartItem);
        }
    }

    /**
     * Checkout pooler's shopping cart into store-related orders
     * 
     * @param poolerId
     * @return
     */
    @PostMapping("/checkout/{poolerId}")
    public ResponseEntity<Object> checkoutCart(@PathVariable("poolerId") Long poolerId) {

        // Order checkedOrder = cartService.checkout(poolerId);
        cartService.checkout(poolerId);
        // return ResponseEntity.ok().body(checkedOrder);
        return ResponseEntity.ok().body("checked out");
    }

}