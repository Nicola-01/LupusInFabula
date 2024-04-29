package it.unipd.dei.webapp.lupus.rest;

import java.io.IOException;

/**
 * Represents a REST resource that can serve a REST request.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public interface RestResource {

    /**
     * Serves a REST request.
     *
     * @throws IOException if any error occurs in the client/server communication.
     */
    void serve() throws IOException;

}
