package com.beanforge.kickback.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "resource_types")
@Getter
@Setter
@NoArgsConstructor
public class ResourceType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "resource_type_id")
    private Long resourceTypeId;

    @Column(name = "resource_name", length = 100, nullable = false, unique = true)
    private String resourceName;

    @Column(name = "supports_games")
    private Boolean supportsGames = true;

    @Column(name = "resource_image_url", length = 150, nullable = false)
    private String resourceImageUrl;

    @OneToMany(mappedBy = "resourceType")
    private List<Resource> resources = new ArrayList<>();
}
