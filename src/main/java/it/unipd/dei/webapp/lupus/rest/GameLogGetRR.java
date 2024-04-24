package it.unipd.dei.webapp.lupus.rest;

import it.unipd.dei.webapp.lupus.dao.GetActionByIdGameDAO;
import it.unipd.dei.webapp.lupus.dao.GetGameRoundDAO;
import it.unipd.dei.webapp.lupus.dao.SelectRoleDAO;
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


public class GameLogGetRR extends AbstractRR
{
    private final int POSIDPART = 7;
    private final int POSISMASTER= POSIDPART + 1;
    public static final String MASTEROLE = "master";
    //GamePhase

    private interface HttpServletFunct {public void exe(HttpServletRequest request, HttpServletResponse response);}

    private final String idPart;
    private final String isMaster;
    private final String nmPlayer;
    private final int round;//round of game



    public GameLogGetRR(final HttpServletRequest request, final HttpServletResponse response, DataSource ds)
    {
        super(Actions.ADD_ACTIONS, request, response, ds);
        this.idPart = getPartUrl(POSIDPART, req);//id of game;
        this.isMaster = getPartUrl(POSISMASTER, req);
        this.nmPlayer ="";//((Player) request.getSession().getAttribute(UserFilter.USER_ATTRIBUTE)).getUsername();
        int app=0;
        try {app = new GetGameRoundDAO(ds.getConnection(), this.idPart).getOutputParam();}
        catch (SQLException e) {LOGGER.error("Fatal error while try to get round.");}
        this.round = app;
    }



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
                    // TODO --> to implement the writeJSON method in the action.java class
                    new ResourceList<Action>(r).toJSON(res.getOutputStream());//to do return ???
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
            catch (IOException e)  {LOGGER.error("Cannot list Action: unexpected database error.", e);}//to do change error

        };

        log(a, req, res);
    }

    private ArrayList<Action> getLog() throws SQLException
    {
        ArrayList<Action> r = new ArrayList<Action>();
        final int max;

       r = new GetActionByIdGameDAO(ds.getConnection(), idPart).access().getOutputParam();

        if(!this.isMaster.equals(MASTEROLE) && r.size()>0)
            r.removeIf(x -> (!x.getPlayer().equals(nmPlayer) && x.getPhase()==GamePhase.NIGHT.ordinal()));


        return r;
    }



    private String getPartUrl(int i, HttpServletRequest req)
    {
        String[] s = req.getRequestURL().toString().split("/");

        return i<s.length ? s[i]: "";
    }

    private void log(HttpServletFunct function, HttpServletRequest request, HttpServletResponse response)
    {
        LogContext.setIPAddress(request.getRemoteAddr());
        function.exe(request, response);
        LogContext.removeIPAddress();
    }
}
