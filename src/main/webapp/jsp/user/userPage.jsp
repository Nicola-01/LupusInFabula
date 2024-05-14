<%--
  Created by IntelliJ IDEA.
  User: Jacopo Momesso
  Date: 11/05/2024
  Time: 21:20
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <title>User</title>
    <c:import url="/jsp/include/head.jsp"/>

    <link type="text/css" rel="stylesheet" href="${pageContext.request.contextPath}/css/user/user.css">
</head>

<body>

    <jsp:include page="/jsp/include/navbar.jsp"/>

    <div class="container">
        <div class="radio-inputs">
            <label class="radio">
                <input type="radio" name="radio" checked="">
                <span class="name">Friends</span>
            </label>

            <label class="radio">
                <input type="radio" name="radio">
                <span class="name">Remove Friends</span>
            </label>

            <label class="radio">
                <input type="radio" name="radio">
                <span class="name">Change Credentials</span>
            </label>
        </div>
    </div>

</body>
</html>
