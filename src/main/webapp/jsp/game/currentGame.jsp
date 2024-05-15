<%--
  Author: LupusInFabula Group
  Version: 1.0
  Since: 1.0
--%>
<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE html>
<html lang="en">

<head>
    <title>Game</title>
    <c:import url="/jsp/include/head.jsp"/>

    <link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css'>
    <script src='https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.bundle.min.js'></script>
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/game/currentGame.css">
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/game/gameActions.css">
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/utils/playersStatus.css">
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/utils/errorMessage.css">
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/utils/infoMessage.css">
  </head>

<body>

<%--<iframe id="background" src="${pageContext.request.contextPath}/jsp/utils/background.html" frameborder="0"></iframe>--%>

<jsp:include page="/jsp/include/navbar.jsp"/>

<div class="container">

    <c:import url="/jsp/utils/infoMessage.jsp"/>

    <div id="actionResults">

    </div>

    <div class="row">
        <div class="col-sm-12 col-md-10 col-lg-8 p-2" style="margin: auto">
            <h2 id="gameStatus"></h2>
        </div>
    </div>

    <c:choose>
        <c:when test="${isMaster}">
            <jsp:include page="gameActions.jsp"/>
        </c:when>
        <c:otherwise>
            <jsp:include page="playerRole.jsp"/>
        </c:otherwise>
    </c:choose>

    <div class="row">
        <div id="playersStatus" class="column row col-md-6 p-2"></div>
        <div id="gameLog" class="column col-md-6 p-2"></div>
    </div>

</div>

<c:import url="/jsp/include/footer.jsp"/>
<c:import url="/jsp/include/foot.jsp"/>
<script src="${pageContext.request.contextPath}/js/game/gameActions.js"></script>
<script src="${pageContext.request.contextPath}/js/utils/playersStatus.js"></script>
<script src="${pageContext.request.contextPath}/js/utils/gameLog.js"></script>
<script src="${pageContext.request.contextPath}/js/utils/errorMessage.js"></script>
<script src="${pageContext.request.contextPath}/js/utils/infoMessage.js"></script>

</body>
</html>
