package com.beanforge.kickback.repository;

import com.beanforge.kickback.entity.SupportTicket;
import com.beanforge.kickback.enums.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {

    List<SupportTicket> findByUser_UserIdOrderByCreatedAtDesc(Long userId);

    long countByUser_UserIdAndStatusIn(Long userId, Collection<TicketStatus> statuses);
}
