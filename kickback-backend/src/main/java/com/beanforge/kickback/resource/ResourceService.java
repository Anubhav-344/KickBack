package com.beanforge.kickback.resource;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.beanforge.kickback.cafe.dto.OperatingWindowResponse;
import com.beanforge.kickback.entity.Booking;
import com.beanforge.kickback.entity.Cafe;
import com.beanforge.kickback.entity.Game;
import com.beanforge.kickback.entity.OperatingDay;
import com.beanforge.kickback.entity.Resource;
import com.beanforge.kickback.entity.ResourceImage;
import com.beanforge.kickback.enums.BookingStatus;
import com.beanforge.kickback.enums.DayOfWeekEnum;
import com.beanforge.kickback.enums.ResourceStatus;
import com.beanforge.kickback.repository.ResourceRepository;
import com.beanforge.kickback.resource.dto.AvailabilityResponse;
import com.beanforge.kickback.resource.dto.ExistingBookingResponse;
import com.beanforge.kickback.resource.dto.GameResponse;
import com.beanforge.kickback.resource.dto.ResourceResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ResourceService {

    private final ResourceRepository resourceRepository;
    private final ResourceLiveStatusService resourceLiveStatusService;

    public ResourceResponse getResource(Long resourceId) {
        Resource resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Resource not found"));
        return toResourceResponse(resource);
    }

    public AvailabilityResponse getAvailability(Long resourceId, LocalDate date) {
        Resource resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Resource not found"));

        Cafe cafe = resource.getCafe();

        OperatingDay operatingDay = cafe.getOperatingDays().stream()
                .filter(day -> matchesDay(day, date))
                .findFirst()
                .orElse(null);

        OperatingWindowResponse operatingWindow;

        if (operatingDay == null || Boolean.TRUE.equals(operatingDay.getIsClosed())) {
            operatingWindow = new OperatingWindowResponse(0, 0, true);
        } else {
            operatingWindow = new OperatingWindowResponse(
                    toMinutes(operatingDay.getOpeningTime()),
                    toMinutes(operatingDay.getClosingTime()),
                    false);
        }

        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.plusDays(1).atStartOfDay();

        List<ExistingBookingResponse> bookings = resource.getBookings().stream()
                .filter(Objects::nonNull)
                .filter(this::isBlockingBooking)
                .filter(booking ->
                        booking.getStartTimestamp().isBefore(endOfDay)
                                && booking.getEndTimestamp().isAfter(startOfDay))
                .sorted(Comparator.comparing(Booking::getStartTimestamp))
                .map(booking -> new ExistingBookingResponse(
                        toMinutes(booking.getStartTimestamp().toLocalTime()),
                        toMinutes(booking.getEndTimestamp().toLocalTime())))
                .toList();

        return new AvailabilityResponse(
                resource.getResourceId(), date, operatingWindow, bookings);
    }

    private ResourceResponse toResourceResponse(Resource resource) {
        List<GameResponse> games = resource.getGames().stream()
                .filter(Objects::nonNull)
                .map(this::toGameResponse)
                .toList();

        String imageUrl = resource.getImages().stream()
                .filter(Objects::nonNull)
                .sorted(Comparator.comparing(
                        ResourceImage::getDisplayOrder,
                        Comparator.nullsLast(Integer::compareTo)))
                .map(ResourceImage::getImageUrl)
                .filter(Objects::nonNull)
                .findFirst()
                .orElse(null);

        // Same rule as the café's unit list (CafeService.getResources): real
        // bookings are layered on top of the stored status, but only for a
        // unit that's stored as AVAILABLE. MAINTENANCE / OUT_OF_SERVICE
        // always win over the live check. Both endpoints go through
        // ResourceLiveStatusService so they can never disagree.
        ResourceStatus status = resource.getStatus();
        String nextAvailableAt = null;

        if (status == ResourceStatus.AVAILABLE) {
            ResourceLiveStatusService.LiveStatus live = resourceLiveStatusService
                    .computeLiveStatus(List.of(resource.getResourceId()))
                    .get(resource.getResourceId());

            if (live != null && live.inUseNow()) {
                status = ResourceStatus.BOOKED;
                nextAvailableAt = live.nextFreeAt().toString();
            }
        }

        return new ResourceResponse(
                resource.getResourceId(),
                resource.getResourceType() != null
                        ? resource.getResourceType().getResourceTypeId() : null,
                resource.getResourceName(),
                resource.getBrand(),
                resource.getMaxPlayers() != null
                        ? resource.getMaxPlayers().intValue() : null,
                status,
                resource.getHourlyRate(),
                resource.getSpecifications(),
                games,
                imageUrl,
                nextAvailableAt,
                resource.getExtraNote());
    }

    private GameResponse toGameResponse(Game game) {
        return new GameResponse(
                game.getGameId(),
                game.getGameName(),
                game.getThumbnailUrl(),
                game.getMultiplayer(),
                game.getMinPlayers(),
                game.getMaxPlayers());
    }

    private boolean isBlockingBooking(Booking booking) {
        return booking.getBookingStatus() == BookingStatus.PENDING
                || booking.getBookingStatus() == BookingStatus.CONFIRMED;
    }

    private boolean matchesDay(OperatingDay operatingDay, LocalDate date) {
        DayOfWeekEnum expectedDay = switch (date.getDayOfWeek()) {
            case MONDAY -> DayOfWeekEnum.MON;
            case TUESDAY -> DayOfWeekEnum.TUE;
            case WEDNESDAY -> DayOfWeekEnum.WED;
            case THURSDAY -> DayOfWeekEnum.THU;
            case FRIDAY -> DayOfWeekEnum.FRI;
            case SATURDAY -> DayOfWeekEnum.SAT;
            case SUNDAY -> DayOfWeekEnum.SUN;
        };
        return operatingDay.getDaysOfWeek() == expectedDay;
    }

    private int toMinutes(LocalTime time) {
        return time == null ? 0 : time.getHour() * 60 + time.getMinute();
    }
}