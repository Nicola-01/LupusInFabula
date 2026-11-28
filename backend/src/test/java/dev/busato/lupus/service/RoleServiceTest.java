package dev.busato.lupus.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import dev.busato.lupus.dto.RoleResponse;
import dev.busato.lupus.mappers.RoleMapper;
import dev.busato.lupus.model.Role;
import dev.busato.lupus.model.RoleType;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class RoleServiceTest {

  @Spy private RoleMapper roleMapper; // real mapper, nothing to fake
  @InjectMocks private RoleService roleService;

  @Test
  void getRolesByType_groupsAllRolesByTypeInEnumOrder() {
    Map<RoleType, List<RoleResponse>> roles = roleService.getRolesByType().roles();

    assertEquals(
        List.of(RoleType.GOOD, RoleType.EVIL, RoleType.VICTORY_STEALER, RoleType.NEUTRAL),
        List.copyOf(roles.keySet()));
    assertEquals(
        Role.values().length, roles.values().stream().mapToInt(List::size).sum());
    roles.forEach(
        (type, list) -> list.forEach(response -> assertEquals(type, response.type())));
    assertTrue(names(roles.get(RoleType.GOOD)).contains(Role.FARMER));
    assertTrue(names(roles.get(RoleType.EVIL)).contains(Role.WOLF));
  }

  private static List<Role> names(List<RoleResponse> roles) {
    return roles.stream().map(RoleResponse::name).toList();
  }
}
