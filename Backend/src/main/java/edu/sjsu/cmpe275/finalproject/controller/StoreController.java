package edu.sjsu.cmpe275.finalproject.controller;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import edu.sjsu.cmpe275.finalproject.model.Pooler;
import edu.sjsu.cmpe275.finalproject.model.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.propertyeditors.StringTrimmerEditor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;

import edu.sjsu.cmpe275.finalproject.repository.StoreRepository;
import edu.sjsu.cmpe275.finalproject.service.StoreService;
import edu.sjsu.cmpe275.finalproject.model.Store;
import edu.sjsu.cmpe275.finalproject.model.Address;

@CrossOrigin
@RestController
public class StoreController {

    @Autowired
    private StoreService storeService;

    //trim all request parameters
    @InitBinder
    public void initBinder ( WebDataBinder binder )
    {
        StringTrimmerEditor stringtrimmer = new StringTrimmerEditor(true);
        binder.registerCustomEditor(String.class, stringtrimmer);
    }

    // Get All Stores
    @GetMapping("/stores")
    public List<Store> getAllStores(){
        return storeService.getAllStores();
    }

    // Create one store
    @PostMapping("/store")
    public ResponseEntity<Object> createStore(@RequestBody Store store){

        return ResponseEntity.ok().body(storeService.createStore(store));
    }

    // Search store using store_id
    @GetMapping("/store")
    public ResponseEntity<Object> getStore(@RequestParam(value="id") Long id) {
        Store store = storeService.findStoreById(id);
        if (store == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Store does not exist");
        }
        else {
            return ResponseEntity.ok().body(store);
        }
    }

    // Search store using store_id
    @PutMapping("/store")
    public ResponseEntity<Object> getStore(@RequestBody Store store) {
        Store s = storeService.findStoreById(store.getId());
        if(s == null) {
            return  ResponseEntity.status(HttpStatus.NOT_FOUND).body("Store does not exist..");
        }
        storeService.updateStore(store);
        return ResponseEntity.ok().body(store);
    }

    // Search store using storeName
    @GetMapping("/store/{store_name}")
    public ResponseEntity<Object> getStore(@PathVariable(value = "store_name") String store_name) {
        Store store = storeService.findStoreByStoreName(store_name);
        if (store == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Store does not exist");
        }
        else {
            return ResponseEntity.ok().body(store);
        }
    }

//    // Edit one store
//    @PutMapping("/store")
//    public ResponseEntity<Object> editProduct(
//            @RequestParam(value = "store_id", required = true) Long store_id,
//            @RequestParam(value = "store_name", required = true) String store_name,
//            @RequestParam(value = "street", required = true) String street,
//            @RequestParam(value = "city", required = true) String city,
//            @RequestParam(value = "state", required = true) String state,
//            @RequestParam(value = "zip", required = true) String zip){
//        Store store = storeService.findStoreById(store_id);
//        if (store == null){
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Store doesn't exist...");
//        }
//        storeService.editStore(store, store_name, street, city, state, zip);
//        return ResponseEntity.ok().body(store);
//    }

    @DeleteMapping("/store/{store_id}")
    public ResponseEntity<Store> deleteStore(@PathVariable Long store_id) {
        if(storeService.findStoreById(store_id) == null) {
            System.out.println("Store doesn't exist...");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        else {
            storeService.deleteStore(store_id);
            return ResponseEntity.ok().body(null);
        }
    }
}