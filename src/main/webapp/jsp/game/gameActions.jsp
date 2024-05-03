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
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/game/gameActions.css">
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/utils/playersStatus.css">
</head>

<body>
<jsp:include page="/jsp/include/navbar.jsp"/>

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
        <jsp:include page="../utils/playersStatus.jsp"/>
        <jsp:include page="../utils/gameLog.jsp"/>
    </div>
</div>

<script src="${pageContext.request.contextPath}/js/game/gameActions.js"></script>
<script src="${pageContext.request.contextPath}/js/utils/playersStatus.js"></script>

<c:import url="/jsp/include/footer.jsp"/>
<c:import url="/jsp/include/foot.jsp"/>

</body>
</html>
