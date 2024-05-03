<%--
  Created by IntelliJ IDEA.
  User: rickw
  Date: 03/05/2024
  Time: 17:14
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE html>
<html lang="en">

<head>
    <title>Logs user</title>
    <c:import url="/jsp/include/head.jsp"/>
    <%--    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/game/createNewGame.css">--%>
</head>

<%--<body onload="loadLogs()"> <!-- Quando il body viene caricato, chiamerà la funzione loadLogs() -->--%>


<body>
<jsp:include page="/jsp/include/navbar.jsp"/>

<%--<div class="log-container">--%>
<%--    <h2>LOGS</h2>--%>
<%--    <table id="logs_table">--%>
<%--        <tr>--%>
<%--            <th>GameID</th>--%>

<%--        </tr>--%>

<%--    </table>--%>


<%--</div>--%>

<h1>Game Logs</h1>

<script src="https://www.kryogenix.org/code/browser/sorttable/sorttable.js"></script>



<table class="sortable" id="logs_table">


    <tr>
        <th>GameId</th>
        <th>number</th>
    </tr>

</table>



<c:import url="/jsp/include/footer.jsp"/>
<c:import url="/jsp/include/foot.jsp"/>

</body>

<script src="${pageContext.request.contextPath}/js/testLogs/testlogs.js"></script>
</html>


<%--<c:choose>--%>
<%--    <c:when test="${not empty logs}">--%>
<%--        <c:forEach var="log" items="${logs}">--%>
<%--            <tr>--%>
<%--                <td><c:out value="${log.getGameId()}"/></td>--%>
<%--                <td><c:out value="${log.getStart()}"/></td>--%>
<%--                <td><c:out value="${log.getGameDuration()}"/></td>--%>
<%--                <td><c:out value="${log.getNumberOfRounds()}"/></td>--%>
<%--                <td><c:out value="${log.getName()}"/></td>--%>
<%--                <td><c:out value="${log.getHasWon() ? 'Victory' : 'Loss'}"/></td>--%>
<%--            </tr>--%>
<%--        </c:forEach>--%>
<%--    </c:when>--%>
<%--    <c:otherwise>--%>
<%--        <tr>--%>
<%--            <td> colspan="6>No data available/></td>--%>

<%--        </tr>--%>
<%--    </c:otherwise>--%>

<%--</c:choose>--%>