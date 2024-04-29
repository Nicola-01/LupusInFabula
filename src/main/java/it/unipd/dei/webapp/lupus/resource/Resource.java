package it.unipd.dei.webapp.lupus.resource;

import java.io.IOException;
import java.io.OutputStream;

/**
 * Represents a resource that can be serialized to JSON.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public interface Resource {

    /**
     * Returns a JSON representation of the {@code Resource} into the given {@code OutputStream}.
     *
     * @param out the stream to which the JSON representation of the {@code Resource} has to be written.
     *
     * @throws IOException if something goes wrong while serializing the {@code Resource}.
     */
    void toJSON(OutputStream out) throws IOException;

}