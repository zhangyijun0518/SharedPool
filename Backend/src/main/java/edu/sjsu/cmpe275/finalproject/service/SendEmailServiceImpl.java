package edu.sjsu.cmpe275.finalproject.service;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Properties;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import edu.sjsu.cmpe275.finalproject.model.Address;
import edu.sjsu.cmpe275.finalproject.model.Order;
import edu.sjsu.cmpe275.finalproject.model.OrderItem;
import edu.sjsu.cmpe275.finalproject.model.Pooler;
import edu.sjsu.cmpe275.finalproject.model.Pool;
import edu.sjsu.cmpe275.finalproject.model.Product;
import edu.sjsu.cmpe275.finalproject.repository.OrderRepository;
import edu.sjsu.cmpe275.finalproject.repository.PoolerRepository;

@Service
public class SendEmailServiceImpl implements SendEmailService{

	@Autowired
	private PoolerRepository poolerRepo;

	@Autowired
	private OrderRepository orderRepo;

//	private String pathUrl = "http://localhost:3000/";
	
	private String pathUrl = "http://zhangyijun.me:3000/";
	
	public String sendMessage(String receiver, String msg, String sender_name)
			throws IOException, AddressException, MessagingException {
		String status = "Message sent successfully via Email";
		Pooler pooler = poolerRepo.findPoolerByScreenname(receiver);
		if (pooler != null) {
			String email = pooler.getEmail();
			String subject = "Cart Share: You have a message from the neighbor!";
			String message = "From " + sender_name + " : \n" + msg;
			// with a page link to response to the message?
			sendEmail(email, subject, message);
		} else {
			status = "Cannot send message to pooler...";
		}

		return status;

	}

	public String sendRefer(String name, String sender_name) throws AddressException, MessagingException, IOException {
		String status = "Refer Email sent successfully";
		Pooler pooler = poolerRepo.findPoolerByScreenname(name);
		Pooler sender = poolerRepo.findPoolerByScreenname(sender_name);
		System.out.println("Sender" + sender + "pooler" + pooler);
		String url = pathUrl + pooler.getId().toString();
		if (pooler != null) {
			// check if the pool leader
			Pool pool = pooler.getPool();
			if (pool == null) {
				return "invalid pooler!";
			}

			if (pool.getLeader() == pooler) {
				url = url + "/approve/" + sender.getId().toString();
				System.out.println("leader : " + url);
			} else {
				url = url + "/refer/" + sender.getId().toString();
				System.out.println("pooler : " + url);
			}
			String email = pooler.getEmail();
			String subject = "Cart Share: A neighbor wants to join the pool!";
			String message = "<h1>" + sender_name + " wants to join your pool! </h1><br>";
			String link = "Click link to review: " + url;
			message = message + link;
			sendEmail(email, subject, message);
		} else {
			status = "Cannot send refer link to pooler...";
		}

		return status;
	}

	public String passReferToLeader(Long sender_id, Long pooler_id)
			throws AddressException, MessagingException, IOException {
		String status = "Email sent to leader successfully";
		Pooler pooler = poolerRepo.findById(pooler_id).orElse(null);
		Pooler sender = poolerRepo.findById(sender_id).orElse(null);
		Pool pool = pooler.getPool();
		String url = pathUrl;
		if (pooler != null && pool != null && sender != null) {
			String sender_name = sender.getScreenname();
			Pooler leader = pool.getLeader();

			url = url + leader.getId().toString() + "/approve/" + sender_id;
			System.out.println("leader : " + url);

			String email = leader.getEmail();
			String subject = "Cart Share: A neighbor wants to join the pool!";
			String message = "<h1>" + sender_name + " wants to join your pool! </h1><br>";
			String link = "Click link to review: " + url;
			message = message + link;
			sendEmail(email, subject, message);
		} else {
			status = "Cannot send refer link to pooler...";
		}

		return status;
	}

	public String sendOrderStatusNotification(Long receiverId, Long orderId, Order.Status orderStatus)
			throws IOException, AddressException, MessagingException {
		String status = "Message sent successfully via Email";
		Optional<Pooler> pooler = poolerRepo.findById(receiverId);
		if (pooler.isPresent()) {
			String email = pooler.get().getEmail();
			String msg = "";
			switch (orderStatus) {
				case OTHER_PICK_UP:
					msg = String.format(
							"Hi, you have chosen to have your order # %s picked up by others, we will notify you if your fellow pooler picked up your order!",
							orderId);
					break;
				case PICKED_UP_BY_SELF:
					msg = String.format("Hi, you have just picked up your order # %s !", orderId);
					break;
				case PICKED_UP_BY_OTHER:
					String delivererName = orderRepo.findById(orderId).get().getDeliveryman().getScreenname();
					msg = String.format(
							"Great news! Your order # %s has just been picked up by %s, please look out for delivery soon!",
							orderId, delivererName);
					break;
				case DELIVERED:
					msg = String.format("Great news! Your Order # %s has just been delivered!", orderId);
					break;
				case NOT_DELIVERED:
					msg = String.format(
							"Hey, Your fellow didn't received order # %s delivered by you, please contact them as soon as possible.",
							orderId);
					break;
				default:
					msg = "Your order status has changed to orderStatus.toString()";
			}
			String subject = "Cart Share: Your have an order status update";
			sendEmail(email, subject, msg);
		} else {
			status = "Cannot send message to pooler...";
		}
		return status;
	}

	/**
	 * send email to the one who pick up includes order’s item detail, and buyer’s
	 * addresses for delivery
	 */
	public String sendDeliveryInstruction(Long receiverId, List<Order> fellowOrders)
			throws IOException, AddressException, MessagingException {
		String status = "Message sent successfully via Email";
		Optional<Pooler> pooler = poolerRepo.findById(receiverId);
		if (pooler.isPresent()) {
			String email = pooler.get().getEmail();
			String msg = "<h1>Thank you for picking up your fellow orders. Here's the order details and delivery information.</h1><br>";
			for (Order order : fellowOrders) {
				String orderInfo = formatOrderDetails(order);
				String deliveryAddress = "<h3>Delivery Address:</h3><br>" + order.getAddress().getAddress();
				msg = msg + orderInfo + deliveryAddress;
			}
			String subject = "Cart Share: Next Step, deliver it to your fellow!";
			sendEmail(email, subject, msg);
		} else {
			status = "Cannot send message to pooler...";
		}
		return status;
	}

	/**
	 * order confirmation through email. Which contains info of the order details,
	 * as well as other orders to pick up, Up to this moment, no info regarding
	 * which fellow poolers made the orders to deliver should be shown or sent in
	 * the email.
	 */
	public String sendPickUpOrderConfirmation(Long receiverId, List<Order> orders)
			throws IOException, AddressException, MessagingException {
		String status = "Message sent successfully via Email";
		Optional<Pooler> pooler = poolerRepo.findById(receiverId);
		if (pooler.isPresent()) {
			String email = pooler.get().getEmail();
			String msg = "<h1>Your order:</h1><br/>";
			// msg += orders.get(0).toString() + "<br/>";
			String storeInfo = "<p>Store Name: %s</p><p>Store Address: %s</p>";
			msg += String.format(storeInfo, orders.get(0).getStore().getStoreName(),
					orders.get(0).getStore().getStoreAddress().getAddress());
			String firstOrderInfo = formatOrderDetails(orders.get(0));
			msg += firstOrderInfo + "<br/>";
			if (orders.size() > 1) {
				msg += "<h1>Your fellow orders:</h1><br/>";
				for (Order order : orders.subList(1, orders.size())) {
					// String orderInfo = order.toString() + "\n";
					String orderInfo = formatOrderDetails(order);
					msg += orderInfo;
				}
			}
			String subject = "Cart Share: Thank you for choosing to pick up the orders!";
			sendEmail(email, subject, msg);
		} else {
			status = "Cannot send message to pooler...";
		}
		return status;
	}

	private String formatOrderDetails(Order order) {
		String html = "";
		String orderId = "<h2>Order # %s</h2>";
		html += String.format(orderId, order.getId());
		html += "<table><tbody>";
		for (OrderItem item : order.getOrderItems()) {
			Product product = item.getProduct();
			String imgUrl = product.getImageUrl();
			String name = product.getProductName();
			double price = product.getPrice();
			String unit = product.getUnit();
			int quantity = item.getQuantity();
			String productInfo = "<tr><td><img src=\"%s\" alt=\"image\" height=\"200\"/></td><td><p>%s</p><p>Price: $%.2f per %s</p><p>Quantity: %x</p></td></tr>";
			html += String.format(productInfo, imgUrl, name, price, unit, quantity);
		}
		html += "</tbody></table>";
		String summary = "<h3>Order Summary: </h3><p>Tax: $%.2f</p><p>Fee: $%.2f</p><p>Subtotal: $%.2f</p><p>Total: $%.2f</p>";
		html += String.format(summary, order.getTax(), order.getFee(), order.getSubtotal(), order.getTotal());
		return html;
	}

	public void sendEmail(String recipient, String subject, String content)
			throws AddressException, MessagingException, IOException {
		Properties props = new Properties();
		props.put("mail.smtp.auth", "true");
		props.put("mail.smtp.starttls.enable", "true");
		props.put("mail.smtp.socketFactory.port", "587");
		props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
		props.put("mail.smtp.host", "smtp.gmail.com");
		props.put("mail.smtp.port", "587");

		Session session = Session.getInstance(props, new javax.mail.Authenticator() {
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication("cartShareOrg@gmail.com", "cartShare123");
			}
		});

		Message msg = new MimeMessage(session);
		msg.setFrom(new InternetAddress("cartShareOrg@gmail.com", false));

		msg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(recipient));
		msg.setSubject(subject);
		msg.setContent(content, "text/html");
		msg.setSentDate(new Date());

		Transport.send(msg);
		System.out.println("Email sent successfully");
	}
}