<template>
  <div class="layout-content personal-info-page">
    <el-card class="box-card">
      <h2 class="title">个人资料</h2>
      <div class="info-list">
        <el-avatar :size="100" :src="avatar" style="cursor: pointer" @click.native="imagecropperShow=true">
          <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png">
        </el-avatar>
        <image-cropper
          v-show="imagecropperShow"
          :key="imagecropperKey"
          :width="100"
          :height="100"
          field="upload_file"
          :url="imageUrl"
          lang-type="zh"
          :headers="uploadHeaders()"
          @close="close"
          @crop-upload-success="handleAvatarSuccess"
        />
        <div class="info-item">
          <label>用户名</label>
          <p>{{ name }}</p>
        </div>
        <div class="info-item">
          <label>用户身份</label>
          <p>{{ role|roleFilter }}</p>
        </div>
        <div class="info-item">
          <label>QQ</label>
          <p v-if="!showEditQq" style="margin-right: 10px">{{ qq || '未设置' }}</p>
          <div style="padding-top: 1px">
            <el-button v-if="!showEditQq" size="small" icon="el-icon-edit" @click="showEditQq=true">修改</el-button>
          </div>
          <el-form v-if="showEditQq" ref="form" :inline="true" label-width="80px" size="small" style="height: 35px">
            <el-form-item>
              <el-input v-model="newQq" placeholder="请输入新的qq" />
            </el-form-item>
            <el-form-item>
              <el-button @click="showEditQq=false">取消</el-button>
              <el-button type="primary" @click="updateQq">确定</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="info-item">
          <label>密码</label>
          <p style="margin-right: 10px">******</p>
          <div style="padding-top: 1px">
            <el-button size="small" icon="el-icon-edit" @click="handleEdit">修改</el-button>
          </div>
        </div>
      </div>
    </el-card>

    <!--    修改密码弹窗-->
    <el-dialog title="修改密码" :visible.sync="showModal" custom-class="base-dialog personal-info-page-dialog">
      <el-form
        ref="dataForm"
        status-icon
        :rules="rules"
        :model="createFormData"
        label-width="90px"
        autocomplete="new-password"
      >
        <el-form-item label="原始密码:" prop="password">
          <el-input
            v-model="createFormData.password"
            type="password"
            placeholder="请输入原始密码"
            autocomplete="new-password"
          />
        </el-form-item>
        <el-form-item label="新密码:" prop="newPassword">
          <el-input v-model="createFormData.newPassword" type="password" placeholder="请输入新密码" autocomplete="off" />
        </el-form-item>
        <el-form-item label="确认密码:" prop="newPasswordConfirm">
          <el-input
            v-model="createFormData.newPasswordConfirm"
            type="password"
            placeholder="请输入确认密码"
            autocomplete="off"
          />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showModal = false">
          取消
        </el-button>
        <el-button type="primary" @click="updatePassword">
          确认
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
const options = JSON.parse(sessionStorage.getItem('options'))

import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'
import { updatePasswordApi, updateInfoSelfApi } from '@/api/account'
import ImageCropper from '@/components/ImageCropper'

export default {
  name: 'PersonalInfo',
  components: { ImageCropper },
  filters: {
    roleFilter: function(role) {
      return options.role.map[role]
    }
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入原密码'))
      } else if (value.length < 6) {
        callback(new Error('密码必须大于6位'))
      } else {
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else if (value.length < 6) {
        callback(new Error('密码必须大于6位'))
      } else {
        callback()
      }
    }
    const validatePass3 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入新密码'))
      } else if (value !== this.createFormData.newPassword) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }

    return {
      imageUrl: 'https://aginx.cn/manageSystem/api/user/uploadAvatar.do',
      showEditQq: false,
      imagecropperShow: false,
      imagecropperKey: 0,
      newQq: '',
      showModal: false,
      createFormData: {
        password: '',
        newPassword: '',
        newPasswordConfirm: ''
      },
      createFormDataTemp: {
        password: '',
        newPassword: '',
        newPasswordConfirm: ''
      },
      rules: {
        password: [{ validator: validatePass, trigger: 'blur' }],
        newPassword: [{ validator: validatePass2, trigger: 'blur' }],
        newPasswordConfirm: [{ validator: validatePass3, trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'avatar',
      'name',
      'role',
      'qq'
    ])
  },
  methods: {
    cropSuccess(resData) {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
      this.image = resData.files.avatar
    },
    close() {
      this.imagecropperShow = false
    },
    uploadHeaders() {
      return {
        'X-Access-Token': getToken()
      }
    },
    updateQq() {
      const tempData = {
        qq: this.newQq
      }
      updateInfoSelfApi(tempData).then(() => {
        this.showEditQq = false
        this.$store.commit('user/SET_QQ', this.newQq)
        this.$message.success('修改成功')
      }).catch((e) => {
        console.log(e)
      })
    },
    handleEdit() {
      this.showModal = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
    },
    updatePassword() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = { ...this.createFormData }
          updatePasswordApi(tempData).then(() => {
            this.dialogFormVisible = false
            this.$message.success('密码修改成功')
            this.showModal = false
          }).catch((e) => {
            console.log(e)
          })
        }
      })
    },
    handleAvatarSuccess(res) {
      this.$store.commit('user/SET_AVATAR', res.data.url)
    }
  }
}
</script>

<style lang="scss" scoped>
.personal-info-page {
  width: 1000px;
  margin-left: auto;
  margin-right: auto;

  & ::v-deep.personal-info-page-dialog {
    max-width: 600px;

    .el-dialog__body {
      padding: 30px 40px;
    }
  }

  .box-card {
    padding-left: 60px;
  }

  .title {
    font-weight: normal;
    color: rgba(39, 56, 72, .85);
    margin-bottom: 30px;
  }

  .info-list {
    .info-item {
      display: flex;
      padding: 15px 0 15px 0;

      label {
        width: 100px;
        text-align: right;
        line-height: 35px;
        color: rgba(71, 86, 99, .8);
        font-weight: 500;
        padding: 0 16px;
        margin-right: 30px;
        white-space: nowrap;
      }

      p {
        margin: 0;
        vertical-align: middle;
        line-height: 35px;
        color: rgba(13, 27, 62, .65);
      }
    }
  }

  .avatar-uploader {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin: 0 0 15px 20px;
    overflow: hidden;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>
