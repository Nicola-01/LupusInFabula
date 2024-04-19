package it.unipd.dei.webapp.lupus.servlet;

import it.unipd.dei.webapp.lupus.dao.*;
import it.unipd.dei.webapp.lupus.resource.Friend;
import it.unipd.dei.webapp.lupus.resource.Message;
import it.unipd.dei.webapp.lupus.resource.Player;
import it.unipd.dei.webapp.lupus.resource.Is_Friend_With;

import it.unipd.dei.webapp.lupus.utils.ErrorCode;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.sql.Date;
import java.sql.SQLException;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

public class FriendServlet extends AbstractDatabaseServlet{

    String usernameRegex = "^[a-zA-Z0-9](?:[a-zA-Z0-9_]*[a-zA-Z0-9])?$";
    Pattern usernameRegexPattern = Pattern.compile(usernameRegex);

    public void doGet(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {

        List<Friend> friendship = new ArrayList<>();
        Message m = null;

        try {
            //take the username of the player
            Player player = (Player) req.getSession().getAttribute("user");
            friendship = new SearchFriendsByUsernameDAO(getConnection(), player.getUsername()).access().getOutputParam();
            m = new Message("Correctly find list of friends");
            LOGGER.info("Correctly find list of friends");
        } catch (SQLException e) { // (SQLException | ServletException e)
            m = new Message("Cannot search for friends: unexpected error while accessing the database.", "E200",
                    e.getMessage());
            LOGGER.info("Cannot search for friends: unexpected error while accessing the database.", e);
        }

        try{
            req.setAttribute("List_of_friends", friendship);
            req.setAttribute("m", m);
            req.getRequestDispatcher("/jsp/friend.jsp").forward(req, res);
        }catch(Exception e){
            LOGGER.error("Unable to send response when creating the friends list", e);
            throw e;
        }

    }

    public void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException, ServletException {
        Message m = null;

        try {

            String action = req.getParameter("action");

            switch (action) {
                case "add":
                    addFriend(req, res);
                    break;
                case "delete":
                    deleteFriend(req, res);
                    break;
            }
        } catch (SQLException e) { // (SQLException | ServletException e)
            m = new Message("Cannot search for friends: unexpected error while accessing the database.", "E200",
                    e.getMessage());
            LOGGER.info("Cannot search for friends: unexpected error while accessing the database.", e);
        }
    }

    public void addFriend(HttpServletRequest req, HttpServletResponse res) throws SQLException, ServletException,  IOException {

        Message m = null;
        try {
            Player player = (Player) req.getSession().getAttribute("user");
            String friend_username = req.getParameter("friend_username");
            Date date = new Date(System.currentTimeMillis());

            if (!usernameRegexPattern.matcher(friend_username).matches()) {
                // TODO: To check
                ErrorCode ec = ErrorCode.INVALID_USERNAME_FORMAT;
                res.setStatus(ec.getHTTPCode());

                m = new Message("Friend_username not valid", "" + ec.getErrorCode(), ec.getErrorMessage());
                req.setAttribute("message", m);

                LOGGER.info("Friend_username not valid");
            } else if (new SearchPlayerByUsernameDAO(getConnection(), friend_username).access().getOutputParam() == null) {
                ErrorCode ec = ErrorCode.PLAYER_NOT_EXIST;
                res.setStatus(ec.getHTTPCode());

                m = new Message("This player doesn't exist", "" + ec.getErrorCode(), ec.getErrorMessage());


                LOGGER.info("This player doesn't exist");
            } else {
                LOGGER.info("" + player.getUsername() + " " + friend_username + " " + date);
                int result = new AddFriendDAO(getConnection(), player.getUsername(), friend_username, date).access().getOutputParam();
                if (result == 1) {
                    m = new Message("Correctly add friend");
                    LOGGER.info("Correctly add friend");
                } else {
                    m = new Message("No player found");
                    LOGGER.info("No player found");
                }
            }
            req.setAttribute("message", m);
            //req.getRequestDispatcher("/jsp/friend.jsp").forward(req, res);

        } catch (SQLException e) { // (SQLException | ServletException e)
            m = new Message("Cannot search for friends: unexpected error while accessing the database.", "E200",
                    e.getMessage());
            LOGGER.info("Cannot search for friends: unexpected error while accessing the database.", e);
        } catch (Exception e) {
        }
    }

    public void deleteFriend(HttpServletRequest req, HttpServletResponse res) throws IOException, ServletException {
        Message m = null;

        try {
            //take the username of the player
            Player player = (Player) req.getSession().getAttribute("user");
            String friend_username = req.getParameter("friend_username");

            if (!usernameRegexPattern.matcher(friend_username).matches()) {
                // TODO: To check
                ErrorCode ec = ErrorCode.INVALID_USERNAME_FORMAT;
                res.setStatus(ec.getHTTPCode());

                m = new Message("Friend_username not valid", "" + ec.getErrorCode(), ec.getErrorMessage());
                

                LOGGER.info("Friend_username not valid");
            }else {
                int result = new DeleteFriendDAO(getConnection(), player.getUsername(), friend_username).access().getOutputParam();
                if (result == 1) {
                    m = new Message("Correctly delete friend");
                    LOGGER.info("Correctly delete friend");
                } else {
                    m = new Message("No friend found");
                    LOGGER.info("No friend found");
                }
            }
            req.setAttribute("message", m);
            //req.getRequestDispatcher("/jsp/friend.jsp").forward(req, res);
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
