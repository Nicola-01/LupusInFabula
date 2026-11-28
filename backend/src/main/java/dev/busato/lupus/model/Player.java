package dev.busato.lupus.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Locale;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Check;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;

/** A registered user. */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "player")
// a deleted account frees its email (null), an active one must have it
@Check(constraints = "email IS NOT NULL OR deleted_at IS NOT NULL")
public class Player {

  @Id
  @GeneratedValue
  @UuidGenerator(style = UuidGenerator.Style.VERSION_7)
  private UUID id;

  @Column(nullable = false, unique = true, length = 20)
  private String username;

  @Column(unique = true, length = 100)
  private String email;

  @Column(nullable = false, length = 100)
  private String passwordHash;

  @CreationTimestamp
  @Column(nullable = false, updatable = false)
  private LocalDate registeredOn;

  /** Soft delete: {@code null} = active account. A deleted account keeps its games but cannot log in. */
  private Instant deletedAt;

  /** Emails are case-insensitive: stored in lower case so lookups are exact and use the UNIQUE index. */
  @PrePersist
  @PreUpdate
  void normalizeEmail() {
    if (email != null) email = email.toLowerCase(Locale.ROOT);
  }
}
