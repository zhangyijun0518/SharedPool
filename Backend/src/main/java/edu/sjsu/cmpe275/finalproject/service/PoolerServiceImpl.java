package edu.sjsu.cmpe275.finalproject.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.sjsu.cmpe275.finalproject.model.Pool;
import edu.sjsu.cmpe275.finalproject.model.Pooler;
import edu.sjsu.cmpe275.finalproject.repository.PoolRepository;
import edu.sjsu.cmpe275.finalproject.repository.PoolerRepository;

@Service
public class PoolerServiceImpl implements PoolerService{
	
	@Autowired
	private PoolerRepository poolerRepo;
	
	@Autowired
	private PoolRepository poolRepo;
	
	public List<Pooler> getAllPoolers(){
		return poolerRepo.findAll();
	}
	
	public Pooler getPoolerById(Long id) {
		Pooler pooler = poolerRepo.findById(id).orElse(null);
	    return pooler;
	}
	
	public Pooler getPoolerByScreenName(String sname) {
		Pooler pooler = poolerRepo.findPoolerByScreenname(sname);
	    return pooler;
	}
	
	public Pooler updatePoolerScore(Long pooler_id, Integer scorechanges) {
		Pooler pooler = poolerRepo.findById(pooler_id).orElse(null);
		
		
		if(pooler == null) {
			return null;
		} else {
			
			Integer newScore = pooler.getContributionScore();
			if(scorechanges != null) { 
				newScore += scorechanges;
				System.out.println(newScore);
			}
			pooler.setContribution(newScore); 
			poolerRepo.save(pooler);
		}
		
		return pooler;
	}
	
	public List<Pooler> getPoolerInPool(Long pool_id){
		List<Pooler> poolers = new ArrayList<>();
		poolers = poolerRepo.findPoolerByPoolId(pool_id) ;
		return poolers;
	}
	
	public List<String> getPoolerNameInPool(Long pool_id){
		List<String> poolers = new ArrayList<>();
		poolers = poolerRepo.findPoolerScreennameByPoolId(pool_id) ;
		return poolers;
	}
	
	public Long BelongsToOnePool(Long id) {
		Pooler pooler = poolerRepo.findById(id).orElse(null);
		if(pooler != null && pooler.getPool() != null) {
			return pooler.getPool().getId();
		}
		return null;
	}
	
	public Long BelongsToOnePool(String id) {
		Pooler pooler = poolerRepo.findPoolerByEmail(id);
		if(pooler != null && pooler.getPool() != null) {
			return pooler.getPool().getId();
		}
		return null;
	}
	
	public Pooler addPoolerToPool(Long pooler_id, Long refer_id) {
		Pooler pooler = poolerRepo.findById(pooler_id).orElse(null);
		Pooler referee = poolerRepo.findById(refer_id).orElse(null);
		Pool pool = referee.getPool();
		if(pooler == null || referee == null || pool == null) {
			return null;
		}
		
		pooler.setPool(pool);
		poolerRepo.save(pooler);
		return pooler;
	}
	
	public Pooler deletePoolerFromPool(Long pooler_id, Long pool_id) {
		Pool pool = poolRepo.findById(pool_id).orElse(null);
		Pooler pooler = poolerRepo.findById(pooler_id).orElse(null);
		if(pool == null || pooler == null) {
			return null;
		}
		
		pooler.setPool(null);
		poolerRepo.save(pooler);
		return pooler;
	}
}