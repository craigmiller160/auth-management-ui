import api from './Api';
import { ClientRole } from '../types/client';
import { Role } from '../types/role';
import { Either, map } from 'fp-ts/es6/Either';
import { pipe } from 'fp-ts/es6/pipeable';
import { CreateRoleWrapper, DeleteRoleWrapper, UpdateRoleWrapper } from '../types/graphApi';

export const createRole = async (clientId: number, role: ClientRole): Promise<Either<Error, Role>> =>
    pipe(
        await api.graphql<CreateRoleWrapper>({
            payload: `
                mutation {
                    createRole(role: {
                        name: "${role.name}",
                        clientId: ${clientId}
                    }) {
                        id
                        name
                        clientId
                    }
                }
            `,
            errorMsg: `Error creating role for client ${clientId}`
        }),
        map((wrapper: CreateRoleWrapper) => wrapper.createRole)
    );

export const updateRole = async (clientId: number, roleId: number, role: ClientRole): Promise<Either<Error, Role>> =>
    pipe(
        await api.graphql<UpdateRoleWrapper>({
            payload: `
                mutation {
                    updateRole(roleId: ${roleId}, role: {
                        name: "${role.name}",
                        clientId: ${clientId}
                    }) {
                        id
                        name
                        clientId
                    }
                }
            `,
            errorMsg: `Error updating role ${roleId} for client ${clientId}`
        }),
        map((wrapper: UpdateRoleWrapper) => wrapper.updateRole)
    );

export const deleteRole = async (roleId: number): Promise<Either<Error, Role>> =>
    pipe(
        await api.graphql<DeleteRoleWrapper>({
            payload: `
                mutation {
                    deleteRole(roleId: ${roleId}) {
                        id
                        name
                        clientId
                    }
                }
            `,
            errorMsg: `Error deleting role ${roleId}`
        }),
        map((wrapper: DeleteRoleWrapper) => wrapper.deleteRole)
    );
