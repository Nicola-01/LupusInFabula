package dev.busato.lupus.service;

import dev.busato.lupus.dto.RoleResponse;
import dev.busato.lupus.dto.RolesByTypeResponse;
import dev.busato.lupus.mappers.RoleMapper;
import dev.busato.lupus.model.Role;
import dev.busato.lupus.model.RoleType;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RoleService {

  private final RoleMapper roleMapper;

  /**
   * Playable roles grouped by type, in the enum order. Every type is present, even with no roles.
   */
  public RolesByTypeResponse getRolesByType() {
    Map<RoleType, List<RoleResponse>> byType = new EnumMap<>(RoleType.class);

    for (RoleType type : RoleType.values())
      byType.put(type, new ArrayList<>());

    for (Role role : Role.values())
      byType.get(role.getType()).add(roleMapper.mapToResponse(role));

    return new RolesByTypeResponse(byType);
  }
}
