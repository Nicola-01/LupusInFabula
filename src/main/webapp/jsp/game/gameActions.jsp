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
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/game/game_actions.css">
    <script src="${pageContext.request.contextPath}/js/utils.js"></script>
    <script src="${pageContext.request.contextPath}/js/game/game_actions.js"></script>
</head>

<body>

<div class="rows">
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

<div class="rows">
    <div class="colums"></div>
    <div class="colums"></div>
    <div class="colums"></div>
</div>

</body>

</html>
