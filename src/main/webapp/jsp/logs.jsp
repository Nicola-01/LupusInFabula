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
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/logs.css">
</head>

<h2>Hello, World!</h2>


<body>

<h2>Table of logs</h2>
<table border="1">
    <thead>
    <tr>
        <th>Game ID</th>
        <th>Date</th>
        <th>Game Duration</th>
        <th>Rounds played</th>
        <th>Role played</th>
        <th>Result</th>
    </tr>
    </thead>
    <tbody>
    <c:choose>
        <c:when test="${not empty logs}">
            <c:forEach var="log" items="${logs}">
                <tr>
                    <td><c:out value="${log.getGameId()}"/></td>
                    <td><c:out value="${log.getStart()}"/></td>
                    <td><c:out value="${log.getGameDuration()}"/></td>
                    <td><c:out value="${log.getNumberOfRounds()}"/></td>
                    <td><c:out value="${log.getName()}"/></td>
                    <td><c:out value="${log.getHasWon() ? 'Victory' : 'Loss'}"/></td>
                </tr>
            </c:forEach>
        </c:when>
        <c:otherwise>
            <tr>
                <td> colspan="6>No data available/></td>

            </tr>
        </c:otherwise>

    </c:choose>


    </tbody>

</table>

</body>
</html>
