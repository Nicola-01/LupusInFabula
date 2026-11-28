package dev.busato.lupus.mappers;

import dev.busato.lupus.dto.RoleResponse;
import dev.busato.lupus.model.Role;
import org.springframework.stereotype.Component;

@Component
public class RoleMapper {

  public RoleResponse mapToResponse(Role role) {
    return new RoleResponse(
        role,
        role.getType(),
        role.getWithWhoWins(),
        role.getMaxNumber(),
        role.getDescription());
  }
}
