package it.unipd.dei.webapp.lupus.rest;

import it.unipd.dei.webapp.lupus.dao.*;
import it.unipd.dei.webapp.lupus.filter.UserFilter;
import it.unipd.dei.webapp.lupus.resource.*;
import it.unipd.dei.webapp.lupus.utils.ErrorCode;
import it.unipd.dei.webapp.lupus.utils.GamePhase;
import it.unipd.dei.webapp.lupus.utils.GameRoleAction;
import it.unipd.dei.webapp.lupus.utils.RoleType;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import javax.sql.DataSource;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static it.unipd.dei.webapp.lupus.utils.ErrorCode.LOGS_NOT_EXIST;

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
     */
    private interface HttpServletFunct {public void exe(HttpServletRequest request, HttpServletResponse response);}

    /**
     * numeric identifier for the game
     */
    private final int gameID;

    /**
     * boolean that represent if a user logged is a master or not
     */
    private final boolean isMaster;

    /**
     * username of the logged in player
     */
    private final String nmPlayer;


    /**
     * Constructor for the class
     *
     * @param request  request arrive from the server
     * @param response response to return
     * @param isMaster boolean that represent if a user logged is a master or not
     * @param gameID   numeric identifier for the game
     * @param ds       the connection pool to the database.
     */
    public GameLogGetRR(int gameID, boolean isMaster, final HttpServletRequest request, final HttpServletResponse response, DataSource ds)
    {
        super(Actions.GET_LOGS, request, response, ds);
        this.gameID = gameID;
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
                    LOGGER.info(String.format("Action successfully listed for game %d.", gameID));
                    res.setStatus(HttpServletResponse.SC_OK);
                    new ResourceList<Action>(r).toJSON(res.getOutputStream());
                }
                else
                {
                    LOGGER.error("Fatal error while listing Action or logs not exist.");

                    ErrorCode ec = ErrorCode.LOGS_NOT_EXIST;
                    m = new Message("Cannot list Action: unexpected error or log not exist.", ec.getErrorCode(),  ec.getErrorMessage());
                    res.setStatus(ec.getHTTPCode());
                    m.toJSON(res.getOutputStream());
                }
            }
            catch (SQLException e) {LOGGER.error("Cannot list Action: unexpected database error.", e);}
            catch (IOException e)  {LOGGER.error("Cannot list Action: unexpected input output error.", e);}//to do change error

        };

        log(a, req, res);
    }

    /**
     * Method to get all logs from the database.
     *
     * @return ArrayList of Action objects representing the logs.
     * @throws SQLException if an SQL error occurs.
     */
    private ArrayList<Action> getLog() throws SQLException
    {
        ArrayList<Action> r = new GetActionByIdGameDAO(ds.getConnection(), gameID).access().getOutputParam();
        ArrayList<Action> d = new GetDeadPlayersInformationByGameIdDAO(ds.getConnection(), gameID).access().getOutputParam();
        Map pl = new GetPlayersAndRoleByGameIdDAO(ds.getConnection(), gameID).access().getOutputParam();
        boolean isDorkyActive = (new IsDorkyAWolfDAO(ds.getConnection(), ds, gameID).access().getOutputParam());
        boolean nmDivNig;
        boolean isPlugueAction;
        boolean isEvilUs;
        int i=0;

        if(!this.isMaster && !r.isEmpty())
            while (i<r.size())
            {
                nmDivNig =  !(r.get(i).getPlayer().equals(nmPlayer)) &&
                        r.get(i).getPhase()==GamePhase.NIGHT.ordinal();
                isPlugueAction = r.get(i).getTypeAction().equals(GameRoleAction.PLAGUE_SPREADER.getAction());
                isEvilUs =  GameRoleAction.valueOfName(String.valueOf(pl.get(nmPlayer))).getRoleType().equals(RoleType.EVIL) &&
                            GameRoleAction.valueOfName(String.valueOf(pl.get(r.get(i).getPlayer()))).getRoleType().equals(RoleType.EVIL);
                isEvilUs = pl.get(nmPlayer).equals(GameRoleAction.DORKY.getName()) ? isDorkyActive && isEvilUs : isEvilUs;

                if(nmDivNig && !isPlugueAction && !isEvilUs)
                    r.remove(r.get(i));
                else
                    i++;
            }

        r.addAll(d);
        r.sort(Action::compareTo);

        return r;
    }

    /**
     * Method to execute logging context for a given function.
     *
     * @param function The function to execute.
     * @param request  Request arriving from the server.
     * @param response Response to return.
     */
    private void log(HttpServletFunct function, HttpServletRequest request, HttpServletResponse response)
    {
        LogContext.setIPAddress(request.getRemoteAddr());
        LogContext.setGame(gameID);
        LogContext.setUser(nmPlayer);

        function.exe(request, response);

        LogContext.removeIPAddress();
        LogContext.removeGame();
        LogContext.removeUser();
    }
}
