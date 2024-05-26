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
</head>
<body>

<jsp:include page="/jsp/include/navbar.jsp"/>

<main class="container">
    <h1>SELECT THE HABITANTS</h1>
    <div class="row">
        <div class="col-sm-12 col-md-6 p-1">
            <div id="players" class="p-2 mb-5">
                <h2 class="text-center my-2">HABITANTS IN GAME</h2>
                <div class="playersTableContainer">
                    <table id="players_tb" class="table table-striped mb-0">
                        <thead class="sticky-top top-0">
                        <tr>
                            <th style="width:10%">Order</th>
                            <th style="width:60%">Username</th>
                            <th style="width:15%">Available</th>
                            <th style="width:15%">Remove</th>
                        </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="col-sm-12 col-md-6 p-1 position-relative">
            <div id="friends" class="p-2 mb-5">
                <h2 class="text-center my-2">YOUR FRIENDS</h2>
                <div class="friendsTableContainer">
                    <table id="friends_tb" class="table table-striped mb-0">
                        <thead class="sticky-top top-0">
                        <tr>
                            <th style="width:60%">Username</th>
                            <th style="width:20%">Available</th>
                            <th>Add</th>
                        </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
                <br>
                <jsp:include page="/jsp/utils/searchPlayer.jsp"/>
            </div>
        </div>

    </div>
    <h1 class="mt-4">SELECT THE ROLES</h1>
    <div class="row">
        <div class="col-sm-12 col-md-6 col-lg-3 p-1">
            <div id="goodRoles" class="goodRoles p-3">
                <h2>GOOD</h2>
            </div>
        </div>
        <div class="col-sm-12 col-md-6 col-lg-3 p-1">
            <div id="evilRoles" class="evilRoles p-3">
                <h2>EVIL</h2>
            </div>
        </div>
        <div class="col-sm-12 col-md-6 col-lg-3 p-1">
            <div id="neutralRoles" class="neutralRoles p-3">
                <h2>NEUTRAL</h2>
            </div>
        </div>
        <div class="col-sm-12 col-md-6 col-lg-3 p-1">
            <div id="victoryStealerRoles" class="victoryStealerRoles p-3">
                <h2>VICTORY STEALER</h2>
            </div>
        </div>
    </div>
    <br>
    <c:import url="/jsp/utils/errorMessage.jsp"/>
    <div class="button-container">
        <button id="sendSettings" class="gradientButton">
            <span class="text">Create new village!</span>
        </button>
    </div>
</main>

<script src="${pageContext.request.contextPath}/js/utils/searchPlayer.js"></script>
<script src="${pageContext.request.contextPath}/js/game/createNewGame.js"></script>

<c:import url="/jsp/include/footer.jsp"/>
<c:import url="/jsp/include/foot.jsp"/>

</body>
</html>
