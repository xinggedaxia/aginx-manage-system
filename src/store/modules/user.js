import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { getAllFlag } from '@/api/flag-manage'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    role: null,
    qq: null
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLE: (state, role) => {
    state.role = role
  },
  SET_QQ: (state, qq) => {
    state.qq = qq
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  async getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      Promise.all([getInfo(), getAllFlag()]).then((res) => {
        try {
          // 初始化系统标识
          const options = res[1].data
          const newOption = {}
          Object.keys(options).forEach((key) => {
            const list = options[key]
            const map = {}
            for (const item of options[key]) {
              map[item.value] = item.label
            }
            newOption[key] = { map, list }
          })
          sessionStorage.setItem('options', JSON.stringify(newOption))
          console.log(newOption)
        } catch (e) {
          console.log(e)
        }

        // 解析用户数据
        const { data } = res[0]
        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        const { name, avatar, role, qq } = data
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_ROLE', role)
        commit('SET_QQ', qq)
        resolve(data)
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

