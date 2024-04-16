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
	 * This class can be neither instantiated nor sub-classed.
	 */
	private Actions() {
		throw new AssertionError(String.format("No instances of %s allowed.", Actions.class.getName()));
	}
}
