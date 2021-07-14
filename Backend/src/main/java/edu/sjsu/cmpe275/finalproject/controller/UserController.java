package edu.sjsu.cmpe275.finalproject.controller;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.propertyeditors.StringTrimmerEditor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;

import edu.sjsu.cmpe275.finalproject.repository.UserRepository;
import edu.sjsu.cmpe275.finalproject.service.UserServiceImpl;
import edu.sjsu.cmpe275.finalproject.model.User;

@RestController
public class UserController {

	@Autowired
	private UserServiceImpl userService;
	
	//trim all request parameters
	@InitBinder
    public void initBinder ( WebDataBinder binder )
    {
        StringTrimmerEditor stringtrimmer = new StringTrimmerEditor(true);
        binder.registerCustomEditor(String.class, stringtrimmer);
    }
	
	@GetMapping("/")
	public String index()
	{
		return "Spring 2020 CMPE275 Term Project Canvas Group 7. Group members: Min Lu, Xiaosa Yang, Yijun Zhang, Sijia Zong.";	
	}
	
    // Get All Sponsors
    @GetMapping("/users")
    public List<User> getAllUsers()
    {
    	return userService.getAllUsers();
    }
    
    @PostMapping("/user")
    public ResponseEntity<Object> createUser(
    		@RequestParam(value = "screenname", required = false) String screenname,
			@RequestParam(value = "nickname", required = false) String nickname,
			@RequestParam(value = "email", required = false) String email)
//    		@RequestBody String screenname, String nickname, String email)
//			@RequestParamString nickname),
//			@RequestParam(value = "email", required = false) String email)
    {
    	System.out.print("screenname:---" + screenname);
    	System.out.print("nname:---" + nickname);
    	System.out.print("email:----" + email);
    	if(screenname == null || nickname == null || email == null) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Missing required parameters...");
		}
    	
		User usr = userService.createUser(screenname, nickname, email);
		System.out.println("end。。。");
		return ResponseEntity.ok().body(usr);
  
    }
    
    @GetMapping("/user/email")
    public ResponseEntity<Object> getUserByEmail(
    		@RequestParam(value = "email", required = true) String email)
    {
    	User usr = userService.findUserByEmail(email);
    	if (usr ==  null) {
    		//return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Email does not exist");
    	  return null;
    	}
    	else{
		  	System.out.print(usr);
		    return ResponseEntity.ok().body(usr);
    	}
    }
    
    @GetMapping("/user/screenname")
    public ResponseEntity<Object> getUserByScreenname(
    		@RequestParam(name = "screenname", required = true) String screenname) 
    {
    	User usr = userService.findUserByScreenname(screenname);
        if (usr == null) {
            //return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Screenname does not exist");
        	return null;
        } else {
            return ResponseEntity.ok().body(usr);
        }
    }
    
    @GetMapping("/user/nickname")
    public ResponseEntity<Object> getUserByNickname(
    		@RequestParam(name = "nickname", required = true) String nickname) 
    {
    	User usr = userService.findUserByNickname(nickname);
        if (usr == null) {
            //return ResponseEntity.status(HttpStatus.NOT_FOUND).body(" Nickname does not exist");
        	return null;
        } else {
            return ResponseEntity.ok().body(usr);
        }
    }
    
    @PutMapping("/user/{email}")
    public ResponseEntity<Object> updateUserNicknamebyEmail(
    		@PathVariable(name = "email", required = true) String email,
			@RequestParam(value = "nickname", required = true) String nickname)
    {

		if (userService.findUserByEmail(email)== null){
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email does not exist");
		}
		if (userService.findUserByNickname(nickname) != null){
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Nickname already exist");
		}
		User usr = userService.updateUserNickname(email, nickname);
        return ResponseEntity.ok().body(usr);
    }
	
}
