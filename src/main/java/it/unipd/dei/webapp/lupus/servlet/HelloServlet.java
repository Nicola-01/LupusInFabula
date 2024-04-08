package it.unipd.dei.webapp.lupus.servlet;

import java.io.*;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.message.StringFormatterMessageFactory;

@WebServlet(name = "helloServlet", value = "/hello-servlet")
public class HelloServlet extends HttpServlet {
    private String message;

    public void init() {
        message = "Hello World! 1";
    }

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/html; charset=utf-8");

        Logger LOGGER = LogManager.getLogger(AbstractDatabaseServlet.class,
                StringFormatterMessageFactory.INSTANCE);

        LOGGER.info(message);
        LOGGER.info("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");

        // Hello
        PrintWriter out = response.getWriter();
        out.println("<html><body>");
        out.println("<h1>" + message + "</h1>");
        out.println("</body></html>");
    }

    public void destroy() {
    }
}