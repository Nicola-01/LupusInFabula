<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/jsp/utils/infoMessage.jsp"/>

<div id="imageContainer" class="row m-auto"></div>

<div class="button-container mt-4 mb-0">
    <button type="button" class="gradientButton" id="updateCard">
        <span>Update the card</span>
    </button>
</div>

<script src="${pageContext.request.contextPath}/js/user/cards.js"></script>