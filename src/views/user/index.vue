<template>
  <div class="container">
    <el-form inline :model="searchData" class="search-form">
      <el-form-item label="姓名" prop="nickName">
        <el-input v-model="searchData.nickName" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-select v-model="searchData.role" placeholder="请选择角色" multiple class="w192">
          <el-option :key="0" label="全部" :value="0"></el-option>
          <el-option v-for="item in roleWithAuthList" :key="item.roleId" :label="item.roleName" :value="item.roleId">{{
            item.roleName
          }}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="userList" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="180"></el-table-column>
      <el-table-column prop="nickName" label="姓名"></el-table-column>
      <el-table-column prop="role" label="角色">
        <template #default="scope">
          <el-button v-for="item in scope.row.role" :key="item.role" link type="primary" size="small">
            {{ item.roleName }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" size="small" link @click="handleEditUser(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" link @click="handleDeleteUser(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="editShow" title="编辑用户信息">
      <el-form :model="editUser" size="large">
        <el-form-item label="用户昵称">
          <el-input v-model="editUser.nickName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户角色">
          <el-select v-model="editUser.role" placeholder="请选择角色" multiple>
            <el-option
              v-for="item in roleWithAuthList"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId"
              >{{ item.roleName }}</el-option
            >
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editShow = false">取消</el-button>
          <el-button type="primary" @click="ensureEditUser">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { getRoleList } from '@/api/role';
import { getUserList } from '@/api/user';
import { onMounted, reactive, ref, watch } from 'vue';

interface IRole {
  role: number; // 角色编号
  roleName: string;
}
interface IUser {
  id: number;
  nickName: string;
  userName: string;
  role: IRole[];
}
interface IRoleWithAuth {
  roleId: number;
  roleName: string;
  auth: string[]; // 权限
}

interface IQueryParams {
  nickName: string;
  role: number;
}

interface IEditUser {
  id: number;
  nickName: string;
  role: [];
  userName: string;
}

const userList = ref<IUser[]>([]);
const searchData = reactive<IQueryParams>({
  nickName: '',
  role: 0
});
const roleWithAuthList = ref<IRoleWithAuth[]>([]);
const editShow = ref(false);
let editUser = reactive<IEditUser>({
  id: 0,
  nickName: '',
  role: [],
  userName: ''
});

const handleEditUser = (row: IUser) => {
  // 这样赋值会失去响应式
  // editUser = { ...row,role:row.role.map(v=>v.role) };
  // 保持应用响应式
  Object.assign(editUser, { ...row, role: row.role.map((v) => v.role) });
  editShow.value = true;
};

const ensureEditUser = () => {
  editShow.value = false;
  // 取出来修改的对象
  let obj: IUser = userList.value.find((item) => item.id === editUser.id)!;
  // 修改了nickName
  obj.nickName = editUser.nickName;
  //  obj.role.splice(0, obj.role.length)  // 清除角色
  obj.role = []; // 清除角色
  roleWithAuthList.value.forEach((item) => {
    if (editUser.role.find((value) => value === item.roleId)) {
      obj.role.push({
        role: item.roleId, // 角色id
        roleName: item.roleName // 角色名称
      });
    }
  });
};

const handleDeleteUser = (row: IUser) => {
  console.log(row);
};

// 请求用户列表
const fetchUserList = () => {
  getUserList()
    .then((res) => {
      userList.value = res;
    })
    .catch(() => {});
};
const fetchRoleList = () => {
  // 请求角色列表
  getRoleList()
    .then((res) => {
      roleWithAuthList.value = res;
    })
    .catch(() => {});
};

onMounted(() => {
  fetchUserList();
  fetchRoleList();
});

const handleSearch = () => {
  let res: IUser[] = [];
  if (searchData.nickName || searchData.role) {
    if (searchData.nickName) {
      res = userList.value.filter((item) => {
        return item.nickName.indexOf(searchData.nickName) !== -1;
      });
    }
    if (searchData.role) {
      res = searchData.nickName ? res : userList.value;
      res = res.filter((item) => {
        return item.role.find((value) => {
          return value.role === searchData.role;
        });
      });
    }
  } else {
    res = userList.value;
  }
  userList.value = res;
};

watch([() => searchData.nickName, () => searchData.role], (newVal, oldVal) => {
  if (searchData.nickName === '' || searchData.role === 0) {
    handleSearch();
  }
});
</script>
<style scoped lang="less">
.search-form {
  padding: 10px 0 0 10px;
}

.w192 {
  width: 192px;
}
</style>
