package dev.busato.lupus.service;

import dev.busato.lupus.dto.SessionResponse;
import dev.busato.lupus.dto.SignupRequest;
import dev.busato.lupus.exceptions.AlreadyUsedException;
import dev.busato.lupus.mappers.PlayerMapper;
import dev.busato.lupus.model.Game;
import dev.busato.lupus.model.Player;
import dev.busato.lupus.repository.GameRepository;
import dev.busato.lupus.repository.PlayerRepository;
import java.util.Locale;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

  private final PlayerRepository playerRepository;
  private final GameRepository gameRepository;
  private final PasswordEncoder passwordEncoder;
  private final PlayerMapper playerMapper;

  /** The exists-check gives the friendly 409; a race between two equal signups is stopped by the UNIQUE constraint. */
  @Transactional
  public void signup(SignupRequest request) {
    if (playerRepository.existsByUsernameIgnoreCase(request.username()))
      throw new AlreadyUsedException("username");
    if (playerRepository.existsByEmail(request.email().toLowerCase(Locale.ROOT)))
      throw new AlreadyUsedException("email");

    playerRepository.save(
        Player.builder()
            .username(request.username())
            .email(request.email())
            .passwordHash(passwordEncoder.encode(request.password()))
            .build());
    log.info("Signup: {}", request.username());
  }

  @Transactional(readOnly = true)
  public SessionResponse session(UUID playerId) {
    Player player =
        playerRepository
            .findByIdAndDeletedAtIsNull(playerId)
            .orElseThrow(() -> new InsufficientAuthenticationException("Player not found"));
    String gamemaster =
        gameRepository
            .findFirstByMasterIdAndEndedAtIsNull(playerId)
            .map(Game::getPublicId)
            .orElse(null);
    return new SessionResponse(playerMapper.mapToResponse(player), gamemaster);
  }
}
