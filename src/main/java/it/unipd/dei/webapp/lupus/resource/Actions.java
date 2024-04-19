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
     *  The list of all the friends
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
	 * The authentication of a user
	 */
	public static final String AUTHENTICATE_USER = "AUTHENTICATE_USER";

    /**
	 * This class can be neither instantiated nor sub-classed.
	 */
	private Actions() {
		throw new AssertionError(String.format("No instances of %s allowed.", Actions.class.getName()));
	}
    /**
     * If arrive GET request to the page login, signup and logout, it will be redirected.
     */
    public static final String LOGIN_REDIRECT_ACTION = "LOGIN_REDIRECT_ACTION";

    public static final String LOGIN_ACTION = "LOGIN_ACTION";

    public static final String SIGNUT_ACTION = "SIGNUT_ACTION";

    /**
     * The authentication of a master
     */
    public static final String AUTHENTICATE_MASTER = "AUTHENTICATE_MASTER";

    /**
     * This class can be neither instantiated nor sub-classed.
     */
    private Actions() {
        throw new AssertionError(String.format("No instances of %s allowed.", Actions.class.getName()));
    }
}
