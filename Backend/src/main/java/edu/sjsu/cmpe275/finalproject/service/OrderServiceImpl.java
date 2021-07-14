package edu.sjsu.cmpe275.finalproject.service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.sjsu.cmpe275.finalproject.model.Address;
import edu.sjsu.cmpe275.finalproject.model.Order;
import edu.sjsu.cmpe275.finalproject.model.OrderItem;
import edu.sjsu.cmpe275.finalproject.model.Pool;
import edu.sjsu.cmpe275.finalproject.model.Pooler;
import edu.sjsu.cmpe275.finalproject.model.Store;
import edu.sjsu.cmpe275.finalproject.repository.OrderRepository;
import edu.sjsu.cmpe275.finalproject.repository.PoolerRepository;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepo;

    @Autowired
    private PoolerRepository poolerRepo;

    private PoolerService poolerService;

    @Autowired
    public void setPoolerService(PoolerService poolerService) {
        this.poolerService = poolerService;
    }

    public List<Order> getAllOrdersByPooler(Long poolerId) {
        // checking for outdated order and update status to canceled
        List<Order> orders = orderRepo.findAllByPoolerId(poolerId);
        for (Order order : orders) {
            if (order.getStatus() == Order.Status.PLACED && isTwoDaysAgo(order.getDateCreated())) {
                order.setStatus(Order.Status.CANCELED);
                orderRepo.save(order);
            }
        }
        return orders;
    }

    private boolean isTwoDaysAgo(LocalDateTime orderCreatedTime) {
        LocalDateTime current = LocalDateTime.now();
        Duration duration = Duration.between(orderCreatedTime, current);
        return (duration.toDays() > 2) ? true : false;
    }

    public Order getOrderById(Long orderId) {
        return orderRepo.findById(orderId).orElse(null);
    }

    public Order assignOrderToCompanionOrder(Long orderId, Long poolerId, Long companionOrderId) {
        Order order = getOrderById(orderId);
        Order companionOrder = getOrderById(companionOrderId);
        Pooler pooler = poolerRepo.findById(poolerId).orElse(null);
        order.setDeliveryman(pooler);
        order.setCompanionOrder(companionOrder);
        return orderRepo.save(order);
    }

    public Order chooseSelfPickUp(Long orderId) {
        Order order = getOrderById(orderId);
        order.setStatus(Order.Status.SELF_PICK_UP);
        return orderRepo.save(order);
    }

    public Order chooseOtherPickUp(Long orderId, Address address) {
        Order order = getOrderById(orderId);
        order.setStatus(Order.Status.OTHER_PICK_UP);
        order.setAddress(address);
        return orderRepo.save(order);
    }

    public List<Order> getFellowOrders(Long orderId) {
        Order order = getOrderById(orderId);
        Pool pool = order.getPool();
        Store store = order.getStore();
        Pooler pooler = order.getPooler();
        List<Order> fellowOrders = orderRepo.findFellowOrders(pool.getId(), store.getId(), pooler.getId());
        return fellowOrders;
    }

    public List<Order> chooseToPickUpOrderBySelf(Long orderId) {
        chooseSelfPickUp(orderId);
        List<Order> orders = getFellowOrders(orderId);
        return orders;
    }

    public List<Order> getPickUpOrdersByPooler(Long poolerId) {
        List<Order> orders = orderRepo.findOrderForPickupByDeliveryMan(poolerId);
        return orders;
    }

    public List<Order> getDeliveryOrdersByPooler(Long poolerId) {
        List<Order> orders = orderRepo.findOrderForDeliveryByDeliveryMan(poolerId);
        return orders;
    }

    public List<Order> getDeliveredOrdersByPooler(Long poolerId) {
        List<Order> orders = orderRepo.findOrderDeliveredByDeliveryMan(poolerId);
        return orders;
    }

    public Order markPickedUp(Long poolerId, Long orderId) {
        Order order = getOrderById(orderId);
        Long deliverymanId = orderRepo.findDeliveryManIdByOrder(orderId);
        Long ownerId = orderRepo.findPoolerIdByOrder(orderId);
        if (deliverymanId == null && poolerId == ownerId) {
            order.setStatus(Order.Status.PICKED_UP_BY_SELF);
        } else if (deliverymanId == poolerId) {
            order.setStatus(Order.Status.PICKED_UP_BY_OTHER);
        }
        return orderRepo.save(order);
    }

    public Order markDelivered(Long orderId) {
        Order order = getOrderById(orderId);
        Long receiver = order.getPooler().getId();
        Long deliverer = order.getDeliveryman().getId();
        poolerService.updatePoolerScore(receiver, -1);
        poolerService.updatePoolerScore(deliverer, 1);
        if (order.getStatus() == Order.Status.PICKED_UP_BY_OTHER) {
            order.setStatus(Order.Status.DELIVERED);
            return orderRepo.save(order);
        } else {
            return null;
        }
    }

    public Order markNotDelivered(Long orderId) {
        Order order = getOrderById(orderId);
        if (order.getStatus() == Order.Status.DELIVERED) {
            order.setStatus(Order.Status.NOT_DELIVERED);
            return orderRepo.save(order);
        } else {
            return null;
        }
    }

    public List<Order> getAllOrders() {
        return orderRepo.findAll();
    }

    public List<OrderItem> getOrderItemsById(Long orderId) {
        Order order = orderRepo.findById(orderId).orElse(null);
        return order.getOrderItems();
    }

    public Order markReceived(Long orderId) {
        Order order = getOrderById(orderId);
        if (order.getStatus() == Order.Status.DELIVERED) {
            order.setStatus(Order.Status.RECEIVED);
            return orderRepo.save(order);
        } else {
            return null;
        }
    }

    public Order assignOrdersToPooler(List<Long> orderIds, Long poolerId) {
        return null;
    }

    public List<Long> getPickUpOrdersId(Long orderId) {
        Order order = orderRepo.findById(orderId).orElse(null);
        List<Long> orderIds = new ArrayList<>();
        if (order != null) {
            orderIds.add(order.getId());
            for (Order fellowOrder : order.getFellowOrders()) {
                orderIds.add(fellowOrder.getId());
            }
        }
        return orderIds;
    }

    public List<Order> getOpenOrdersByProductId(Long productId) {
        return orderRepo.findOpenOrdersByProductId(productId);
    }

    public List<Order> getOpenOrdersByStoreId(Long storeId) {
        return orderRepo.findOpenOrdersByStoreId(storeId);
    }

}