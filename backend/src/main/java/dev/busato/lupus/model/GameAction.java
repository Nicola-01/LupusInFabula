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
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.annotations.UuidGenerator;

/** One entry of the game log: what a player did, in which round and phase. */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(
    name = "game_action",
    indexes = {
      @Index(columnList = "game_id, round, phase"),
      @Index(columnList = "game_id, type")
    })
public class GameAction {

  @Id
  @GeneratedValue
  @UuidGenerator(style = UuidGenerator.Style.VERSION_7)
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "game_id")
  @OnDelete(action = OnDeleteAction.CASCADE)
  private Game game;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "actor_id")
  @OnDelete(action = OnDeleteAction.CASCADE)
  private GamePlayer actor;

  /** {@code null} = "no target". */
  @ManyToOne(fetch = FetchType.LAZY, optional = true)
  @JoinColumn(name = "target_id")
  @OnDelete(action = OnDeleteAction.CASCADE)
  private GamePlayer target;

  @Column(nullable = false)
  private int round;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private GamePhase phase;

  /** 0 = night or first day vote, 1-2 = ballots. */
  @Column(nullable = false)
  @Builder.Default
  private int subphase = 0;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private ActionType type;

  /** Blocked by the illusionist. */
  @Column(nullable = false)
  @Builder.Default
  private boolean blocked = false;
}
