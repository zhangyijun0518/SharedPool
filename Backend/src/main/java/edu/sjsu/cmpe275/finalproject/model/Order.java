package edu.sjsu.cmpe275.finalproject.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "order_table")
public class Order {
    public enum Status {
        PLACED, SELF_PICK_UP, OTHER_PICK_UP, PICKED_UP_BY_SELF, PICKED_UP_BY_OTHER, CANCELED, DELIVERED, NOT_DELIVERED,
        RECEIVED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "pooler_id", nullable = false)
    @JsonIgnoreProperties("pool")
    private Pooler pooler;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "pool_id", nullable = false)
    private Pool pool;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "store_id", nullable = false)
    @JsonIgnoreProperties("products")
    private Store store;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status;

    @Column(name = "date_created", nullable = false)
    private LocalDateTime dateCreated;

    @OneToMany(mappedBy = "order")
    // @JsonIgnore
    private List<OrderItem> orderItems = new ArrayList<>();

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "deliveryman_id", nullable = true)
    // @JsonIgnoreProperties({"package","order"})
    private Pooler deliveryman = null;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "companion_order_id", nullable = true)
    @JsonIgnore
    private Order companionOrder = null;

    @OneToMany(mappedBy = "companionOrder")
    @JsonIgnoreProperties({ "pooler", "pool", "store", "orderItems", "deliveryman", "companionOrder", "fellowOrders",
            "address", "subtotal", "total", "tax", "fee" })
    private List<Order> fellowOrders = null;

    @Column(name = "address", nullable = true)
    private Address address = new Address();

    @Column(name = "subtotal", nullable = false)
    private double subtotal = 0;

    @Column(name = "tax", nullable = false)
    private double tax = 0;

    @Column(name = "fee", nullable = false)
    private double fee = 0;

    @Column(name = "total", nullable = false)
    private double total = 0;

    public Order() {

    }

    public Order(Pooler pooler, Pool pool, Store store, Status status, LocalDateTime dateCreated, double subtotal,
            double tax, double fee, double total) {
        this.pooler = pooler;
        this.pool = pool;
        this.store = store;
        this.status = status;
        this.dateCreated = dateCreated;
        this.subtotal = subtotal;
        this.tax = tax;
        this.fee = fee;
        this.total = total;
    }

    public Long getId() {
        return id;
    }

    public Pooler getPooler() {
        return pooler;
    }

    public void setPooler(Pooler pooler) {
        this.pooler = pooler;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public List<OrderItem> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }

    public Store getStore() {
        return store;
    }

    public void setStore(Store store) {
        this.store = store;
    }

    public Pooler getDeliveryman() {
        return deliveryman;
    }

    public void setDeliveryman(Pooler deliveryman) {
        this.deliveryman = deliveryman;
    }

    public LocalDateTime getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(LocalDateTime dateCreated) {
        this.dateCreated = dateCreated;
    }

    public Pool getPool() {
        return pool;
    }

    public void setPool(Pool pool) {
        this.pool = pool;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public double getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(double subtotal) {
        this.subtotal = subtotal;
    }

    public double getTax() {
        return tax;
    }

    public void setTax(double tax) {
        this.tax = tax;
    }

    public double getFee() {
        return fee;
    }

    public void setFee(double fee) {
        this.fee = fee;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }

    public Order getCompanionOrder() {
        return companionOrder;
    }

    public void setCompanionOrder(Order companionOrder) {
        this.companionOrder = companionOrder;
    }

    public List<Order> getFellowOrders() {
        return fellowOrders;
    }

    public void setFellowOrders(List<Order> fellowOrders) {
        this.fellowOrders = fellowOrders;
    }

}
