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
    <title>Lupus In Fabula - Logs and Statistics of user</title>
    <c:import url="/jsp/include/head.jsp"/>
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/user/userStatistics.css">
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/utils/searchPlayer.css">
    <%--    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/common.css">--%>
</head>


<body class="d-flex flex-column">
<jsp:include page="/jsp/include/navbar.jsp"/>

<div id="username_requested" style="display: none;"><%= request.getAttribute("player")%>
</div>

<div id="username_logged" style="display: none;">${sessionScope.user.getUsername()}
</div>

<div id="error_message" style="display: none;"></div>


<main class="container flex-grow-1" id="main_class" style="display: none">

    <div class="row justify-content-center my-4">
        <div class="col-9 mt-5" style="position:relative">
            <div class="search m-2">
                <input id="playerUsername" placeholder="Search a player to see its statics..." type="text"
                       data-1p-ignore data-bwignore
                       data-lpignore="true" data-form-type="other">
                <button id="addPlayer" class="searchUser">Search!</button>
                <div id="playerListPopup" class="popup">
                    <ul id="playerList" class="player-list"></ul>
                </div>
            </div>
        </div>
    </div>

    <div class="row mb-2">
        <div class="col-9">
            <h1 class="mb-0" id="title">
                <%--                Statistics and history of <b><%= request.getAttribute("player") %></b>    --%>

            </h1>
        </div>
        <div class="col-3" id="friendButtonContainer"></div>
    </div>

    <div class="internal-container p-3" id="background_container">
        <%--         style="display: none">--%>


        <div id="block_container">

            <h2>Statistics <a title="You can sort the table clicking on the name of the column">&#9432</a></h2>

            <div>
                <div class="row">
                    <%--        General statistics--%>
                    <div class="col-12 col-md-12 col-lg-4 p-2 px-md-4 px-xl-5">
                        <%--            <p id=gen_stats></p>--%>
                        <table id="general_stats" class="general_statics w-100">
                            <%--                style="border-style: hidden;"--%>
                        </table>
                    </div>

                    <%--        Statistics for role--%>
                    <div class="col-12 col-md-6 col-lg-4 p-2 overflow-auto">
                        <table class="sortable table table-striped w-100" id="roles_table">
                            <%--                            <thead class="sticky-top top-0">--%>
                            <tr>
                                <th>Role</th>
                                <th>Times</th>
                                <th>Wins</th>
                                <th>Loss</th>
                                <th>Rate
                                    <a id="info_rate"
                                       title="The percentage of games played as over the total played">&#9432</a>
                                </th>
                            </tr>
                            <%--                            </thead>--%>
                        </table>
                    </div>

                    <%--    Pie chart for roles--%>
                    <div class="col-12 col-md-6 col-lg-4 p-2">
                        <canvas id="myChart"></canvas>
                    </div>
                </div>
            </div>
        </div>

        <br>

        <div id="block_container2" class="overflow-auto">
            <h2>History <a id="info_logs" title="You can sort the table clicking on the name of the column">&#9432</a>
            </h2>


            <table class="sortable table table-striped mb-0" id="logs_table" align="center">

                <%--                <thead class="sticky-top top-0">--%>
                <tr>
                    <th>Date and time</th>
                    <th>GameId</th>
                    <th>Duration</th>
                    <th>Number of rounds</th>
                    <th>Role played</th>
                    <th>Outcome</th>
                    <th>Game history</th>
                </tr>
                <%--                </thead>--%>

            </table>
        </div>
    </div>
</main>


<c:import url="/jsp/include/footer.jsp"/>
<c:import url="/jsp/include/foot.jsp"/>


<script src="https://www.kryogenix.org/code/browser/sorttable/sorttable.js"></script>
<script src="${pageContext.request.contextPath}/js/user/userStatistics.js"></script>
<script src="${pageContext.request.contextPath}/js/friend/friendActionButton.js"></script>
<%--for pie chart--%>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<script src="${pageContext.request.contextPath}/js/utils/searchPlayer.js"></script>


</body>
</html>


<%--<c:choose>--%>
<%--    <c:when test="${empty sessionScope.user}">--%>
<%--        <h1 class="not_logged">Please login to check the statistics</h1>--%>
<%--    </c:when>--%>

<%--    <c:when test="">--%>
<%--        <h1 class="not_logged">Please login to check the statistics</h1>--%>
<%--    </c:when>--%>

<%--    <c:otherwise>--%>


<%--</c:otherwise>--%>

<%--</c:choose>--%>

<%--<p>Statistics and history--%>
<%--    <c:if test="${not empty sessionScope.user}">--%>
<%--        of--%>
<%--        <b> ${sessionScope.user.getUsername()} </b>--%>
<%--    </c:if>--%>
<%--    <c:if test="${empty sessionScope.user}">--%>
<%--        Please login to check the statistics--%>
<%--    </c:if>--%>
<%--</p>--%>


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