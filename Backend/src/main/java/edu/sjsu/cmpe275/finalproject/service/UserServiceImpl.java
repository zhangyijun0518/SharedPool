package edu.sjsu.cmpe275.finalproject.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import edu.sjsu.cmpe275.finalproject.model.Pooler;
import edu.sjsu.cmpe275.finalproject.model.User;
import edu.sjsu.cmpe275.finalproject.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService{
	
	@Autowired
	private UserRepository userRepo;
	
	@Override
	public List<User> getAllUsers(){
		return userRepo.findAll();
	}
	
	@Override
	public User createUser(String screenname, String nickname, String email){
//		String userType;
		String adminEmailDomain = "sjsu.edu";
		String emailDomain = email.substring(email.indexOf("@")+1);
		User usr;
		//System.out.println(emailDomain);
		if(emailDomain.equalsIgnoreCase(adminEmailDomain)){
//			userType = "admin";
			usr = new User(screenname, nickname, email);		
		} else {
//			userType = "pooler";
			usr = new Pooler(screenname, nickname, email);
		}
		return userRepo.save(usr);
	}
	
	@Override
	public User findUserByEmail(String email){
		return userRepo.findByEmailAddress(email);
	}
	
	@Override
	public User findUserByScreenname(String screenname){
		return userRepo.findByScreenname(screenname);
	}
	
	@Override
	public User findUserByNickname(String nickname){
		return userRepo.findByNickname(nickname);
	}
	
	@Override
	public User updateUserNickname(String email, String nickname){
		User userNicknameTobeChanged= findUserByEmail(email);
		if(userNicknameTobeChanged != null){
			userNicknameTobeChanged.setNickname(nickname);
		}
        return userRepo.save(userNicknameTobeChanged);
	}

}
