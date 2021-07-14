package edu.sjsu.cmpe275.finalproject.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.sjsu.cmpe275.finalproject.repository.PoolRepository;
import edu.sjsu.cmpe275.finalproject.repository.PoolerRepository;
import edu.sjsu.cmpe275.finalproject.model.Pool;
import edu.sjsu.cmpe275.finalproject.model.Pooler;

@Service
public class PoolServiceImpl implements PoolService {
	
	@Autowired
	private PoolerRepository poolerRepo;
	
	@Autowired
	private PoolRepository poolRepo;
	
	public List<Pool> getAllPool() {
		return poolRepo.findAll();
	}
	
	public Pool getPool(Long id) {
		Pool pool = poolRepo.findById(id).orElse(null);
	    return pool;
	}
	
	public Set<Pool> searchPool(String keywords){
		Set<Pool> pools = new HashSet<Pool>();
		
		for(Pool temp: poolRepo.findPoolByZip(keywords)) {
			pools.add(temp);
		}
		
		for(Pool t: poolRepo.findPoolByNameContainingIgnoreCase(keywords)) {
			pools.add(t);
		}
		
		for (Pool pool: poolRepo.findPoolByNeighborhoodContainingIgnoreCase(keywords) ){
			pools.add(pool);
		}
		
	
		return pools;
	}
	
	public Pool createPool(String leader_email, String name, String zip, String neighborhood, String dscrp) {
		Pooler leader = poolerRepo.findPoolerByEmail(leader_email);
		
		if(leader == null) {
			return null;
		} 
		
		Pool pool = new Pool(leader, name, zip);
		pool.setDescription(dscrp);
		pool.setNeighborhood(neighborhood);
		leader.setPool(pool);
		poolRepo.save(pool);
		poolerRepo.save(leader);
		
		return pool;
	}
	
	
	public Pool updatePoolInfo(Long pool_id, String name, String neighborhood, String dscrp) {
		Pool pool = poolRepo.findById(pool_id).orElse(null);
		
		if(pool == null) {
			return null;
		}
		
		if(dscrp != null) { pool.setDescription(dscrp); }
		if(neighborhood != null) { pool.setNeighborhood(neighborhood); }
		if(name != null) {pool.setName(name);}
		
		poolRepo.save(pool);
		
		
		return pool;
	}
	
	public Pool deletePool(Long id) {
		Pool pool = poolRepo.findById(id).orElse(null);
		if(pool != null) {
			Pooler leader = pool.getLeader();
			leader.setPool(null);
			poolerRepo.save(leader);
			poolRepo.deleteById(id);
		}
		
		return pool;
	}
	
	public String getLeaderName(Long id) {
		Pool pool = poolRepo.findById(id).orElse(null);
		if(pool == null) {
			return null;
		}
		Pooler leader = pool.getLeader();
		return leader.getScreenname();
	}
	
	public List<Pooler> getPoolersInPool(Long id){
		return poolerRepo.findPoolerByPoolId(id);
	}
		
}