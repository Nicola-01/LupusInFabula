<%--
  Created by IntelliJ IDEA.
  User: Jacopo Momesso
  Date: 07/04/2024
  Time: 17:45
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Lupus in Fabula - Rules</title>

    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/homepage.css">
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/rules.css">
    <script src="${pageContext.request.contextPath}/js/rules.js"></script>

<%--  BOOTSTRAP  --%>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

</head>
<body>
<jsp:include page="include/navbar.jsp"/>
<div>
<h1 style="padding:3%; display: flex; justify-content: center; align-items: center">RULES</h1>
    <p class="rules">
        In the remote village of Fabula, some people become werewolves at night. They attack an innocent person to
        satisfy their instincts. During the day, the survivors discuss what to do. At the end of the discussion, they lynch
        one of them. Who will survive the massacre?
    </p>
    <ul>
        <li><a href="#aim">Aim of the Game</a></li>
        <li><a href="#preparation">Preparation</a></li>
        <li><a href="#game">Game</a></li>
        <li><a href="#victory">Victory Condition</a></li>
    </ul>
    <h4 id="aim">Aim of the game:</h4>
    <p class="rules">
        There are two factions in the game: the Werewolves and the Villagers. The aim of the Werewolf faction is
        to eliminate all villagers. Conversely, the aim of the Villagers faction is to lynch all the Werewolves.
    </p>
    <h4 id="preparation">Preparation:</h4>
    <p class="rules">
        Before the game starts, one player is chosen to be the master/moderator. He doesn’t belong to any faction,
        and he will only manage the game tracking everything that will happen. The other players will play the role
        given to them by their card and look at their own card secretly.
    </p>
    <h4 id="game">Game:</h4>
    <p class="rules">
        The game is divided into two phases: night and day. At night each role with an effect that resolves during
        this phase will be called by the master to perform the respective action described in the role card. Once the
        master has called all roles with a night effect, night will end and the day phase will begin. During the day,
        people will discuss and vote to lynch someone, hopefully a wolf or a member of the wolf faction.
    <br>
        – Night:<br>
        The moderator declares the beginning of the night (”it is night, everyone close your eyes”). All players
        then close their eyes, trying not to make any kind of noise for all the duration of this phase. The master
        then begins to call each role with effect:
    <br>
        Example of wolves calling:
        - Master: ”Wolves open their eyes and choose who to go and maul.”
        - Wolves silently agree and point to their prey
        - Master: ”Decide who to send among you to maul your chosen prey”
        - Wolves indicate who among them will go
        - Master: ”The wolves close their eyes.”
        Example of good role calling (e.g: Seer):
        - Master: ”Seer open eyes and choose whom to investigate”
        - Seer points to the player he wants to investigate
        - Master nods to say whether the player has a bad or good role
        - Master: ”Seer closes eyes.”
        Note: This phase should be played even if the called role is already dead in order to not give clues to
        others. Once the master has called all roles with night effect, the night is over.
        – Day:<br>
        The master now declares the start of the day (”it’s day, everybody open your eyes”). The master
        then gives a recap of what happened during the past night, listing who died (if anyone died), who was
        anointed, etc. without giving explicit information about what happened (e.g. recap: Master: ”A died,
        B died, C was anointed”). Once the master has finished the recap, the still-living players can then start
        discussing among themselves to decide who to lynch. You may lie freely but under no circumstances
        may you show your card to others.
    <br>
        – Voting:<br>
        After a maximum of three minutes of discussion, the master stops the discussion and asks each player,
        starting with the one to the left of the one who died first and proceeding clockwise, who he thinks
        should be lynched. All players, including ghosts (i.e., those who died), in their turn vote indicating who
        they want to lynch. At the end of the voting, the two players with the most votes will be clued (in case
        of a tie, the player closest to the first dead will be chosen). The two suspected players can now take a
        short speech defending themselves against the charges. After the two speeches are over, the remaining
        alive unindicted players will vote again for the new player to be lynched among the two suspects (in this
        case the voting will be counterclockwise starting with the alive unindicted player who was last to vote
        before). At this point the day is over and the master can start a new night and so on until one faction
        wins.
    <br>
        Note: all dead players (i.e. ghosts) for the rest of the entire game must not speak or show their role to
        other players.
    </p>
    <h4 id="victory">Victory Condition:</h4>
    <p class="rules">
        The master declares the game over with a villagers victory if the villagers lynch all the werewolves. Werewolves,
        on the other hand, are declared winners if at any point in time they are equal in number to the still-living
        villagers (e.g., 2 werewolves and 2 villagers, or 1 and 1): in that case the werewolves unceremoniously maul
        the remaining villagers! In case there are victory stealer roles in the game, they will win if their victory
        condition is fulfilled, and in that case the master will declare them winners any time in the game when they
        have completed their victory condition.
        This game requires at least five participants, one of whom will be the game-master, and the other will get roles
        assigned randomly, for instance by drawing a card. The main roles are wolves and farmers, but other roles are used
        - like medium, knight, werehamster etc - in order to make the game more entertaining, with specific rules applying
        to each character.
    </p>
</div>
<br>

<h1 style="padding:3%; display: flex; justify-content: center; align-items: center">ROLES</h1>

<h4 class="text-center">GOOD ROLES</h4>
<div class="container-fluid mt-3 slideshow-container">
        <c:if test="${not empty roles}">
            <c:forEach var="roleList" items="${roles}">
                <c:forEach var="role" items="${roleList}">
                    <c:if test="${role.type eq 0}">
                        <div class="mySlides slide">
                        <div class="row">
                            <div class="col-md-5 p-3 d-flex justify-content-center">
                                <!-- <p><c:out value="${role.name}"/></p> -->
                                <img src="${pageContext.request.contextPath}/media/cards/<c:out value="${role.name}"/>.png"
                                     style="width:50%">
                            </div>
                            <div class="row col-md-7 p-4 d-flex justify-content-center">
                                <p style="padding:3%; display: flex; justify-content: center; align-items: center"><c:out value="${role.description}"/></p>
                                <div class="row col">
                                    <div class="col" style="display: flex; justify-content: center; align-items: center">
                                        <p class="text-center">WINS WITH:</p>
                                    </div>
                                    <div class="col" style="display: flex; justify-content: center; align-items: center">
                                        <p class="text-center">VILLAGERS</p>
                                    </div>
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

<br><br>

<h4 class="text-center">EVIL ROLES</h4>
<div class="container-fluid mt-3 slideshow-container">
    <c:if test="${not empty roles}">
        <c:forEach var="roleList" items="${roles}">
            <c:forEach var="role" items="${roleList}">
                <c:if test="${role.type eq 1}">
                    <div class="mySlides slide2">
                        <div class="row">
                            <div class="col-md-5 p-3 d-flex justify-content-center">
                                <!-- <p><c:out value="${role.name}"/></p> -->
                                <img src="${pageContext.request.contextPath}/media/cards/<c:out value="${role.name}"/>.png"
                                     style="width:50%">
                            </div>
                            <div class="row col-md-7 p-4 d-flex justify-content-center">
                                <p style="padding:3%; display: flex; justify-content: center; align-items: center"><c:out value="${role.description}"/></p>
                                <div class="row col">
                                    <div class="col" style="display: flex; justify-content: center; align-items: center">
                                        <p class="text-center">WINS WITH:</p>
                                    </div>
                                    <div class="col" style="display: flex; justify-content: center; align-items: center">
                                        <p class="text-center">WOLF PACK</p>
                                    </div>
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
<br><br>

<h4 class="text-center">VICTORY STEALER ROLES</h4>
<div class="container-fluid mt-3 slideshow-container">
    <c:if test="${not empty roles}">
        <c:forEach var="roleList" items="${roles}">
            <c:forEach var="role" items="${roleList}">
                <c:if test="${role.type eq 2}">
                    <div class="mySlides slide3">
                        <div class="row">
                            <div class="col-md-5 p-3 d-flex justify-content-center">
                                <!-- <p><c:out value="${role.name}"/></p> -->
                                <img src="${pageContext.request.contextPath}/media/cards/<c:out value="${role.name}"/>.png"
                                     style="width:50%">
                            </div>
                            <div class="row col-md-7 p-4 d-flex justify-content-center">
                                <p style="padding:3%; display: flex; justify-content: center; align-items: center"><c:out value="${role.description}"/></p>
                                <div class="row col">
                                    <div class="col" style="display: flex; justify-content: center; align-items: center">
                                        <p class="text-center">WINS WITH:</p>
                                    </div>
                                    <div class="col" style="display: flex; justify-content: center; align-items: center">
                                        <p class="text-center">ALONE</p>
                                    </div>
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

<h4 class="text-center">NEUTRAL ROLES</h4>
<div class="container-fluid mt-3 slideshow-container">
    <c:if test="${not empty roles}">
        <c:forEach var="roleList" items="${roles}">
            <c:forEach var="role" items="${roleList}">
                <c:if test="${role.type eq 3}">
                    <div class="mySlides slide4">
                        <div class="row">
                            <div class="col-md-5 p-3 d-flex justify-content-center">
                                <!-- <p><c:out value="${role.name}"/></p> -->
                                <img src="${pageContext.request.contextPath}/media/cards/<c:out value="${role.name}"/>.png"
                                     style="width:50%">
                            </div>
                            <div class="row col-md-7 p-4 d-flex justify-content-center">
                                <p style="padding:3%; display: flex; justify-content: center; align-items: center"><c:out value="${role.description}"/></p>
                                <div class="row col">
                                    <div class="col" style="display: flex; justify-content: center; align-items: center">
                                        <p class="text-center">WINS WITH:</p>
                                    </div>
                                    <div class="col" style="display: flex; justify-content: center; align-items: center">
                                        <c:if test="${role.name eq 'plague spreader'}">
                                            <p class="text-center">VILLAGERS</p>
                                        </c:if>
                                        <c:if test="${role.name eq 'illusionist'}">
                                            <p class="text-center">WOLF PACK</p>
                                        </c:if>
                                    </div>
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
<br>

<c:import url="/jsp/include/footer.jsp"/>

</body>
</html>
