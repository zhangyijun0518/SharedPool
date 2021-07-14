package edu.sjsu.cmpe275.finalproject.model;

import javax.persistence.*;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "type")
@DiscriminatorValue("admin")
@Table(name = "user", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"screenname","nickname","email"})})
public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "id")
	private Long id;
	
	@Column(name = "screenname", nullable = false)
	private String screenname;
	
	@Column(name = "nickname", nullable = false)
	private String nickname;
	
	@Column(name = "email", nullable = false)
	private String email;
	
//	@Column(name = "type")
//	private String userType;
	
	// default constructor
	public User(){}
	
	public User(String screenname, String nickname, String email){
		this.screenname = screenname;
		this.nickname = nickname;
		this.email = email;
//		this.userType = userType;
	}
	
	public Long getId() {
		return id;
	}
	
	public void setNickname(String nickname){
		this.nickname = nickname;
	}
	
//	public void setUserType(String type){
//		this.userType = type;  //"Pooler" or "Admin"
//	}
//	
	public String getScreenname(){
		return screenname;
	}
	
	public String getNickname(){
		return nickname;
	}
	
//	public String getUserType(){
//		return userType;
//	}
	
	public String getEmail(){
		return email;
	}

}