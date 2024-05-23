<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>


<div class="row">
    <div class="col-lg-10 col-xl-8 p-2 m-auto">
        <h2>HABITANTS ACTIONS</h2>
        <div id="gameActions"></div>
    </div>
</div>

<c:import url="/jsp/utils/warningMessage.jsp"/>
<c:import url="/jsp/utils/errorMessage.jsp"/>
<div class="button-container">
    <button id="sendActions" class="gradientButton">
        <span class="text" id="textActionsBt"></span>
    </button>
</div>