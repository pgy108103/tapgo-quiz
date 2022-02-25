export function setAuth (state, auth) {
  const { id, username, token } = auth

  state._auth.id = id
  state._auth.username = username
  state._auth.token = token
}
