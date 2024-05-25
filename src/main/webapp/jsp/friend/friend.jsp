<div id="addFriend" class="row justify-content-center">
    <div  class="col-9" style="position: relative;">
        <jsp:include page="/jsp/utils/searchPlayer.jsp"/>
    </div>
</div>

<div id="listFriend" class="row justify-content-center">
    <h2>Your Friends</h2>
    <div id="friendsTable">
        <table id="my_friends" class="table table-striped mb-0">
            <thead class="sticky-top top-0" style="z-index: 1 !important;">
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