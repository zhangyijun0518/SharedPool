package edu.sjsu.cmpe275.finalproject.model;


import javax.persistence.*;
import java.util.Set;
import java.util.HashSet;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@Entity
@Table(name = "products", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"sku", "store_id"})})
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sku")
    private String sku;

    private Long sid;
    private String sname;
    private String simage;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "imageUrl", nullable = false)
    private String imageUrl;

    @Column(name = "brand", nullable = false)
    private String brand;

    @Column(name = "unit", nullable = false)
    private String unit;

    @Column(name = "price", nullable = false)
    private double price;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "store_id", nullable = true)
    @OnDelete(action = OnDeleteAction.NO_ACTION)
    @JsonIgnore
    private Store store;

    // default constructor
    public Product(){}

    public Product(Product p) {
        this.sku = p.getSku();
        this.productName = p.getProductName();
        this.description = p.getDescription();
        this.imageUrl = p.getImageUrl();
        this.brand = p.getBrand();
        this.unit = p.getUnit();
        this.price = p.getPrice();
    }

    public Product(String sku, String productName, String description, String imageUrl, String brand, String unit, double price){
        this.sku = sku;
        this.productName = productName;
        this.description = description;
        this.imageUrl = imageUrl;
        this.brand = brand;
        this.unit = unit;
        this.price = price;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public String getSku() {
        return sku;
    }

    public String getSname() {
        return sname;
    }

    public void setSname(String sname) {
        this.sname = sname;
    }

    public String getSimage() {
        return simage;
    }

    public void setSimage(String simage) {
        this.simage = simage;
    }

    public Long getSid() {
        return sid;
    }

    public void setSid(Long sid) {
        this.sid = sid;
    }

    public String getProductName() {
        return productName;
    }

    public String getDescription() {
        return description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public String getBrand() {
        return brand;
    }

    public String getUnit() {
        return unit;
    }

    public double getPrice() {
        return price;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public void setBrand(String brand) {
        this.brand = brand;
}

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public void setPrice(double price) {
        this.price = price;
    }

	public void setStore(Store sto) {
		this.store = sto;
		this.setSid(sto.getId());
		this.setSimage(sto.getImage());
		this.setSname(sto.getStoreName());
    }

    public Store getStore() {
        return store;
    }

    public Long getId() {
        return id;
    }

    @Override
    public String toString() {
        return "Product{" +
                "id=" + id +
                ", sku='" + sku + '\'' +
                ", sid=" + sid +
                ", sname='" + sname + '\'' +
                ", simage='" + simage + '\'' +
                ", productName='" + productName + '\'' +
                ", description='" + description + '\'' +
                ", imageUrl='" + imageUrl + '\'' +
                ", brand='" + brand + '\'' +
                ", unit='" + unit + '\'' +
                ", price=" + price +
                ", store=" + store +
                '}';
    }
}