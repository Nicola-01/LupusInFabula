package it.unipd.dei.webapp.lupus.resource;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonToken;

import java.io.EOFException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

public class UserUpdate extends AbstractResource {

    private static final String JSON_NAME = "userUpdate";

    private final String oldPassword;
    private final String newPassword;
    private final String repeatNewPassword;

    private final String oldEmail;
    private final String newEmail;

    public UserUpdate(String oldPassword, String newPassword, String repeatNewPassword, String oldEmail, String newEmail) {
        this.oldPassword = oldPassword;
        this.newPassword = newPassword;
        this.repeatNewPassword = repeatNewPassword;
        this.oldEmail = oldEmail;
        this.newEmail = newEmail;
    }

    public String getOldPassword() {
        return oldPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public String getOldEmail() {
        return oldEmail;
    }

    public String getRepeatNewPassword() {
        return repeatNewPassword;
    }

    public String getNewEmail() {
        return newEmail;
    }

    @Override
    protected void writeJSON(OutputStream out) throws Exception {}

    public static UserUpdate fromJSON(InputStream in) throws Exception {

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
