<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lupus in Fabula - Home</title>
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/homepage.css">
</head>
<body>
<header>
    <h1>Lupus in Fabula</h1>
</header>
<nav>
    <ul>
        <li></li>
    </ul>
</nav>
<main>
    <p>Welcome,
        <c:if test="${not empty sessionScope.user}">
            <b>${sessionScope.user.getUsername()} </b>
        </c:if>
        <c:if test="${empty sessionScope.user}">
            please login to check the website in its entirety
        </c:if>
    </p>
    <section class="centered-box">
        <div class="box">
            <h2>Player</h2>
            <!-- if logged in -->
            <c:if test="${not empty sessionScope.user}">
                <a href="<c:url value="/logout"/>"><button>Logout</button></a>
            </c:if>
            <!-- if NOT logged in -->
            <c:if test="${empty sessionScope.user}">
                <a href="<c:url value="/login"/>">
                    <button>Login</button>
                </a>
            </c:if>
            <button>Personal Area</button>
            <button>Statistics</button>
        </div>
        <div class="box">
            <h2>Game</h2>
            <a href="<c:url value="/rules"/>">
                <button>Game Rules</button>
            </a>
            <a href="<c:url value="/jsp/game/newGame.jsp"/>">
                <button>Create a Game</button>
            </a>
            <button>Join a Game</button>
        </div>
    </section>
    <section class="show-message">
        <c:import url="/jsp/include/show-message.jsp"/>
    </section>
</main>
<footer>
    <p>&copy; 2024 Team LIF - Lupus in Fabula. All rights reserved.</p>
</footer>
</body>
</html>
