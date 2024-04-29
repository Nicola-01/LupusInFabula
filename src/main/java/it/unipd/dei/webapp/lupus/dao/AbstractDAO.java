package it.unipd.dei.webapp.lupus.dao;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.message.StringFormatterMessageFactory;

import java.sql.Connection;
import java.sql.SQLException;

/**
 * Abstract DAO object class.
 *
 * @param <T> the type of the output parameter
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public abstract class AbstractDAO<T> implements DataAccessObject<T> {

    /**
     * A LOGGER available for all the subclasses.
     */
    protected static final Logger LOGGER = LogManager.getLogger(AbstractDAO.class,
            StringFormatterMessageFactory.INSTANCE);

    /**
     * The connection to be used to access the database.
     */
    protected final Connection con;

    /**
     * The output parameter, if any
     */
    protected T outputParam = null;

    /**
     * Indicates whether the database has been already accessed or not.
     */
    private boolean accessed = false;

    /**
     * A lock for synchronization.
     */
    private final Object lock = new Object();

    /**
     * Creates a new DAO object.
     *
     * @param con the connection to be used for accessing the database.
     */
    protected AbstractDAO(final Connection con) {

        if (con == null) {
            LOGGER.error("The connection cannot be null.");
            throw new NullPointerException("The connection cannot be null.");
        }
        this.con = con;

        try {
            // ensure that autocommit is true
            con.setAutoCommit(true);
            LOGGER.debug("Auto-commit set to default value true.");
        } catch (final SQLException e) {
            LOGGER.warn("Unable to set connection auto-commit to true.", e);
        }

    }

    public final DataAccessObject<T> access() throws SQLException {

        synchronized (lock) {
            try {
                if (accessed) {
                    LOGGER.error("Cannot use a DataAccessObject more than once.");
                    throw new SQLException("Cannot use a DataAccessObject more than once.");
                }
            } finally {
                accessed = true;
            }
        }

        try {
            doAccess();

            try {
                con.close();
                LOGGER.debug("Connection successfully closed.");
            } catch (final SQLException e) {
                LOGGER.error("Unable to close the connection to the database.", e);
                throw e;
            }
        } catch (final Throwable t) {

            LOGGER.error("Unable to perform the requested database access operation.", t);

            try {
                if (!con.getAutoCommit()) {
                    // autoCommit == false => transaction needs to be rolled back
                    con.rollback();
                    LOGGER.info("Transaction successfully rolled-back.");
                }
            } catch (final SQLException e) {
                LOGGER.error("Unable to roll-back the transaction.", e);
            } finally {
                try {
                    con.close();
                    LOGGER.debug("Connection successfully closed.");
                } catch (final SQLException e) {
                    LOGGER.error("Unable to close the connection to the database.", e);
                }

            }

            if (t instanceof SQLException) {
                throw (SQLException) t;
            } else {
                throw new SQLException("Unable to perform the requested database access operation.", t);
            }
        }

        return this;
    }


    @Override
    public final T getOutputParam() {

        synchronized (lock) {
            if (!accessed) {
                LOGGER.error("Cannot retrieve the output parameter before accessing the database.");
                throw new IllegalStateException("Cannot retrieve the output parameter before accessing the database.");
            }
        }

        return outputParam;
    }

    /**
     * Performs the actual logic needed for accessing the database.
     * <p>
     * Subclasses have to implement this method in order to define the
     * actual strategy for accessing the database.
     *
     * @throws Exception if there is any issue.
     */
    protected abstract void doAccess() throws Exception;


}
