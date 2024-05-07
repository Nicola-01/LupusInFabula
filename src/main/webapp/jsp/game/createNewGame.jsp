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
    <title>Create new game</title>
    <c:import url="/jsp/include/head.jsp"/>

    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/game/createNewGame.css">
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/utils/searchPlayer.css">
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/utils/errorMessage.css">
</head>
<body>

<jsp:include page="/jsp/include/navbar.jsp"/>

<div class="container">
    <div class="row">
        <div id="players" class="column col-sm-12 col-md-6 p-2 pb-5">
            <h2>PLAYERS IN GAME</h2>
            <table id="players_tb">
                <thead>
                <tr>
                    <th>Username</th>
                    <th>Remove</th>
                </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>
        <div id="friends" class="column col-sm-12 col-md-6 p-2 pb-5">
            <h2>YOUR FRIENDS</h2>
            <table id="friends_tb">
                <thead>
                <tr>
                    <th>Username</th>
                    <th>Add</th>
                </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
            <br>
            <jsp:include page="/jsp/utils/searchPlayer.jsp"/>
        </div>

    </div>
    <br>
    <div class="row">
        <div class="col-sm-12 col-md-6 col-lg-3 p-2">
            <div id="goodRoles" class="goodRoles p-2">
                <h2>GOOD</h2>
            </div>
        </div>
        <div class="col-sm-12 col-md-6 col-lg-3 p-2">
            <div id="evilRoles" class="p-2 evilRoles">
                <h2>EVIL</h2>
            </div>
        </div>
        <div class="col-sm-12 col-md-6 col-lg-3 p-2">
            <div id="neutralRoles" class="p-2 neutralRoles">
                <h2>NEUTRAL</h2>
            </div>
        </div>
        <div class="col-sm-12 col-md-6 col-lg-3 p-2">
            <div id="victoryStealerRoles" class="p-2 victoryStealerRoles">
                <h2>VICTORY STEALER</h2>
            </div>
        </div>
    </div>
    <br>
    <c:import url="/jsp/utils/errorMessage.jsp"/>
    <div class="button-container">
        <button id="sendSettings">
            <span class="text">Create new game!</span>
        </button>
    </div>
</div>

<script src="${pageContext.request.contextPath}/js/game/createNewGame.js"></script>
<script src="${pageContext.request.contextPath}/js/utils/searchPlayer.js"></script>
<script src="${pageContext.request.contextPath}/js/utils/errorMessage.js"></script>

<c:import url="/jsp/include/footer.jsp"/>
<c:import url="/jsp/include/foot.jsp"/>

</body>
</html>
