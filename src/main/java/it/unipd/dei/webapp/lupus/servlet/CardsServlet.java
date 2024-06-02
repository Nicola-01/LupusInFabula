package it.unipd.dei.webapp.lupus.servlet;


import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.File;

import java.io.IOException;
import java.sql.SQLException;

public class CardsServlet extends AbstractDatabaseServlet
{

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException
    {
        /*
        String imagePath = "/webapp/media/cards/card_back";
        File imageDir = new File(imagePath);
        String[] imageList = imageDir.list((dir, name) -> name.toLowerCase().endsWith(".jpg") || name.toLowerCase().endsWith(".png"));

        for(int i = 0; i < imageList.length; i++)
            LOGGER.info("img: " + imageList[i]);

        req.setAttribute("imageList", imageList);
        */
        req.getRequestDispatcher("/jsp/cards.jsp").forward(req, resp);;
    }

}