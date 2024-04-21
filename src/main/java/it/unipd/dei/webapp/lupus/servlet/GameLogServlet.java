package it.unipd.dei.webapp.lupus.servlet;

import it.unipd.dei.webapp.lupus.dao.LoginPlayerDAO;
import it.unipd.dei.webapp.lupus.dao.SearchPlayerByEmailDAO;
import it.unipd.dei.webapp.lupus.dao.SearchPlayerByUsernameDAO;
import it.unipd.dei.webapp.lupus.dao.SingupPlayerDAO;
import it.unipd.dei.webapp.lupus.resource.Actions;
import it.unipd.dei.webapp.lupus.resource.LogContext;
import it.unipd.dei.webapp.lupus.resource.Message;
import it.unipd.dei.webapp.lupus.resource.Player;
import it.unipd.dei.webapp.lupus.utils.ErrorCode;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.concurrent.Callable;
import java.util.function.Consumer;
import java.util.regex.Pattern;

public class GameLogServlet extends AbstractDatabaseServlet
{
    private final int POSIDPART = 6;
    private final int POSURLROLE = POSIDPART+1;


    private interface HttpServletFunct {public void exe(HttpServletRequest request, HttpServletResponse response);}

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
        HttpServletFunct a = (req, res)->
       {
           String idPart = getPartUrl(POSIDPART, req);
           String urlRole = getPartUrl(POSURLROLE, req);
           Boolean isMaster = this.isMaster(req);

           switch (urlRole)
           {
               case "master":

               break;

               default: //player or another

               break;

           }
           
       };

        log(a, request, response);
    }

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException
    {
        HttpServletFunct a = (req, res)->
        {

        };

        log(a, request, response);
    }

    private ArrayList<Actions>getLog(String idPart, String urlRole, Boolean isMaster)
    {
        ArrayList<Actions> r = new ArrayList<>();


        return r;
    }

    private String getPartUrl(int i, HttpServletRequest req)
    {
        String[] s = req.getRequestURL().toString().split("/");

        return i<s.length ? s[i]: "";
    }

    private Boolean isMaster(HttpServletRequest req)
    {
        HttpSession session = req.getSession(false);
        return session != null && session.getAttribute("master") != null;
    }

    private void log(HttpServletFunct function, HttpServletRequest request, HttpServletResponse response)
    {
        LogContext.setIPAddress(request.getRemoteAddr());
        function.exe(request, response);
        LogContext.removeIPAddress();
    }



}