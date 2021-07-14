package edu.sjsu.cmpe275.finalproject.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import edu.sjsu.cmpe275.finalproject.model.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query(value = "SELECT * FROM cmpe275_cartShare.order_table WHERE pooler_id = ?1 ORDER BY date_created DESC", nativeQuery = true)
    List<Order> findAllByPoolerId(Long poolerId);

    @Query(value = "SELECT * FROM cmpe275_cartShare.order_table WHERE pool_id = ?1 AND store_id = ?2 AND status = 'OTHER_PICK_UP' AND pooler_id <> ?3 AND deliveryman_id IS NULL ORDER BY date_created DESC LIMIT 10", nativeQuery = true)
    List<Order> findFellowOrders(Long poolId, Long storeId, Long poolerId);

    @Query(value = "SELECT * FROM cmpe275_cartShare.order_table WHERE deliveryman_id = ?1 ORDER BY status DESC, store_id, date_created", nativeQuery = true)
    List<Order> findOrderByDeliveryMan(Long poolerId);

    @Query(value = "SELECT * FROM cmpe275_cartShare.order_table WHERE pooler_id = ?1 AND status = 'SELF_PICK_UP' ORDER BY store_id, date_created", nativeQuery = true)
    List<Order> findOrderForPickupByDeliveryMan(Long poolerId);

    @Query(value = "SELECT * FROM cmpe275_cartShare.order_table WHERE deliveryman_id = ?1 AND status = 'PICKED_UP_BY_OTHER' ORDER BY date_created", nativeQuery = true)
    List<Order> findOrderForDeliveryByDeliveryMan(Long poolerId);

    @Query(value = "SELECT * FROM cmpe275_cartShare.order_table WHERE deliveryman_id = ?1 AND status = 'DELIVERED' ORDER BY date_created DESC", nativeQuery = true)
    List<Order> findOrderDeliveredByDeliveryMan(Long poolerId);

    // @Query(value = "SELECT * FROM cmpe275_cartShare.order_table WHERE
    // deliveryman_id = ?1 AND (status = 'OTHER_PICK_UP' OR status = 'SELF_PICK_UP')
    // ORDER BY store, date_created", nativeQuery = true)
    // List<Order> findOrderForPickUpByDeliveryMan(Long poolerId);

    @Query(value = "SELECT deliveryman_id FROM cmpe275_cartShare.order_table WHERE id = ?1", nativeQuery = true)
    Long findDeliveryManIdByOrder(Long orderId);

    @Query(value = "SELECT pooler_id FROM cmpe275_cartShare.order_table WHERE id = ?1", nativeQuery = true)
    Long findPoolerIdByOrder(Long orderId);

    @Query(value = "SELECT o.* FROM cmpe275_cartShare.order_table o left join cmpe275_cartShare.order_item i on o.id = i.order_id WHERE o.status <> 'CANCELED' and o.status <> 'RECEIVED' and i.product_id = ?1", nativeQuery = true)
    List<Order> findOpenOrdersByProductId(Long ProductId);

    @Query(value = "SELECT o.* FROM cmpe275_cartShare.order_table o WHERE o.status <> 'CANCELED' and o.status <> 'RECEIVED' and o.store_id = ?1", nativeQuery = true)
    List<Order> findOpenOrdersByStoreId(Long StoreId);

}