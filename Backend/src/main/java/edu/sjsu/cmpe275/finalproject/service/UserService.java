package edu.sjsu.cmpe275.finalproject.service;

import java.util.List;
import edu.sjsu.cmpe275.finalproject.model.User;

public interface UserService {
	
	public List<User> getAllUsers();
	public User createUser(String screenname, String nickname, String email);
	public User findUserByEmail(String email);
	public User findUserByScreenname(String screenname);
	public User findUserByNickname(String nickname);
	public User updateUserNickname(String email, String nickname);
	
}
