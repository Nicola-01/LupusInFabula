<%--
  Created by IntelliJ IDEA.
  User: michele
  Date: 02/06/2024
  Time: 13:55
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE html>
<html lang="en">

<head>
    <title>Lupus In Fabula - Cards backings</title>
    <c:import url="/jsp/include/head.jsp"/>
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/common.css">
</head>


<body class="d-flex flex-column">
<jsp:include page="/jsp/include/navbar.jsp"/>


<main class="container flex-grow-1" id="main_class">
    <div class="row mb-2">
        <div class="col-9">
            <h1 class="mb-0">Cards backing of <b>${sessionScope.user.getUsername()}</b></h1>
        </div>
    </div>

    <c:import url="/jsp/utils/infoMessage.jsp"/>

    <div id="imageContainer" class="row"></div>

    <form id="selectionForm">
        <button type="submit">Submit</button>
    </form>

</main>


<c:import url="/jsp/include/footer.jsp"/>
<c:import url="/jsp/include/foot.jsp"/>

<script src="${pageContext.request.contextPath}/js/cards.js"></script>
<script src="${pageContext.request.contextPath}/js/utils/message.js"></script>

</body>
</html>