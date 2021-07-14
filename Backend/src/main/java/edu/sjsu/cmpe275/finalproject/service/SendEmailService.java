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


public interface SendEmailService {

	String sendMessage(String receiver, String msg, String sender_name)
			throws IOException, AddressException, MessagingException;

	String sendRefer(String name, String sender_name) throws AddressException, MessagingException, IOException;
	
	String passReferToLeader(Long sender_id, Long pooler_id)
			throws AddressException, MessagingException, IOException;

	String sendOrderStatusNotification(Long receiverId, Long orderId, Order.Status orderStatus)
			throws IOException, AddressException, MessagingException;

	/**
	 * send email to the one who pick up includes order’s item detail, and buyer’s
	 * addresses for delivery
	 */
	String sendDeliveryInstruction(Long receiverId, List<Order> fellowOrders)
			throws IOException, AddressException, MessagingException;

	/**
	 * order confirmation through email. Which contains info of the order details,
	 * as well as other orders to pick up, Up to this moment, no info regarding
	 * which fellow poolers made the orders to deliver should be shown or sent in
	 * the email.
	 */
	String sendPickUpOrderConfirmation(Long receiverId, List<Order> orders)
			throws IOException, AddressException, MessagingException;


	void sendEmail(String recipient, String subject, String content)
			throws AddressException, MessagingException, IOException;
}