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
<div class="container">
    <div class="row">
        <div class="col-sm-1 d-none d-sm-block col-md-1 col-lg-2 p-2"></div>
        <div class="main col-sm-12 col-md-10 col-lg-8 p-0">
            <input type="checkbox" id="chk" aria-hidden="true">
            <c:import url="/jsp/include/show-message.jsp"/>
            <div class="signup">
                <form action="<c:url value="/signup"/>" method="POST">
                    <label class="lb_singup" for="chk" aria-hidden="true">Sign up</label>
                    <input type="text" id="sing_username" class="custom-input" name="username" placeholder="Username"
                           required="">
                    <input type="email" id="sing_email" class="custom-input" name="email" placeholder="Email"
                           required="">
                    <input type="password" id="sing_password" class="custom-input" name="password"
                           placeholder="Password"
                           required="">
                    <input type="password" id="sing_password_rp" class="custom-input" name="password_rp"
                           placeholder="Repeat password"
                           required="">
                    <input type="submit" id="sing_submit" value="Sign up">
                </form>
            </div>

            <div class="login">
                <form action="<c:url value="/login"/>" method="POST">
                    <label class="lb_login" for="chk" aria-hidden="true">Login</label>
                    <input type="text" id="login_user" class="custom-input" name="user" placeholder="Username/Email"
                           required="">
                    <input type="password" id="login_password" class="custom-input" name="password"
                           placeholder="Password"
                           required="">
                    <div class="additional-options">
                        <a href="#" class="forgot-password">Forgot password?</a>
                    </div>
                    <input type="submit" id="login_submit" value="Login">
                </form>
            </div>
        </div>
        <div class="col-sm-1 d-none d-sm-block col-md-1 col-lg-2 p-2"></div>
    </div>
</div>
<script src="${pageContext.request.contextPath}/js/login.js"></script>

<c:import url="/jsp/include/foot.jsp"/>

</body>
</html>