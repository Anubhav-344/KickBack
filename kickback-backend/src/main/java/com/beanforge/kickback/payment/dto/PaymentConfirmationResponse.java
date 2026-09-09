package com.beanforge.kickback.payment.dto;

import com.beanforge.kickback.enums.BookingStatus;
import com.beanforge.kickback.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentConfirmationResponse {

    private Long paymentId;
    private Long bookingId;
    private BigDecimal amount;
    private PaymentStatus paymentStatus;
    private BookingStatus bookingStatus;
    private String transactionReference;

}
