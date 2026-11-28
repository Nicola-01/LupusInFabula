package dev.busato.lupus.security;

import java.util.Collection;
import java.util.List;
import java.util.UUID;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

/** The logged user kept in the session: id (stable, the username can change), username, BCrypt hash. */
public record PlayerPrincipal(UUID id, String username, String passwordHash) implements UserDetails {
  @Override public Collection<? extends GrantedAuthority> getAuthorities() { return List.of(); }
  @Override public String getPassword() { return passwordHash; }
  @Override public String getUsername() { return username; }
}
