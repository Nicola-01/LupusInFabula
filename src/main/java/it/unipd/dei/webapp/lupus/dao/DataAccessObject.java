package it.unipd.dei.webapp.lupus.dao;

import java.sql.SQLException;

/**
 * Interface for accessing the database and retrieving output parameters.
 *
 * @param <T> the type of the output parameter.
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public interface DataAccessObject<T> {

    /**
     * Accesses the database.
     *
     * @return a reference to this {@code DataAccessObject} object.
     * @throws SQLException if something goes wrong while accessing the database.
     */
    DataAccessObject<T> access() throws SQLException;

    /**
     * Retrieves any output parameters, after the access to the database.
     *
     * @return output parameter, or @code{null} if there is no output parameter.
     */
    T getOutputParam();

}
