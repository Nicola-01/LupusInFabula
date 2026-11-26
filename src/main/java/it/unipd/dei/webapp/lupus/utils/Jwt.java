package it.unipd.dei.webapp.lupus.utils;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.JSONObject;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;

/**
 * Minimal HS256 JSON Web Token support, with the standard library only.
 * The secret comes from the {@code JWT_SECRET} environment variable; without a valid one, a random secret
 * is generated at startup and the tokens do not survive a restart.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public final class Jwt {

    private static final Logger LOGGER = LogManager.getLogger(Jwt.class);

    private static final Base64.Encoder ENCODER = Base64.getUrlEncoder().withoutPadding();
    private static final Base64.Decoder DECODER = Base64.getUrlDecoder();

    /** The only header accepted: encoded once, compared as is (rejects "none" and every other algorithm). */
    private static final String HEADER =
            ENCODER.encodeToString("{\"alg\":\"HS256\",\"typ\":\"JWT\"}".getBytes(StandardCharsets.UTF_8));

    private static final byte[] SECRET = loadSecret();

    private Jwt() {
    }

    private static byte[] loadSecret() {
        String env = System.getenv("JWT_SECRET");
        if (env != null && env.length() >= 32)
            return env.getBytes(StandardCharsets.UTF_8);

        byte[] random = new byte[32];
        new SecureRandom().nextBytes(random);
        LOGGER.warn("JWT_SECRET missing or shorter than 32 characters: using a random secret, "
                + "login tokens will not survive a server restart");
        return random;
    }

    /**
     * Issues a token for the given username.
     *
     * @param username   the subject of the token.
     * @param ttlSeconds the lifetime of the token in seconds.
     * @return the signed token.
     */
    public static String issue(String username, long ttlSeconds) {
        long now = Instant.now().getEpochSecond();
        JSONObject payload = new JSONObject()
                .put("sub", username)
                .put("iat", now)
                .put("exp", now + ttlSeconds);

        String signingInput = HEADER + "." + ENCODER.encodeToString(payload.toString().getBytes(StandardCharsets.UTF_8));
        return signingInput + "." + ENCODER.encodeToString(sign(signingInput));
    }

    /**
     * Verifies a token.
     *
     * @param token the token to check, may be null.
     * @return the username in the token, or null if the format, the header, the signature or the expiry is not valid.
     */
    public static String verify(String token) {
        if (token == null)
            return null;

        String[] parts = token.split("\\.", -1);
        if (parts.length != 3 || !HEADER.equals(parts[0]))
            return null;

        try {
            byte[] given = DECODER.decode(parts[2]);
            if (!MessageDigest.isEqual(sign(parts[0] + "." + parts[1]), given))
                return null;

            JSONObject payload = new JSONObject(new String(DECODER.decode(parts[1]), StandardCharsets.UTF_8));
            if (Instant.now().getEpochSecond() >= payload.getLong("exp"))
                return null;

            return payload.getString("sub");
        } catch (RuntimeException e) { // bad Base64, bad JSON or missing claim
            return null;
        }
    }

    private static byte[] sign(String signingInput) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(SECRET, "HmacSHA256"));
            return mac.doFinal(signingInput.getBytes(StandardCharsets.UTF_8));
        } catch (GeneralSecurityException e) {
            throw new IllegalStateException("HmacSHA256 not available", e);
        }
    }
}
