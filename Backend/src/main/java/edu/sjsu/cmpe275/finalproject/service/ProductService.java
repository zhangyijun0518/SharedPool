package edu.sjsu.cmpe275.finalproject.service;

import java.util.List;
import edu.sjsu.cmpe275.finalproject.model.Product;


public interface ProductService {

    public List<Product> getAllProducts();

    public Product getProductById(Long productId);

    public List<Product> getProductByProductNameLike(String name);

    public List<Product> saveProductToStores(Product product, List<String>store_ids);

    public List<Product> addProductToStores(Product product, List<String>store_ids);

    public Product findProductBySku(String sku);

    public Product findProductById(Long id);

    public Product findProductByStoreIdAndSku(Long storeId, String sku);

    public void deleteProductByStoreIdAndSku(Long storeId, String sku);

    public void deleteProductById(Long id);
}