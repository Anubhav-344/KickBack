package com.beanforge.kickback.payment;

import com.beanforge.kickback.entity.*;
import com.beanforge.kickback.enums.*;
import com.beanforge.kickback.payment.dto.*;
import com.beanforge.kickback.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

    public PaymentService(PaymentRepository paymentRepository, BookingRepository bookingRepository) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
    }

    @Transactional
    public PaymentResponse createPayment(CreatePaymentRequest request) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> error(HttpStatus.NOT_FOUND, "Booking not found"));

        if (booking.getBookingStatus() == BookingStatus.CANCELLED ||
            booking.getBookingStatus() == BookingStatus.EXPIRED ||
            booking.getBookingStatus() == BookingStatus.COMPLETED ||
            booking.getBookingStatus() == BookingStatus.NO_SHOW) {
            throw error(HttpStatus.BAD_REQUEST, "Payment cannot be created for this booking");
        }

        if (booking.getBookingStatus() == BookingStatus.PENDING &&
            booking.getHoldExpiresAt() != null &&
            LocalDateTime.now().isAfter(booking.getHoldExpiresAt())) {
            booking.setBookingStatus(BookingStatus.EXPIRED);
            bookingRepository.save(booking);
            throw error(HttpStatus.BAD_REQUEST, "Booking hold has expired");
        }

        if (paymentRepository.findByBooking_BookingId(booking.getBookingId()).isPresent())
            throw error(HttpStatus.CONFLICT, "Payment already exists for this booking");

        if (booking.getTotalAmount() == null ||
            request.getAmount().compareTo(booking.getTotalAmount()) != 0)
            throw error(HttpStatus.BAD_REQUEST, "Payment amount must match the booking total amount");

        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setAmount(booking.getTotalAmount());
        payment.setPaymentMethod(request.getMethod());
        payment.setPaymentStatus(PaymentStatus.PENDING);
        payment.setTransactionReference("KB-" + UUID.randomUUID());

        return toResponse(paymentRepository.save(payment));
    }

    @Transactional
    public PaymentConfirmationResponse confirmPayment(Long paymentId, ConfirmPaymentRequest request) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> error(HttpStatus.NOT_FOUND, "Payment not found"));
        Booking booking = payment.getBooking();

        if (payment.getPaymentStatus() == PaymentStatus.SUCCESS)
            return toConfirmation(payment, booking);

        if (payment.getPaymentStatus() != PaymentStatus.PENDING)
            throw error(HttpStatus.BAD_REQUEST, "Payment cannot be confirmed in its current status");

        if (booking.getBookingStatus() == BookingStatus.CANCELLED ||
            booking.getBookingStatus() == BookingStatus.EXPIRED ||
            booking.getBookingStatus() == BookingStatus.COMPLETED ||
            booking.getBookingStatus() == BookingStatus.NO_SHOW)
            throw error(HttpStatus.BAD_REQUEST, "Payment cannot be confirmed for this booking");

        if (booking.getBookingStatus() == BookingStatus.PENDING &&
            booking.getHoldExpiresAt() != null &&
            LocalDateTime.now().isAfter(booking.getHoldExpiresAt())) {
            booking.setBookingStatus(BookingStatus.EXPIRED);
            bookingRepository.save(booking);
            throw error(HttpStatus.BAD_REQUEST, "Booking hold has expired");
        }

        if (!request.getTransactionReference().trim().equals(payment.getTransactionReference()))
            throw error(HttpStatus.BAD_REQUEST, "Invalid transaction reference");

        payment.setPaymentStatus(PaymentStatus.SUCCESS);
        payment.setPaidAt(LocalDateTime.now());
        booking.setBookingStatus(BookingStatus.CONFIRMED);
        booking.setHoldExpiresAt(null);

        paymentRepository.save(payment);
        bookingRepository.save(booking);
        return toConfirmation(payment, booking);
    }

    private PaymentResponse toResponse(Payment p) {
        return new PaymentResponse(p.getPaymentId(), p.getBooking().getBookingId(), p.getAmount(),
                p.getPaymentMethod(), p.getPaymentStatus(), p.getTransactionReference(), p.getPaidAt());
    }

    private PaymentConfirmationResponse toConfirmation(Payment p, Booking b) {
        return new PaymentConfirmationResponse(p.getPaymentId(), b.getBookingId(), p.getAmount(),
                p.getPaymentStatus(), b.getBookingStatus(), p.getTransactionReference());
    }

    private ResponseStatusException error(HttpStatus status, String message) {
        return new ResponseStatusException(status, message);
    }
}
