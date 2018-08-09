<template>
  <div id="p" class="shoppingCart">
    <el-header>
      <h1 class="head">我的收藏</h1>
      <div class="headLine"></div>
    </el-header>
    <div class="cartTable">
      <el-row>
        <el-col :span="2">编号</el-col>
        <el-col :span="4">类型</el-col>
        <el-col :span="12">文法</el-col>
        <el-col :span="4">操作</el-col>
      </el-row>
      <div style="margin: 15px 0;"></div>
      <div class="table-block">
        <div class="table" v-for="item in currCollection">
          <el-row>
            <el-col :span="2">{{item.itemID}}</el-col>
            <el-col :span="4">
              <p>{{item.leixing}}</p>
            </el-col>
            <el-col style="margin-right: 80px" :span="10">
              <textarea readonly="readonly" class="textStyle" :rows="4" v-model="item.data_content"></textarea>
            </el-col>
            <el-col :span="1">
              <el-button @click="gotoWatch(item)" type="text">查看</el-button>
            </el-col>
            <el-col :span="2">
              <el-button style="color: #f00" @click="deleteItem(item.collectionID)" type="text">删除</el-button>
            </el-col>
          </el-row>
        </div>
      </div>

      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="prev, pager, next" :total="collection.length">
        </el-pagination>
      </div>
    </div>

  </div>
</template>

<script type="text/javascript">
export default {
  data () {
    return {
      pageSize: 6,
      currentPage: 1,
      currCollection: [],
      collection: [

      ],
      hostURL: 'localhost'
    }
  },
  methods: {
    handleSizeChange (val) {

    },
    handleCurrentChange (val) {

    },
    getCollectionList () {
      const self = this
      let Params = {
        studentID: sessionStorage.getItem('studentID')}
      self.$axios.post('/api/user_function/collectionQuery', Params)
        .then((response) => {
          // console.log(response.data);
          self.collection = response.data.data
          console.log(self.collection)
          for (let i = 0; i < this.pageSize; i++) {
            if (this.pageSize * (this.currentPage - 1) + i < this.collection.length) {
              this.currCollection.push(this.collection[this.pageSize * (this.currentPage - 1) + i])
              this.currCollection[i].itemID = this.pageSize * (this.currentPage - 1) + i + 1
              switch (this.currCollection[i].collectionType) {
                case 0:
                  this.currCollection[i].leixing = '词法分析'
                  break
              }
            } else { break }
          }
          console.log(12313213)
          console.log(this.currCollection)
        }).catch((error) => {
          this.$message({
            type: 'info',
            message: 'connection fail,press F12 to see the error in console'
          })
          console.log('ERROR:')
          console.log(error)
        })
    },
    deleteItem (val) {
      var self = this

      let Params = {
        collectionID: val,
        studentID: sessionStorage.getItem('studentID')
      }
      // console.log(Params)
      self.$axios.post('/api/user_function/collectionDelete', Params)
        .then((response) => {
          console.log(response.data)
          if (response.data.state === 1) {
            this.$message({
              type: 'success',
              message: response.data.message
            })
            

          this.currCollection = []
          const self = this
          let Params = {
            studentID: sessionStorage.getItem('studentID')}
          self.$axios.post('/api/user_function/collectionQuery', Params)
            .then((response) => {
              // console.log(response.data);
              self.collection = response.data.data
              console.log(self.collection)
              for (let i = 0; i < this.pageSize; i++) {
                if (this.pageSize * (this.currentPage - 1) + i < this.collection.length) {
                  this.currCollection.push(this.collection[this.pageSize * (this.currentPage - 1) + i])
                  this.currCollection[i].itemID = this.pageSize * (this.currentPage - 1) + i + 1
                  switch (this.currCollection[i].collectionType) {
                    case 0:
                      this.currCollection[i].leixing = '词法分析'
                      break
                  }
                } else { break }
              }
              console.log(12313213)
              console.log(this.currCollection)
            }).catch((error) => {
              this.$message({
                type: 'info',
                message: 'connection fail,press F12 to see the error in console'
              })
              console.log('ERROR:')
              console.log(error)
            })




          } else {
            this.$message({
              type: 'info',
              message: '删除收藏失败'
            })
          }
        }).catch((error) => {
          this.$message({
            type: 'info',
            message: 'connection fail,press F12 to see the error in console'
          })
          console.log('ERROR:')
          console.log(error)
        })
    },
    gotoWatch (val) {
      if (val.collectionType === 0) {
        localStorage.setItem('collectionToWatch', val.data_content)
        this.$router.push('/index/lexical-analysis')
      }
    }
  },
  mounted () {
    document.getElementById('p').style.height = (window.innerHeight - 110) + 'px'
    if(window.innerHeight>700)
      this.pageSize = 6
    else
      this.pageSize = 4
    this.getCollectionList()
    // this.$nextTick(()=>{
    //   for(let i = 0; i < this.pageSize; i++)
    //   {
    //     if(this.pageSize * (this.currentPage-1) + i < this.collection.length)
    //       this.currCollection.push(this.collection[this.pageSize * (this.currentPage-1) + i])
    //     else
    //       break
    //   }
    //   console.log(12313213)
    //   console.log(this.currCollection)
    // })
  },
  watch: {
    currentPage: function () {
      console.log(this.currentPage)
      this.currCollection = []
      for (let i = 0; i < this.pageSize; i++) {
        if (this.pageSize * (this.currentPage - 1) + i < this.collection.length) {
          this.currCollection.push(this.collection[this.pageSize * (this.currentPage - 1) + i])
          this.currCollection[i].itemID = this.pageSize * (this.currentPage - 1) + i + 1
          switch (this.currCollection[i].collectionType) {
            case 0:
              this.currCollection[i].leixing = '词法分析'
          }
        } else { break }
      }
      console.log(this.currCollection)
    }
  }
}
</script>

<style scoped>
.shoppingCart {
  width: 70%;
  margin-left: auto;
  margin-right: auto;
  border: 1px solid #cccccc;
  font-size: 16px;
  background-color: rgba(255, 255, 255, 1);
}
.head {
  margin: 1.5rem;
  font-size: 2.5rem;
}
.headLine {
  height: 5px;
  width: 100%;
  background-color: #dd0606;
}
.cartTable {
  margin: 2% 4%;

  overflow: hidden;
}
.table-block {
  overflow-y: hidden;
  overflow-x: hidden;
  min-height: 80%;
}
.table {
  width: 100%;
  height: 85px;
  margin-bottom: 0px;
  background-color: #fafafa;
  padding: 10px;

  border: 1px solid #ccd0d2;
  border-bottom-color: #ececec;
  border-top-color: #ececec;
}
.block {
  position: relative;
  bottom: 10px;
  margin-top: 2rem;
  text-align: center;
}
.textStyle {
  resize: none;
  width: 100%;
  border-color: #aaa;
  font-size: 2rem
}
</style>
