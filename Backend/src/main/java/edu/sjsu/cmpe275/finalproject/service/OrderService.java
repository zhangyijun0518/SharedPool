package edu.sjsu.cmpe275.finalproject.service;

import java.util.List;
import edu.sjsu.cmpe275.finalproject.model.Address;
import edu.sjsu.cmpe275.finalproject.model.Order;
import edu.sjsu.cmpe275.finalproject.model.OrderItem;

public interface OrderService {

    public List<Order> getAllOrdersByPooler(Long poolerId);

    public Order getOrderById(Long orderId);

    public Order assignOrderToCompanionOrder(Long orderId, Long poolerId, Long companionOrderId);

    public Order chooseSelfPickUp(Long orderId);

    public Order chooseOtherPickUp(Long orderId, Address address);

    public List<Order> getFellowOrders(Long orderId);

    public List<Order> chooseToPickUpOrderBySelf(Long orderId);

    public List<Order> getPickUpOrdersByPooler(Long poolerId);

    public List<Order> getDeliveryOrdersByPooler(Long poolerId);

    public List<Order> getDeliveredOrdersByPooler(Long poolerId);

    public Order markPickedUp(Long poolerId, Long orderId);

    public Order markDelivered(Long orderId);

    public Order markNotDelivered(Long orderId);

    public List<Order> getAllOrders();

    public List<OrderItem> getOrderItemsById(Long orderId);

    public Order markReceived(Long orderId);

    public Order assignOrdersToPooler(List<Long> orderIds, Long poolerId);

    public List<Long> getPickUpOrdersId(Long orderId);

    public List<Order> getOpenOrdersByProductId(Long productId);

    public List<Order> getOpenOrdersByStoreId(Long storeId);
}