<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:if test="${not empty sessionScope.user}">

    <%--    <c:import url="/jsp/utils/infoMessage.jsp"/>--%>

    <form id="updateForm">

        <div id="liveAlertPlaceholderPut"></div>

        <div class="form-group">
            <label>Username</label>
            <div class="form-input">
                <input id="namePut" type="text" name="name" class="form-control" placeholder=""
                       value="${sessionScope.user.getUsername()}" disabled>
            </div>
        </div>
        <br>
        <hr>
        <br>

        <div class="form-group">
            <input id="currentEmail" type="text" name="CurrentEmail" class="form-control" placeholder="">
            <label class="control-label">Current E-mail</label>
        </div>
        <br>
        <br>

        <div class="form-group">
            <input id="newEmail" type="text" name="NewEmail" class="form-control" placeholder="">
            <label class="control-label">New E-mail</label>
        </div>
        <br>
        <hr>
        <br>

        <div class="form-group">
            <input type="password" name="CurrentPassword" id="oldPassword" class="form-control" placeholder="">
            <label class="control-label">Current Password</label>
        </div>
        <br>
        <br>

        <div id="passwordComplex" class="w-100 p-2 px-3 d-none">
            The password must contain:
            <ul class="m-0">
                <li id="passwordLength" class="invalid">From 8 to 20 characters.</li>
                <li id="passwordUppercase" class="invalid">An uppercase letter.</li>
                <li id="passwordLowercase" class="invalid">A lowercase letter.</li>
                <li id="passwordNumber" class="invalid">A number.</li>
                <li id="passwordSymbol" class="invalid">A symbol (!@#$%^&*)</li>
            </ul>
        </div>
        <div class="form-group">
            <input type="password" name="NewPassword" id="newPassword" class="form-control" placeholder="">
            <label class="control-label">New Password</label>
        </div>
        <br>
        <br>

        <div class="form-group">
            <input type="password" name="ConfirmPassword" id="confirm-password" class="form-control" placeholder="">
            <label class="control-label">Repeat New Password</label>
        </div>
        <br>

        <div class="button-container mb-0">
            <button type="button" class="gradientButton" id="updateButton" disabled>
                <span>Update Credentials</span>
            </button>
        </div>
    </form>

</c:if>
<c:if test="${empty sessionScope.user}">
    <div><strong>NOT LOGGED IN</strong></div>
</c:if>