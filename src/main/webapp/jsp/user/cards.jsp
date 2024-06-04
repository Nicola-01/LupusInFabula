<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/jsp/utils/infoMessage.jsp"/>

<div id="imageContainer" class="row"></div>

<div class="button-container mb-0">
    <button type="button" class="gradientButton" id="updateCard">
        <span>Update the card</span>
    </button>
</div>


<script src="${pageContext.request.contextPath}/js/user/cards.js"></script>