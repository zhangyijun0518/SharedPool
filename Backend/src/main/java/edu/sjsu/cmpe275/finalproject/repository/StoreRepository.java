package edu.sjsu.cmpe275.finalproject.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import edu.sjsu.cmpe275.finalproject.model.Store;

@Repository
public interface StoreRepository extends JpaRepository<Store, Long> {
	
	Store findStoreById(Long id);

	Store findStoreByStoreName(String name);

}