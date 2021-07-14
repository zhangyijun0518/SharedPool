package edu.sjsu.cmpe275.finalproject.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import edu.sjsu.cmpe275.finalproject.model.CartItem;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    // get all cart items for a pooler
    @Query(value = "SELECT * FROM cmpe275_cartShare.cart_item WHERE pooler_id = ?1", nativeQuery = true)
    List<CartItem> findAllByPoolerId(Long poolerId);

    @Query(value = "SELECT * FROM cmpe275_cartShare.cart_item WHERE pooler_id = ?1 AND product_id = ?2 LIMIT 1", nativeQuery = true)
    CartItem findCartItemByPoolerId(Long poolerId, Long productId);

    // @Modifying
    // @Query(value = "DELETE FROM cmpe275_cartShare.cart_item WHERE pooler_id =
    // ?1", nativeQuery = true)
    // void deleteAllCartItemByPoolerId(Long poolerId);

    @Transactional
    @Modifying
    void deleteByPoolerId(Long poolerId);

    CartItem findFirstByPoolerId(Long poolerId);
}