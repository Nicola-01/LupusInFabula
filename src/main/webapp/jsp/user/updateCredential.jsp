<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:if test="${not empty sessionScope.user}">

    <%--    <c:import url="/jsp/utils/infoMessage.jsp"/>--%>

    <div id="liveAlertPlaceholderPut"></div>
    <c:import url="/jsp/utils/successMessage.jsp"/>
    <c:import url="/jsp/utils/errorMessage.jsp"/>

    <form id="updateForm">
        <div class="form-group">
            <label>Username</label>
            <div class="form-input">
                <input id="namePut" type="text" name="name" class="form-control" placeholder=""
                       value="${sessionScope.user.getUsername()}" disabled>
            </div>
        </div>
        <hr class="my-4">

        <div class="form-group">
            <input id="currentEmail" type="text" name="CurrentEmail" class="form-control" placeholder="">
            <label class="control-label">Current E-mail</label>
        </div>

        <div class="form-group">
            <input id="newEmail" type="text" name="NewEmail" class="form-control" placeholder="">
            <label class="control-label">New E-mail</label>
        </div>
        <hr class="my-4">

        <div class="form-group">
            <input type="password" name="CurrentPassword" id="oldPassword" class="form-control" placeholder="">
            <label class="control-label">Current Password</label>
            <button id="oldPassword_ShowPassword" class="showPassword" tabindex="-1">
                <i id="oldPassword_eyeIcon" class="fas fa-eye"></i>
            </button>
        </div>

        <div class="form-group">
            <div id="passwordComplex" class="p-2 px-3 d-none">
                The password must contain:
                <ul class="m-0">
                    <li id="passwordLength" class="invalid">From 8 to 20 characters.</li>
                    <li id="passwordUppercase" class="invalid">An uppercase letter.</li>
                    <li id="passwordLowercase" class="invalid">A lowercase letter.</li>
                    <li id="passwordNumber" class="invalid">A number.</li>
                    <li id="passwordSymbol" class="invalid">A symbol (!@#$%^&*)</li>
                </ul>
            </div>
            <input type="password" name="NewPassword" id="newPassword" class="form-control" placeholder="">
            <label class="control-label">New Password</label>
            <button id="newPassword_ShowPassword" class="showPassword" tabindex="-1">
                <i id="newPassword_eyeIcon" class="fas fa-eye"></i>
            </button>
        </div>

        <div class="form-group">
            <input type="password" name="ConfirmPassword" id="confirm-password" class="form-control" placeholder="">
            <label class="control-label">Repeat New Password</label>
            <button id="confirm-password_ShowPassword" class="showPassword" tabindex="-1">
                <i id="confirm-password_eyeIcon" class="fas fa-eye"></i>
            </button>
        </div>

        <div class="button-container mb-0 mt-5">
            <button type="button" class="gradientButton" id="updateButton" disabled>
                <span>Update Credentials</span>
            </button>
        </div>
    </form>

</c:if>
<c:if test="${empty sessionScope.user}">
    <div><strong>NOT LOGGED IN</strong></div>
</c:if>