package com.beanforge.kickback.entity;

import com.beanforge.kickback.enums.DiscountType;
import com.beanforge.kickback.enums.OfferType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(
    name = "offers",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_offers_cafe_promo_code",
            columnNames = {"cafe_id", "promo_code"}
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
public class Offer extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "offer_id")
    private Long offerId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cafe_id", nullable = false)
    private Cafe cafe;

    @Column(name = "title", length = 50, nullable = false)
    private String title;

    @Column(name = "promo_code", length = 20)
    private String promoCode;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "offer_type", nullable = false)
    private OfferType offerType;

    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type")
    private DiscountType discountType;

    @Column(name = "discount_value", precision = 10, scale = 2)
    private BigDecimal discountValue;

    @Column(name = "bonus_minutes")
    private Integer bonusMinutes = 0;

    @Column(name = "valid_from", nullable = false)
    private LocalDate validFrom;

    @Column(name = "valid_to", nullable = false)
    private LocalDate validTo;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    @Column(name = "applicable_days", length = 30)
    private String applicableDays;

    @Column(name = "min_booking_minutes")
    private Integer minBookingMinutes;

    @Column(name = "min_booking_amount", precision = 10, scale = 2)
    private BigDecimal minBookingAmount;

    @Column(name = "is_active")
    private Boolean isActive = true;
}
