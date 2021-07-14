package edu.sjsu.cmpe275.finalproject.model;


import java.util.ArrayList;
import java.util.Set;
import java.util.HashSet;
import javax.persistence.*;

@Entity
@Table(name = "stores", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"store_name"})})
public class Store {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "store_name", nullable = false)
    private String storeName;

    @Column(name = "store_address", nullable = false)
    private Address storeAddress;

    @Column(name = "image", nullable = false)
    private String image;

    public Store() {}
    public Store(String name, String image, Address address) {
        this.storeName = name;
        this.image = image;
        this.storeAddress = address;
    }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public void setStoreName(String storeName){
        this.storeName = storeName;
    }

    public void setStoreAddress(Address storeAddress){
        this.storeAddress = storeAddress;
    }

    public String getStoreName(){
        return storeName;
    }

    public Address getStoreAddress(){
        return storeAddress;
    }

    public Long getId() {
        return id;
    }

    @OneToMany(mappedBy = "store", fetch = FetchType.LAZY,
            cascade = CascadeType.ALL)
    private Set<Product> products;

    public Set<Product> getProducts() {
        return products;
    }

    public void setProducts(Set<Product> products) {
        this.products = products;
    }

    @Override
    public String toString() {
        return "Store{" +
                "id=" + id +
                ", storeName='" + storeName + '\'' +
                ", storeAddress=" + storeAddress +
                ", image='" + image + '\'' +
                '}';
    }
}