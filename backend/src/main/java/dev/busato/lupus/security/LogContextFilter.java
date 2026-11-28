package dev.busato.lupus.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.slf4j.MDC;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

/** Puts the logged user and the client IP in the MDC, so every log line of the request shows them. */
public class LogContextFilter extends OncePerRequestFilter {
  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
      throws ServletException, IOException {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth != null && auth.isAuthenticated() && !(auth instanceof AnonymousAuthenticationToken))
      MDC.put("user", auth.getName());
    MDC.put("ip", request.getRemoteAddr());
    try {
      chain.doFilter(request, response);
    } finally {
      // Tomcat reuses threads: without this the next request on the same thread would inherit the user
      MDC.remove("user");
      MDC.remove("ip");
    }
  }
}
