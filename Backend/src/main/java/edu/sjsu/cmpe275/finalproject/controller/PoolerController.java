package edu.sjsu.cmpe275.finalproject.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import edu.sjsu.cmpe275.finalproject.model.Pool;
import edu.sjsu.cmpe275.finalproject.model.Pooler;
import edu.sjsu.cmpe275.finalproject.service.PoolService;
import edu.sjsu.cmpe275.finalproject.service.PoolerService;

//@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/pooler")
public class PoolerController {
	@Autowired
    private PoolerService poolerService;
	
	@GetMapping("")
	public ResponseEntity<Object>  getAllPooler(){
			List<Pooler> poolers = poolerService.getAllPoolers();
			if(poolers == null) {
				return  ResponseEntity.status(HttpStatus.NOT_FOUND).body("No pooler yet..");
			}
			
			return ResponseEntity.ok().body(poolers);
	}
	
	@GetMapping("/{pooler_id}")
	public ResponseEntity<Object>  getPoolerById(@PathVariable Long pooler_id){
		Pooler pooler = poolerService.getPoolerById(pooler_id);
		if(pooler == null) {
			return  ResponseEntity.status(HttpStatus.NOT_FOUND).body("Pooler does not exist..");
		}
		
		return ResponseEntity.ok().body(pooler);
	}
	
//	@GetMapping("/pool/{pooler_id}")
//	public ResponseEntity<Object>  getPoolIdByPoolerName(@PathVariable Long pooler_id){
//		Pooler pooler = poolerService.getPoolerById(pooler_id);
//		if(pooler == null) {
//			return  ResponseEntity.status(HttpStatus.NOT_FOUND).body("Pooler does not exist..");
//		}
//		
//		return ResponseEntity.ok().body(pooler);
//	}
	
//	@GetMapping("/{pooler_id}")
//	public ResponseEntity<Object>  getPoolerNameById(@PathVariable Long pooler_id){
//		Pooler pooler = poolerService.getPoolerById(pooler_id);
//		if(pooler == null) {
//			return  ResponseEntity.status(HttpStatus.NOT_FOUND).body("Pooler does not exist..");
//		}
//		
//		return ResponseEntity.ok().body(pooler);
//	}
	
	@GetMapping("/pool/{pool_id}")
	public ResponseEntity<Object>  getPoolerInPool(@PathVariable Long pool_id){
//		List<Pooler> poolers = poolerService.getPoolerInPool(pool_id);
		List<String> poolers = poolerService.getPoolerNameInPool(pool_id);
		if(poolers == null) {
			return  ResponseEntity.status(HttpStatus.NOT_FOUND).body("Pooler does not exist..");
		}
		
		return ResponseEntity.ok().body(poolers);
	}
	
	@GetMapping("/search/{sname}")
	public ResponseEntity<Object>  getPoolerByScreenName(@PathVariable String sname){
		Pooler pooler = poolerService.getPoolerByScreenName(sname);
		if(pooler == null) {
			return  ResponseEntity.status(HttpStatus.NOT_FOUND).body("Pooler does not exist..");
		}
		
		return ResponseEntity.ok().body(pooler);
	}
	
	/**
	 * pass changes as -1 if reduce one point
	 * pass changes as 1 if add one point
	 */
	@PutMapping("/{pooler_id}/score")
	public ResponseEntity<Object> updatePoolerScore(
			@PathVariable("pooler_id") Long pooler_id,
			@RequestParam(value = "changes", required = true) Integer schanges)
	{	
		if(schanges == null) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Missing score changes...");
		}
		
		Pooler pooler = poolerService.updatePoolerScore(pooler_id, schanges);
		if(pooler == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Pooler does not exist..");
		}
		
		return ResponseEntity.ok().body(pooler);			
	}
	
	//unnecessary if we have user CRUD functions 
	
//	@PostMapping("/pooler")
//	public ResponseEntity<Object> createPooler(
//			@RequestParam(value = "screenname", required = true) Long screenname,
//			@RequestParam(value = "nickname", required = true) String nickname,
//			@RequestParam(value = "email", required = true) String email) 
//	{
//		
//	}
//	

//	
//	@DeleteMapping("/pooler/{pooler_id}")
//	public ResponseEntity<Object> deletePooler(@PathVariable Long pooler_id) 
//	{
//		
//	}
	
	@PutMapping("/{pooler_id}/{refer_id}")
	public ResponseEntity<Object> addPoolerToPool(
			@PathVariable Long pooler_id,
			@PathVariable Long refer_id) 
	{	
		if(poolerService.BelongsToOnePool(pooler_id) != null){
			return ResponseEntity.status(HttpStatus.CONFLICT).body("Cannot join the pool, the pooler has already been in a pool..");
		} 
		
		Pooler pooler = poolerService.addPoolerToPool(pooler_id, refer_id);
		
		if(pooler == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Invalid pooler or pool..");
		}
		
		return ResponseEntity.ok().body(pooler);
			
	}
	
	@DeleteMapping("/{pooler_id}/{pool_id}")
	public ResponseEntity<Object> deletePoolerFromPool(
			@PathVariable Long pooler_id,
			@PathVariable Long pool_id) 
	{
		if(poolerService.BelongsToOnePool(pooler_id) == null || poolerService.BelongsToOnePool(pooler_id) != pool_id){
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The pooler is not in this pool..");
		} 
		
		Pooler pooler = poolerService.deletePoolerFromPool(pooler_id, pool_id);
		
		if(pooler == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Invalid pooler or pool..");
		}
		
		return ResponseEntity.ok().body(pooler);
	}
}
