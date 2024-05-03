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
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/game/gameActions.css">
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/utils/playersStatus.css">
</head>

<body>
<jsp:include page="/jsp/include/navbar.jsp"/>

<div class="container">
    <div class="row">
        <div class="col-sm-1 d-none d-sm-block col-md-1 col-lg-2 p-2"></div>
        <div class="col-sm-12 col-md-10 col-lg-8 p-2" id="gameActions"></div>
        <div class="col-sm-1 d-none d-sm-block col-md-1 col-lg-2 p-2"></div>
    </div>

    <div class="button-container">
        <button id="sendActions">
            <span class="text">New DAY!</span>
        </button>
    </div>

    <div class="row">
        <jsp:include page="../utils/playersStatus.jsp"/>
        <jsp:include page="../utils/gameLog.jsp"/>
    </div>

</div>

<script src="${pageContext.request.contextPath}/js/game/gameActions.js"></script>
<script src="${pageContext.request.contextPath}/js/utils/playersStatus.js"></script>

<c:import url="/jsp/include/footer.jsp"/>
<c:import url="/jsp/include/foot.jsp"/>

</body>
</html>
