<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

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


<script src="${pageContext.request.contextPath}/js/user/cards.js"></script>