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
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/testLogs/logs.css">
</head>


<body>
<jsp:include page="/jsp/include/navbar.jsp"/>


<p>Statistics and history
    <c:if test="${not empty sessionScope.user}">
        of
        <b> ${sessionScope.user.getUsername()} </b>
    </c:if>
    <c:if test="${empty sessionScope.user}">
        Please login to check the statistics
    </c:if>
</p>


<h1>Statistics</h1>
<div class="container">
    <div class="row">
        <div class="col-md-4">
            <table id="general_stats">

            </table>
        </div>
        <div class="col-md-4">
            <table class="sortable" id="roles_table">
                <tr>
                    <th>Role</th>
                    <th>Times</th>
                    <th>Wins</th>
                    <th>Loss</th>
                    <th>Rate
                        <div id="info_rate" title="The percentage of games played as over the total played">&#9432</div>
                    </th>
                </tr>
            </table>
        </div>
        <div class="col-md-4">
            <canvas id="myChart"></canvas>
        </div>
    </div>
</div>
</div>


<h1>Game Logs</h1>

<div id="info" title="Questa è una frase informativa">Passa sopra di me</div>


<div class="container">

    <table class="sortable" id="logs_table">


        <tr>
            <th>GameId</th>
            <th>Date and time</th>
            <th>Duration</th>
            <th>Number of rounds</th>
            <th>Role played</th>
            <th>Outcome</th>
            <th>View logs</th>
        </tr>

    </table>

</div>


<c:import url="/jsp/include/footer.jsp"/>
<c:import url="/jsp/include/foot.jsp"/>


</body>


<script src="https://www.kryogenix.org/code/browser/sorttable/sorttable.js"></script>
<script src="${pageContext.request.contextPath}/js/testLogs/testlogs.js"></script>

<%--for pie chart--%>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

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