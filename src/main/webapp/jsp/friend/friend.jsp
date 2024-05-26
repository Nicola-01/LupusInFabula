<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<div id="addFriend" class="row justify-content-center">
    <div  class="col-9" style="position: relative;">
        <jsp:include page="/jsp/utils/searchPlayer.jsp"/>
    </div>
</div>

<c:import url="/jsp/utils/successMessage.jsp"/>
<c:import url="/jsp/utils/infoMessage.jsp"/>
<c:import url="/jsp/utils/errorMessage.jsp"/>

<div id="listFriend" class="row justify-content-center mt-3">
    <h2>Your Friends</h2>
    <div id="friendsTable" class="p-0">
        <table id="my_friends" class="table table-striped mb-0">
            <thead class="sticky-top top-0">
            <tr>
                <th style="width:40%">Username</th>
                <th style="width:15%">Available</th>
                <th style="width:30%">Date</th>
                <th style="width:15%">Remove</th>
            </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
    </div>
</div>