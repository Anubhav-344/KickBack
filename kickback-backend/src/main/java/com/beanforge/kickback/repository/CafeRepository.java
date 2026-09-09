package com.beanforge.kickback.repository;

import com.beanforge.kickback.entity.Cafe;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CafeRepository extends JpaRepository<Cafe, Long> {

    Optional<Cafe> findBySlugIgnoreCase(String slug);

    List<Cafe> findAllByAddress_CityIgnoreCase(String city);
}
