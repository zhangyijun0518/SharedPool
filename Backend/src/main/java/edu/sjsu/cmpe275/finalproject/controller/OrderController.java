package edu.sjsu.cmpe275.finalproject.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.mail.MessagingException;
import javax.mail.internet.AddressException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import edu.sjsu.cmpe275.finalproject.model.Address;
import edu.sjsu.cmpe275.finalproject.model.Order;
import edu.sjsu.cmpe275.finalproject.model.OrderItem;
import edu.sjsu.cmpe275.finalproject.service.OrderService;
import edu.sjsu.cmpe275.finalproject.service.SendEmailService;

@RestController
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private SendEmailService emailService;

    // get all order
    @GetMapping("/orders")
    public ResponseEntity<Object> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok().body(orders);
    }

    // get pooler's order list
    @GetMapping("/orders/{poolerId}")
    public ResponseEntity<Object> getOrdersByName(@PathVariable(name = "poolerId", required = true) Long poolerId) {
        List<Order> orders = orderService.getAllOrdersByPooler(poolerId);
        if (orders == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("The pooler does not have any order yet");
        } else {
            return ResponseEntity.ok().body(orders);
        }
    }

    // get basic order information for pick up by order id
    @GetMapping("/order/{orderId}")
    public ResponseEntity<Object> getOrderById(@PathVariable(name = "orderId", required = true) Long orderId) {
        Order order = orderService.getOrderById(orderId);
        if (order == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("This order does not exsit");
        } else {
            HashMap<String, String> orderInfo = new HashMap<>();
            orderInfo.put("OrderId", order.getId().toString());
            orderInfo.put("Store Name", order.getStore().getStoreName());
            orderInfo.put("Store Address", order.getStore().getStoreAddress().getAddress());
            orderInfo.put("Date Placed", order.getDateCreated().toString());
            return ResponseEntity.ok().body(orderInfo);
        }
    }

    // get order items by order id
    @GetMapping("/orderitems/{orderId}")
    public ResponseEntity<Object> getOrderItemsById(@PathVariable(name = "orderId", required = true) Long orderId) {
        List<OrderItem> orderItems = orderService.getOrderItemsById(orderId);
        if (orderItems == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("This order does not contain any item");
        } else {
            return ResponseEntity.ok().body(orderItems);
        }
    }

    @GetMapping("/pickUpOrders/{poolerId}")
    public ResponseEntity<Object> getPickUpOrdersByPooler(
            @PathVariable(name = "poolerId", required = true) Long poolerId) {
        List<Order> pickUpOrders = orderService.getPickUpOrdersByPooler(poolerId);
        return ResponseEntity.ok().body(pickUpOrders);
    }

    @GetMapping("/deliveryOrders/{poolerId}")
    public ResponseEntity<Object> getDeliveryOrdersByPooler(
            @PathVariable(name = "poolerId", required = true) Long poolerId) {
        List<Order> deliveryOrders = orderService.getDeliveryOrdersByPooler(poolerId);
        return ResponseEntity.ok().body(deliveryOrders);
    }

    @GetMapping("/deliveredOrders/{poolerId}")
    public ResponseEntity<Object> getDeliveredOrdersByPooler(
            @PathVariable(name = "poolerId", required = true) Long poolerId) {
        List<Order> deliveredOrders = orderService.getDeliveredOrdersByPooler(poolerId);
        return ResponseEntity.ok().body(deliveredOrders);
    }

    // assign multiple orders pick up
    @PutMapping("/assignorders")
    public ResponseEntity<Object> assignOrdersToPooler(@RequestParam(value = "poolerId", required = true) Long poolerId,
            @RequestParam(value = "orderIds", required = true) List<Long> orderIds)
            throws AddressException, IOException, MessagingException {

        // the first order id is the pooler's own order
        List<Order> ordersToPickUp = new ArrayList<Order>();
        for (Long orderId : orderIds) {
            if (orderId == orderIds.get(0)) {
                orderService.chooseSelfPickUp(orderId);
                ordersToPickUp.add(orderService.getOrderById(orderId));
            } else {
                Order updatedOrder = orderService.assignOrderToCompanionOrder(orderId, poolerId, orderIds.get(0));
                ordersToPickUp.add(updatedOrder);
            }
        }
        emailService.sendPickUpOrderConfirmation(poolerId, ordersToPickUp);
        return ResponseEntity.ok().body(ordersToPickUp);
    }

    // @PutMapping("/choosepickupbyself/{orderId}")
    // public ResponseEntity<Object> chooseToPickUpOrderBySelf(
    // @PathVariable(name = "orderId", required = true) Long orderId) {
    // List<Order> otherOrders = orderService.chooseToPickUpOrderBySelf(orderId);
    // return ResponseEntity.ok().body(otherOrders);
    // }

    @GetMapping("/getFellowOrders/{orderId}")
    public ResponseEntity<Object> getFellowOrders(@PathVariable(name = "orderId", required = true) Long orderId) {
        List<Order> fellowOrders = orderService.getFellowOrders(orderId);
        return ResponseEntity.ok().body(fellowOrders);
    }

    @GetMapping("/chooseotherpickup/{orderId}")
    public ResponseEntity<Object> chooseToPickUpOrderByOther(
            @PathVariable(name = "orderId", required = true) Long orderId,
            @RequestParam(value = "street", required = true) String street,
            @RequestParam(value = "city", required = true) String city,
            @RequestParam(value = "state", required = true) String state,
            @RequestParam(value = "zip", required = true) String zip)
            throws AddressException, IOException, MessagingException {
        Address address = new Address(street, city, state, zip);
        Order order = orderService.chooseOtherPickUp(orderId, address);
        Long receiverId = order.getPooler().getId();
        emailService.sendOrderStatusNotification(receiverId, orderId, Order.Status.OTHER_PICK_UP);
        return ResponseEntity.ok().body(order);
    }

    /**
     * when order is picked by pooler
     * 
     * @param poolerId
     * @param orderId
     * @return
     * @throws MessagingException
     * @throws IOException
     * @throws AddressException
     */
    @PutMapping("/pickedup")
    public ResponseEntity<Object> pickedUpOrder(@RequestParam(value = "poolerId", required = true) Long poolerId,
            @RequestParam(value = "orderId", required = true) Long orderId)
            throws AddressException, IOException, MessagingException {
        Order pickedUpOrder = orderService.markPickedUp(poolerId, orderId);
        Long ownerId = pickedUpOrder.getPooler().getId();
        Order.Status status = pickedUpOrder.getStatus();
        emailService.sendOrderStatusNotification(ownerId, orderId, status);
        // get fellow orders and marked pick up
        List<Order> fellowOrders = pickedUpOrder.getFellowOrders();
        if (fellowOrders.size() > 0) {
            for (Order fellowOrder : fellowOrders) {
                Long fellowOrderId = fellowOrder.getId();
                Order pickedUpFellowOrder = orderService.markPickedUp(poolerId, fellowOrderId);
                Long fellowId = pickedUpFellowOrder.getPooler().getId();
                Order.Status fellowStatus = pickedUpFellowOrder.getStatus();
                emailService.sendOrderStatusNotification(fellowId, fellowOrderId, fellowStatus);
            }
            emailService.sendDeliveryInstruction(poolerId, fellowOrders);
        }
        return ResponseEntity.ok().body(pickedUpOrder);
    }

    @GetMapping("/qrcode/{orderId}")
    public ResponseEntity<Object> pickedUpOrder(@PathVariable(name = "orderId", required = true) Long orderId) {
        List<Long> orderIds = orderService.getPickUpOrdersId(orderId);
        return ResponseEntity.ok().body("The order Id related to this pick up order are: " + orderIds.toString());
    }

    @PutMapping("/delivered/{orderId}")
    public ResponseEntity<Object> deliverOrder(@PathVariable(name = "orderId", required = true) Long orderId)
            throws AddressException, IOException, MessagingException {
        Order deliveredOrder = orderService.markDelivered(orderId);
        Long receiverId = deliveredOrder.getPooler().getId();
        emailService.sendOrderStatusNotification(receiverId, orderId, Order.Status.DELIVERED);
        return ResponseEntity.ok().body(deliveredOrder);
    }

    @PutMapping("/notdelivered/{orderId}")
    public ResponseEntity<Object> notDeliveredOrder(@PathVariable(name = "orderId", required = true) Long orderId)
            throws AddressException, IOException, MessagingException {
        Order notDeliveredOrder = orderService.markNotDelivered(orderId);
        if (notDeliveredOrder != null) {
            Long receiverId = notDeliveredOrder.getDeliveryman().getId();
            emailService.sendOrderStatusNotification(receiverId, orderId, Order.Status.NOT_DELIVERED);
            return ResponseEntity.ok().body(notDeliveredOrder);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No such delivered order found");
        }
    }

    @PutMapping("/received/{orderId}")
    public ResponseEntity<Object> receivedOrder(@PathVariable(name = "orderId", required = true) Long orderId) {
        Order receivedOrder = orderService.markReceived(orderId);
        if (receivedOrder != null) {
            return ResponseEntity.ok().body(receivedOrder);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No such delivered order found");
        }
    }

    // get all order of products
    @GetMapping("/openorders_p")
    public ResponseEntity<Object> getOpenOrdersByProductId(@RequestParam(name = "productId", required = true) Long productId) {
        List<Order> orders = orderService.getOpenOrdersByProductId(productId);
        return ResponseEntity.ok().body(orders);
    }

    // get all order of products
    @GetMapping("/openorders_s")
    public ResponseEntity<Object> getOpenOrdersByStoreId(@RequestParam(name = "storeId", required = true) Long storeId) {
        List<Order> orders = orderService.getOpenOrdersByStoreId(storeId);
        return ResponseEntity.ok().body(orders);
    }
}