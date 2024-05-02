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
    <meta charset="UTF-8">
    <title>Friends</title>
</head>
<body>
<jsp:include page="include/navbar.jsp" />
<h1>Friends List</h1>
<c:if test="${not empty requestScope.m}">
    <div style="color: red;"><c:out value="${requestScope.m.getMessage()}" /></div>
</c:if>

<c:if test="${not empty List_of_friends}">
    <ul>
        <c:forEach var="friend" items="${List_of_friends}">
            <li>${friend.getFriend_username()} ${friend.getDate()}</li>
            <form method="POST">
                <input type="hidden" name="action" value="delete">
                <input type="hidden" name="friend_username" value="${friend.getFriend_username()}">
                <input type="submit" value="Delete">
            </form>
        </c:forEach>
    </ul>
</c:if>

<form method="post">
    <label>Add Friend</label>
    <input type="hidden" name="action" value="add">
    <input type="text" id="friend_username" class="custom-input" name="friend_username" placeholder="Friend_username" required="">
    <input type="submit" id="add_submit" value="Add">
</form>

</body>
</html>
