<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/utils/navbar.css">
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.3.0/css/font-awesome.css" rel="stylesheet"  type='text/css'>

<header>
    <h1>Lupus in Fabula</h1>
</header>

<nav class="navbar navbar-expand-lg bg-light">
    <div class="container-fluid">
        <a class="navbar-brand" href="<c:url value="/jsp/home.jsp"/>">
            <img src="${pageContext.request.contextPath}/media/favicon.ico" alt="logo" style="width:40px;">
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01"
                aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0" style="margin: auto">
                <li class="nav-item">
                    <a class="nav-link active" aria-current="page" href="<c:url value="/jsp/home.jsp"/>">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="<c:url value="/"/>">Statistics</a>
                </li>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                       aria-expanded="false">
                        Game
                    </a>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="<c:url value="/rules"/>">Rules</a></li>
                        <li><a class="dropdown-item" href="<c:url value="/jsp/game/createNewGame.jsp"/>">Create New
                            Game</a></li>
                        <li><a class="dropdown-item" href="<c:url value="/"/>">Join Game</a></li>
                    </ul>
                </li>
            </ul>
        </div>

        <div>
            <input id="check-for-clicking" type="checkbox">
            <label class="main-add-button-plus" for="check-for-clicking">
                <div class="menu-add-button-title"><i class="fas fa-bars"></i></div>
            </label>
            <label class="main-add-button-minus" for="check-for-clicking">
                <div class="menu-add-button-title"><i class="fas fa-times"></i></div>
            </label>
            <div class="menu-add-items">
                <span class="plate"><a href="<c:url value="/user/"/>"><i class="fas fa-user"></i></a></span>
                <span class="plate"><a href="<c:url value="/logout"/>"><i class="fas fa-sign-out-alt"></i></a></span>
            </div>
        </div>

    </div>
</nav>
