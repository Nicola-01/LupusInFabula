<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lupus in Fabula - Home</title>
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/homepage.css">
    <c:import url="/jsp/include/head.jsp"/>
</head>
<body>

<iframe id="background" src="${pageContext.request.contextPath}/jsp/utils/background.html" class="background-iframe" frameborder="0"></iframe>

<jsp:include page="include/navbar.jsp"/>
<main>
    <p class="my-2">
        <span>Welcome, </span>
        <c:if test="${not empty sessionScope.user}">
            <span id="username" class="fw-bold">${sessionScope.user.getUsername()}</span>
        </c:if>
        <c:if test="${empty sessionScope.user}">
            <script>
                window.location.href = window.location.origin + "/lupus/login";
            </script>
        </c:if>
    </p>


    <div id="messageDiv"></div>

    <section class="centered-box">
        <div class="box">
            <h2>Player</h2>
            <!-- if logged in -->
            <c:if test="${not empty sessionScope.user}">
                <a href="<c:url value="/logout"/>">
                    <button>Logout</button>
                </a>
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
            <a href="<c:url value="/jsp/game/createNewGame.jsp"/>">
                <button>Create a Game</button>
            </a>
            <button>Join a Game</button>
        </div>
    </section>
<%--    <section class="show-message">--%>
<%--        <c:import url="/jsp/include/show-message.jsp"/>--%>
<%--    </section>--%>
</main>

<c:import url="/jsp/include/footer.jsp"/>
<c:import url="/jsp/include/foot.jsp"/>

<script>
    playerName = document.getElementById("username").innerText;
    localStorage.setItem('playerName', playerName);
</script>
<script src="${pageContext.request.contextPath}/js/homepage.js"></script>

</body>
</html>
