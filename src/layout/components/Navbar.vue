<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />
    <div class="right-menu">
      <span
        style="line-height: 50px;color:#606266;font-size: 14px;margin-right: 20px"
      >当前身份:{{ role === 0 ? '超级管理员' : role === 1 ? '管理员' : '游客' }}</span>
      <el-dropdown class="avatar-container" trigger="hover">
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar">
          <span class="user-name">{{ name }}</span>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <!--          <router-link to="/">-->
          <!--            <el-dropdown-item>-->
          <!--              Home-->
          <!--            </el-dropdown-item>-->
          <!--          </router-link>-->
          <!--          <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">-->
          <!--            <el-dropdown-item>Github</el-dropdown-item>-->
          <!--          </a>-->
          <!--          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">-->
          <!--            <el-dropdown-item>Docs</el-dropdown-item>-->
          <!--          </a>-->
          <el-dropdown-item @click.native="$router.push({name:'PersonalInfo'})">
            <span style="display:block;">个人资料</span>
          </el-dropdown-item>

          <el-dropdown-item @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div id="he-plugin-simple" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name',
      'role'
    ])
  },
  mounted() {
    window.WIDGET = {
      CONFIG: {
        'modules': '10234',
        'background': 4,
        'backgroundColor': 'FFFFFF',
        'tmpColor': '606266',
        'tmpSize': 14,
        'cityColor': '606266',
        'citySize': 14,
        'aqiSize': 14,
        'weatherIconSize': 24,
        'alertIconSize': 18,
        'padding': '10px 10px 10px 10px',
        'shadow': '1',
        'language': 'auto',
        'borderRadius': 5,
        'fixed': 'false',
        'vertical': 'middle',
        'horizontal': 'center',
        'key': '101eb26387544d18967f6647ac9cdfe0'
      }
    };
    (function(d) {
      const script = d.getElementsByTagName('script')[0]
      const newScript = d.createElement('script')
      newScript.src = 'https://widget.qweather.net/simple/static/js/he-simple-common.js?v=2.0'
      script.parentNode.insertBefore(newScript, script)
    })(document)
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>
<style lang="scss">
#he-plugin-simple {
  float: right;
  width: 200px;
  height: 50px;

  .s-sticker div:last-child {
    width: 0 !important;
  }

  div:last-child {
    z-index: 9;
  }
}
</style>
<style lang="scss" scoped>

.navbar {
  height: 50px;
  //overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    margin-right: 40px;
    display: flex;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 40px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {

      .avatar-wrapper {
        cursor: pointer;
        position: relative;
        display: flex;
        align-items: center;
        line-height: 50px;

        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }

        .user-name {
          font-size: 16px;
          margin-left: 10px;
        }

        //.el-icon-caret-bottom {
        //  cursor: pointer;
        //  position: absolute;
        //  right: -20px;
        //  top: 25px;
        //  font-size: 12px;
        //}
      }
    }
  }
}
</style>
