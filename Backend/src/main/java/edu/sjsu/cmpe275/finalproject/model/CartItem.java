package edu.sjsu.cmpe275.finalproject.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "cart_item")
public class CartItem {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "id")
	private Long id;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "pooler_id", nullable = false)
	@JsonIgnore
	private Pooler pooler;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "product_id", nullable = false)
	@JsonIgnoreProperties("cartItems")
	private Product product;

	@Column(name = "quantity", nullable = false)
	private int quantity;

	public CartItem() {
	}

	public CartItem(Pooler pooler, Product product, int quantity) {
		this.pooler = pooler;
		this.product = product;
		this.quantity = quantity;
	}

	public Long getId() {
		return this.id;
	}

	// public void setId(Long id) {
	// this.id = id;
	// }

	public Pooler getPooler() {
		return this.pooler;
	}

	public void setPooler(Pooler pooler) {
		this.pooler = pooler;
	}

	public Product getProduct() {
		return this.product;
	}

	public void setProduct(Product product) {
		this.product = product;
	}

	public int getquantity() {
		return quantity;
	}

	public void setquantity(int quantity) {
		this.quantity = quantity;
	}
}