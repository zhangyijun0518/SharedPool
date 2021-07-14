package edu.sjsu.cmpe275.finalproject.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import edu.sjsu.cmpe275.finalproject.model.Pool;
import edu.sjsu.cmpe275.finalproject.model.Pooler;


public interface PoolService {
	
	List<Pool> getAllPool() ;
	
	Pool getPool(Long id) ;
	
	Set<Pool> searchPool(String keywords);
	
	Pool createPool(String leader_email, String name, String zip, String neighborhood, String dscrp) ;
	
	Pool updatePoolInfo(Long pool_id, String name, String neighborhood, String dscrp) ;
	
	Pool deletePool(Long id) ;
	
	String getLeaderName(Long id) ;
	
	List<Pooler> getPoolersInPool(Long id);
		
}