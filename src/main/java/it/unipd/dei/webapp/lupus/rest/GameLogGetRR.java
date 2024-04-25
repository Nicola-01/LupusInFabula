package it.unipd.dei.webapp.lupus.rest;

import it.unipd.dei.webapp.lupus.dao.GetActionByIdGameDAO;
import it.unipd.dei.webapp.lupus.dao.GetGameRoundDAO;
import it.unipd.dei.webapp.lupus.dao.SelectRoleDAO;
import it.unipd.dei.webapp.lupus.filter.UserFilter;
import it.unipd.dei.webapp.lupus.resource.*;
import it.unipd.dei.webapp.lupus.servlet.GameLogServlet;
import it.unipd.dei.webapp.lupus.utils.GamePhase;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import javax.sql.DataSource;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;

/**
 * class to manege the log of a game
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class GameLogGetRR extends AbstractRR
{
    /**
     * interface to create ab object that represent a function that don't have a return parameter and take as parameter the request and response for a url
     * */
    private interface HttpServletFunct {public void exe(HttpServletRequest request, HttpServletResponse response);}

    /**
     * numeric identifier for the game
     * */
    private final int idPart;
    /**
     * boolean that represent if a user logged is a master or not
     * */
    private final boolean isMaster;
    /***
     * username of the logged in player
     */
    private final String nmPlayer;


    /**
     * Constructor for the class
     *
     * @param  request  request arrive from the server
     * @param  response response to return
     * @param  isMaster boolean that represent if a user logged is a master or not
     * @param  idPart numeric identifier for the game
     */
    public GameLogGetRR(int idPart, boolean isMaster, final HttpServletRequest request, final HttpServletResponse response, DataSource ds)
    {
        super(Actions.ADD_ACTIONS, request, response, ds);
        this.idPart = idPart;
        this.isMaster = isMaster;
        this.nmPlayer =((Player) request.getSession().getAttribute(UserFilter.USER_ATTRIBUTE)).getUsername();
    }

    /**
     * function to serve the te request make to the url game/logs/{idPart} and game/logs/{idPart}/master
     */
    @Override
    protected void doServe() throws IOException
    {
        HttpServletFunct a = (req, res)->
        {
            Message m = null;

            try
            {
                ArrayList<Action> r = this.getLog();
                if (r != null)
                {
                    LOGGER.info("Action successfully listed.");
                    res.setStatus(HttpServletResponse.SC_OK);
                    new ResourceList<Action>(r).toJSON(res.getOutputStream());
                }
                else
                {
                    LOGGER.error("Fatal error while listing Action.");

                    m = new Message("Cannot list Action: unexpected error.", "E5A1", null);
                    res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                    m.toJSON(res.getOutputStream());
                }
            }
            catch (SQLException e) {LOGGER.error("Cannot list Action: unexpected database error.", e);}
            catch (IOException e)  {LOGGER.error("Cannot list Action: unexpected input output error.", e);}//to do change error

        };

        log(a, req, res);
    }

    /**
     * function to get all log from db
     */
    private ArrayList<Action> getLog() throws SQLException
    {
        ArrayList<Action> r = new GetActionByIdGameDAO(ds.getConnection(), idPart).access().getOutputParam();

        if(!this.isMaster && r.size()>0)
            r.removeIf(x -> (!x.getPlayer().equals(nmPlayer) && x.getPhase()==GamePhase.NIGHT.ordinal()));

        return r;
    }

    /**
     * function to get all log from db
     * @param  request  request arrive from the server
     * @param  response response to return
     * @param  function function to exec between LogContext
     */
    private void log(HttpServletFunct function, HttpServletRequest request, HttpServletResponse response)
    {
        LogContext.setIPAddress(request.getRemoteAddr());
        function.exe(request, response);
        LogContext.removeIPAddress();
    }
}
