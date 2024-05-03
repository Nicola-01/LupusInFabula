<%--
  Created by IntelliJ IDEA.
  User: Michele
  Date: 02/05/2024
  Time: 20:09
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <c:import url="/jsp/include/head.jsp"/>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lupus in Fabula - Current Game</title>
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/homepage.css">

    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/common.css">
<%--    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/game/gameActions.css">--%>
    <script src="${pageContext.request.contextPath}/js/utils.js"></script>

    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

</head>
<body>
    <jsp:include page="/jsp/include/navbar.jsp" />
    <h1>Current Game</h1>
    <p>Game ID: ${publicGameID}</p>
    <footer>
        <p>&copy; 2024 Team LIF - Lupus in Fabula. All rights reserved.</p>
    </footer>
</body>
</html>
