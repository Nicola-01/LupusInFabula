<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!-- Section to add a new friend -->
<div id="addFriend" class="row justify-content-center">
    <div class="col-9" style="position: relative;">
        <jsp:include page="/jsp/utils/searchPlayer.jsp"/> <!-- Include the searchPlayer.jsp to provide the functionality to search for a player -->
    </div>
</div>

<!-- Include success, info, and error message templates for displaying feedback to the user -->
<c:import url="/jsp/utils/successMessage.jsp"/>
<c:import url="/jsp/utils/infoMessage.jsp"/>
<c:import url="/jsp/utils/errorMessage.jsp"/>

<!-- Section to list current friends -->
<div id="listFriend" class="row justify-content-center mt-3">
    <h2>Your Friends</h2>
    <div id="friendsTable" class="p-0">
        <table id="my_friends" class="sortable table table-striped mb-0">
            <thead class="sticky-top top-0">
            <tr>
                <th style="width:35%">Username</th>
                <th style="width:10%">Available</th>
                <th style="width:20%">Games together</th>
                <th style="width:20%">Since</th>
                <th style="width:15%"></th>
            </tr>
            </thead>
            <tbody>
            <!-- Friend list will be dynamically populated here -->
            </tbody>
        </table>
    </div>
</div>

<!-- External JavaScript library to make the table sortable -->
<script src="https://www.kryogenix.org/code/browser/sorttable/sorttable.js"></script>
