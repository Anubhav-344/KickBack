package com.beanforge.kickback.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "amenities")
@Getter
@Setter
@NoArgsConstructor
public class Amenity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "amenity_id")
    private Long amenityId;

    @Column(name = "amenity_name", length = 100, nullable = false, unique = true)
    private String amenityName;

    @Column(name = "icon_name", length = 100, nullable = false)
    private String iconName;

    @ManyToMany(mappedBy = "amenities")
    private List<Cafe> cafes = new ArrayList<>();
}
