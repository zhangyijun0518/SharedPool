package edu.sjsu.cmpe275.finalproject.model;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@DiscriminatorValue("pooler")
public class Pooler extends User{
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "pool_id", nullable = true)
	@JsonIgnoreProperties("leader")
	private Pool pool;
	
	@Column(name = "cscore", nullable = true)
	private Integer contributionScore ;
	
	@Column(name = "cstatus", nullable = true)
	private String contributionStatus;
	
	public Pooler() {
		setContribution(0);
	}
	
	public Pooler(String screenname, String nickname, String email) {
		super(screenname, nickname, email);
		setContribution(0);
	}
	
	public void setPool(Pool pool) {
		this.pool = pool;
	}
	
	public Pool getPool() {
		return pool;
	}
	
	public void setContribution(Integer score) {
		contributionScore = score;
		updateStatus(score);
		
	}
	
	public Integer getContributionScore() {
		return contributionScore;
	}
	
	public String getContributionStatus() {
		return contributionStatus;
	}
	
	private void updateStatus(Integer score) {
		if(Integer.compare(score, -4) <= 0 && Integer.compare(score, -6) > 0) {
			contributionStatus = "yellow";
		} else if (Integer.compare(score, -6) <= 0) {
			contributionStatus = "red";
		} else {
			contributionStatus = "normal";
		}
	}	

}