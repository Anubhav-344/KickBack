package com.beanforge.kickback.payment;

import com.beanforge.kickback.entity.Booking;
import com.beanforge.kickback.entity.Payment;
import com.beanforge.kickback.enums.BookingStatus;
import com.beanforge.kickback.enums.PaymentMethod;
import com.beanforge.kickback.enums.PaymentStatus;
import com.beanforge.kickback.payment.dto.ConfirmPaymentRequest;
import com.beanforge.kickback.payment.dto.CreatePaymentRequest;
import com.beanforge.kickback.payment.dto.PaymentConfirmationResponse;
import com.beanforge.kickback.payment.dto.PaymentResponse;
import com.beanforge.kickback.repository.BookingRepository;
import com.beanforge.kickback.repository.PaymentRepository;
import com.beanforge.kickback.testsupport.TestData;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.http.HttpStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static com.beanforge.kickback.testsupport.HttpAssert.assertStatus;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/** Unit tests for the payment rules around holds, amounts and confirmation. No database needed. */
@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class PaymentServiceTest {

    @Mock PaymentRepository paymentRepository;
    @Mock BookingRepository bookingRepository;

    PaymentService service;
    Booking booking;

    @BeforeEach
    void setUp() {
        service = new PaymentService(paymentRepository, bookingRepository);

        booking = TestData.booking(1L, BookingStatus.PENDING);
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));
        when(paymentRepository.findByBooking_BookingId(1L)).thenReturn(Optional.empty());
        when(paymentRepository.save(any(Payment.class))).thenAnswer(inv -> inv.getArgument(0));
    }

    private CreatePaymentRequest createRequest(String amount) {
        CreatePaymentRequest r = new CreatePaymentRequest();
        r.setBookingId(1L);
        r.setAmount(new BigDecimal(amount));
        r.setMethod(PaymentMethod.UPI);
        return r;
    }

    private Payment pendingPayment() {
        Payment p = TestData.payment(7L, booking, PaymentStatus.PENDING, "KB-abc");
        when(paymentRepository.findById(7L)).thenReturn(Optional.of(p));
        return p;
    }

    private ConfirmPaymentRequest confirmRequest(String ref) {
        ConfirmPaymentRequest r = new ConfirmPaymentRequest();
        r.setTransactionReference(ref);
        return r;
    }

    // ---------- create ----------

    @Test
    void createsAPendingPaymentForTheBookingTotal() {
        PaymentResponse r = service.createPayment(createRequest("200.00"));

        assertThat(r.getPaymentStatus()).isEqualTo(PaymentStatus.PENDING);
        assertThat(r.getAmount()).isEqualByComparingTo("200.00");
        assertThat(r.getTransactionReference()).startsWith("KB-");
    }

    @Test
    void amountThatDoesNotMatchTheTotalIsRejected() {
        assertStatus(() -> service.createPayment(createRequest("199.99")), HttpStatus.BAD_REQUEST);
        verify(paymentRepository, never()).save(any(Payment.class));
    }

    @Test
    void secondPaymentForTheSameBookingIsAConflict() {
        when(paymentRepository.findByBooking_BookingId(1L)).thenReturn(Optional.of(new Payment()));
        assertStatus(() -> service.createPayment(createRequest("200.00")), HttpStatus.CONFLICT);
    }

    @Test
    void cannotPayForDeadBookings() {
        for (BookingStatus s : List.of(BookingStatus.CANCELLED, BookingStatus.EXPIRED,
                BookingStatus.COMPLETED, BookingStatus.NO_SHOW)) {
            booking.setBookingStatus(s);
            assertStatus(() -> service.createPayment(createRequest("200.00")), HttpStatus.BAD_REQUEST);
        }
    }

    @Test
    void lapsedHoldCannotBePaidAndMarksTheBookingExpired() {
        booking.setHoldExpiresAt(LocalDateTime.now().minusSeconds(1));
        assertStatus(() -> service.createPayment(createRequest("200.00")), HttpStatus.BAD_REQUEST);
        assertThat(booking.getBookingStatus()).isEqualTo(BookingStatus.EXPIRED);
    }

    @Test
    void unknownBookingIsNotFound() {
        when(bookingRepository.findById(1L)).thenReturn(Optional.empty());
        assertStatus(() -> service.createPayment(createRequest("200.00")), HttpStatus.NOT_FOUND);
    }

    // ---------- confirm ----------

    @Test
    void confirmingMarksPaymentPaidAndBookingConfirmed() {
        Payment p = pendingPayment();

        PaymentConfirmationResponse r = service.confirmPayment(7L, confirmRequest("KB-abc"));

        assertThat(r.getPaymentStatus()).isEqualTo(PaymentStatus.SUCCESS);
        assertThat(r.getBookingStatus()).isEqualTo(BookingStatus.CONFIRMED);
        assertThat(p.getPaidAt()).isNotNull();
        assertThat(booking.getHoldExpiresAt()).isNull();
    }

    @Test
    void confirmingTrimsWhitespaceAroundTheReference() {
        pendingPayment();
        assertThat(service.confirmPayment(7L, confirmRequest("  KB-abc  ")).getPaymentStatus())
                .isEqualTo(PaymentStatus.SUCCESS);
    }

    @Test
    void wrongTransactionReferenceIsRejectedAndNothingChanges() {
        pendingPayment();
        assertStatus(() -> service.confirmPayment(7L, confirmRequest("KB-wrong")), HttpStatus.BAD_REQUEST);
        assertThat(booking.getBookingStatus()).isEqualTo(BookingStatus.PENDING);
    }

    @Test
    void confirmingTwiceIsHarmless() {
        Payment p = pendingPayment();
        p.setPaymentStatus(PaymentStatus.SUCCESS);
        booking.setBookingStatus(BookingStatus.CONFIRMED);

        PaymentConfirmationResponse r = service.confirmPayment(7L, confirmRequest("anything"));
        assertThat(r.getPaymentStatus()).isEqualTo(PaymentStatus.SUCCESS);
        verify(paymentRepository, never()).save(any(Payment.class));
    }

    @Test
    void failedPaymentCannotBeConfirmed() {
        pendingPayment().setPaymentStatus(PaymentStatus.FAILED);
        assertStatus(() -> service.confirmPayment(7L, confirmRequest("KB-abc")), HttpStatus.BAD_REQUEST);
    }

    @Test
    void cannotConfirmAfterTheBookingWasCancelled() {
        pendingPayment();
        booking.setBookingStatus(BookingStatus.CANCELLED);
        assertStatus(() -> service.confirmPayment(7L, confirmRequest("KB-abc")), HttpStatus.BAD_REQUEST);
    }

    @Test
    void cannotConfirmAfterTheHoldLapsed() {
        pendingPayment();
        booking.setHoldExpiresAt(LocalDateTime.now().minusSeconds(1));
        assertStatus(() -> service.confirmPayment(7L, confirmRequest("KB-abc")), HttpStatus.BAD_REQUEST);
        assertThat(booking.getBookingStatus()).isEqualTo(BookingStatus.EXPIRED);
    }

    @Test
    void unknownPaymentIsNotFound() {
        when(paymentRepository.findById(404L)).thenReturn(Optional.empty());
        assertStatus(() -> service.confirmPayment(404L, confirmRequest("x")), HttpStatus.NOT_FOUND);
    }
}