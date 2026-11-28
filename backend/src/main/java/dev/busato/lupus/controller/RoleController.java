package dev.busato.lupus.controller;

import dev.busato.lupus.dto.RolesByTypeResponse;
import dev.busato.lupus.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/rules")
@RequiredArgsConstructor
public class RoleController {

  private final RoleService roleService;

  @GetMapping("/roles")
  public ResponseEntity<RolesByTypeResponse> getRoles() {
    return ResponseEntity.ok(roleService.getRolesByType());
  }
}
