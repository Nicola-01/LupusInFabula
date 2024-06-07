<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:if test="${not empty sessionScope.user}">

    <%--    <c:import url="/jsp/utils/infoMessage.jsp"/>--%>

    <div id="liveAlertPlaceholderDelete"></div>
    <c:import url="/jsp/utils/successMessage.jsp"/>
    <c:import url="/jsp/utils/errorMessage.jsp"/>

    <form id="deleteForm">
        <div class="form-group">
            <label>Username</label>
            <div class="form-input">
                <input id="nameDelete" type="text" name="name" class="form-control" placeholder=""
                       value="${sessionScope.user.getUsername()}" disabled>
            </div>
        </div>
        <hr class="my-4">

        <div class="form-group">
            <label>E-mail</label>
            <input id="email" type="text" name="email" class="form-control" placeholder=""
                   value="${sessionScope.user.getEmail()}" disabled>
        </div>

        <div class="form-group">
            <input type="password" name="password" id="password" class="form-control" placeholder="">
            <label class="control-label">Password</label>
            <button id="password_ShowPassword" class="showPassword" tabindex="-1">
                <i id="password_eyeIcon" class="fas fa-eye"></i>
            </button>
        </div>

        <div class="button-container mb-0 mt-5\">
            <button type="button" class="gradientButton" id="deleteButton" disabled>
                <span>Delete Account</span>
            </button>
        </div>
    </form>

</c:if>
<c:if test="${empty sessionScope.user}">
    <div><strong>NOT LOGGED IN</strong></div>
</c:if>