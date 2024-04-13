package it.unipd.dei.webapp.lupus.servlet;

import it.unipd.dei.webapp.lupus.dao.*;
import it.unipd.dei.webapp.lupus.resource.Message;
import it.unipd.dei.webapp.lupus.resource.Player;
import it.unipd.dei.webapp.lupus.resource.Is_Friend_With;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.sql.SQLException;

import java.util.ArrayList;
import java.util.List;

public class FriendServlet extends AbstractDatabaseServlet{

    public void doGet(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {

        List<Is_Friend_With> friendship = new ArrayList<>();
        Message m = null;

        try {
            HttpSession session = req.getSession(false);
            // check if the user hae done the login
            if (session != null && session.getAttribute("player") != null) {
                //take the username of the player
                Player player = (Player) session.getAttribute("player");
                friendship = new SearchFriendsByUsernameDAO(getConnection(), player.getUsername()).access().getOutputParam();
                m = new Message("Correctly find list of friends");
                LOGGER.info("Correctly find list of friends");
            } else {
                LOGGER.info("User is not logged in. Redirecting to login page.");
                //send the user to the login page
                req.getRequestDispatcher("/jsp/login.jsp").forward(req, res);
            }
        } catch (SQLException e) { // (SQLException | ServletException e)
            m = new Message("Cannot search for friends: unexpected error while accessing the database.", "E200",
                    e.getMessage());
            LOGGER.info("Cannot search for friends: unexpected error while accessing the database.", e);
        }

        try{
            req.setAttribute("List of friends", friendship);
            req.setAttribute("m", m);
            req.getRequestDispatcher("/jsp/friend.jsp").forward(req, res);
        }catch(Exception e){
            LOGGER.error("Unable to send response when creating the friends list", e);
            throw e;
        }

    }

    public void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException, ServletException {

    }

    public void doDelete(HttpServletRequest req, HttpServletResponse res) throws IOException, ServletException {
        Message m = null;

        try {
            HttpSession session = req.getSession(false);
            // check if the user hae done the login
            if (session != null && session.getAttribute("player") != null) {
                //take the username of the player
                Player player = (Player) session.getAttribute("player");
                String friend_username = req.getParameter("friend_username");
                int result = new DeleteFriendDAO(getConnection(), player.getUsername(), friend_username).access().getOutputParam();
                if(result == 1){
                    m = new Message("Correctly delete friend");
                    LOGGER.info("Correctly delete friend");
                }else{
                    m = new Message("No friend found");
                    LOGGER.info("No friend found");
                }
            } else {
                LOGGER.info("User is not logged in. Redirecting to login page.");
                //send the user to the login page
                req.getRequestDispatcher("/jsp/login.jsp").forward(req, res);
            }
        } catch (SQLException e) { // (SQLException | ServletException e)
            m = new Message("Cannot search for friends: unexpected error while accessing the database.", "E200",
                    e.getMessage());
            LOGGER.info("Cannot search for friends: unexpected error while accessing the database.", e);
        }

        try{
            req.setAttribute("m", m);
        }catch(Exception e){
            LOGGER.error("Unable to send response when delete friend", e);
            throw e;
        }
    }
}
