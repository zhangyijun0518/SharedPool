package edu.sjsu.cmpe275.finalproject.controller;

import java.util.Arrays;
import java.util.List;

import edu.sjsu.cmpe275.finalproject.model.Store;
import edu.sjsu.cmpe275.finalproject.service.StoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.propertyeditors.StringTrimmerEditor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;

import edu.sjsu.cmpe275.finalproject.service.ProductService;
import edu.sjsu.cmpe275.finalproject.model.Product;

@CrossOrigin
@RestController
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private StoreService storeService;

    //trim all request parameters
    @InitBinder
    public void initBinder ( WebDataBinder binder )
    {
        StringTrimmerEditor stringtrimmer = new StringTrimmerEditor(true);
        binder.registerCustomEditor(String.class, stringtrimmer);
    }

    // Get All Products
    @GetMapping("/products")
    public List<Product> getAllProducts(){
        List<Product> products = productService.getAllProducts();
        for (Product p: products) {
            p.setSid(p.getStore().getId());
            p.setSname(p.getStore().getStoreName());
            p.setSimage(p.getStore().getImage());
        }
        return products;
    }

    // Search store using storeName
    @GetMapping("/product/{id}")
    public Product getProduct(@PathVariable(value = "id") Long id) {
        Product p = productService.getProductById(id);
        Store s = p.getStore();
        p.setSid(s.getId());
        p.setSname(s.getStoreName());
        p.setSimage(s.getImage());
        return p;
    }

    // Search store using storeName
    @GetMapping("/product")
    public List<Product> getProduct(@RequestParam(value="q") String name) {
        List<Product> products = productService.getProductByProductNameLike(name);
        for (int i = 0; i < products.size(); i++) {
            Product p = products.get(i);
            Store s = p.getStore();
            p.setSid(s.getId());
            p.setSname(s.getStoreName());
            p.setSimage(s.getImage());
        }
        return products;
    }

    @PostMapping("/product")
    public ResponseEntity<Object> createProduct(
            @RequestParam(value = "store_ids", required = true) String store_ids,
            @RequestBody Product product) {

        System.out.println(product);
        System.out.println(store_ids);
        List<String> sids = Arrays.asList(store_ids.split("\\s*,\\s*"));

        List<Product> products = productService.addProductToStores(product, sids);

        return ResponseEntity.ok().body(products);
    }

    @PutMapping("/product")
    public ResponseEntity<Object> updateProduct(
            @RequestParam(value = "store_ids", required = true) String store_ids,
            @RequestBody Product product){

        System.out.println(product);
        System.out.println(store_ids);
        List<String> sids = Arrays.asList(store_ids.split("\\s*,\\s*"));

        List<Product> products = productService.saveProductToStores(product, sids);

        return ResponseEntity.ok().body(products);
    }

//    @DeleteMapping("/product")
//    public ResponseEntity<Object> createProduct(
//            @RequestParam(value = "store_id", required = true) Long storeId,
//            @RequestParam(value = "sku", required = true) String sku){
//
//        if (productService.findProductByStoreIdAndSku(storeId, sku)!= null){
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Sku in this store already exist...");
//        }
//
//        productService.deleteProductByStoreIdAndSku(storeId, sku);
//
//        return ResponseEntity.ok().body(null);
//    }

    @DeleteMapping("/product/{id}")
    public ResponseEntity<Object> deleteProduct(@PathVariable(value = "id") Long id) {
        if (productService.findProductById(id) == null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("product does not exist...");
        }

        productService.deleteProductById(id);

        return ResponseEntity.ok().body(null);
    }

}