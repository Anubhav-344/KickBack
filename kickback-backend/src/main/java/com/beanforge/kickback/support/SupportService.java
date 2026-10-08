package com.beanforge.kickback.support;

import com.beanforge.kickback.entity.Booking;
import com.beanforge.kickback.entity.SupportTicket;
import com.beanforge.kickback.entity.User;
import com.beanforge.kickback.enums.TicketStatus;
import com.beanforge.kickback.repository.BookingRepository;
import com.beanforge.kickback.repository.SupportTicketRepository;
import com.beanforge.kickback.repository.UserRepository;
import com.beanforge.kickback.support.dto.CreateTicketRequest;
import com.beanforge.kickback.support.dto.TicketResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class SupportService {

    /** Stops one account from flooding the queue. */
    private static final int MAX_OPEN_TICKETS = 5;

    private final SupportTicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

    public SupportService(SupportTicketRepository ticketRepository,
                          UserRepository userRepository,
                          BookingRepository bookingRepository) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
    }

    @Transactional
    public TicketResponse create(Authentication authentication, CreateTicketRequest request) {
        User user = getAuthenticatedUser(authentication);

        long open = ticketRepository.countByUser_UserIdAndStatusIn(
                user.getUserId(), List.of(TicketStatus.OPEN, TicketStatus.IN_PROGRESS));
        if (open >= MAX_OPEN_TICKETS) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY,
                    "You already have " + MAX_OPEN_TICKETS + " open tickets. Please wait for a reply before raising another.");
        }

        SupportTicket ticket = new SupportTicket();
        ticket.setUser(user);
        ticket.setCategory(request.getCategory());
        ticket.setSubject(request.getSubject().trim());
        ticket.setMessage(request.getMessage().trim());

        if (request.getBookingId() != null) {
            Booking booking = bookingRepository
                    .findByBookingIdAndUser_UserId(request.getBookingId(), user.getUserId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.BAD_REQUEST, "Booking not found"));
            ticket.setBooking(booking);
        }

        return toResponse(ticketRepository.save(ticket));
    }

    @Transactional(readOnly = true)
    public List<TicketResponse> listMine(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        return ticketRepository.findByUser_UserIdOrderByCreatedAtDesc(user.getUserId())
                .stream().map(this::toResponse).toList();
    }

    private TicketResponse toResponse(SupportTicket t) {
        return new TicketResponse(
                t.getTicketId(),
                t.getCategory().name(),
                t.getSubject(),
                t.getMessage(),
                t.getStatus().name(),
                t.getBooking() == null ? null : t.getBooking().getBookingId(),
                t.getCreatedAt());
    }

    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }
        Long userId;
        try {
            userId = Long.valueOf(authentication.getName());
        } catch (NumberFormatException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid session");
        }
        return userRepository.findById(userId)
                .filter(u -> !u.isDeleted())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Account no longer exists"));
    }
}
