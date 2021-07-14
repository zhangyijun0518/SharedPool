package edu.sjsu.cmpe275.finalproject.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import edu.sjsu.cmpe275.finalproject.model.Product;
import java.util.List;
import java.util.Optional;


@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Product findProductById(Long id);

    Product findBySku(String sku);

    Product findProductByStoreId(Long store_id);

    Product findProductByStoreIdAndSku(Long store_id, String sku);
    
    Void deleteByStoreIdAndSku(Long store_id, String sku);

    @Query(value = "SELECT * FROM cmpe275_cartShare.products WHERE Upper(product_name) like CONCAT('%',?1,'%') or Upper(sku) = ?1 or store_id = ?1", nativeQuery = true)
    List<Product> searchProducts(String name);
}