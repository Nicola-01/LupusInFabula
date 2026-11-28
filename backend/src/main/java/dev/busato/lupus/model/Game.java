package dev.busato.lupus.model;

import jakarta.persistence.Column;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapKeyColumn;
import jakarta.persistence.MapKeyEnumerated;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.Check;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;

/** A game of a village. Duration is {@code Duration.between(startedAt, endedAt)}, not stored. */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "game")
@Check(constraints = "(ended_at IS NULL) = (winner IS NULL)")
@Check(constraints = "round >= 1")
public class Game {

  @Id
  @GeneratedValue
  @UuidGenerator(style = UuidGenerator.Style.VERSION_7)
  private UUID id;

  /** Id used in URLs ({@code /village/{publicId}}). */
  @Column(nullable = false, unique = true, length = 64)
  private String publicId;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "master_id")
  private Player master;

  @CreationTimestamp
  @Column(nullable = false, updatable = false)
  private Instant startedAt;

  /** {@code null} = game still in progress. */
  private Instant endedAt;

  /** {@code null} = game still in progress; {@code DRAW} = ended without a winner. */
  @Enumerated(EnumType.STRING)
  private WinFaction winner;

  @Column(nullable = false)
  @Builder.Default
  private int round = 1;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  @Builder.Default
  private GamePhase phase = GamePhase.NIGHT;

  /** Settings enabled in this game (present = enabled). Stored in table {@code game_setting}. */
  // the live board loads up to 50 games, the collections of all of them are fetched in one query instead of one per game
  @ElementCollection
  @BatchSize(size = 50)
  @CollectionTable(name = "game_setting", joinColumns = @JoinColumn(name = "game_id"))
  @Enumerated(EnumType.STRING)
  @Column(name = "setting", nullable = false)
  @Builder.Default
  private Set<GameSetting> settings = EnumSet.noneOf(GameSetting.class);

  /** Cards chosen by the master, role -> number. With LARGER_ROLE_NUMBER more than the players: the extra ones are discarded. */
  @ElementCollection
  @CollectionTable(name = "game_role", joinColumns = @JoinColumn(name = "game_id"))
  @MapKeyEnumerated(EnumType.STRING)
  @MapKeyColumn(name = "role", length = 20)
  @Column(name = "cards", nullable = false)
  @Builder.Default
  private Map<Role, Integer> deck = new EnumMap<>(Role.class);

  /** Players of the game, ordered by seat. Inverse side: the column is in {@code GamePlayer}. */
  // the live board loads up to 50 games, the collections of all of them are fetched in one query instead of one per game
  @OneToMany(mappedBy = "game")
  @BatchSize(size = 50)
  @OrderBy("seat")
  @Builder.Default
  private List<GamePlayer> players = new ArrayList<>();
}
