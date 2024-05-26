<%--
  Created by IntelliJ IDEA.
  User: Jacopo Momesso
  Date: 23/05/2024
  Time: 20:57
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:if test="${not empty sessionScope.user}">

<%--    <c:import url="/jsp/utils/infoMessage.jsp"/>--%>

    <div id="liveAlertPlaceholderDelete"></div>

    <form id="deleteForm">
        <div class="form-group">
            <label class="control-label">Username</label>
            <div class="form-input">
                <input id="nameDelete" type="text" name="name" class="form-control" placeholder="Username"
                       value="${sessionScope.user.getUsername()}" disabled>
            </div>
        </div>
        <br>
        <hr>

        <div class="form-group">
            <label class="control-label">E-mail</label>
            <div class="form-input">
                <input id="email" type="text" name="email" class="form-control" placeholder="E-mail">
            </div>
        </div>
        <br>

        <div class="form-group">
            <label class="control-label">Password</label>
            <div class="form-input">
                <input type="password" name="password" id="password" class="form-control"
                       placeholder="Password">
            </div>
        </div>
        <br>

        <div class="button-container mb-0">
            <button type="button" class="gradientButton" id="deleteButton">
                <span>Delete Account</span>
            </button>
        </div>
    </form>

</c:if>
<c:if test="${empty sessionScope.user}">
    <div><strong>NOT LOGGED IN</strong></div>
</c:if>