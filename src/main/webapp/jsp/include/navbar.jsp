<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/utils/navbar.css">
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.3.0/css/font-awesome.css" rel="stylesheet"
      type='text/css'>

<link href="https://fonts.googleapis.com/css2?family=Red+Hat+Display&display=swap" rel="stylesheet">

<%--<header>--%>
<%--    <h1>Lupus in Fabula</h1>--%>
<%--</header>--%>

<nav class="navbar navbar-expand-md shadow p-0 px-lg-3 py-lg-2 bg-light sticky-top">

    <a class="d-flex w-25 order px-3 py-2 p-lg-0 navbar-brand" href="<c:url value="/jsp/home.jsp"/>">
        <img src="${pageContext.request.contextPath}/media/logo.png" alt="logo" style="height:40px;">
    </a>
    <button class="border-0 px-3 py-2 p-lg-0 navbar-toggler collapsed" type="button" data-bs-toggle="collapse"
            data-bs-target="#headerNavbar"
            aria-controls="headerNavbar" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div id="headerNavbar" class="justify-content-center bg-blue order-2 w-50 navbar-collapse collapse">
        <div class="navbar-nav">
            <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="<c:url value="/jsp/home.jsp"/>">
<%--                    <i class="fa-solid fa-house"></i>--%>
                    Home
                </a>
            <li class="nav-item">
                <a class="nav-link" href="<c:url value="/jsp/testLogs/testlogs.jsp"/>">Statistics</a>
            </li>
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                   aria-expanded="false">
                    Game
                </a>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="<c:url value="/rules"/>">Rules</a></li>
                    <li>
                        <hr class="dropdown-divider">
                    </li>
                    <li><a class="dropdown-item" href="<c:url value="/jsp/game/createNewGame.jsp"/>">Create New
                        Game</a></li>
                    <li><a class="dropdown-item" href="<c:url value="/"/>">Join Game</a></li>
                </ul>
            </li>
            <div class="d-flex d-md-none pb-2 text-center nav-item">
                <span class="navigation__group">
                    <img class="profile" src="${pageContext.request.contextPath}/media/favicon.ico" alt="Joe Doe Picture">
                </span>
            </div>
        </div>
    </div>

    <div class="d-flex w-25 order-last px-3 py-2 p-lg-0 mx-0 navbar-brand justify-content-end d-none d-md-flex">
        <span class="navigation__group">
            <img class="profile" src="${pageContext.request.contextPath}/media/favicon.ico" alt="Lupus logo">
        </span>
        <div class="dropdown__wrapper hide dropdown__wrapper--fade-in none">
            <div class="dropdown__group">
                <c:if test="${not empty sessionScope.user}">
                    <div class="user-name">${sessionScope.user.getUsername()}</div>
                    <div class="email">${sessionScope.user.getEmail()}</div>
                </c:if>
            </div>
            <hr class="divider">
            <nav class="profile_nav">
                <ul>
                    <li>
                        <img src="${pageContext.request.contextPath}/media/navbar/profile.svg" alt="Profile"><a
                            href="${pageContext.request.contextPath}/jsp/user/userPage.jsp">
                        My Profile</a>
                    </li>
                    <li>
                        <img src="${pageContext.request.contextPath}/media/navbar/settings.svg" alt="Settings">
                        Settings
                    </li>
                </ul>
                <hr class="divider">
                <ul>
                    <li style="color: #E3452F;">
                        <img src="${pageContext.request.contextPath}/media/navbar/logout.svg" alt="Log Out"><a href="/lupus/logout">Log
                        out</a>
                    </li>
                </ul>
            </nav>
        </div>
    </div>

</nav>

<script src="${pageContext.request.contextPath}/js/navbar.js"></script>