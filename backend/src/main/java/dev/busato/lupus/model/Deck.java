package dev.busato.lupus.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Check;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UuidGenerator;
import org.hibernate.type.SqlTypes;

/** A saved set of roles, public: any logged-in user can list the decks of another user. */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(
    name = "deck",
    uniqueConstraints = @UniqueConstraint(columnNames = {"owner_id", "name"}))
@Check(constraints = "players >= 5")
public class Deck {

  @Id
  @GeneratedValue
  @UuidGenerator(style = UuidGenerator.Style.VERSION_7)
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "owner_id")
  private Player owner;

  @Column(nullable = false, length = 50)
  private String name;

  /** Players the deck is meant for. */
  @Column(nullable = false)
  private int players;

  /** {"WOLF": 2, "SEER": 1}: always read and written whole, so one jsonb column instead of a table. */
  @JdbcTypeCode(SqlTypes.JSON)
  @Column(nullable = false)
  private Map<Role, Integer> roles;

  @CreationTimestamp
  @Column(nullable = false, updatable = false)
  private Instant createdAt;
}
