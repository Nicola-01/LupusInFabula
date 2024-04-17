<%--
  Created by IntelliJ IDEA.
  User: rickw
  Date: 16/04/2024
  Time: 22:51
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <title>Statistics</title>
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/logs.css">
</head>

<h2>Hello, World!</h2>

<body>

<h2>Table of stats</h2>
<table border="1">
    <thead>
    <tr>
        <th>Role played</th>
        <th>Times played as</th>
        <th>Wins</th>
    </tr>
    </thead>
    <tbody>
    <c:choose>
        <c:when test="${not empty stats}">
            <c:forEach var="log" items="${stats}">
                <tr>
                    <td><c:out value="${log.getName()}"/></td>
                    <td><c:out value="${log.getCountName()}"/></td>
                    <td><c:out value="${log.getCountWins()}"/></td>
                </tr>
            </c:forEach>
        </c:when>
        <c:otherwise>
            <tr>
                <td> colspan="6>No data available/></td>

            </tr>
        </c:otherwise>

    </c:choose>

    <h1>Stats2</h1>
    <c:set var="totalIterations" value="0"/>
    <c:set var="hasWonCount" value="0"/>
    <c:set var="roundsPlayedCount" value="0"/>

    <c:if test="${not empty logs}">
        <c:forEach var="log" items="${logs}">
            <c:set var="totalIterations" value="${totalIterations + 1}"/>
            <c:if test="${log.getHasWon()}">
                <c:set var="hasWonCount" value="${hasWonCount + 1}"/>
            </c:if>
            <c:set var="roundsPlayedCount" value="${roundsPlayedCount + log.getNumberOfRounds()}"/>
        </c:forEach>
    </c:if>

    <p>Total Iterations: ${totalIterations}</p>
    <p>Has Won Count: ${hasWonCount}</p>
    <p>Rounds Played Count: ${roundsPlayedCount}</p>
    </tbody>

</table>


</body>
</html>
