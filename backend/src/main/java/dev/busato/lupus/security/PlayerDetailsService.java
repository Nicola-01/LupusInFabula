package dev.busato.lupus.security;

import dev.busato.lupus.repository.PlayerRepository;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Loads a player by username or email, for login and remember-me. Deleted accounts are not found. */
@Service
@RequiredArgsConstructor
public class PlayerDetailsService implements UserDetailsService {

  private final PlayerRepository playerRepository;

  @Override
  @Transactional(readOnly = true)
  public PlayerPrincipal loadUserByUsername(String login) {
    return playerRepository
        .findActiveByLogin(login, login.toLowerCase(Locale.ROOT))
        .map(player -> new PlayerPrincipal(player.getId(), player.getUsername(), player.getPasswordHash()))
        .orElseThrow(() -> new UsernameNotFoundException("Player not found"));
  }
}
