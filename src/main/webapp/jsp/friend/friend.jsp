<%--
  Created by IntelliJ IDEA.
  User: user
  Date: 15/04/24
  Time: 11:44
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE html>
<html lang="en">

<head>
    <title>Friends</title>
    <c:import url="/jsp/include/head.jsp"/>
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/friend/friend.css">
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/utils/searchPlayer.css">
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/utils/navbar.css">
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/common.css">
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/utils/errorMessage.css">
</head>

<body>

<jsp:include page="../include/navbar.jsp" />

<div class="container text-center">

    <div id="addFriend" class="row justify-content-center">
        <div  class="col-9">
            <jsp:include page="/jsp/utils/searchPlayer.jsp"/>
        </div>
    </div>

    <div id="listFriend" class="row justify-content-center">
        <h2>Your Friends</h2>
        <div id="friendsTable">
            <table id="my_friends">
                <thead>
                <tr>
                    <th>Username</th>
                    <th>Date</th>
                    <th>Remove</th>
                </tr>
                </thead>
                <tbody>
                </tbody>
        </table>
        </div>
    </div>
</div>

<script src="${pageContext.request.contextPath}/js/friend/friendManagement.js"></script>
<script src="${pageContext.request.contextPath}/js/utils/searchPlayer.js"></script>
<script src="${pageContext.request.contextPath}/js/utils/errorMessage.js"></script>

<c:import url="/jsp/include/footer.jsp"/>
<c:import url="/jsp/include/foot.jsp"/>
</body>
</html>
