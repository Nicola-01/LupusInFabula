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
    <%--    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/login.css">--%>
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/game/createNewGame.css">

    <script src="${pageContext.request.contextPath}/js/game/createNewGame.js"></script>
</head>
<body>
<jsp:include page="/jsp/include/navbar.jsp"/>
<div class="container">
    <div class="row">
        <div id="players" class="column col-sm-12 col-md-6 p-2 pb-5">
            <h2>PLAYERS IN GAME</h2>
            <table id="players_tb">
                <tr>
                    <th>Username</th>
                    <th>Remove</th>
                </tr>
            </table>
        </div>
        <div id="friends" class="column col-sm-12 col-md-6 p-2 pb-5">
            <h2>YOUR FRIENDS</h2>
            <table id="friends_tb">
                <tr>
                    <th>Username</th>
                    <th>Add</th>
                </tr>
            </table>
            <br>
            <div class="search">
                <input id="playerUsername" placeholder="Add a player" type="text" data-1p-ignore data-bwignore
                       data-lpignore="true" data-form-type="other">
                <button id="addPlayer" class="searchUser">Add player!</button>
            </div>

        </div>

    </div>
    <br>
    <div class="row">
        <div id="goodRoles" class="column col-sm-12 col-md-6 col-lg-3 p-2">
            <h2>GOOD</h2>
        </div>
        <div id="evilRoles" class="column col-sm-12 col-md-6 col-lg-3 p-2">
            <h2>EVIL</h2>
        </div>
        <div id="neutralRoles" class="column col-sm-12 col-md-6 col-lg-3 p-2">
            <h2>NEUTRAL</h2>
        </div>
        <div id="victoryStealerRoles" class="column col-sm-12 col-md-6 col-lg-3 p-2">
            <h2>VICTORY STEALER</h2>
        </div>
    </div>
    <br>
    <div class="button-container">
        <button id="sendSettings">
            <span class="text">Create new game!</span>
        </button>
    </div>
</div>

<c:import url="/jsp/include/footer.jsp"/>
<c:import url="/jsp/include/foot.jsp"/>

</body>
</html>
