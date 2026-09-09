package com.beanforge.kickback.entity;

import com.beanforge.kickback.enums.DayOfWeekEnum;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalTime;

@Entity
@Table(name = "operating_days")
@Getter
@Setter
@NoArgsConstructor
public class OperatingDay {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "operating_day_id")
    private Long operatingDayId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cafe_id", nullable = false)
    private Cafe cafe;

    @Enumerated(EnumType.STRING)
    @Column(name = "days_of_week", nullable = false)
    private DayOfWeekEnum daysOfWeek;

    @Column(name = "opening_time")
    private LocalTime openingTime;

    @Column(name = "closing_time")
    private LocalTime closingTime;

    @Column(name = "is_closed")
    private Boolean isClosed = false;
}
