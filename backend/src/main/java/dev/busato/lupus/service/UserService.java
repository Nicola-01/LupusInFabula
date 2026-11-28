package dev.busato.lupus.service;

import dev.busato.lupus.dto.PlayerSearchResponse;
import dev.busato.lupus.dto.ProfileResponse;
import dev.busato.lupus.dto.UpdateProfileRequest;
import dev.busato.lupus.exceptions.AlreadyUsedException;
import dev.busato.lupus.exceptions.PlayerNotFoundException;
import dev.busato.lupus.exceptions.SearchTooShortException;
import dev.busato.lupus.exceptions.WrongPasswordException;
import dev.busato.lupus.mappers.PlayerMapper;
import dev.busato.lupus.model.Player;
import dev.busato.lupus.repository.PlayerRepository;
import java.time.Instant;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Limit;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

  private static final int MAX_RESULTS = 20;

  private final PlayerRepository playerRepository;
  private final PlayerMapper playerMapper;
  private final PasswordEncoder passwordEncoder;

  @Transactional(readOnly = true)
  public ProfileResponse me(UUID id) {
    return playerMapper.mapToOwnProfile(active(id));
  }

  @Transactional(readOnly = true)
  public ProfileResponse profile(String username) {
    Player player =
        playerRepository
            .findByUsernameIgnoreCaseAndDeletedAtIsNull(username)
            .orElseThrow(() -> new PlayerNotFoundException(username));
    return playerMapper.mapToPublicProfile(player); // the stored spelling, the frontend fixes the URL with it
  }

  /** Dirty checking saves the changes at the end of the transaction: no explicit save. */
  @Transactional
  public ProfileResponse update(UUID id, UpdateProfileRequest request) {
    Player player = active(id);
    checkPassword(player, request.currentPassword());
    if (request.username() != null) {
      if (playerRepository.existsByUsernameIgnoreCaseAndIdNot(request.username(), id))
        throw new AlreadyUsedException("username");
      player.setUsername(request.username());
    }
    if (request.email() != null) {
      String email = request.email().toLowerCase(Locale.ROOT); // checked before the UNIQUE constraint
      if (playerRepository.existsByEmailAndIdNot(email, id)) throw new AlreadyUsedException("email");
      player.setEmail(email);
    }
    if (request.password() != null)
      player.setPasswordHash(passwordEncoder.encode(request.password()));
    log.info("Profile updated: {}", player.getUsername());
    return playerMapper.mapToOwnProfile(player);
  }

  /** Soft delete: the row stays (games keep their players), the email is freed, the username stays taken. */
  @Transactional
  public void delete(UUID id, String currentPassword) {
    Player player = active(id);
    checkPassword(player, currentPassword);
    player.setDeletedAt(Instant.now());
    player.setEmail(null);
    log.info("Account deleted: {}", player.getUsername());
  }

  @Transactional(readOnly = true)
  public List<PlayerSearchResponse> search(UUID id, String text) {
    String stripped = text.strip();
    if (stripped.length() < 2) throw new SearchTooShortException();
    // escape the LIKE wildcards so that "_" and "%" are searched as plain characters
    String escaped = stripped.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_");
    return playerRepository.search(escaped, id, Limit.of(MAX_RESULTS));
  }

  /** A deleted account with a still-open session gets 401. */
  private Player active(UUID id) {
    return playerRepository
        .findByIdAndDeletedAtIsNull(id)
        .orElseThrow(() -> new InsufficientAuthenticationException("Account deleted"));
  }

  private void checkPassword(Player player, String currentPassword) {
    if (!passwordEncoder.matches(currentPassword, player.getPasswordHash()))
      throw new WrongPasswordException();
  }
}
