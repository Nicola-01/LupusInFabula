package it.unipd.dei.webapp.lupus.rest;

import it.unipd.dei.webapp.lupus.dao.GetActionByIdGameDAO;
import it.unipd.dei.webapp.lupus.dao.SelectRoleDAO;
import it.unipd.dei.webapp.lupus.resource.*;
import it.unipd.dei.webapp.lupus.servlet.GameLogServlet;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import javax.sql.DataSource;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;


public class GameLogGetRR extends AbstractRR
{
    private final int POSIDPART = 7;
    public static final String USERROLE = "USER";

    private interface HttpServletFunct {public void exe(HttpServletRequest request, HttpServletResponse response);}

    public GameLogGetRR(final HttpServletRequest request, final HttpServletResponse response, DataSource ds) {super(Actions.ADD_ACTIONS, request, response, ds);}

    @Override
    protected void doServe() throws IOException
    {
        GameLogGetRR.HttpServletFunct a = (req, res)->
        {
            String idPart = getPartUrl(POSIDPART, req);//id of game
            int phase = Integer.parseInt(req.getParameter("phase"));//phase of game
            Message m = null;

            ArrayList<Action> r = getLog(idPart, USERROLE, phase);
            try
            {
                if (r != null)
                {
                    LOGGER.info("Action successfully listed.");

                    res.setStatus(HttpServletResponse.SC_OK);
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
            catch (IOException e)  {LOGGER.error("Cannot list Action: unexpected database error.", e);}

        };

        log(a, req, res);
    }

    public ArrayList<Action> getLog(String idPart, String role, int phase)
    {
        ArrayList<Action> r = new ArrayList<Action>();
        final int max;

        try {r = new GetActionByIdGameDAO(ds.getConnection(), idPart).access().getOutputParam();}
        catch (SQLException e) {LOGGER.error("Cannot list Action: unexpected database error.", e);}

        if(role.equals(USERROLE) && r.size()>0)
        {
            max = r.get(r.size() - 1).getRound();//query make in order
            r.removeIf(x -> (x.getRound() == max && x.getSubphase() == phase));
        }

        return r;
    }



    private String getPartUrl(int i, HttpServletRequest req)
    {
        String[] s = req.getRequestURL().toString().split("/");

        return i<s.length ? s[i]: "";
    }

    private void log(GameLogGetRR.HttpServletFunct function, HttpServletRequest request, HttpServletResponse response)
    {
        LogContext.setIPAddress(request.getRemoteAddr());
        function.exe(request, response);
        LogContext.removeIPAddress();
    }
}
