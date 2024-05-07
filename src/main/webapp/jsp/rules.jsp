<%--
  Created by IntelliJ IDEA.
  User: Jacopo Momesso
  Date: 07/04/2024
  Time: 17:45
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Lupus in Fabula - Rules</title>
    <c:import url="/jsp/include/head.jsp"/>

    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/navbar.css">
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/rules.css">
</head>
<body>

<jsp:include page="include/navbar.jsp"/>

<div class="container">
    <h1>RULES</h1>
    <ol>
        <li>
            <h3><strong>Introduction to Lupus</strong></h3>
            <p>In the remote village of Fabula, some people become werewolves at night. They attack an innocent person
                to satisfy their instincts. During the day, the survivors discuss what to do. At the end of the
                discussion, they lynch one of them. Who will survive the massacre?</p>
        </li>
    </ol>
    <%--    <p class="rules">--%>
    <%--        In the remote village of Fabula, some people become werewolves at night. They attack an innocent person to--%>
    <%--        satisfy their instincts. During the day, the survivors discuss what to do. At the end of the discussion, they--%>
    <%--        lynch one of them. Who will survive the massacre?--%>
    <%--    </p>--%>
    <ul>
        <li><a href="#aim">Aim of the Game</a></li>
        <li><a href="#preparation">Preparation</a></li>
        <li><a href="#game">Game</a></li>
        <ul>
            <li><a href="#night">Night</a></li>
            <li><a href="#day">Day</a></li>
            <li><a href="#voting">Vote</a></li>
        </ul>
        <li><a href="#victory">Victory Condition</a></li>
    </ul>
    <ol style="--length: 7" role="list">
        <li id="aim" style="--i: 1">
            <h3><strong>Aim of the game</strong></h3>
            <p>There are two factions in the game: the Werewolves and the Villagers. The aim of the Werewolf faction is
                to eliminate all villagers. Conversely, the aim of the Villagers faction is to lynch all the
                Werewolves.</p>
        </li>
        <li id="preparation" style="--i: 2">
            <h3><strong>Preparation</strong></h3>
            <p>Before the game starts, one player is chosen to be the master/moderator. He doesn’t belong to any
                faction, and he will only manage the game tracking everything that will happen. The other players will
                play the role given to them by their card and look at their own card secretly.</p>
        </li>
        <li id="game" style="--i: 3">
            <h3><strong>Game</strong></h3>
            <p>The game is divided into two phases: night and day. At night each role with an effect that resolves
                during this phase will be called by the master to perform the respective action described in the role
                card.
                Once the master has called all roles with a night effect, night will end and the day phase will begin.
                During the day, people will discuss and vote to lynch someone, hopefully a wolf or a member of the wolf
                faction.</p>
        </li>
        <li id="night" style="--i: 4">
            <h3><strong>Night</strong></h3>
            <p>The moderator declares the beginning of the night (”it is night, everyone close your eyes”). All players
                then close their eyes, trying not to make any kind of noise for all the duration of this phase. The
                master then begins to call each role with effect:<br>
                Example of wolves calling:<br>
                - Master: ”Wolves open their eyes and choose who to go and maul.”<br>
                - Wolves silently agree and point to their prey<br>
                - Master: ”Decide who to send among you to maul your chosen prey”<br>
                - Wolves indicate who among them will go<br>
                - Master: ”The wolves close their eyes.”<br>
                Example of good role calling (e.g: Seer):<br>
                - Master: ”Seer open eyes and choose whom to investigate”<br>
                - Seer points to the player he wants to investigate<br>
                - Master nods to say whether the player has a bad or good role<br>
                - Master: ”Seer closes eyes.”<br>
                Note: This phase should be played even if the called role is already dead in order to not give clues to
                others. Once the master has called all roles with night effect, the night is over.<br></p>
        </li>
        <li id="day" style="--i: 5">
            <h3><strong>Day</strong></h3>
            <p>The master now declares the start of the day (”it’s day, everybody open your eyes”). The master
                then gives a recap of what happened during the past night, listing who died (if anyone died), who was
                anointed, etc. without giving explicit information about what happened (e.g. recap: Master: ”A died,
                B died, C was anointed”). Once the master has finished the recap, the still-living players can then
                start discussing among themselves to decide who to lynch. You may lie freely but under no circumstances
                may you show your card to others.</p>
        </li>
        <li id="voting" style="--i: 6">
            <h3><strong>Voting</strong></h3>
            <p>After a maximum of three minutes of discussion, the master stops the discussion and asks each player,
                starting with the one to the left of the one who died first and proceeding clockwise, who he thinks
                should be lynched. All players, including ghosts (i.e., those who died), in their turn vote indicating
                who they want to lynch. At the end of the voting, the two players with the most votes will be clued (in
                case of a tie, the player closest to the first dead will be chosen). The two suspected players can now
                take a short speech defending themselves against the charges. After the two speeches are over, the
                remaining alive unindicted players will vote again for the new player to be lynched among the two
                suspects (in this case the voting will be counterclockwise starting with the alive unindicted player who
                was last to vote before). At this point the day is over and the master can start a new night and so on
                until one faction wins.
                <br>
                Note: all dead players (i.e. ghosts) for the rest of the entire game must not speak or show their role
                to other players.</p>
        </li>
        <li id="victory" style="--i: 7">
            <h3><strong>Victory Condition</strong></h3>
            <p>The master declares the game over with a villagers victory if the villagers lynch all the werewolves.
                Werewolves, on the other hand, are declared winners if at any point in time they are equal in number to
                the still-living villagers (e.g., 2 werewolves and 2 villagers, or 1 and 1): in that case the werewolves
                unceremoniously maul the remaining villagers! In case there are victory stealer roles in the game, they
                will win if their victory condition is fulfilled, and in that case the master will declare them winners
                any time in the game when they have completed their victory condition.
                This game requires at least five participants, one of whom will be the game-master, and the other will
                get roles assigned randomly, for instance by drawing a card. The main roles are wolves and farmers, but
                other roles are used - like medium, knight, werehamster etc - in order to make the game more
                entertaining, with specific rules applying to each character.</p>
        </li>
    </ol>
</div>
<br>

<div class="container">
    <h1 id="roles">ROLES</h1>
    <div class="slideshow-container goodRoles">
        <h2 class="text-center">GOOD</h2>
        <div class="rolesDescription">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sapien dolor, pulvinar ac maximus non,
            egestas a libero. Praesent quis sollicitudin risus. Cras vulputate placerat nunc vel accumsan. Mauris elit
            justo, pretium quis purus id, fermentum tincidunt ligula.
        </div>
        <c:if test="${not empty roles}">
            <c:forEach var="roleList" items="${roles}">
                <c:forEach var="role" items="${roleList}">
                    <c:if test="${role.type eq 0}">
                        <div class="mySlides slide1 p-2">
                            <div class="row">
                                <div class="col-md-5">
                                    <img class="asyncImage"
                                         src="${pageContext.request.contextPath}/media/cards/lowResolution/<c:out value="${role.name}"/>.png"
                                         data-src="${pageContext.request.contextPath}/media/cards/<c:out value="${role.name}"/>.png"
                                         alt="<c:out value="${role.name}"/>'s card">
                                </div>
                                <div class="col-md-7 roleDescription">
                                    <h5 class="roleName">
                                        <c:out value="${fn:toUpperCase(role.name)}"/>
                                    </h5>
                                    <p>
                                        <c:out value="${role.description}"/>
                                    </p>
                                    <div class="wins">
                                        WINS WITH: <strong class="winsWith">VILLAGERS</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </c:if>
                </c:forEach>
            </c:forEach>
        </c:if>

        <a class="prev" onclick="plusSlides(-1, 0)">❮</a>
        <a class="next" onclick="plusSlides(1, 0)">❯</a>
    </div>

    <br>

    <div class="slideshow-container evilRoles">
        <h2 class="text-center">EVIL</h2>
        <div class="rolesDescription">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sapien dolor, pulvinar ac maximus non,
            egestas a libero. Praesent quis sollicitudin risus. Cras vulputate placerat nunc vel accumsan. Mauris elit
            justo, pretium quis purus id, fermentum tincidunt ligula.
        </div>
        <c:if test="${not empty roles}">
            <c:forEach var="roleList" items="${roles}">
                <c:forEach var="role" items="${roleList}">
                    <c:if test="${role.type eq 1}">
                        <div class="mySlides slide2 p-2">
                            <div class="row">
                                <div class="col-md-5">
                                    <img class="asyncImage"
                                         src="${pageContext.request.contextPath}/media/cards/lowResolution/<c:out value="${role.name}"/>.png"
                                         data-src="${pageContext.request.contextPath}/media/cards/<c:out value="${role.name}"/>.png"
                                         alt="<c:out value="${role.name}"/>'s card">
                                </div>
                                <div class="col-md-7 roleDescription">
                                    <h5 class="roleName">
                                        <c:out value="${fn:toUpperCase(role.name)}"/>
                                    </h5>
                                    <p>
                                        <c:out value="${role.description}"/>
                                    </p>
                                    <div class="wins">
                                        WINS WITH: <strong class="winsWith">WOLF PACK</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </c:if>
                </c:forEach>
            </c:forEach>
        </c:if>

        <a class="prev" onclick="plusSlides(-1, 1)">❮</a>
        <a class="next" onclick="plusSlides(1, 1)">❯</a>
    </div>

    <br>

    <div class="slideshow-container victoryStealerRoles">
        <h2 class="text-center">VICTORY STEALER</h2>
        <div class="rolesDescription">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sapien dolor, pulvinar ac maximus non,
            egestas a libero. Praesent quis sollicitudin risus. Cras vulputate placerat nunc vel accumsan. Mauris elit
            justo, pretium quis purus id, fermentum tincidunt ligula.
        </div>
        <c:if test="${not empty roles}">
            <c:forEach var="roleList" items="${roles}">
                <c:forEach var="role" items="${roleList}">
                    <c:if test="${role.type eq 2}">
                        <div class="mySlides slide3 p-2">
                            <div class="row">
                                <div class="col-md-5">
                                    <img class="asyncImage"
                                         src="${pageContext.request.contextPath}/media/cards/lowResolution/<c:out value="${role.name}"/>.png"
                                         data-src="${pageContext.request.contextPath}/media/cards/<c:out value="${role.name}"/>.png"
                                         alt="<c:out value="${role.name}"/>'s card">
                                </div>
                                <div class="col-md-7 roleDescription">
                                    <h5 class="roleName">
                                        <c:out value="${fn:toUpperCase(role.name)}"/>
                                    </h5>
                                    <p>
                                        <c:out value="${role.description}"/>
                                    </p>
                                    <div class="wins">
                                        WINS WITH: <strong class="winsWith">ALONE</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </c:if>
                </c:forEach>
            </c:forEach>
        </c:if>

        <a class="prev" onclick="plusSlides(-1, 2)">❮</a>
        <a class="next" onclick="plusSlides(1, 2)">❯</a>
    </div>

    <br>

    <div class="slideshow-container neutralRoles">
        <h2 class="text-center">NEUTRAL ROLES</h2>
        <div class="rolesDescription">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sapien dolor, pulvinar ac maximus non,
            egestas a libero. Praesent quis sollicitudin risus. Cras vulputate placerat nunc vel accumsan. Mauris elit
            justo, pretium quis purus id, fermentum tincidunt ligula.
        </div>
        <c:if test="${not empty roles}">
            <c:forEach var="roleList" items="${roles}">
                <c:forEach var="role" items="${roleList}">
                    <c:if test="${role.type eq 3}">
                        <div class="mySlides slide4 p-2">
                            <div class="row">
                                <div class="col-md-5">
                                    <img class="asyncImage"
                                         src="${pageContext.request.contextPath}/media/cards/lowResolution/<c:out value="${role.name}"/>.png"
                                         data-src="${pageContext.request.contextPath}/media/cards/<c:out value="${role.name}"/>.png"
                                         alt="<c:out value="${role.name}"/>'s card">
                                </div>
                                <div class="col-md-7 roleDescription">
                                    <h5 class="roleName">
                                        <c:out value="${fn:toUpperCase(role.name)}"/>
                                    </h5>
                                    <p>
                                        <c:out value="${role.description}"/>
                                    </p>
                                    <div class="wins">
                                        WINS WITH: <strong class="winsWith">
                                        <c:if test="${role.name eq 'plague spreader'}">
                                            VILLAGERS
                                        </c:if>
                                        <c:if test="${role.name eq 'illusionist'}">
                                            WOLF PACK
                                        </c:if>
                                    </strong>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </c:if>
                </c:forEach>
            </c:forEach>
        </c:if>

        <a class="prev" onclick="plusSlides(-1, 3)">❮</a>
        <a class="next" onclick="plusSlides(1, 3)">❯</a>
    </div>
</div>

<c:import url="/jsp/include/footer.jsp"/>
<script src="${pageContext.request.contextPath}/js/rules.js"></script>

</body>
</html>
