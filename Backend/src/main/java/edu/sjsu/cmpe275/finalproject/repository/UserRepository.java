package edu.sjsu.cmpe275.finalproject.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import edu.sjsu.cmpe275.finalproject.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
	  @Query("select u from User u where u.email = ?1")
	  User findByEmailAddress(String emailAddress);
	  @Query("select u from User u where u.screenname = ?1")
	  User findByScreenname(String screename);
	  @Query("select u from User u where u.nickname = ?1")
	  User findByNickname(String nickname);
//	@Query(value = "SELECT * FROM cmpe275_cartShare.user WHERE email = ?1", nativeQuery = true)
//	//@Query("select u from User u where u.email = ?1")
//	User findByEmailAddress(String emailAddress);
//	  
//	@Query(value = "SELECT * FROM cmpe275_cartShare.user WHERE screenname = ?1", nativeQuery = true)
//	//@Query("select u from User u where u.screenname = ?1")
//	User findByScreenname(String screename);
//	
//	@Query(value = "SELECT * FROM cmpe275_cartShare.user WHERE nickname = ?1", nativeQuery = true)
//	//@Query("select u from User u where u.nickname = ?1")
//	User findByNickname(String nickname);
}
