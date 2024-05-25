<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:if test="${not empty sessionScope.user}">

<%--    <c:import url="/jsp/utils/infoMessage.jsp"/>--%>

    <form id="updateForm">
        <div class="form-group">
            <label class="control-label">Username</label>
            <div class="form-input">
                <input id="name" type="text" name="name" class="form-control" placeholder="Username"
                       value="${sessionScope.user.getUsername()}" disabled>
            </div>
        </div>
        <br>
        <hr>

        <div class="form-group">
            <label class="control-label">Current E-mail</label>
            <div class="form-input">
                <input id="currentEmail" type="text" name="CurrentEmail" class="form-control"
                       placeholder="Current E-mail">
            </div>
        </div>
        <br>

        <div class="form-group">
            <label class="control-label">New E-mail</label>
            <div class="form-input">
                <input id="newEmail" type="text" name="NewEmail" class="form-control" placeholder="New E-mail">
            </div>
        </div>
        <br>
        <hr>

        <div class="form-group">
            <label class="control-label">Current Password</label>
            <div class="form-input">
                <input type="password" name="CurrentPassword" id="oldPassword" class="form-control"
                       placeholder="Current Password">
            </div>
        </div>
        <br>

        <div class="form-group">
            <label class="control-label">New Password</label>
            <div class="form-input">
                <input type="password" name="NewPassword" id="newPassword" class="form-control"
                       placeholder="New Password">
            </div>
        </div>
        <br>

        <div class="form-group">
            <label class="control-label">Repeat New Password</label>
            <div class="form-input">
                <input type="password" name="ConfirmPassword" id="confirm-password" class="form-control"
                       placeholder="Repeat New Password">
            </div>
        </div>
        <br>
        <div class="button-container mb-0">
            <button type="button" class="gradientButton" id="updateButton">
                <span>Update Credentials</span>
            </button>
        </div>
    </form>

</c:if>
<c:if test="${empty sessionScope.user}">
    <div><strong>NOT LOGGED IN</strong></div>
</c:if>