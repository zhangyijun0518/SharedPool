package edu.sjsu.cmpe275.finalproject.controller;

import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import javax.mail.MessagingException;

import java.util.Set;
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
import org.springframework.http.ResponseEntity;

import edu.sjsu.cmpe275.finalproject.model.Pool;
import edu.sjsu.cmpe275.finalproject.model.Pooler;
import edu.sjsu.cmpe275.finalproject.service.PoolService;
import edu.sjsu.cmpe275.finalproject.service.PoolerService;
import edu.sjsu.cmpe275.finalproject.service.SendEmailService;

//@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/pool")
public class PoolController {
	
	@Autowired
    private PoolService poolService;
	
	@Autowired
    private PoolerService poolerService;
	
	@Autowired
    private SendEmailService sendEmailService;
	
	@GetMapping("")
	public ResponseEntity<Object>  getAllPool(){
			List<Pool> pools = poolService.getAllPool();
			if(pools == null) {
				return  ResponseEntity.status(HttpStatus.NOT_FOUND).body("No pool yet..");
			}
			
			return ResponseEntity.ok().body(pools);
	}
	
	@GetMapping("/{pool_id}")
	public ResponseEntity<Object>  getPoolById(@PathVariable Long pool_id){
			Pool pool = poolService.getPool(pool_id);
			if(pool == null) {
				return  ResponseEntity.status(HttpStatus.NOT_FOUND).body("Pool does not exist..");
			}
			System.out.println("Pool: " + pool.getLeader().getId());
			
			return ResponseEntity.ok().body(pool);
	}
//	
//	@GetMapping("/leader/{pool_id}")
//	public ResponseEntity<Object>  getLeaderName(@PathVariable Long pool_id){
//		String leader_name = poolService.getLeaderName(pool_id);
//		if(leader_name == null) {
//			return  ResponseEntity.status(HttpStatus.NOT_FOUND).body("Pool and leader does not exist..");
//		}
//		
//		return ResponseEntity.ok().body(leader_name);
//	}
	
	@GetMapping("/search")
	public ResponseEntity<Object>  searchPool(
			@RequestParam(value = "keywords", required = true) String keywords){
		Set<Pool> pool = new HashSet<Pool>();
			pool =	poolService.searchPool(keywords);
		if(pool == null) {
			return  ResponseEntity.status(HttpStatus.NOT_FOUND).body("Pool does not exist..");
		}
		
		return ResponseEntity.ok().body(pool);
	}
	
	/**
	 * 
	 * @param leader_id,  pass email as id
	 * @param name
	 * @param zip
	 * @param neighborhood
	 * @param description
	 * @return
	 */
	@PostMapping("")
	public ResponseEntity<Object> createPool(
			@RequestParam(value = "leader_id", required = true) String leader_id,
			@RequestParam(value = "name", required = true) String name,
			@RequestParam(value = "zip", required = true) String zip,
			@RequestParam(value = "neighborhood", required = false) String neighborhood,
			@RequestParam(value = "description", required = false) String description) 
	{	
			if(leader_id == null || name == null || zip == null) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Missing required parameters...");
			} else if (!validZip(zip)) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid zip code..");
			}
			
			if(poolerService.BelongsToOnePool(leader_id) != null){
				return ResponseEntity.status(HttpStatus.CONFLICT).body("Cannot create a new pool, the pooler has already been in a pool..");
			}
			
			Pool pool = poolService.createPool(leader_id, name, zip, neighborhood, description);
			if(pool == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Invalid pooler..");
			}
			
			return ResponseEntity.ok().body(pool);
	}
	
	@PutMapping("/{pool_id}")
	public ResponseEntity<Object> updatePool(
			@PathVariable("pool_id") Long pool_id,
			@RequestParam(value = "name", required = false) String name,
			@RequestParam(value = "neighborhood", required = false) String neighborhood,
			@RequestParam(value = "description", required = false) String description) 
	{	
			
			Pool pool = poolService.updatePoolInfo(pool_id, name, neighborhood, description);
			if(pool == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Pool does not exist..");
			}
			
			return ResponseEntity.ok().body(pool);
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<Object> deletePool(@PathVariable Long id) {
		try {
				Pool pool = new Pool();
				pool = poolService.deletePool(id);
				if (pool == null) {
					System.out.println("Invalid pool id... " + id);
					return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Pool does not exist... ");
				} else {
					List<Pooler> poolers = poolService.getPoolersInPool(id);
					if (poolers.size() > 1) {
			        	return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cannot delete pool while it still has pool members...");
			        }
				}
				System.out.println("Delete pool id... " + id);
				return ResponseEntity.ok().body(pool);
		} catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid parameters...");
		}
	}
	
	@PostMapping("/message")
    public ResponseEntity<Object> sendMessage(
    		@RequestParam(value = "receiver", required = true) String receiver,
    		@RequestParam(value = "sender", required = true) String sender,
			@RequestParam(value = "content", required = true) String content) throws IOException, MessagingException {
		String status;
		System.out.println( "To: "+ receiver + " , " +content + " From " + sender);
		status = sendEmailService.sendMessage(receiver, content, sender);
		return ResponseEntity.ok().body(status);
    }

	/**
	 * 
	 * @param sender, sender name
	 * @param name, receiver name
	 * @return
	 * @throws IOException
	 * @throws MessagingException
	 */
	@PostMapping("/refer")
    public ResponseEntity<Object> sendRefer(
    		@RequestParam(value = "sender", required = true) String sender,
    		@RequestParam(value = "name", required = true) String name) throws IOException, MessagingException {
		String status;
		System.out.println("sender: " + sender + " pooler_name: " + name);
		status = sendEmailService.sendRefer(name, sender);
		System.out.println("status: " + status );
		return ResponseEntity.ok().body(status);
    }
	
	/**
	 * 
	 * @param sender, sender name
	 * @param name, pooler receiver name
	 * @return
	 * @throws IOException
	 * @throws MessagingException
	 */
	@PostMapping("/refer/toleader")
    public ResponseEntity<Object> passReferToLeader(
    		@RequestParam(value = "sender_id", required = true) Long sender_id,
    		@RequestParam(value = "pooler_id", required = true) Long pooler_id) throws IOException, MessagingException {
		String status;
		System.out.println("sender: " +  sender_id + " pooler_name: " +  pooler_id);
		status = sendEmailService.passReferToLeader(sender_id,  pooler_id);
		System.out.println("status: " + status );
		return ResponseEntity.ok().body(status);
    }
	
	//for test purpose
	@PostMapping("/sendemail")
    public ResponseEntity<Object> sendEmail(
    		@RequestParam(value = "recipient", required = true) String recipient,
			@RequestParam(value = "subject", required = false) String subject,
			@RequestParam(value = "content", required = false) String content) throws IOException, MessagingException {
		
		if(recipient == null || recipient.isEmpty()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Missing required parameters...");
		} else if(!validEmail(recipient)) {
			System.out.println("Invalid Email..." + recipient);
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid email...");
		} 
		
		sendEmailService.sendEmail(recipient, subject, content);
		return ResponseEntity.ok().body("Email sent successfully");
    }

	
	private boolean validEmail(String email) {
		String regex = "^[\\w-_\\.+]*[\\w-_\\.]\\@([\\w]+\\.)+[\\w]+[\\w]$";
	    return email.matches(regex);
	}
	
	private boolean validZip(String zip) {
		if(zip == null || zip.isEmpty()) {return false;}
		String regex = "^[0-9]{5}(?:-[0-9]{4})?$";
	    return zip.matches(regex);
	}
}