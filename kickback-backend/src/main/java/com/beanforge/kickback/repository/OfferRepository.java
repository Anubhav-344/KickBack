package com.beanforge.kickback.repository;

import com.beanforge.kickback.entity.Offer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OfferRepository extends JpaRepository<Offer, Long> {

    Optional<Offer> findByCafe_CafeIdAndPromoCodeIgnoreCase(Long cafeId, String promoCode);
}
