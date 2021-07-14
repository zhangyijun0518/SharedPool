package edu.sjsu.cmpe275.finalproject.service;

import java.util.ArrayList;
import java.util.List;

import edu.sjsu.cmpe275.finalproject.model.Pooler;


public interface PoolerService {
	
	List<Pooler> getAllPoolers();
	
	Pooler getPoolerById(Long id) ;
	
	Pooler getPoolerByScreenName(String sname);
	
	Pooler updatePoolerScore(Long pooler_id, Integer scorechanges);
	
	List<Pooler> getPoolerInPool(Long pool_id);
	
	List<String> getPoolerNameInPool(Long pool_id);
	
	Long BelongsToOnePool(Long id) ;
	
	Long BelongsToOnePool(String id) ;
	
	Pooler addPoolerToPool(Long pooler_id, Long refer_id);
	
	Pooler deletePoolerFromPool(Long pooler_id, Long pool_id);
}