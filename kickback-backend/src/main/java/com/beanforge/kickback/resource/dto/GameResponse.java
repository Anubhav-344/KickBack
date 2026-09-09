package com.beanforge.kickback.resource.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GameResponse {

    private Long gameId;
    private String gameName;
    private String thumbnailUrl;
    private Boolean multiplayer;
    private Integer minPlayers;
    private Integer maxPlayers;

}
