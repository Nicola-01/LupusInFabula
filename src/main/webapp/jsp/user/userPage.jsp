<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <title>User</title>
    <c:import url="/jsp/include/head.jsp"/>

    <link type="text/css" rel="stylesheet" href="${pageContext.request.contextPath}/css/user/user.css">
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/user/cards.css">
    <link type="text/css" rel="stylesheet" href="${pageContext.request.contextPath}/css/utils/inputFormAnimations.css">
    <link type="text/css" rel="stylesheet" href="${pageContext.request.contextPath}/css/utils/passwordComplexAndShowPassword.css">

    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/friend/friend.css">
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/utils/searchPlayer.css">

    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/common.css">
</head>

<body class="d-flex flex-column">
<c:import url="/jsp/utils/loginChecker.jsp"/>

<jsp:include page="/jsp/include/navbar.jsp"/>

<main class="container flex-grow-1">
    <h1>Your personal area</h1>
    <div class="radio-inputs m-0 mb-2 row">
        <label class="radio col-6 col-sm-3">
            <input type="radio" name="radio" value="friends">
            <span>Friends</span>
        </label>

        <label class="radio col-6 col-sm-3">
            <input type="radio" name="radio" value="playerCards">
            <span>Cards</span>
        </label>

        <label class="radio col-6 col-sm-3">
            <input type="radio" name="radio" value="changeCredentials">
            <span>Change Credentials</span>
        </label>

        <label class="radio col-6 col-sm-3">
            <input type="radio" name="radio" value="deleteAccount">
            <span>Delete Account</span>
        </label>
    </div>
    <div class="internal-container p-3">
                <div id="contentBox">
            <div id="friendsPage" style="display: none;">
                <jsp:include page="/jsp/friend/friend.jsp"/>
            </div>
            <div class="row" id="playerCardsPage" style="display: none;">
                <jsp:include page="cards.jsp"/>
            </div>
            <div class="row" id="changeCredentialsPage" style="display: none;">
                <jsp:include page="updateCredential.jsp"/>
            </div>
            <div class="row" id="deleteAccountPage" style="display: none;">
                <jsp:include page="deleteAccount.jsp"/>
            </div>
        </div>
    </div>
</main>

<c:import url="/jsp/include/footer.jsp"/>
<c:import url="/jsp/include/foot.jsp"/>

<script src="${pageContext.request.contextPath}/js/friend/friendManagement.js"></script>
<script src="${pageContext.request.contextPath}/js/utils/searchPlayer.js"></script>
<script src="${pageContext.request.contextPath}/js/user/userPage.js"></script>
<script src="${pageContext.request.contextPath}/js/user/updateCredentials.js"></script>
<script src="${pageContext.request.contextPath}/js/utils/passwordComplexAndShowPassword.js"></script>
<script src="${pageContext.request.contextPath}/js/user/deleteAccount.js"></script>

</body>
</html>
