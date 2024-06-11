<%@ page contentType="text/html;charset=utf-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/utils/modal.css">


<div class="modal fade" id="modal" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header py-2 justify-content-center position-relative">
                <h1 id="modalLabel" class="modal-title mx-auto">Modal title</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body py-2" id="modalBodyText">
                ...
            </div>
            <div class="modal-footer py-2">
                <button type="button" id="modalCancel" class="btn btn-secondary" data-bs-dismiss="modal">
                    Close
                </button>
                <button type="button" id="modalConfirm" class="btn btn-primary" data-bs-dismiss="modal">
                    Confirm
                </button>
            </div>
        </div>
    </div>
</div>

<script>
    // Adding event listeners to modal buttons
    document.addEventListener('DOMContentLoaded', function () {
        document.getElementById("modalConfirm").addEventListener("click", modalConfirmEvent);
    });

    /**
     * Sets the modal title.
     *
     * @param {string} title - The title to be set for the modal.
     */
    function setModalTitle(title) {
        document.getElementById("modalLabel").innerText = title;
    }

    /**
     * Sets the modal body text.
     *
     * @param {string} text - The text to be set for the modal body.
     */
    function setModalText(text) {
        document.getElementById("modalBodyText").innerText = text;
    }

    /**
     * Gets the modal body text.
     *
     * @returns {string} The current text of the modal body.
     */
    function getModalText() {
        return document.getElementById("modalBodyText").innerText;
    }

</script>