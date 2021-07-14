package edu.sjsu.cmpe275.finalproject.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.validation.constraints.Null;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.sjsu.cmpe275.finalproject.repository.ProductRepository;
import edu.sjsu.cmpe275.finalproject.repository.StoreRepository;
import edu.sjsu.cmpe275.finalproject.model.Product;
import edu.sjsu.cmpe275.finalproject.model.Store;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepo;

    @Autowired
    private StoreRepository storeRepo;

    public List<Product> getAllProducts(){
        return productRepo.findAll();
    }

    public Product getProductById(Long productId) {
        return productRepo.findProductById(productId);
    }

    public List<Product> getProductByProductNameLike(String name) {
        return productRepo.searchProducts(name.toUpperCase());
    }

    public List<Product> saveProductToStores(Product product, List<String>store_ids) {
        List<Product> products = new ArrayList<Product>();
        for (String store_id: store_ids) {
            Long sid = Long.valueOf(store_id);
            Store store = storeRepo.findStoreById(sid);

            if (productRepo.findProductByStoreIdAndSku(sid, product.getSku()) != null) {
                product.setStore(store);
                productRepo.save(product);
                products.add(product);
            } else {
                Product new_product = new Product(product);
                new_product.setStore(store);
                productRepo.save(new_product);
                products.add(new_product);
            }
        }

        return products;
    }

    public List<Product> addProductToStores(Product product, List<String>store_ids) {
        List<Product> products = new ArrayList<Product>();
        for (String store_id: store_ids) {
            Long sid = Long.valueOf(store_id);
            Store store = storeRepo.findStoreById(sid);

            Product new_product = new Product(product);
            new_product.setStore(store);
            productRepo.save(new_product);
            products.add(new_product);
        }

        return products;
    }



    public Product findProductBySku(String sku){
        return productRepo.findBySku(sku);
    }

    public Product findProductById(Long id){
        return productRepo.findProductById(id);
    }

    public Product findProductByStoreIdAndSku(Long storeId, String sku) {
        return productRepo.findProductByStoreIdAndSku(storeId, sku);
    }

    public void deleteProductByStoreIdAndSku(Long storeId, String sku) {
        productRepo.deleteByStoreIdAndSku(storeId, sku);
    }
    public void deleteProductById(Long id) {
        productRepo.deleteById(id);
    }
}