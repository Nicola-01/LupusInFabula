<%--
  Author: LupusInFabula Group
  Version: 1.0
  Since: 1.0
--%>
<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE html>
<html lang="en">

<head>
    <title>Game</title>
    <c:import url="/jsp/include/head.jsp"/>

    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/game/currentGame.css">
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/game/currentGame/gameActions.css">
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/game/currentGame/playersStatus.css">
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/game/currentGame/gameLog.css">
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/user/cards.css">
</head>

<body class="d-flex flex-column">
<c:import url="/jsp/utils/loginChecker.jsp"/>
<jsp:include page="/jsp/include/navbar.jsp"/>

<main class="container flex-grow-1">

    <c:import url="/jsp/utils/infoMessage.jsp"/>

    <div id="actionResults">

    </div>

    <c:choose>
        <c:when test="${gameOver>=0}">
            <jsp:include page="currentGame/gameOver.jsp"/>
        </c:when>
        <c:otherwise>

            <div class="row">
                <div class="col-lg-11 col-xl-10 p-2 m-auto row">
                    <div class="col-4 p-0 my-auto">
                        <h1 id="gameStatus" class="m-0"></h1>
                    </div>
                    <div class="col-4 p-0 d-flex justify-content-center">
                        <button id="toggleButton" class="btn btn-primary rounded-circle" style="display: none;">
                            <i id="eyeIcon" class="fas fa-eye"></i>
                        </button>
                    </div>
                    <div class="col-4 p-0 my-auto">
                        <div class="d-flex justify-content-end">
                            <button id="copyLink" onclick="copyGameLink()">
                <span>
                    <svg viewBox="0 0 467 512.22" clip-rule="evenodd" fill-rule="evenodd"
                         image-rendering="optimizeQuality" text-rendering="geometricPrecision"
                         shape-rendering="geometricPrecision" xmlns="http://www.w3.org/2000/svg" fill="#0E418F"
                         height="12" width="12">
                        <path d="M131.07 372.11c.37 1 .57 2.08.57 3.2 0 1.13-.2 2.21-.57 3.21v75.91c0 10.74 4.41 20.53 11.5 27.62s16.87 11.49 27.62 11.49h239.02c10.75 0 20.53-4.4 27.62-11.49s11.49-16.88 11.49-27.62V152.42c0-10.55-4.21-20.15-11.02-27.18l-.47-.43c-7.09-7.09-16.87-11.5-27.62-11.5H170.19c-10.75 0-20.53 4.41-27.62 11.5s-11.5 16.87-11.5 27.61v219.69zm-18.67 12.54H57.23c-15.82 0-30.1-6.58-40.45-17.11C6.41 356.97 0 342.4 0 326.52V57.79c0-15.86 6.5-30.3 16.97-40.78l.04-.04C27.51 6.49 41.94 0 57.79 0h243.63c15.87 0 30.3 6.51 40.77 16.98l.03.03c10.48 10.48 16.99 24.93 16.99 40.78v36.85h50c15.9 0 30.36 6.5 40.82 16.96l.54.58c10.15 10.44 16.43 24.66 16.43 40.24v302.01c0 15.9-6.5 30.36-16.96 40.82-10.47 10.47-24.93 16.97-40.83 16.97H170.19c-15.9 0-30.35-6.5-40.82-16.97-10.47-10.46-16.97-24.92-16.97-40.82v-69.78zM340.54 94.64V57.79c0-10.74-4.41-20.53-11.5-27.63-7.09-7.08-16.86-11.48-27.62-11.48H57.79c-10.78 0-20.56 4.38-27.62 11.45l-.04.04c-7.06 7.06-11.45 16.84-11.45 27.62v268.73c0 10.86 4.34 20.79 11.38 27.97 6.95 7.07 16.54 11.49 27.17 11.49h55.17V152.42c0-15.9 6.5-30.35 16.97-40.82 10.47-10.47 24.92-16.96 40.82-16.96h170.35z"
                              fill-rule="nonzero">
                        </path>
                    </svg> Copy link
                </span>
                                <span>Copied</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <c:choose>
                <c:when test="${isMaster}">
                    <jsp:include page="currentGame/gameActions.jsp"/>
                </c:when>
                <c:otherwise>
                    <jsp:include page="currentGame/playerRole.jsp"/>
                </c:otherwise>
            </c:choose>
        </c:otherwise>
    </c:choose>

    <div class="row">
        <div id="playersStatusExternal" class="col-md-6 mb-3 mb-md-0 p-1">
            <h2>HABITANTS STATUS</h2>
            <div id="playersStatus" class="row p-2"></div>
        </div>
        <div id="gameLogExternal" class="col-md-6 p-1">
            <h2>VILLAGE LOGS</h2>
            <div id="gameLog" class="row p-2"></div>
        </div>
    </div>

</main>

<c:import url="/jsp/include/footer.jsp"/>
<c:import url="/jsp/include/foot.jsp"/>

<script src="${pageContext.request.contextPath}/js/game/currentGame/playerCardToggle.js"></script>
<script src="${pageContext.request.contextPath}/js/game/currentGame/gameActions.js"></script>
<script src="${pageContext.request.contextPath}/js/game/currentGame/playersStatus.js"></script>
<script src="${pageContext.request.contextPath}/js/game/currentGame/gameLog.js"></script>
<script src="${pageContext.request.contextPath}/js/game/currentGame.js"></script>

</body>
</html>
