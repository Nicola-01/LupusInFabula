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
    <section class="centered-box">
        <div class="box">
            <h2>Player</h2>
            <button>Personal Area</button>
            <button>Statistics</button>
        </div>
        <div class="box">
            <h2>Game</h2>
            <a href="<c:url value="/rules"/>"><button>Game Rules</button></a>
            <button>Create a Game</button>
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
