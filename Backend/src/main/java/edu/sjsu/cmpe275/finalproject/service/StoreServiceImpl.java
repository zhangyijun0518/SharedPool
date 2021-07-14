package edu.sjsu.cmpe275.finalproject.service;

import java.util.List;

import javax.validation.constraints.Null;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import edu.sjsu.cmpe275.finalproject.repository.StoreRepository;
import edu.sjsu.cmpe275.finalproject.model.Store;
import edu.sjsu.cmpe275.finalproject.model.Address;

@Service
public class StoreServiceImpl implements StoreService {

    @Autowired
    private StoreRepository storeRepo;

    public List<Store> getAllStores(){
        return storeRepo.findAll();
    }

    public Store updateStore(Store s) { return storeRepo.save(s); }

    public Store findStoreById(Long storeId) {
        return storeRepo.findStoreById(storeId);
    }

    public Store findStoreByStoreName(String store_name) {
        return storeRepo.findStoreByStoreName(store_name);
    }

    public Store createStore(Store store){
        return storeRepo.save(store);
    }

    public Store createStore(String store_name, String street, String city, String state, String zip){
        Address address = new Address(street, city, state, zip);
        Store store = new Store();
        store.setStoreAddress(address);
        store.setStoreName(store_name);

        return storeRepo.save(store);
    }

    public Store editStore(Store store, String store_name, String street, String city, String state, String zip){
        Address address = new Address(street, city, state, zip);
        store.setStoreAddress(address);
        store.setStoreName(store_name);
        return storeRepo.save(store);
    }

    public void deleteStore(Long storeId) {
        storeRepo.deleteById(storeId);
    }

}