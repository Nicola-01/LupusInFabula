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
<body class="d-flex flex-column">

<iframe id="background" src="${pageContext.request.contextPath}/jsp/utils/homeBackground.html" class="background-iframe"
        frameborder="0"></iframe>

<jsp:include page="include/navbar.jsp"/>
<main class="flex-grow-1 w-100 mt-sm-0 mt-md-5 pt-md-3">
    <h1 class="mb-4">
        <span>Welcome back, </span>
        <c:if test="${not empty sessionScope.user}">
            <span id="username" class="fw-bold">${sessionScope.user.getUsername()}</span>
        </c:if>
        <c:if test="${empty sessionScope.user}">
            <script>
                window.location.href = window.location.origin + "/lupus/login";
            </script>
        </c:if>
    </h1>

    <div id="messageDiv" class="mb-2 mb-md-5"></div>

    <section class="centered-box row pt-3">
        <div class="box col-sm-12 col-md-5 m-md-auto mb-3 p-4">
            <h2>Habitant</h2>
            <a href="<c:url value="/habitant/me"/>">
                <button>Personal Area</button>
            </a>
            <a href="<c:url value="/habitant/"/>">
                <button>Statistics and History</button>
            </a>
            <a href="<c:url value="/logout"/>">
                <button id="logoutBT">Logout</button>
            </a>
        </div>
        <div class="box col-sm-12 col-md-5 m-md-auto p-4">
            <h2>Village</h2>
            <a href="<c:url value="/rules"/>">
                <button>Rulebook</button>
            </a>
            <a href="<c:url value="/newVillage"/>">
                <button>Create a village</button>
            </a>
            <a href="<c:url value="/village"/>">
                <button>Join your village</button>
            </a>
        </div>
    </section>

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
