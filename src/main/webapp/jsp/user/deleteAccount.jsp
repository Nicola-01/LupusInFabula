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

    <form id="deleteForm">
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
            <label class="control-label">E-mail</label>
            <div class="form-input">
                <input id="email" type="text" name="email" class="form-control" placeholder="E-mail">
                    <%--        <span class="small-error email-too-short none" style="position: relative;top: 5px;color: red;">L'e-mail è troppo breve.</span>--%>
                    <%--        <span class="small-error email-too-long none" style="position: relative;top: 5px;color: red;">L'e-mail è troppo lunga.</span>--%>
            </div>
        </div>
        <br>

        <div class="form-group">
            <label class="control-label">Password</label>
            <div class="form-input">
                <input type="password" name="password" id="password" class="form-control"
                       placeholder="Password">
                    <%--            <span class="small-error password-not-equal none" style="position: relative;top: 5px;color: red;">Incorrect old password</span>--%>
                    <%--            <p class="help-block">Insert your current password</p>--%>
                    <%--            <div data-lastpass-icon-root=""--%>
                    <%--                 style="position: relative !important; height: 0px !important; width: 0px !important; float: left !important;"></div>--%>
            </div>
        </div>
        <br>

        <button type="button" class="cssbuttons-io" id="deleteButton">
            <span>Delete Account</span>
        </button>
    </form>

</c:if>
<c:if test="${empty sessionScope.user}">
    <div><strong>NOT LOGGED IN</strong></div>
</c:if>