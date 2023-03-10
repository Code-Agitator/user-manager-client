<script setup lang="ts">
import {DataTableColumns, PaginationProps, useMessage, NButton, NPopconfirm, DataTableRowKey} from "naive-ui";
import {UserInfo, UserInfoHistory} from "@/services/user/type/response";
import {ref, reactive, onMounted, h} from "vue";
import {GetUserParam} from "@/services/user/type/request";
import {addUser, deleteUser, getHistory, revoke, revokeTo, searchUserPage, updateUser} from "@/services/user/api";
import {Plus} from '@vicons/tabler'
import areaData from "@/util/lib/address/areas.json";
import provinceData from "@/util/lib/address/provinces.json";
import cityData from "@/util/lib/address/citys.json";
import {CascaderOption} from "naive-ui/es/cascader/src/interface";
import dayjs from 'dayjs'

type RowData = UserInfo & {};
type AddressData = { name: string; code: string; }
const tableData = ref<RowData[]>([])
const loading = ref<boolean>(false)
const queryForm = ref<GetUserParam>({})
const showEditModal = ref<boolean>(false)
const showHistoryModal = ref<boolean>(false)
const editModalMode = ref<number>(1)
const model = ref<UserInfo>({})
const message = useMessage()
const history = ref<UserInfoHistory[]>([])
const historySelectedId = ref<number>(0)
const checkedRowKeysRef = ref<DataTableRowKey[]>([])

const getOptions = (depth: number, i1: number | null, i2: number | null): CascaderOption[] => {
  const data: CascaderOption[] = []
  if (depth === 1) {
    provinceData?.map((v: AddressData, k: number) => {
      data.push({
        label: v.name,
        value: v.code,
        depth: 1,
        isLeaf: cityData[k].length == 1,
        children: cityData[k].length > 1 ? getOptions(2, k, null) : undefined
      })
    })
  } else if (depth === 2) {
    i1 != null && cityData[i1]?.map((v: AddressData, k: number) => {
      data.push({
        label: v.name,
        value: v.code,
        depth: 2,
        isLeaf: areaData[i1][k].length == 1,
        children: areaData[i1][k].length > 1 ? getOptions(3, i1, k) : undefined
      })
    })
  } else {
    i1 != null && i2 != null && areaData[i1][i2]?.map((v: AddressData, k: number) => {
      data.push({
        label: v.name,
        value: v.code,
        depth: 3,
        isLeaf: true,
      })
    })
  }
  return data
}


/**
 * ????????????????????????????????????
 * @param adCode ?????????????????????"440104"
 * @return {Boolean|Array} ??????????????????false?????????????????????????????????????????????[??????, ??????, ??????]
 */
const queryAreaName = (adCode: string): Array<string> => {
  let result: any[] = []
  let provinceIndex: number = 0
  let cityIndex: number = 0
  try {
    const areaCodeArray = [`${adCode.slice(0, 2)}0000`, `${adCode.slice(0, 4)}00`, adCode]
    provinceData?.map((v: AddressData, k: number) => {
      if (v.code === areaCodeArray[0]) {
        result[0] = v.name
        provinceIndex = k
      }
    })
    cityData[provinceIndex]?.map((v: AddressData, k: number) => {
      if (v.code === areaCodeArray[1]) {
        result[1] = v.name
        cityIndex = k
      }
    })
    areaData[provinceIndex][cityIndex]?.map((v: AddressData, k: number) => {
      if (v.code === areaCodeArray[2]) {
        result[2] = v.name
      }
    })
  } catch (e) {
    console.error(e)
    return []
  }
  return result
}


const options = ref<CascaderOption[]>(getOptions(1, null, null))


/**
 * ????????????
 */
const pagination = reactive<PaginationProps>({
  page: 1,
  pageSize: 6,
})

const historyPage = reactive<PaginationProps>({
  page: 1,
  pageCount: 1
})
const handleEdit = (row: RowData) => {
  editModalMode.value = 2
  showEditModal.value = true
  model.value = row
}
const handleCheck = (rowKeys: DataTableRowKey[]) => {
  checkedRowKeysRef.value = rowKeys
}

const getHistoryData = () => {
  loading.value = true
  historySelectedId.value && getHistory(historySelectedId.value, {
    pageNumber: historyPage.page,
    pageSize: 6
  }).then(res => {
    res && res.data && (history.value = res.data?.records)
    historyPage.page = res.data?.current
    historyPage.pageCount = res.data?.pages
    showHistoryModal.value = true
  }).finally(() => {
    loading.value = false
  })
}

const handleHowHistory = (row: RowData) => {
  row.id && (historySelectedId.value = row.id)
  getHistoryData();
}

const getStringAddress = (row: UserInfo) => {
  const pre = (row.areaCode && queryAreaName(row.areaCode)) || []
  let result = ""
  pre.forEach(value => {
    value && (result = result + value)
  })
  return result + (row.address || '')
}
/**
 * ?????????
 */
const columns: DataTableColumns<RowData> = [
  {
    type: 'selection'
  },
  {
    key: "name",
    title: "??????",
    align: "center",
    width: 100
  }, {
    key: "age",
    title: "??????",
    align: "center",
    width: 100
  }, {
    key: "phone",
    title: "??????",
    align: "center",
    width: 150
  }, {
    key: "address",
    title: "????????????",
    align: "center",
    width: 500,
    render: (row: RowData) => {
      return getStringAddress(row)
    }
  },
  {
    title: '??????',
    key: 'operation',
    width: 200,
    align: 'center',
    fixed: 'left',
    render(row: UserInfo) {
      return [
        h(NButton, {
          size: 'small',
          type: 'primary',
          class: 'mr-4',
          onClick: () => handleEdit(row)
        }, {default: () => '??????'}),
        h(NButton, {
          size: 'small',
          type: 'info',
          strong: true,
          secondary: true,
          class: 'mr-4',
          onClick: () => handleHowHistory(row)
        }, {default: () => '??????'}),
        h(NPopconfirm, {
          onPositiveClick: () => handleDelete(row),
        }, {
          default: () => '?????????????????????',
          trigger: () => h(NButton, {
            size: 'small',
            type: 'error',
          }, {default: () => '??????'}),
        })
      ]
    },
  }
]
const handleDelete = (row: UserInfo) => {
  loading.value = true
  row.id && deleteUser([row.id]).then(res => {
    message.success("????????????")
    getUserData()
  }).catch(err => {
    message.error("?????????????????????????????????")
  }).finally(() => {
    loading.value = false
  })
}

const handleBatchDelete = () => {
  const ids: number[] = []
  checkedRowKeysRef.value && checkedRowKeysRef.value.forEach(value => ids.push(value as number))
  ids && deleteUser(ids).then(res => {
    message.success("????????????")
    getUserData()
  }).catch(err => {
    message.error("?????????????????????????????????")
  }).finally(() => {
    loading.value = false
  })
}

const getUserData = () => {
  loading.value = true
  queryForm.value.pageSize = pagination.pageSize
  queryForm.value.pageNumber = pagination.page
  searchUserPage(queryForm.value).then((res) => {
    res && res.data && (tableData.value = res.data.records as RowData[])
    pagination.page = res.data?.current
    pagination.pageCount = res.data?.pages
    pagination.itemCount = res.data?.total

    // ??????
    sessionStorage.setItem("userInfoCache", JSON.stringify({
      paginationCache: pagination,
      tableDataCache: tableData.value,
      keywordsCache: queryForm.value.keywords
    }))
  }).finally(() => {
    loading.value = false
  })
}
const handelAddBtnClick = () => {
  showEditModal.value = true
  editModalMode.value = 1
  model.value = {}
}
const handelSaveBtnClick = () => {
  loading.value = true
  if (editModalMode.value === 1) {
    model.value.id = undefined
    addUser(model.value).then(res => {
      message.success("????????????")
      getUserData()
    }).catch(err => {
      message.error("?????????????????????????????????")
    }).finally(() => {
      loading.value = false
      showEditModal.value = false
    })
  } else {
    updateUser(model.value).then(res => {
      message.success("????????????")
      getUserData()
    }).catch(err => {
      message.error("?????????????????????????????????")
    }).finally(() => {
      loading.value = false
      showEditModal.value = false
    })
  }
}
const handelRevokeBtnClick = () => {
  loading.value = true
  revoke().then(res => {
    message.success("????????????")
    getUserData()
  }).catch(err => {
    message.error('?????????????????????????????????')
  }).finally(() => {
    loading.value = false
  })
}
const handelRevokeTo = (id: number | undefined) => {
  loading.value = true
  id && revokeTo(id).then(res => {
    message.success("????????????")
    getUserData()
    showHistoryModal.value = false
  }).catch(err => {
    message.error('?????????????????????????????????')
  }).finally(() => {
    loading.value = false
  })
}
onMounted(() => {
  const cache = sessionStorage.getItem("userInfoCache")
  if (cache) {
    const {
      paginationCache,
      tableDataCache,
      keywordsCache
    } = JSON.parse(cache) as { paginationCache: PaginationProps | undefined, tableDataCache: RowData[] | undefined, keywordsCache: string | undefined }
    if (paginationCache) {
      pagination.pageCount = paginationCache.pageCount
      pagination.page = paginationCache.page
      pagination.pageSize = paginationCache.pageSize
    }
    tableDataCache && (tableData.value = tableDataCache)
    keywordsCache && (queryForm.value.keywords = keywordsCache)

  } else {
    getUserData()
  }
  pagination.onChange = (page) => {
    pagination.page = page
    getUserData()
  }
})
</script>

<template>
  <div class="p-12 pt-6 ">
    <n-space justify="space-between" class="pb-4">
      <n-space>
        <n-button @click="handelAddBtnClick">
          <template #icon>
            <n-icon>
              <plus/>
            </n-icon>
          </template>
          ??????
        </n-button>
        <n-input v-model:value="queryForm.keywords" @input="getUserData"/>
      </n-space>
      <n-button @click="handelRevokeBtnClick">??????</n-button>
    </n-space>
    <div>
      <n-data-table
          remote
          :columns="columns"
          :data="tableData"
          :pagination="pagination"
          :row-key="(row:RowData) => row.id"
          :loading="loading"
          @update:checked-row-keys="handleCheck"
      />
      <n-button
          @click="handleBatchDelete"
          type="error">
        ????????????
      </n-button>
    </div>
    <n-modal v-model:show="showEditModal" :mask-closable="false">
      <n-card style="width: 600px" :title="editModalMode===1?'????????????':'????????????'" size="huge" role="dialog"
              aria-modal="true" closable @close="showEditModal=false">
        <n-form ref="formRef" :model="model">
          <n-grid :cols="24" :x-gap="8">
            <n-form-item-gi :span="12" path="name" label="??????">
              <n-input v-model:value="model.name" @keydown.enter.prevent/>
            </n-form-item-gi>
            <n-form-item-gi :span="12" path="age" label="??????">
              <n-input-number v-model:value="model.age" class="w-100" :show-button="false" @keydown.enter.prevent/>
            </n-form-item-gi>
          </n-grid>
          <n-grid :cols="24" :x-gap="8">
            <n-form-item-gi :span="12" path="phone" label="????????????">
              <n-input v-model:value="model.phone" @keydown.enter.prevent/>
            </n-form-item-gi>

          </n-grid>
          <n-grid :cols="24" :x-gap="8">
            <n-form-item-gi :span="10" label="????????????">
              <n-cascader
                  v-model:value="model.areaCode"
                  placeholder="????????????"
                  :options="options"
                  check-strategy="child"
                  :show-path="true"
              />
            </n-form-item-gi>
            <n-form-item-gi :span="14">
              <n-input v-model:value="model.address" @keydown.enter.prevent/>
            </n-form-item-gi>
          </n-grid>
          <n-row :gutter="[0, 24]">
            <n-col :span="24">
              <div style="display: flex; justify-content: flex-end">
                <n-button :loading="loading" @click="showEditModal=false" class="mr-4">
                  ??????
                </n-button>
                <n-button :loading="loading" type="primary" @click="handelSaveBtnClick">
                  ??????
                </n-button>
              </div>
            </n-col>
          </n-row>
        </n-form>
      </n-card>
    </n-modal>
    <n-modal v-model:show="showHistoryModal" :mask-closable="false">
      <n-card
          style="width: 600px" title="????????????" size="huge" role="dialog"
          aria-modal="true" closable @close="showHistoryModal=false">
        <n-collapse accordion>
          <n-collapse-item v-for="item of history" key="id"
                           :title="'??????: '+ dayjs(item.createdTime).tz('PRC').format('YYYY-MM-DD HH:mm:ss')" :name="item.id">
            <div>
              <p>????????? {{ item.name }}</p>
              <p>????????? {{ item.age }}</p>
              <p>????????? {{ item.phone }}</p>
              <p>??????????????? {{ getStringAddress(item) }}</p>
            </div>
            <n-button
                class="mt-2"
                size="small"
                secondary
                strong
                @click="handelRevokeTo(item.id)"
                type="primary">
              ??????
            </n-button>
          </n-collapse-item>
        </n-collapse>
        <template #footer>
          <n-pagination v-model:page="historyPage.page" @update:page="getHistoryData"
                        :page-count="historyPage.pageCount"
                        :page-slot="7"/>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<style scoped>

</style>