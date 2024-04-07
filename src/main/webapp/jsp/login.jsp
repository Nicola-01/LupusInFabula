<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page contentType="text/html" pageEncoding="UTF-8" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <c:import url="/jsp/include/head.jsp"/>
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/login.css">
    <title>Lupus in Fabula - Login</title>
</head>

<body>
<div class="main">
    <input type="checkbox" id="chk" aria-hidden="true">

    <div class="signup">
        <form action="<c:url value="/signup"/>" method="POST">
            <label class="lb_singup" for="chk" aria-hidden="true">Sign up</label>
            <input type="text" class="custom-input" name="username" placeholder="Username" required="">
            <input type="email" class="custom-input" name="email" placeholder="Email" required="">
            <input type="password" class="custom-input" name="password" placeholder="Password" required="">
            <input type="password" class="custom-input" name="password_rp" placeholder="Repeat password" required="">
            <input type="submit" value="Sign up">
        </form>
    </div>

    <div class="login">
        <form action="<c:url value="/login"/>" method="POST">
            <label class="lb_login" for="chk" aria-hidden="true">Login</label>
            <input type="text" class="custom-input" name="user" placeholder="Username/Email" required="">
            <input type="password" class="custom-input" name="password" placeholder="Password" required="">
            <div class="additional-options">
                <a href="#" class="forgot-password">Forgot password?</a>
            </div>
            <input type="submit" value="Login">
        </form>
    </div>
</div>

<%--<c:import url="/jsp/include/foot.jsp"/>--%>
</body>
</html>