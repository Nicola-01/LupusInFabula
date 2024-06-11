<%@ page contentType="text/html;charset=utf-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/utils/modal.css">

<div class="modal fade" id="rolesModal" tabindex="-1" aria-labelledby="rolesModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header py-2 justify-content-center position-relative">
                <h1 id="rolesModalLabel" class="modal-title mx-auto">ROLES IN GAME</h1>
                <button type="button" data-bs-dismiss="modal" aria-label="Close" class="btn-close m-0"></button>
            </div>
            <div class="modal-body py-2">
                <div id="gameConfEvil" class="evilRoles mb-1 d-none"></div>
                <div id="gameConfNeutral" class="neutralRoles mb-1 d-none"></div>
                <div id="gameConfGood" class="goodRoles mb-1 d-none"></div>
                <div id="gameConfVictoryStealer" class="victoryStealerRoles mb-1 d-none"></div>
            </div>
            <div class="modal-footer justify-content-center py-2">
                <button type="button" id="closeRolesModal" data-bs-dismiss="modal" class="btn btn-primary">Close</button>
            </div>
        </div>
    </div>
</div>