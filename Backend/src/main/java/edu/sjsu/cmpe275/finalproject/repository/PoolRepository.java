package edu.sjsu.cmpe275.finalproject.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import edu.sjsu.cmpe275.finalproject.model.Pool;
import edu.sjsu.cmpe275.finalproject.model.Pooler;

@Repository
public interface PoolRepository extends JpaRepository<Pool, Long> {
	
//	@Query(value = "SELECT * FROM cmpe275_cartShare.pool WHERE name = ?1", nativeQuery = true)
	List<Pool> findPoolByNameContainingIgnoreCase(String name);
	
	Pool findPoolByName(String name);
	
//	@Query(value = "SELECT * FROM cmpe275_cartShare.pool WHERE zip = ?1", nativeQuery = true)
	List<Pool> findPoolByZip(String zip);
	
//	@Query(value = "SELECT * FROM cmpe275_cartShare.pool WHERE neighborhood = ?1", nativeQuery = true)
	List<Pool> findPoolByNeighborhoodContainingIgnoreCase(String neighborhood);
}
