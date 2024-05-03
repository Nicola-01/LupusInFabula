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
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/common.css">
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/game/gameActions.css">
    <script src="${pageContext.request.contextPath}/js/utils.js"></script>
    <script src="${pageContext.request.contextPath}/js/game/gameActions.js"></script>

    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</head>

<body>

<div class="container">
    <div class="row">
        <div class="actionTitle">NIGHT</div>
        <div class="actions">Wolves, who do you want to kill tonight?
            <select id="">
                <optgroup label="WOLF PACK">
                    <option value="">Wolf</option>
                    <option value="">Berserker</option>
                </optgroup>
                <optgroup label="VILLAGERS">
                    <option value="">Farmer</option>
                    <option value="">Sam</option>
                </optgroup>
            </select>
        </div>
        <div class="actions">Wolves, who will among you kill your target?
            <select>
                <option value="">wolf1</option>
                <option value="">wolf2</option>
            </select>
        </div>
    </div>

    <div class="row">
        <div id="playersStatus" class="column col-md-6 p-2 pb-5">
            <div id="circle"></div>
        </div>
        <div id="gameLog" class="column col-md-6 p-2 pb-5">

        </div>
    </div>
</div>

</body>

</html>
