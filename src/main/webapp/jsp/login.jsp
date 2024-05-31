<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page contentType="text/html" pageEncoding="UTF-8" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <c:import url="/jsp/include/head.jsp"/>
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/login.css">
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/utils/inputFormAnimations.css">
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/utils/passwordComplexHint.css">
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/utils/show-message.css">
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/firefly.css">
    <title>Lupus in Fabula - Login</title>

    <style>
        .control-label {
            top: 7px;
        }

        .form-control:focus ~ .control-label,
        .form-control:not(:placeholder-shown) ~ .control-label {
            color: #4BA3C3FF;
        }
    </style>
</head>

<body>
<main class="container mb-5 p-0">

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

    <div id="loginSignup" class="m-auto">
        <c:import url="/jsp/include/show-message.jsp"/>
        <div class="main">
            <input type="checkbox" id="loginCB" aria-hidden="true" checked>
            <div class="signup">
                <form action="<c:url value="/signup"/>" method="POST">
                    <label class="lb_singup" for="loginCB" aria-hidden="true">Sign up</label>
                    <div class="inputs my-0 mx-auto px-2">
                        <div class="form-group">
                            <input type="text" id="sing_username" class="custom-input form-control" name="username"
                                   placeholder="" minlength="3" maxlength="20"
                                   required="">
                            <label class="control-label">Username</label>
                        </div>
                        <div class="form-group">
                            <input type="email" id="sing_email" class="custom-input form-control" name="email" placeholder=""
                                   required="">
                            <label class="control-label">Email</label>
                        </div>
                        <div id="passwordComplex" class="w-100 p-2 px-3 d-none">
                            The password must contain:
                            <ul class="m-0">
                                <li id="passwordLength" class="invalid">From 8 to 20 characters.</li>
                                <li id="passwordUppercase" class="invalid">An uppercase letter.</li>
                                <li id="passwordLowercase" class="invalid">A lowercase letter.</li>
                                <li id="passwordNumber" class="invalid">A number.</li>
                                <li id="passwordSymbol" class="invalid">A symbol (!@#$%^&*)</li>
                            </ul>
                        </div>
                        <div class="form-group">
                            <input type="password" id="sing_password" class="custom-input form-control" name="password"
                                   placeholder="" maxlength="20"
                                   required=""> <!-- TODO add in password input minlength="8" -->
                            <label class="control-label">Password</label>
                        </div>
                        <div class="form-group">
                            <input type="password" id="sing_password_rp" class="custom-input mb-1 form-control" name="password_rp"
                                   placeholder="" maxlength="20"
                                   required="">
                            <label class="control-label">Repeat password</label>
                        </div>
                        <div class="additional-options">
                            <input type="checkbox" id="signupShowPassword">
                            <label for="signupShowPassword">Show Password</label>
                        </div>
                        <input type="submit" id="sing_submit" class="mt-4" value="Sign up">
                    </div>
                </form>
            </div>

            <div class="login">
                <form action="<c:url value="/login"/>" method="POST">
                    <label class="lb_login" for="loginCB" aria-hidden="true">Login</label>
                    <div class="inputs my-0 mx-auto px-2">
                        <div class="form-group">
                            <input type="text" id="login_user" class="custom-input mt-5 form-control" name="user"
                                   placeholder=""
                                   required="" minlength="3">
                            <label class="control-label">Username/Email</label>
                        </div>
                        <div class="form-group">
                            <input type="password" id="login_password" class="custom-input mb-1 form-control" name="password"
                                   placeholder="" maxlength="20"
                                   required=""> <!-- TODO add in password input minlength="8" -->
                            <label class="control-label">Password</label>
                        </div>
                        <%--<div class="additional-options">--%>
                        <%--<a href="#" class="forgot-password">Forgot password?</a>--%>
                        <%--</div>--%>
                        <div class="additional-options">
                            <input type="checkbox" id="loginShowPassword">
                            <label for="loginShowPassword">Show Password</label>
                        </div>
                        <input type="submit" id="login_submit" class="mt-4" value="Login">
                    </div>
                </form>
            </div>
        </div>
    </div>

    <c:import url="/jsp/include/foot.jsp"/>
    <script src="${pageContext.request.contextPath}/js/passwordComplexHint.js"></script>
    <script src="${pageContext.request.contextPath}/js/login.js"></script>

</body>
</html>