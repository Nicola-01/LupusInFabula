package it.unipd.dei.webapp.lupus.resource;

public class Message {
    private final String message;
    private final String errorCode;
    private final String errorDetails;
    private final boolean isError;

    public Message(final String message, final String errorCode, final String errorDetails) {
        this.message = message;
        this.errorCode = errorCode;
        this.errorDetails = errorDetails;
        this.isError = true;
    }

    public Message(final String message) {
        this.message = message;
        this.errorCode = null;
        this.errorDetails = null;
        this.isError = false;
    }

    public final String getMessage() {
        return message;
    }

    public final String getErrorCode() {
        return errorCode;
    }

    public final String getErrorDetails() {
        return errorDetails;
    }

    public final boolean isError() {
        return isError;
    }
}
