<%--
  Author: LupusInFabula Group
  Version: 1.0
  Since: 1.0
--%>
<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<html>
<html lang="en">
<head>
    <title>Create new game</title>
    <c:import url="/jsp/include/head.jsp"/>
    <%--    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/login.css">--%>
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/game/gameSettings.css">

    <script src="${pageContext.request.contextPath}/js/utils.js"></script>
    <script src="${pageContext.request.contextPath}/js/game/game_settings.js"></script>

</head>
<body>
<div class="columns">
    <div id="players" class="column">
        <table id="players_tb">
            <tr>
                <th>Username</th>
                <th>Remove</th>
            </tr>
        </table>
    </div>
    <div id="friends" class="column">
        <table id="friends_tb">
            <tr>
                <th>Username</th>
                <th>Add</th>
            </tr>
        </table>
    </div>

</div>
<br>
<br>
<div class="columns">
    <div id="goodRoles" class="column">
        <h2>GOOD</h2>
    </div>
    <div id="evilRoles" class="column">
        <h2>EVIL</h2>
    </div>
    <div id="neutralRoles" class="column">
        <h2>NEUTRAL</h2>
    </div>
    <div id="victoryStealerRoles" class="column">
        <h2>VICTORY STEALER</h2>
    </div>
</div>
<br>
<div class="button-container">
    <button id="sendSettings">Create new game!</button>
</div>


</body>
</html>
