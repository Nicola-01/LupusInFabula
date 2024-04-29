package it.unipd.dei.webapp.lupus.resource;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonParser;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.message.StringFormatterMessageFactory;


import java.io.IOException;
import java.io.OutputStream;

/**
 * Abstract base class for resources providing JSON serialization functionality.
 * <p>
 * Subclasses should implement the {@code writeJSON} method to define the JSON representation of the resource.
 * </p>
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public abstract class AbstractResource implements Resource {

    /**
     * A LOGGER available for all the subclasses.
     */
    protected static final Logger LOGGER = LogManager.getLogger(AbstractResource.class, StringFormatterMessageFactory.INSTANCE);

    /**
     * The JSON factory to be used for creating JSON parsers and generators.
     */
    protected static final JsonFactory JSON_FACTORY;

    static {
        // set up the JSON factory
        JSON_FACTORY = new JsonFactory();
        JSON_FACTORY.disable(JsonGenerator.Feature.AUTO_CLOSE_TARGET);
        JSON_FACTORY.disable(JsonParser.Feature.AUTO_CLOSE_SOURCE);

        LOGGER.debug("JSON factory successfully setup.");
    }

    @Override
    public void toJSON(final OutputStream out) throws IOException {

        if(out == null) {
            LOGGER.error("The output stream cannot be null.");
            throw new IOException("The output stream cannot be null.");
        }

        try {
            writeJSON(out);
        } catch(Exception e) {
            LOGGER.error("Unable to serialize the resource to JSON.", e);
            throw new IOException("Unable to serialize the resource to JSON.", e);
        }

    }

    /**
     * Performs the actual writing of JSON.
     *
     * Subclasses have to implement this method to provide the actual logic needed for representing the {@code
     * Resource} to JSON.
     *
     * @param out the stream to which the JSON representation of the {@code Resource} has to be written.
     *
     * @throws Exception if something goes wrong during writing.
     */
    protected abstract void writeJSON(OutputStream out) throws Exception;
}
