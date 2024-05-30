<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page contentType="text/html" pageEncoding="UTF-8" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <c:import url="/jsp/include/head.jsp"/>
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/login.css">
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/utils/show-message.css">
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/firefly.css">
    <title>Lupus in Fabula - Login</title>
</head>

<body>
<div class="container">

    <div class="fireflies">
        <div class="firefly"></div>
        <div class="firefly"></div>
        <div class="firefly"></div>
        <div class="firefly"></div>
        <div class="firefly"></div>
        <div class="firefly"></div>
        <div class="firefly"></div>
        <div class="firefly"></div>
        <div class="firefly"></div>
        <div class="firefly"></div>
        <div class="firefly"></div>
        <div class="firefly"></div>
        <div class="firefly"></div>
        <div class="firefly"></div>
        <div class="firefly"></div>
        <div class="firefly"></div>
        <div class="firefly"></div>
        <div class="firefly"></div>
        <div class="firefly"></div>
        <div class="firefly"></div>
        <div class="firefly"></div>
        <div class="firefly"></div>
        <div class="firefly"></div>
        <div class="firefly"></div>
        <div class="firefly"></div>
    </div>

    <div class="row">
        <div class="col-sm-12 col-md-10 col-lg-8 col-xl-6 p-0" style="margin: auto">
            <c:import url="/jsp/include/show-message.jsp"/>
            <div class="main">
                <input type="checkbox" id="loginCB" aria-hidden="true" checked>
                <div class="signup">
                    <form action="<c:url value="/signup"/>" method="POST">
                        <label class="lb_singup" for="loginCB" aria-hidden="true">Sign up</label>
                        <input type="text" id="sing_username" class="custom-input" name="username"
                               placeholder="Username"
                               required="">
                        <input type="email" id="sing_email" class="custom-input" name="email" placeholder="Email"
                               required="">
                        <input type="password" id="sing_password" class="custom-input" name="password"
                               placeholder="Password"
                               required="">
                        <input type="password" id="sing_password_rp" class="custom-input mb-1" name="password_rp"
                               placeholder="Repeat password"
                               required="">
                        <div class="additional-options">
                            <input type="checkbox" id="signupShowPassword">
                            <label for="signupShowPassword">Show Password</label>
                        </div>
                        <input type="submit" id="sing_submit" class="mt-4" value="Sign up">
                    </form>
                </div>

                <div class="login">
                    <form action="<c:url value="/login"/>" method="POST">
                        <label class="lb_login" for="loginCB" aria-hidden="true">Login</label>
                        <input type="text" id="login_user" class="custom-input mt-5" name="user" placeholder="Username/Email"
                               required="">
                        <input type="password" id="login_password" class="custom-input mb-1" name="password"
                               placeholder="Password"
                               required="">
                        <%--<div class="additional-options">--%>
                        <%--<a href="#" class="forgot-password">Forgot password?</a>--%>
                        <%--</div>--%>
                        <div class="additional-options">
                            <input type="checkbox" id="loginShowPassword">
                            <label for="loginShowPassword">Show Password</label>
                        </div>
                        <input type="submit" id="login_submit" class="mt-4" value="Login">
                    </form>
                </div>
            </div>
        </div>
    </div>

    <c:import url="/jsp/include/foot.jsp"/>
    <script src="${pageContext.request.contextPath}/js/login.js"></script>

</body>
</html>