package com.beanforge.kickback.cafe;

import com.beanforge.kickback.cafe.dto.AmenityResponse;
import com.beanforge.kickback.cafe.dto.CafeAddressResponse;
import com.beanforge.kickback.cafe.dto.CafeDetailsResponse;
import com.beanforge.kickback.cafe.dto.CafeListingResponse;
import com.beanforge.kickback.cafe.dto.OfferSummaryResponse;
import com.beanforge.kickback.cafe.dto.OperatingWindowResponse;
import com.beanforge.kickback.cafe.dto.ResourceTypeSummaryResponse;
import com.beanforge.kickback.entity.Amenity;
import com.beanforge.kickback.entity.Cafe;
import com.beanforge.kickback.entity.CafeImage;
import com.beanforge.kickback.entity.Offer;
import com.beanforge.kickback.entity.OperatingDay;
import com.beanforge.kickback.entity.Resource;
import com.beanforge.kickback.entity.ResourceType;
import com.beanforge.kickback.enums.DayOfWeekEnum;
import com.beanforge.kickback.repository.CafeRepository;
import com.beanforge.kickback.resource.dto.GameResponse;
import com.beanforge.kickback.resource.dto.ResourceListResponse;
import com.beanforge.kickback.resource.dto.ResourceResponse;
import com.beanforge.kickback.resource.dto.ResourceTypeResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class CafeService {

    private final CafeRepository cafeRepository;

    public CafeService(CafeRepository cafeRepository) {
        this.cafeRepository = cafeRepository;
    }

    public List<CafeListingResponse> getCafes(String city) {
        List<Cafe> cafes = (city == null || city.isBlank())
                ? cafeRepository.findAll()
                : cafeRepository.findAllByAddress_CityIgnoreCase(city.trim());

        return cafes.stream()
                .map(this::toListingResponse)
                .toList();
    }

    public CafeDetailsResponse getCafeBySlug(String slug) {
        Cafe cafe = cafeRepository.findBySlugIgnoreCase(slug)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Cafe not found"));

        return toDetailsResponse(cafe);
    }

    public ResourceListResponse getResources(String slug, Long resourceTypeId) {
        Cafe cafe = cafeRepository.findBySlugIgnoreCase(slug)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Cafe not found"));

        List<Resource> cafeResources = cafe.getResources().stream()
                .filter(resource -> resource.getResourceType() != null)
                .toList();

        // No resourceTypeId → return all resources
        if (resourceTypeId == null) {

            List<ResourceResponse> resources = cafeResources.stream()
                    .sorted(Comparator.comparing(
                            Resource::getResourceName,
                            String.CASE_INSENSITIVE_ORDER
                    ))
                    .map(this::toResourceResponse)
                    .toList();

            return new ResourceListResponse(null, resources);
        }

        // resourceTypeId provided → find that resource type
        ResourceType resourceType = cafeResources.stream()
                .map(Resource::getResourceType)
                .filter(type -> resourceTypeId.equals(type.getResourceTypeId()))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Resource type not found for this cafe"
                ));

        List<ResourceResponse> resources = cafeResources.stream()
                .filter(resource -> resourceTypeId.equals(
                        resource.getResourceType().getResourceTypeId()
                ))
                .sorted(Comparator.comparing(
                        Resource::getResourceName,
                        String.CASE_INSENSITIVE_ORDER
                ))
                .map(this::toResourceResponse)
                .toList();

        ResourceTypeResponse typeResponse = new ResourceTypeResponse(
                resourceType.getResourceTypeId(),
                resourceType.getResourceName(),
                Boolean.TRUE.equals(resourceType.getSupportsGames()),
                resourceType.getResourceImageUrl()
        );

        return new ResourceListResponse(typeResponse, resources);
    }

    private CafeListingResponse toListingResponse(Cafe cafe) {
        CafeListingResponse response = new CafeListingResponse();
        response.setCafeId(cafe.getCafeId());
        response.setSlug(cafe.getSlug());
        response.setName(cafe.getName());
        response.setArea(cafe.getAddress() != null ? cafe.getAddress().getAddressLine1() : null);
        response.setCity(cafe.getAddress() != null ? cafe.getAddress().getCity() : null);
        response.setAverageRating(defaultRating(cafe.getAverageRating()));
        response.setTotalReviews(defaultInt(cafe.getTotalReviews()));

        List<Resource> resources = cafe.getResources();
        response.setStartingHourlyRate(resources.stream()
                .map(Resource::getHourlyRate)
                .filter(Objects::nonNull)
                .min(BigDecimal::compareTo)
                .orElse(BigDecimal.ZERO));

        response.setResourceTypeTags(resources.stream()
                .map(Resource::getResourceType)
                .filter(Objects::nonNull)
                .map(ResourceType::getResourceName)
                .filter(Objects::nonNull)
                .distinct()
                .sorted(String.CASE_INSENSITIVE_ORDER)
                .toList());

        response.setImageUrl(firstImageUrl(cafe));
        response.setTodayOperatingWindow(getTodayOperatingWindow(cafe));
        return response;
    }

    private CafeDetailsResponse toDetailsResponse(Cafe cafe) {
        CafeDetailsResponse response = new CafeDetailsResponse();
        response.setCafeId(cafe.getCafeId());
        response.setSlug(cafe.getSlug());
        response.setName(cafe.getName());
        response.setDescription(cafe.getDescription());
        response.setEmail(cafe.getEmail());
        response.setPhone(cafe.getPhone());
        response.setAverageRating(defaultRating(cafe.getAverageRating()));
        response.setTotalReviews(defaultInt(cafe.getTotalReviews()));

        OperatingWindowResponse todayWindow = getTodayOperatingWindow(cafe);
        response.setOperatingWindow(todayWindow);
        response.setOpenNow(isOpenNow(todayWindow));

        response.setImages(cafe.getImages().stream()
                .filter(image -> image.getImageUrl() != null)
                .sorted(Comparator.comparing(
                        image -> image.getDisplayOrder() == null ? Integer.MAX_VALUE : image.getDisplayOrder()))
                .map(CafeImage::getImageUrl)
                .toList());

        response.setAddress(toAddressResponse(cafe));
        response.setAmenities(cafe.getAmenities().stream()
                .map(this::toAmenityResponse)
                .toList());

        LocalDate today = LocalDate.now();
        response.setOffers(cafe.getOffers().stream()
                .filter(offer -> Boolean.TRUE.equals(offer.getIsActive()))
                .filter(offer -> offer.getValidFrom() == null || !today.isBefore(offer.getValidFrom()))
                .filter(offer -> offer.getValidTo() == null || !today.isAfter(offer.getValidTo()))
                .map(this::toOfferResponse)
                .toList());

        response.setResourceTypes(toResourceTypeSummaries(cafe.getResources()));
        return response;
    }

    private List<ResourceTypeSummaryResponse> toResourceTypeSummaries(List<Resource> resources) {
        Map<ResourceType, List<Resource>> grouped = resources.stream()
                .filter(resource -> resource.getResourceType() != null)
                .collect(Collectors.groupingBy(Resource::getResourceType));

        return grouped.entrySet().stream()
                .map(entry -> {
                    ResourceType type = entry.getKey();
                    BigDecimal startingRate = entry.getValue().stream()
                            .map(Resource::getHourlyRate)
                            .filter(Objects::nonNull)
                            .min(BigDecimal::compareTo)
                            .orElse(BigDecimal.ZERO);

                    return new ResourceTypeSummaryResponse(
                            type.getResourceTypeId(),
                            type.getResourceName(),
                            entry.getValue().size(),
                            startingRate,
                            Boolean.TRUE.equals(type.getSupportsGames())
                    );
                })
                .sorted(Comparator.comparing(
                        ResourceTypeSummaryResponse::getResourceName,
                        String.CASE_INSENSITIVE_ORDER))
                .toList();
    }

    private ResourceResponse toResourceResponse(Resource resource) {
        ResourceResponse response = new ResourceResponse();
        response.setResourceId(resource.getResourceId());
        response.setResourceTypeId(resource.getResourceType() != null
                ? resource.getResourceType().getResourceTypeId() : null);
        response.setResourceName(resource.getResourceName());
        response.setBrand(resource.getBrand());
        response.setMaxPlayers(resource.getMaxPlayers() == null ? null : resource.getMaxPlayers().intValue());
        response.setStatus(resource.getStatus());
        response.setHourlyRate(resource.getHourlyRate());
        response.setDescription(resource.getSpecifications());
        response.setGames(resource.getGames().stream()
                .map(game -> new GameResponse(
                        game.getGameId(),
                        game.getGameName(),
                        game.getThumbnailUrl(),
                        game.getMultiplayer(),
                        game.getMinPlayers(),
                        game.getMaxPlayers()))
                .toList());
        response.setImageUrl(resource.getImages().stream()
                .filter(image -> image.getImageUrl() != null)
                .sorted(Comparator.comparing(
                        image -> image.getDisplayOrder() == null ? Integer.MAX_VALUE : image.getDisplayOrder()))
                .map(image -> image.getImageUrl())
                .findFirst()
                .orElse(null));
        return response;
    }

    private CafeAddressResponse toAddressResponse(Cafe cafe) {
        if (cafe.getAddress() == null) {
            return null;
        }

        return new CafeAddressResponse(
                cafe.getAddress().getAddressLine1(),
                cafe.getAddress().getAddressLine2(),
                cafe.getAddress().getCity(),
                cafe.getAddress().getState(),
                cafe.getAddress().getCountry(),
                cafe.getAddress().getPincode()
        );
    }

    private AmenityResponse toAmenityResponse(Amenity amenity) {
        return new AmenityResponse(
                amenity.getAmenityId(),
                amenity.getAmenityName(),
                amenity.getIconName()
        );
    }

    private OfferSummaryResponse toOfferResponse(Offer offer) {
        OfferSummaryResponse response = new OfferSummaryResponse();
        response.setOfferId(offer.getOfferId());
        response.setTitle(offer.getTitle());
        response.setPromoCode(offer.getPromoCode());
        response.setDescription(offer.getDescription());
        response.setOfferType(offer.getOfferType());
        response.setDiscountType(offer.getDiscountType());
        response.setDiscountValue(offer.getDiscountValue());
        response.setBonusMinutes(offer.getBonusMinutes());
        response.setValidFrom(offer.getValidFrom());
        response.setValidTo(offer.getValidTo());
        response.setActive(Boolean.TRUE.equals(offer.getIsActive()));
        return response;
    }

    private OperatingWindowResponse getTodayOperatingWindow(Cafe cafe) {
        DayOfWeekEnum today = toDayOfWeekEnum(LocalDate.now().getDayOfWeek());

        OperatingDay operatingDay = cafe.getOperatingDays().stream()
                .filter(day -> day.getDaysOfWeek() == today)
                .findFirst()
                .orElse(null);

        if (operatingDay == null || Boolean.TRUE.equals(operatingDay.getIsClosed())
                || operatingDay.getOpeningTime() == null || operatingDay.getClosingTime() == null) {
            return new OperatingWindowResponse(0, 0, true);
        }

        return new OperatingWindowResponse(
                toMinutes(operatingDay.getOpeningTime()),
                toMinutes(operatingDay.getClosingTime()),
                false
        );
    }

    private boolean isOpenNow(OperatingWindowResponse window) {
        if (window == null || window.isClosedToday()) {
            return false;
        }

        int now = toMinutes(LocalTime.now());
        return now >= window.getOpeningMinutes() && now < window.getClosingMinutes();
    }

    private int toMinutes(LocalTime time) {
        return time.getHour() * 60 + time.getMinute();
    }

    private DayOfWeekEnum toDayOfWeekEnum(DayOfWeek dayOfWeek) {
        return switch (dayOfWeek) {
            case MONDAY -> DayOfWeekEnum.MON;
            case TUESDAY -> DayOfWeekEnum.TUE;
            case WEDNESDAY -> DayOfWeekEnum.WED;
            case THURSDAY -> DayOfWeekEnum.THU;
            case FRIDAY -> DayOfWeekEnum.FRI;
            case SATURDAY -> DayOfWeekEnum.SAT;
            case SUNDAY -> DayOfWeekEnum.SUN;
        };
    }

    private String firstImageUrl(Cafe cafe) {
        return cafe.getImages().stream()
                .filter(image -> image.getImageUrl() != null)
                .sorted(Comparator.comparing(
                        image -> image.getDisplayOrder() == null ? Integer.MAX_VALUE : image.getDisplayOrder()))
                .map(CafeImage::getImageUrl)
                .findFirst()
                .orElse(null);
    }

    private BigDecimal defaultRating(BigDecimal rating) {
        return rating == null ? BigDecimal.ZERO : rating;
    }

    private int defaultInt(Integer value) {
        return value == null ? 0 : value;
    }
}
