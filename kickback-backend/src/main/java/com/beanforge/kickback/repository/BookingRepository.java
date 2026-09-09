package com.beanforge.kickback.repository;

import com.beanforge.kickback.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;


public interface BookingRepository extends JpaRepository<Booking, Long> {

}
