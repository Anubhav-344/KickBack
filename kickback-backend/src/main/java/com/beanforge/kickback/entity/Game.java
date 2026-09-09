package com.beanforge.kickback.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "games")
@Getter
@Setter
@NoArgsConstructor
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "game_id")
    private Long gameId;

    @Column(name = "game_name", length = 150, nullable = false)
    private String gameName;

    @Column(name = "thumbnail_url", length = 500)
    private String thumbnailUrl;

    @Column(name = "multiplayer")
    private Boolean multiplayer;

    @Column(name = "min_players")
    private Integer minPlayers;

    @Column(name = "max_players")
    private Integer maxPlayers;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @ManyToMany(mappedBy = "games")
    private List<Resource> resources = new ArrayList<>();

    @OneToMany(mappedBy = "game")
    private List<Booking> bookings = new ArrayList<>();
}
