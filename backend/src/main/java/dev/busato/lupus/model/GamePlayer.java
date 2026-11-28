package dev.busato.lupus.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.Instant;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Check;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.annotations.UuidGenerator;

/** A player taking part in a game, with his role. */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(
    name = "game_player",
    uniqueConstraints = {
      @UniqueConstraint(columnNames = {"game_id", "player_id"}),
      @UniqueConstraint(columnNames = {"game_id", "seat"})
    },
    indexes = @Index(columnList = "player_id"))
@Check(
    constraints =
        "(death_round IS NULL) = (death_phase IS NULL) AND (death_round IS NULL) = (died_at IS NULL)")
public class GamePlayer {

  @Id
  @GeneratedValue
  @UuidGenerator(style = UuidGenerator.Style.VERSION_7)
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "game_id")
  @OnDelete(action = OnDeleteAction.CASCADE)
  private Game game;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "player_id")
  private Player player;

  /** Stored as the constant name (e.g. "WOLF"). */
  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private Role role;

  /** Seat at the table, from 1: used for vote order and plague neighbours. */
  @Column(nullable = false)
  private int seat;

  /** Round of death; {@code null} = alive. {@code Integer}, not {@code int}, on purpose. */
  private Integer deathRound;

  /** Phase of death; {@code null} = alive. */
  @Enumerated(EnumType.STRING)
  private GamePhase deathPhase;

  /** Moment of death; {@code null} = alive. */
  private Instant diedAt;
}
