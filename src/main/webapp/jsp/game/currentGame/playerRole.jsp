<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<div class="row justify-content-center align-items-center mb-3">
    <div class="col-sm-12 col-md-10 col-lg-8 p-2 mx-auto text-center" style="margin: auto">
        <div id="playerRole" class="justify-content-center align-items-center w-100 mb-2"></div>

        <div id="cardContainer" class="card-container">
            <div id="card" class="card mx-auto">
                <div class="card-face card-front">
                    <!-- Front of card -->
                </div>
                <div class="card-face card-back">
                    <!-- Back of card -->
                </div>
            </div>
        </div>
    </div>
</div>

<script src="${pageContext.request.contextPath}/js/game/currentGame/playerCardToggle.js"></script>
<c:import url="/jsp/utils/errorMessage.jsp"/>