package it.unipd.dei.webapp.lupus.utils;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.HexFormat;

/**
 * Password hashing with PBKDF2-HMAC-SHA256 and a random salt.
 * <p>
 * Format: {@code pbkdf2$<iterations>$<salt base64>$<hash base64>} (83 characters).
 * Legacy rows store an unsalted MD5 as 32 hex characters: {@link #verify} still accepts them,
 * and {@link #needsRehash} tells the caller to replace them on the next successful login.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public final class PasswordHash {

    /**
     * Prefix of the PBKDF2 format.
     */
    private static final String PREFIX = "pbkdf2";

    /**
     * Key derivation algorithm.
     */
    private static final String ALGORITHM = "PBKDF2WithHmacSHA256";

    /**
     * Number of PBKDF2 iterations for new hashes.
     */
    private static final int ITERATIONS = 210000;

    /**
     * Salt length in bytes.
     */
    private static final int SALT_BYTES = 16;

    /**
     * Derived key length in bits (256).
     */
    private static final int KEY_BITS = 256;

    private static final SecureRandom RANDOM = new SecureRandom();

    private PasswordHash() {
    }

    /**
     * Hashes a password with a new random salt.
     *
     * @param password the plain password (not null)
     * @return the string to store in the database
     */
    public static String hash(final String password) {
        byte[] salt = new byte[SALT_BYTES];
        RANDOM.nextBytes(salt);
        try {
            byte[] key = derive(password, salt, ITERATIONS);
            return PREFIX + "$" + ITERATIONS + "$" + Base64.getEncoder().encodeToString(salt)
                    + "$" + Base64.getEncoder().encodeToString(key);
        } catch (GeneralSecurityException e) {
            throw new IllegalStateException("Password hashing failed", e);
        }
    }

    /**
     * Checks a password against a stored value, in constant time with respect to the hash.
     *
     * @param password the plain password typed by the user
     * @param stored   the value stored in the database (PBKDF2 or legacy MD5)
     * @return true if the password matches, false otherwise (also for malformed values)
     */
    public static boolean verify(final String password, final String stored) {
        if (password == null || stored == null) {
            return false;
        }

        if (isLegacy(stored)) {
            byte[] expected = md5Hex(password).getBytes(StandardCharsets.US_ASCII);
            return MessageDigest.isEqual(expected, stored.getBytes(StandardCharsets.US_ASCII));
        }

        String[] parts = stored.split("\\$");
        if (parts.length != 4 || !PREFIX.equals(parts[0])) {
            return false;
        }
        try {
            int iterations = Integer.parseInt(parts[1]);
            byte[] salt = Base64.getDecoder().decode(parts[2]);
            byte[] expected = Base64.getDecoder().decode(parts[3]);
            byte[] actual = derive(password, salt, iterations);
            return MessageDigest.isEqual(expected, actual);
        } catch (IllegalArgumentException | GeneralSecurityException e) {
            return false;
        }
    }

    /**
     * Tells whether a stored value must be replaced with a new hash (it is not in the PBKDF2 format).
     *
     * @param stored the value stored in the database
     * @return true if the value is a legacy hash
     */
    public static boolean needsRehash(final String stored) {
        return stored == null || !stored.startsWith(PREFIX + "$");
    }

    private static boolean isLegacy(final String stored) {
        return stored.matches("[0-9a-f]{32}");
    }

    private static String md5Hex(final String password) {
        try {
            byte[] digest = MessageDigest.getInstance("MD5").digest(password.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (java.security.NoSuchAlgorithmException e) {
            throw new IllegalStateException("MD5 not available", e);
        }
    }

    private static byte[] derive(final String password, final byte[] salt, final int iterations)
            throws GeneralSecurityException {
        PBEKeySpec spec = new PBEKeySpec(password.toCharArray(), salt, iterations, KEY_BITS);
        try {
            return SecretKeyFactory.getInstance(ALGORITHM).generateSecret(spec).getEncoded();
        } finally {
            spec.clearPassword();
        }
    }
}
