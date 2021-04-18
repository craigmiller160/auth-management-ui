/*
 *     Auth Management UI
 *     Copyright (C) 2020 Craig Miller
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import MockAdapter from 'axios-mock-adapter';
import { Either } from 'fp-ts/es6/Either';
import {
	mockAndValidateGraphQL,
	mockCsrfPreflight
} from '@craigmiller160/ajax-api-fp-ts/lib/test-utils';
import ajaxApi from '../../src/services/AjaxApi';
import {
	UserAuthDetailsList,
	UserClient,
	UserClients,
	UserDetails,
	UserInput,
	UserList,
	UserRole
} from '../../src/types/user';
import {
	AddClientToUserWrapper,
	AddRoleToUserWrapper,
	CreateUserWrapper,
	DeleteUserWrapper,
	GraphQLQueryResponse,
	RemoveClientFromUserWrapper,
	RemoveRoleFromUserWrapper,
	UpdateUserWrapper,
	UserClientsWrapper,
	UserDetailsWrapper
} from '../../src/types/graphApi';
import {
	addClientToUser,
	addRoleToUser,
	createUser,
	deleteUser,
	getAllUserAuthDetails,
	getAllUsers,
	getUserClients,
	getUserDetails,
	removeClientFromUser,
	removeRoleFromUser,
	revokeUserAuthAccess,
	updateUser
} from '../../src/services/UserService';

const mockAjaxApi = new MockAdapter(ajaxApi.instance);
const clientId = 1;
const userId = 1;
const user: UserDetails = {
	id: 1,
	email: 'user@gmail.com',
	firstName: 'Bob',
	lastName: 'Saget',
	enabled: true
};
const userClient: UserClient = {
	id: 1,
	name: 'Client',
	clientKey: 'Key',
	allRoles: [
		{
			id: 1,
			name: 'Role'
		}
	],
	userRoles: [
		{
			id: 1,
			name: 'Role'
		}
	]
};
const userClients: UserClients = {
	id: 1,
	email: 'user@gmail.com',
	clients: [userClient]
};
const userInput: UserInput = {
	...user,
	password: '12345'
};
const role: UserRole = {
	id: 1,
	name: 'Role'
};
const roleId = 3;
const userAuthDetailsList: UserAuthDetailsList = {
	email: 'user@gmail.com',
	authDetails: []
};

describe('UserService', () => {
	beforeEach(() => {
		mockAjaxApi.reset();
	});

	it('getAllUsers', async () => {
		const payload = `
                query {
                    users {
                        id
                        email
                        firstName
                        lastName
                    }
                }
            `;
		const data: UserList = {
			users: [user]
		};
		const responseData: GraphQLQueryResponse<UserList> = {
			data
		};
		mockCsrfPreflight(mockAjaxApi, '/graphql');
		mockAndValidateGraphQL({
			mockApi: mockAjaxApi,
			payload,
			responseData
		});
		const result: Either<Error, UserList> = await getAllUsers()();
		expect(result).toEqualRight(data);
	});

	it('getUserDetails', async () => {
		const payload = `
                query {
                    user(userId: ${userId}) {
                        id
                        email
                        firstName
                        lastName
                        enabled
                    }
                }
            `;
		const responseData: GraphQLQueryResponse<UserDetailsWrapper> = {
			data: {
				user
			}
		};
		mockCsrfPreflight(mockAjaxApi, '/graphql');
		mockAndValidateGraphQL({
			mockApi: mockAjaxApi,
			payload,
			responseData
		});
		const result: Either<Error, UserDetails> = await getUserDetails(
			userId
		)();
		expect(result).toEqualRight(user);
	});

	it('getUserClients', async () => {
		const payload = `
                query {
                    user(userId: ${userId}) {
                        id
                        email
                        clients {
                            id
                            name
                            clientKey
                            allRoles {
                                id
                                name
                            }
                            userRoles {
                                id
                                name
                            }
                        }
                    }
                }
            `;
		const responseData: GraphQLQueryResponse<UserClientsWrapper> = {
			data: {
				user: userClients
			}
		};
		mockCsrfPreflight(mockAjaxApi, '/graphql');
		mockAndValidateGraphQL({
			mockApi: mockAjaxApi,
			payload,
			responseData
		});
		const result: Either<Error, UserClients> = await getUserClients(
			userId
		)();
		expect(result).toEqualRight(userClients);
	});

	it('updateUser', async () => {
		const payload = `
                mutation {
                    updateUser(userId: ${userId}, user: {
                        email: "${userInput.email}",
                        password: "${userInput.password || ''}",
                        firstName: "${userInput.firstName}",
                        lastName: "${userInput.lastName}",
                        enabled: ${userInput.enabled}
                    }) {
                        id
                        email
                        firstName
                        lastName
                        enabled
                    }
                }
            `;
		const responseData: GraphQLQueryResponse<UpdateUserWrapper> = {
			data: {
				updateUser: user
			}
		};
		mockCsrfPreflight(mockAjaxApi, '/graphql');
		mockAndValidateGraphQL({
			mockApi: mockAjaxApi,
			payload,
			responseData
		});
		const result: Either<Error, UserDetails> = await updateUser(
			userId,
			userInput
		)();
		expect(result).toEqualRight(user);
	});

	it('createUser', async () => {
		const payload = `
                mutation {
                    createUser(user: {
                        email: "${userInput.email}",
                        password: "${userInput.password}",
                        firstName: "${userInput.firstName}",
                        lastName: "${userInput.lastName}",
                        enabled: ${userInput.enabled}
                    }) {
                        id
                        email
                        firstName
                        lastName
                        enabled
                    }                  
                }
            `;
		const responseData: GraphQLQueryResponse<CreateUserWrapper> = {
			data: {
				createUser: user
			}
		};
		mockCsrfPreflight(mockAjaxApi, '/graphql');
		mockAndValidateGraphQL({
			mockApi: mockAjaxApi,
			payload,
			responseData
		});
		const result: Either<Error, UserDetails> = await createUser(
			userInput
		)();
		expect(result).toEqualRight(user);
	});

	it('deleteUser', async () => {
		const payload = `
                mutation {
                    deleteUser(userId: ${userId}) {
                        id
                        email
                        firstName
                        lastName
                        enabled
                    }
                }
            `;
		const responseData: GraphQLQueryResponse<DeleteUserWrapper> = {
			data: {
				deleteUser: user
			}
		};
		mockCsrfPreflight(mockAjaxApi, '/graphql');
		mockAndValidateGraphQL({
			mockApi: mockAjaxApi,
			payload,
			responseData
		});
		const result: Either<Error, UserDetails> = await deleteUser(userId)();
		expect(result).toEqualRight(user);
	});

	it('removeClientFromUser', async () => {
		const payload = `
                mutation {
                    removeClientFromUser(userId: ${userId}, clientId: ${clientId}) {
                        id
                        name
                        clientKey
                        allRoles {
                            id
                            name
                        }
                        userRoles {
                            id
                            name
                        }
                    }
                }
            `;
		const responseData: GraphQLQueryResponse<RemoveClientFromUserWrapper> = {
			data: {
				removeClientFromUser: [userClient]
			}
		};
		mockCsrfPreflight(mockAjaxApi, '/graphql');
		mockAndValidateGraphQL({
			mockApi: mockAjaxApi,
			payload,
			responseData
		});
		const result: Either<
			Error,
			Array<UserClient>
		> = await removeClientFromUser(userId, clientId)();
		expect(result).toEqualRight([userClient]);
	});

	it('addClientToUser', async () => {
		const payload = `
                mutation {
                    addClientToUser(userId: ${userId}, clientId: ${clientId}) {
                        id
                        name
                        clientKey
                        allRoles {
                            id
                            name
                        }
                        userRoles {
                            id
                            name
                        }
                    }
                }
            `;
		const responseData: GraphQLQueryResponse<AddClientToUserWrapper> = {
			data: {
				addClientToUser: [userClient]
			}
		};
		mockCsrfPreflight(mockAjaxApi, '/graphql');
		mockAndValidateGraphQL({
			mockApi: mockAjaxApi,
			payload,
			responseData
		});
		const result: Either<Error, Array<UserClient>> = await addClientToUser(
			userId,
			clientId
		)();
		expect(result).toEqualRight([userClient]);
	});

	it('removeRoleFromUser', async () => {
		const payload = `
                mutation {
                    removeRoleFromUser(userId: ${userId}, clientId: ${clientId}, roleId: ${roleId}) {
                        id
                        name
                    }
                }
            `;
		const responseData: GraphQLQueryResponse<RemoveRoleFromUserWrapper> = {
			data: {
				removeRoleFromUser: [role]
			}
		};
		mockCsrfPreflight(mockAjaxApi, '/graphql');
		mockAndValidateGraphQL({
			mockApi: mockAjaxApi,
			payload,
			responseData
		});
		const result: Either<Error, Array<UserRole>> = await removeRoleFromUser(
			userId,
			clientId,
			roleId
		)();
		expect(result).toEqualRight([role]);
	});

	it('addRoleToUser', async () => {
		const payload = `
                mutation {
                    addRoleToUser(userId: ${userId}, clientId: ${clientId}, roleId: ${roleId}) {
                        id
                        name
                    }
                }
            `;
		const responseData: GraphQLQueryResponse<AddRoleToUserWrapper> = {
			data: {
				addRoleToUser: [role]
			}
		};
		mockCsrfPreflight(mockAjaxApi, '/graphql');
		mockAndValidateGraphQL({
			mockApi: mockAjaxApi,
			payload,
			responseData
		});
		const result: Either<Error, Array<UserRole>> = await addRoleToUser(
			userId,
			clientId,
			roleId
		)();
		expect(result).toEqualRight([role]);
	});

	it('getAllUserAuthDetails', async () => {
		mockAjaxApi
			.onGet(`/users/auth/${userId}`)
			.reply(200, userAuthDetailsList);
		const result: Either<
			Error,
			UserAuthDetailsList
		> = await getAllUserAuthDetails(userId)();
		expect(result).toEqualRight(userAuthDetailsList);
	});

	it('revokeUserAuthAccess', async () => {
		mockAjaxApi
			.onPost(`/users/auth/${userId}/${clientId}/revoke`)
			.reply(200);
		mockCsrfPreflight(
			mockAjaxApi,
			`/users/auth/${userId}/${clientId}/revoke`
		);
		const result: Either<Error, void> = await revokeUserAuthAccess(
			userId,
			clientId
		)();
		expect(result).toBeRight();
	});
});
