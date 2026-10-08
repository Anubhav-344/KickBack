package com.beanforge.kickback.entity;

import com.beanforge.kickback.enums.Role;
import com.beanforge.kickback.enums.Theme;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "first_name", length = 100, nullable = false)
    private String firstName;

    @Column(name = "last_name", length = 100)
    private String lastName;

    @Column(name = "email", length = 255, nullable = false, unique = true)
    private String email;

    @Column(name = "phone", length = 15, nullable = false, unique = true)
    private String phone;

    @Column(name = "username", length = 30, unique = true)
    private String username;

    @Column(name = "password_hash", length = 255, nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Role role;

    // References one of a fixed set of preset avatar images (chosen from
    // the frontend's gallery, not a custom upload — no file storage/
    // moderation needed). Nullable: a new user has no avatar chosen yet.
    @Column(name = "avatar_id")
    private Integer avatarId;

    // Colour theme chosen in Settings > Appearance. Nullable on purpose: null
    // means "never chose", so the browser's own saved choice (or the dark
    // default) stays in charge until the user picks one.
    @Enumerated(EnumType.STRING)
    @Column(name = "theme", length = 10)
    private Theme theme;

    // Set when the user deletes their account. The row is kept (bookings and
    // reviews point at it, and cafes need their history) but every personal
    // field is scrubbed, so nothing identifies the person any more.
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    public boolean isDeleted() {
        return deletedAt != null;
    }
}
