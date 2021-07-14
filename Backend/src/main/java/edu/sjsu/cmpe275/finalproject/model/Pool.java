package edu.sjsu.cmpe275.finalproject.model;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "pool", uniqueConstraints = {
        @UniqueConstraint(columnNames = "name")})
public class Pool {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "pool_id")
	private Long pool_id;
	
	@Column(name = "name", nullable = false)
	private String name;
	
	@Column(name = "neighborhood")
	private String neighborhood; 
	
	@Column(name = "dscrp")
	private String dscrp;
	
	@Column(name = "zip", nullable = false)
	private String zip;
	
//	@OneToMany(fetch = FetchType.EAGER)
//	@JoinColumn(name = "pooler_id", nullable = false)
//	@JsonIgnoreProperties("pool")
//	private List<Pooler> poolers;
	
	@OneToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "pooler_id", nullable = false)
	@JsonIgnoreProperties("pool")
	private Pooler leader;
	
	public Pool() {
		this.leader = new Pooler();
//		this.poolers = new ArrayList<>();
	}
	
	public Pool(Pooler leader, String name, String zip) {
		this.leader = leader;
		this.name = name;
		this.zip = zip;
//		this.poolers = new ArrayList<>();
	} 
	
	public Long getId() {
		return pool_id;
	}
	
	public void setName(String name) {
		this.name = name;
	} 
	
	public String getName() {
		return name;
	}
	
	public void setNeighborhood(String neighborhood) {
		this.neighborhood = neighborhood;
	}
	
	public String getNeighborhood() {
		return neighborhood;
	}
	
	public void setDescription(String description) {
		this.dscrp = description;
	}
	
	public String getDescription() {
		return dscrp;
	}
	
	public String getZip() {
		return zip;
	}
	
	public Pooler getLeader() {
		return leader;
	}
	
//	public void setPooler(List<Pooler> pooler) {
//		this.poolers = pooler;
//	}
//	
//	public List<Pooler> getPoolers(){
//		return poolers;
//	}
}