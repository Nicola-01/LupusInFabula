package it.unipd.dei.webapp.lupus.resource;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonToken;

import java.io.EOFException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

/**
 * Represents the update of a user in the database, so when a user wants to change his password or his email.<br>
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class UserUpdate extends AbstractResource {

    /**
     * The JSON field name for user update.
     */
    private static final String JSON_NAME = "userUpdate";

    /**
     * The old password for the user update.
     */
    private final String oldPassword; //can also be used as a confirmation password (e.g. when deleting the account)

    /**
     * The new password for the user update.
     */
    private final String newPassword;

    /**
     * The repeated new password for the user update.
     */
    private final String repeatNewPassword;

    /**
     * The old email for the user update.
     */
    private final String oldEmail;

    /**
     * The new email for the user update.
     */
    private final String newEmail;

    /**
     * Constructs a new UserUpdate object with the specified old password, new password, repeated new password,
     * old email, and new email.
     *
     * @param oldPassword       the old password for the user update
     * @param newPassword       the new password for the user update
     * @param repeatNewPassword the repeated new password for the user update
     * @param oldEmail          the old email for the user update
     * @param newEmail          the new email for the user update
     */
    public UserUpdate(String oldPassword, String newPassword, String repeatNewPassword, String oldEmail, String newEmail) {
        this.oldPassword = oldPassword;
        this.newPassword = newPassword;
        this.repeatNewPassword = repeatNewPassword;
        this.oldEmail = oldEmail;
        this.newEmail = newEmail;
    }

    /**
     * Gets the old password.
     *
     * @return the old password
     */
    public String getOldPassword() {
        return oldPassword;
    }

    /**
     * Gets the new password.
     *
     * @return the new password
     */
    public String getNewPassword() {
        return newPassword;
    }

    /**
     * Gets the old email.
     *
     * @return the old email
     */
    public String getOldEmail() {
        return oldEmail;
    }

    /**
     * Gets the repeated new password.
     *
     * @return the repeated new password
     */
    public String getRepeatNewPassword() {
        return repeatNewPassword;
    }

    /**
     * Gets the new email.
     *
     * @return the new email
     */
    public String getNewEmail() {
        return newEmail;
    }


    @Override
    protected void writeJSON(OutputStream out) throws Exception {}

    /**
     * Parses a UserUpdate object from JSON representation read from the specified input stream.
     *
     * @param in the input stream containing the JSON representation
     * @return the parsed UserUpdate object
     * @throws IOException if an I/O error occurs while parsing the JSON representation
     */
    public static UserUpdate fromJSON(InputStream in) throws IOException {

        String oldPassword = "";
        String newPassword = "";
        String repeatNewPassword = "";

        String oldEmail = "";
        String newEmail = "";

        try {

            final JsonParser jp = JSON_FACTORY.createParser(in);

            while (jp.getCurrentToken() != JsonToken.FIELD_NAME || !JSON_NAME.equals(jp.getCurrentName())) {

                if (jp.nextToken() == null) {

                    LOGGER.error("No UserUpdate object found in the stream");
                    throw new EOFException("Unable to parse JSON: no UserUpdate object found");

                }

            }

            while (jp.nextToken() != JsonToken.END_OBJECT) {

                if (jp.getCurrentToken() == JsonToken.FIELD_NAME) {

                    switch (jp.getCurrentName()) {
                        case "oldPassword":
                            jp.nextToken();
                            oldPassword = jp.getText();
                            break;
                        case "newPassword":
                            jp.nextToken();
                            newPassword = jp.getText();
                            break;
                        case "repeatNewPassword":
                            jp.nextToken();
                            repeatNewPassword = jp.getText();
                            break;
                        case "oldEmail":
                            jp.nextToken();
                            oldEmail = jp.getText();
                            break;
                        case "newEmail":
                            jp.nextToken();
                            newEmail = jp.getText();
                            break;
                    }

                }

            }

        } catch (IOException e) {

            LOGGER.error("Unable to parse an UserUpdate object from Json", e);
            throw e;

        }

        return new UserUpdate(oldPassword, newPassword, repeatNewPassword, oldEmail, newEmail);

    }
}
