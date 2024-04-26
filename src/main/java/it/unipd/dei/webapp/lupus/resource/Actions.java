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
     * The search of player by their username/email and password
     */
    public static final String SEARCH_PLAYER_BY_USER_AND_PASSWORD = "SEARCH_PLAYER_BY_USER_AND_PASSWORD";

    public static final String ADD_ACTIONS = "ADD_ACTIONS";

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
     * GET request of game settings.
     */
    public static final String GET_SETTINGS_ACTION = "GET_SETTINGS_ACTION";

    /**
     * POST request of game settings.
     */
    public static final String POST_SETTINGS_ACTION = "POST_SETTINGS_ACTION";

    /**
     * GET request of logs for user.
     */
    public static final String GET_LOGS_USER = "GET_LOGS_USER";

    /**
     * GET request of stats for user.
     */
    public static final String GET_STATS_USER = "GET_STATS_USER";


    // Dispatcher

    /**
     * Dispatcher in the game saction
     */
    public static final String GAME_DISPATCHER_ACTION = "GAME_DISPATCHER_ACTION";

    /**
     * GET request of game actions.
     */
    public static final String GET_GAME_ACTIONS_ACTION = "GET_GAME_ACTIONS_ACTION";


    /**
     * This class can be neither instantiated nor sub-classed.
     */
    private Actions() {
        throw new AssertionError(String.format("No instances of %s allowed.", Actions.class.getName()));
    }
}
