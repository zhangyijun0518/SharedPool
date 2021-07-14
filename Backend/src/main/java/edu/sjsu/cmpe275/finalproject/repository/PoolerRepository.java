package edu.sjsu.cmpe275.finalproject.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import edu.sjsu.cmpe275.finalproject.model.Pooler;

@Repository
public interface PoolerRepository extends JpaRepository<Pooler, Long> {
	
	@Query(value = "SELECT screenname FROM cmpe275_cartShare.user WHERE pool_id = ?1", nativeQuery = true)
	List<String> findPoolerScreennameByPoolId(Long pool_id);
	
	
	@Query(value = "SELECT * FROM cmpe275_cartShare.user WHERE pool_id = ?1", nativeQuery = true)
	List<Pooler> findPoolerByPoolId(Long pool_id);
	
	Pooler findPoolerByEmail(String email);
	
	@Query(value = "SELECT * FROM cmpe275_cartShare.user WHERE id = ?1", nativeQuery = true)
	Pooler findPoolerById(Long pool_id);
	
	@Query(value = "SELECT * FROM cmpe275_cartShare.user WHERE screenname = ?1", nativeQuery = true)
	Pooler findPoolerByScreenname(String screenname);
	
}
