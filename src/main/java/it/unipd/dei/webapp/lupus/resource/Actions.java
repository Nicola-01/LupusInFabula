/*
 * Copyright (c) 2023 University of Padua, Italy
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package it.unipd.dei.webapp.lupus.resource;

/**
 * Contains constants for the actions performed by the application.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public final class Actions {

    /**
     * The creation of a player
     */
    public static final String INSERT_PLAYER = "INSERT_PLAYER";

    /**
     * The search of player by partial username
     */
    public static final String SEARCH_PLAYER= "SEARCH_PLAYER";

    /**
     * The addition of a friend
     */
    public static final String ADD_FRIEND = "ADD_FRIEND";

    /**
     * The deletion of a friend
     */
    public static final String DELETE_FRIEND = "DELETE_FRIEND";

    /**
     * The list of all the friends
     */
    public static final String LIST_FRIENDS = "LIST_FRIENDS";

    /**
     * The deletion of the user logged in
     */
    public static final String DELETE_USER = "DELETE_USER";

    /**
     * The update of the user logged in
     */
    public static final String UPDATE_USER = "UPDATE_USER";

    /**
     * The get of a user knowing his username
     */
    public static final String GET_USERNAME = "GET_USERNAME";

    /**
     * The get for logs knowing the game id
     */
    public static final String GET_LOGS = "GET_LOGS";

    /**
     * The authentication of a user.
     */
    public static final String AUTHENTICATE_USER = "AUTHENTICATE_USER";

    /**
     * The authentication of a master.
     */
    public static final String AUTHENTICATE_MASTER = "AUTHENTICATE_MASTER";

    /**
     * If arrive GET request to the page login, signup and logout, it will be redirected.
     */
    public static final String LOGIN_REDIRECT_ACTION = "LOGIN_REDIRECT_ACTION";

    /**
     * The login action of a user.
     */
    public static final String LOGIN_ACTION = "LOGIN_ACTION";

    /**
     * The sign-up action of a user.
     */
    public static final String SIGNUP_ACTION = "SIGNUP_ACTION";

    /**
     * GET request of game rpòes.
     */
    public static final String GET_ROLES = "GET_ROLES";

    /**
     * POST request of game creation.
     */
    public static final String POST_GAME_CREATION = "POST_GAME_CREATION";

    /**
     * GET game configuration.
     */
    public static final String GET_GAME_CONFIGURATION = "GET_GAME_CONFIGURATION";

    /**
     * PUT update game status.
     */
    public static final String GAME_STATUS_UPDATE = "GAME_STATUS_UPDATE";

    /**
     * POST game settings.
     */
    public static final String GET_SETTINGS = "GET_SETTINGS";


    /**
     * GET request of game status.
     */
    public static final String GET_GAME_STATUS_ACTION = "GET_GAME_STATUS_ACTION";

    /**
     * GET request of game players .
     */
    public static final String GET_GAME_PLAYERS_ACTION = "GET_GAME_STATUS_ACTION";

    /**
     * GET request of logs for user.
     */
    public static final String GET_LOGS_USER = "GET_LOGS_USER";

    /**
     * GET request of stats for user.
     */
    public static final String GET_STATS_USER = "GET_STATS_USER";

    /**
     * GET request for all the roles in the game.
     */
    public static final String GET_ALL_ROLES = "GET_ALL_ROLES";

    // Dispatcher

    /**
     * Dispatcher in the game section
     */
    public static final String GAME_DISPATCHER_ACTION = "GAME_DISPATCHER_ACTION";

    /**
     * GET request of game actions.
     */
    public static final String GET_GAME_ACTIONS_ACTION = "GET_GAME_ACTIONS_ACTION";

    /**
     * POST request of game actions.
     */
    public static final String POST_GAME_ACTIONS_ACTION = "POST_GAME_ACTIONS_ACTION";

    /**
     * Dispatcher for user operations
     */
    public static final String USER_DISPATCHER_ACTION = "USER_DISPATCHER_ACTION";

    /**
     * This class can be neither instantiated nor sub-classed.
     */
    private Actions() {
        throw new AssertionError(String.format("No instances of %s allowed.", Actions.class.getName()));
    }
}
