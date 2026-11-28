package dev.busato.lupus.repository;

import dev.busato.lupus.dto.FriendResponse;
import dev.busato.lupus.model.Friendship;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, UUID> {

  boolean existsByPlayerIdAndFriendId(UUID playerId, UUID friendId);

  Optional<Friendship> findByPlayerIdAndFriendUsernameIgnoreCase(UUID playerId, String friendUsername);

  /** Friends of a player that still have an account, with the number of games played together. */
  @Query("""
      SELECT new dev.busato.lupus.dto.FriendResponse(f.friend.username,
        (SELECT count(gp1) FROM GamePlayer gp1, GamePlayer gp2
          WHERE gp1.game = gp2.game AND gp1.player = f.player AND gp2.player = f.friend),
        f.since)
      FROM Friendship f
      WHERE f.player.id = :playerId AND f.friend.deletedAt IS NULL
      ORDER BY lower(f.friend.username)""")
  List<FriendResponse> findFriends(UUID playerId);
}
