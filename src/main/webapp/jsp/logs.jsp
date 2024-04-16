<%--
  Created by IntelliJ IDEA.
  User: rickw
  Date: 16/04/2024
  Time: 15:17
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <title>logs</title>
<%--    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/logs.css">--%>
</head>

<h2>Hello, World!</h2>


<body>
<c:if test="${not empty logs}">
    <c:forEach var="log" items="${logs}">
        <p>Game ID: <c:out value="${log.getGameId()}"/></p>
        <p>Start: <c:out value="${log.getStart()}"/></p>
        <p>Game Duration: <c:out value="${log.getGameDuration()}"/></p>
        <p>Number of Rounds: <c:out value="${log.getNumberOfRounds()}"/></p>
        <p>Name: <c:out value="${log.getName()}"/></p>
        <p>Who has Won: <c:out value="${log.getHasWon()}"/></p>
        <br/>
    </c:forEach>
</c:if>

<c:if test="${empty logs}">
    <p>Game ID: No data available</p>
    <p>Start: No data available</p>
    <p>Game Duration: No data available</p>
    <p>Number of Rounds: No data available</p>
    <p>Name: No data available</p>
    <p>With Who Wins: No data available</p>
    <p>Who Wins: No data available</p>
    <br/>
</c:if>


</body>
</html>
