<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<div class="row">
    <div class="col-sm-1 d-none d-sm-block col-md-1 col-lg-2 p-2"></div>
    <div class="col-sm-12 col-md-10 col-lg-8 p-2">
        <h2 id="gameStatus"></h2>
        <div id="gameActions"></div>
    </div>
    <div class="col-sm-1 d-none d-sm-block col-md-1 col-lg-2 p-2"></div>
</div>

<c:import url="/jsp/utils/errorMessage.jsp"/>
<div class="button-container">
    <button id="sendActions">
        <span class="text" id="textActionsBt">New </span>
    </button>
</div>