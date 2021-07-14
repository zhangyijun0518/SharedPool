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

public interface StoreService {

    public List<Store> getAllStores();

    public Store updateStore(Store s);

    public Store findStoreById(Long storeId);

    public Store findStoreByStoreName(String store_name);

    public Store createStore(Store store);

    public Store createStore(String store_name, String street, String city, String state, String zip);

    public Store editStore(Store store, String store_name, String street, String city, String state, String zip);

    public void deleteStore(Long storeId);

}