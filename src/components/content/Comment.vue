<template>
  <div id="comment">
    <div @click.stop="inputFocus()" class="my-reply">
      <el-avatar
        class="header-img"
        :size="40"
        :src="!myId? this.originalAvator:this.myHeader"
        :key="myId"
      ></el-avatar>
      <div class="reply-info">
        <div
          tabindex="0"
          contenteditable="true"
          id="replyInput"
          spellcheck="false"
          placeholder="输入评论..."
          class="reply-input"
          @keyup="getContent($event)"
          @keypress="delTishi"
          @focus="showReplyBtn"
          @input="onDivInput($event)"
          v-clickoutside="hideReplyBtn.bind(this)"
        ></div>
      </div>
      <div class="reply-btn-box" v-show="btnShow">
        <el-button class="reply-btn" size="medium" @click.stop="sendComment" type="primary">发表评论</el-button>
      </div>
    </div>
    <div
      v-for="(item, i) in comments.slice(
        (currentPage - 1) * pagesize,
        currentPage * pagesize
      )"
      :key="i"
      :data-id="item._id"
      class="author-title reply-father"
    >
      <!-- <el-avatar class="header-img" :size="40" :src="item.fromHeadImg"></el-avatar> -->
      <a @mouseover="showInfoCard($event, item)" @mouseout="hideInfoCard()">
        <el-avatar class="header-img" :size="40" :src="item.fromHeadImg"></el-avatar>
      </a>

      <div class="author-info">
        <span class="author-name">{{ item.fromName }}</span>
        <span class="author-time">{{ dateStr(item.time) }}</span>
      </div>
      <div class="icon-btn">
        <span @click.stop="showReplyInput(item, i)">
          <i class="iconfont el-icon-chat-dot-round"></i>
          回复({{ item.commentNum }})
        </span>
        <span @click.stop="likeClick(item, i)">
          <i class="iconfont">
            <img
              class="like-icon"
              v-show="!show(item)"
              id="is-like-imgactive"
              src="https://blog.csdn.net/static_files/template/new_img/commentUnHeart.png"
              width="15px"
              height="15px"
              alt
            />
            <img
              class="like-icon"
              v-show="show(item)"
              id="is-like-img"
              src="https://blog.csdn.net/static_files/template/new_img/commentActiveHeart.png"
              width="15px"
              height="15px"
              alt
            />
          </i>

          <!-- <i class="iconfont el-icon-chat-dot-roundel-icon-thumb" :class="{active:item.isLike}"></i> -->
          <span class="like-num">{{ item.like > 0 ? item.like + '人赞' : '点赞' }}</span>
        </span>
      </div>
      <div class="talk-box">
        <p>
          <span class="reply" v-html="item.content"></span>
        </p>
      </div>
      <div v-show="_inputShow(item,i)" class="my-reply my-comment-reply">
        <el-avatar class="header-img" :size="40" :src="!myId?'':myHeader"></el-avatar>
        <div class="reply-info">
          <div
            tabindex="0"
            contenteditable="true"
            spellcheck="false"
            :placeholder="replyed"
            @input="onDivInput($event)"
            @keyup="getContent($event)"
            @keypress="delTishi"
            class="reply-input reply-comment-input"
            v-focus="comments[i].inputShow"
            v-clickoutside="hideReply.bind(this,i)"
          ></div>
        </div>
        <div class="reply-btn-box">
          <el-button
            class="reply-btn"
            size="medium"
            @click.stop="sendCommentReply(i)"
            type="primary"
          >发表评论</el-button>
        </div>
      </div>

      <div class="reply-box">
        <div v-for="(reply, j) in item.reply" :key="j" :data-id="reply._id">
          <div v-show="!pullDown || j < 3" class="author-title">
            <!-- <el-avatar class="header-img" :size="40" :src="reply.fromHeadImg"></el-avatar> -->
            <a @mouseover="showInfoCard($event, reply)" @mouseout="hideInfoCard()">
              <el-avatar class="header-img" :size="40" :src="reply.fromHeadImg"></el-avatar>
            </a>

            <div class="author-info">
              <span class="author-name">{{ reply.fromName }}</span>
              <span class="author-time">{{ dateStr(reply.time) }}</span>
            </div>
            <div class="icon-btn">
              <span @click.stop="showReplyInputs(reply, i,j)">
                <i class="iconfont el-icon-chat-dot-round"></i>
                回复
              </span>
              <span @click.stop="likeClicks(reply, j)">
                <i class="iconfont">
                  <img
                    class="like-icon"
                    v-show="!shows(reply, j)"
                    id="is-like-imgactive"
                    src="https://blog.csdn.net/static_files/template/new_img/commentUnHeart.png"
                    width="15px"
                    height="15px"
                    alt
                  />
                  <img
                    class="like-icon"
                    v-show="shows(reply, j)"
                    id="is-like-img"
                    src="https://blog.csdn.net/static_files/template/new_img/commentActiveHeart.png"
                    width="15px"
                    height="15px"
                    alt
                  />
                </i>
                <span class="like-num">{{ reply.like > 0 ? reply.like + '人赞' : '点赞' }}</span>
              </span>
            </div>
            <div class="talk-box">
              <p>
                <span class="text">回复</span>
                <span>{{ reply.toName }}:</span>

                <span class="reply" v-html="reply.content"></span>
              </p>
            </div>
          </div>
          <div v-show="_inputShow1(reply,i,j)" class="my-reply my-comment-reply">
            <el-avatar class="header-img" :size="40" :src="!myId?'':myHeader"></el-avatar>
            <div class="reply-info">
              <div
                tabindex="0"
                contenteditable="true"
                spellcheck="false"
                :placeholder="replyed"
                @input="onDivInput($event)"
                @keyup="getContent($event)"
                @keypress="delTishi"
                class="reply-input reply-comment-input"
                v-focus="comments[i].reply[j].inputShow"
                v-clickoutside="hideReply.bind(this,i,j)"
              ></div>
            </div>
            <div class="reply-btn-box">
              <el-button
                class="reply-btn"
                size="medium"
                @click.stop="sendCommentReply(i)"
                type="primary"
              >发表评论</el-button>
            </div>
          </div>
        </div>
        <div class="comment-rest" v-if="item.reply.length > 3">
          <span v-if="pullDown" @click.stop="setPullDown(false)">
            显示全部{{ item.reply.length }}条
            <i class="el-icon-arrow-down"></i>
          </span>
          <span v-else @click.stop="setPullDown(true)">
            收起评论
            <i class="el-icon-arrow-up"></i>
          </span>
        </div>
      </div>
    </div>

    <!-- <div v-show="_inputShow(i)" class="my-reply my-comment-reply">
        <el-avatar class="header-img" :size="40" :src="myHeader"></el-avatar>
        <div class="reply-info">
          <div
            tabindex="0"
            contentEditable="true"
            spellcheck="false"
            :placeholder="replyed"
            @input="onDivInput($event)"
            class="reply-input reply-comment-input"
            v-focus="comments[i].inputShow"
            v-clickoutside="hideReply"
          ></div>
        </div>
        <div class="reply-btn-box">
          <el-button
            class="reply-btn"
            size="medium"
            @click.stop="sendCommentReply(i)"
            type="primary"
          >发表评论</el-button>
        </div>
      </div>
    </div>-->
    <el-pagination
      v-if="comments.length>5"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 20, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="comments.length"
    ></el-pagination>
  </div>
</template>

<script>
import { request } from '../../utils/network/request'
// import { mapState } from 'vuex';

let editArr = document.getElementsByClassName('contenteditable')
const clickoutside = {
  // 初始化指令
  bind(el, binding, vnode) {
    function documentHandler(e) {
      // 这里判断点击的元素是否是本身，是本身，则返回

      if (el.isEqualNode(e.target)) {
        return false
      }
      // console.log(el)
      // 判断指令中是否绑定了函数

      if (binding.expression) {
        // console.log(el, e.target)
        // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法

        binding.value()
        // console.log(el.innerHTML)
        el.innerHTML = ''
      }
    }
    // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
    el.vueClickOutside = documentHandler
    document.addEventListener('click', documentHandler)
  },
  update() {},
  unbind(el, binding) {
    // 解除事件监听
    document.removeEventListener('click', el.vueClickOutside)
    delete el.vueClickOutside
  }
}

export default {
  // inject: ['reload'],
  name: 'comment',
  props: {
    // articleComment: {
    //   type: Array
    // },
    articleId: {
      type: String
    },
    id: {
      type: Number
    }
  },
  // mounted() {
  //   console.log(JSON.stringify(this.comments))
  // },
  // created(){
  //   this.comments=this.$store.state.commentList
  // },
  data() {
    return {
      originalAvator: require('../../assets/images/originalHeadImg.png'),
      currentPage: 1, //初始页
      pagesize: 10, //    每页的数据
      replyed: '',
      btnShow: false,

      index: '0',
      replyComment: '',
      to: '',
      toId: -1,
      pullDown: true,
      // comments: this.$store.state.commentList,
      avatarHeight: ''

      // fits: 'contain'
    }
  },
  computed: {
    // mapState({
    ...Vuex.mapState({
      myHeader: state => state.avator,
      myId: state => state.logId,
      timer: state => state.timer,
      comments: state => state.commentList
    })
  },
  directives: {
    clickoutside,
    focus: {
      update(el, binding) {
        // console.log(el)
        if (binding.value) {
          el.focus()
          // el.scrollIntoView()
        }
      }
    }
  },
  // watch: {
  //   articleComment: {
  //     handler(val, oldVal) {
  //       // console.log(val)
  //       this.comments = val
  //       // this.comments = Object.assign([], this.comments, val)
  //       // this.$set(this.comments, 0, val)
  //       // this.$forceUpdate()
  //       // console.log(this.comments)
  //     },
  //     deep: true,
  //     immediate: true
  //   }
  // },

  mounted() {
    for (let item of this.comments) {
      // console.log(item)
      this.$set(item, 'inputShow', false)
      for (let val of item.reply) {
        this.$set(val, 'inputShow', false)
      }
    }

    // document.onclick = e => {

    //   if (e.target.className.indexOf('reply-input') == -1) {
    //     for (let item of this.comments) {
    //       // console.log(this.comments.inputShow)
    //       // console.log(item)
    //       item.inputShow = false
    //     }
    //   }
    // }
  },

  destroyed() {
    document.onclick = null
  },
  methods: {
    showInfoCard(e, item) {
      let obj = {}
      obj['username'] = item.fromName
      obj['avatar'] = item.fromHeadImg
      obj['signature'] = item.signature

      // if (window.sessionStorage.getItem('usrCard')) {
      //   window.sessionStorage.removeItem('usrCard')
      // }
      // window.sessionStorage.setItem('usrCard', JSON.stringify(obj))
      if (e.target.clientHeight) {
        this.avatarHeight = e.target.clientHeight
      }

      if (this.timer) clearTimeout(this.timer)
      let user = document.getElementById('userCard')
      let height = parseInt(getComputedStyle(user, null).height.split('px')[0])
      user.style.display = 'block'
      // console.log(e.clientY - e.offsetY, height)
      user.style.left = e.clientX - e.offsetX + 'px'
      if (e.clientY - e.offsetY > height + 66) {
        user.style.top =
          e.clientY -
          e.offsetY -
          height -
          this.avatarHeight +
          document.documentElement.scrollTop +
          'px'
        obj['classChange'] = false
        this.$store.commit('infoChange', obj)
      } else {
        // user.classList.remove('userTooltip-default')
        // user.classList.toggle('userTooltip-pos')
        user.style.top =
          e.clientY -
          e.offsetY +
          this.avatarHeight +
          14 +
          document.documentElement.scrollTop +
          'px'
        obj['classChange'] = true
        this.$store.commit('infoChange', obj)
      }

      // this.floatLeft = e.clientX + 'px' // 减去外层div的left距离
      // this.floatTop = e.clientY + 'px'
    },
    hideInfoCard() {
      // this.infoShow = false

      let timer = setTimeout(() => {
        this.hide()
      }, 500)
      this.$store.commit('timechange', timer)
    },
    hide() {
      document.getElementById('userCard').style.display = 'none'
    },
    handleSizeChange: function(size) {
      this.pagesize = size
      // console.log(this.pagesize) //每页下拉显示数据
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage
      // console.log(this.currentPage) //点击第几页
    },
    hideReply(...args) {
      if (args.length > 1) {
        this.comments[args[0]].reply[args[1]].inputShow = false
      } else {
        this.comments[args[0]].inputShow = false
      }
      // this.comments[i].inputShow = false
      // for (let item of this.comments) {

      //   item.inputShow = false
      //   for (let val of item.reply) val.inputShow = false
      // }
    },

    show(item) {
      // console.log(this.comments)
      // console.log(JSON.stringify(this.comments))
      let m = item.users.indexOf(this.myId)

      return m >= 0
    },
    shows(reply, j) {
      // console.log(this.comments[2].reply)
      // JSON.parse(JSON.stringify(this.comments[i].reply[j].users))
      let m = reply.users.indexOf(this.myId)
      // console.log(m)
      return m >= 0
    },
    setPullDown(data) {
      this.pullDown = data
    },
    likeClick(item, i) {
      if (!this.myId) {
        this.btnShow = false
        this.$message({
          showClose: true,
          type: 'warning',
          message: '请先登录哦'
        })
      } else {
        let usernames = item.users
        // console.log(usernames)
        if (usernames.indexOf(this.myId) < 0) {
          request({
            method: 'post',
            url: '/api/dianzan',
            data: {
              userid: this.myId,
              id: item._id
            }
          })
            .then(res => {
              console.log(res)
              this.$set(item, 'users', res.data.users)
              this.$set(item, 'like', res.data.like)
              // location.reload()
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          request({
            method: 'post',
            url: '/api/canclezan',
            data: {
              userid: this.myId,
              id: item._id
            }
          })
            .then(res => {
              console.log(res)
              this.$set(item, 'users', res.data.users)
              this.$set(item, 'like', res.data.like)
              // location.reload()
            })
            .catch(err => {
              console.log(err)
            })
        }
      }
    },
    likeClicks(reply, j) {
      if (!this.myId) {
        this.btnShow = false
        this.$message({
          showClose: true,
          type: 'warning',
          message: '请先登录哦'
        })
      } else {
        // let userid = this.$store.state.logId
        // console.log(this.comments[i].reply[j].users)
        let usernames = reply.users
        // console.log(usernames)
        if (usernames.indexOf(this.myId) < 0) {
          request({
            method: 'post',
            url: '/api/dianzan',
            data: {
              userid: this.myId,
              id: reply._id
            }
          })
            .then(res => {
              console.log(res)
              this.$set(reply, 'users', res.data.users)
              this.$set(reply, 'like', res.data.like)
              // console.log(this.comments[i].reply[j].users)
              // location.reload()
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          request({
            method: 'post',
            url: '/api/canclezan',
            data: {
              userid: this.myId,
              id: reply._id
            }
          })
            .then(res => {
              console.log(res)
              this.$set(reply, 'users', res.data.users)
              this.$set(reply, 'like', res.data.like)
              // location.reload()
            })
            .catch(err => {
              console.log(err)
            })
        }
      }
    },
    inputFocus() {
      if (!this.myId) {
        this.btnShow = false
        this.$message({
          showClose: true,
          type: 'warning',
          message: '请先登录哦'
        })

        this.$store.commit('statusChange', true)
      } else {
        let replyInput = document.getElementById('replyInput')
        replyInput.style.padding = '8px 8px'
        replyInput.style.border = '2px solid blue'
        replyInput.focus()
      }
    },
    showReplyBtn() {
      this.btnShow = true
    },
    getContent(e) {
      console.log(e.target.innerHTML)
      this.replyComment = e.target.innerHTML
    },
    delTishi() {
      this.replyed = ''
    },
    hideReplyBtn() {
      let replyInput = document.getElementById('replyInput')
      this.btnShow = false
      replyInput.style.padding = '10px'
      replyInput.style.border = 'none'
    },
    showReplyInput(item, i) {
      // console.log(window.sessionStorage.getItem('logid'))
      if (!this.myId) {
        this.$message({
          showClose: true,
          type: 'warning',
          message: '请先登录哦'
        })

        this.$store.commit('statusChange', true)
        this.replyShow = false
        // this.comments[i].inputShow = false
      } else {
        this.hideReplyBtn()

        this.comments[this.index].inputShow = false
        for (let i of this.comments[this.index].reply) {
          i.inputShow = false
        }
        this.index = i
        // this.$set(this.comments[i], 'inputShow', true)
        this.comments[i].inputShow = true
        this.to = item.fromName
        this.toId = item.fromId

        this.replyed = '回复：' + item.fromName
        let m = document.getElementsByClassName('reply-comment-input')[0]
        if (m.innerHTML) {
          m.innerHTML = ''
          // m.setAttribute('placeholder', '')
        }
        // console.log(this.comments[i])
      }
    },
    showReplyInputs(item, i, j) {
      // console.log(window.sessionStorage.getItem('logid'))
      if (!this.myId) {
        this.$message({
          showClose: true,
          type: 'warning',
          message: '请先登录哦'
        })

        this.$store.commit('statusChange', true)
        this.replyShow = false
        // this.comments[i].inputShow = false
      } else {
        this.hideReplyBtn()
        this.comments[this.index].inputShow = false
        for (let i of this.comments[this.index].reply) {
          i.inputShow = false
        }
        // this.comments[this.index].reply[j].inputShow = false
        this.index = i
        // this.$set(this.comments[i], 'inputShow', true)
        this.comments[i].reply[j].inputShow = true
        this.to = item.fromName
        this.toId = item.fromId

        this.replyed = '回复：' + item.fromName
        let m = document.getElementsByClassName('reply-comment-input')[0]
        if (m.innerHTML) {
          m.innerHTML = ''
          // m.setAttribute('placeholder', '')
        }
        // console.log(this.comments[i])
      }
    },
    _inputShow(item, i) {
      // return !this.replyShow

      return this.comments[i].inputShow
    },
    _inputShow1(reply, i, j) {
      // return !this.replyShow
      if (this.comments[i].reply.includes(reply)) {
        //  console.log(this.comments[i].reply[j])
        return this.comments[i].reply[j].inputShow
      }
    },
    sendComment(...args) {
      // this.replyComment = document.getElementsByClassName
      if (!this.replyComment) {
        this.$message({
          showClose: true,
          type: 'warning',
          message: '评论不能为空'
        })
      } else {
        let a = {}
        let input = document.getElementById('replyInput')
        let timeNow = new Date().getTime()
        // let time = this.dateStr(timeNow)
        a.fromId = this.myId
        // a.from = this.myName
        // console.log(typeof args[0])
        if (typeof args[0] == 'number') {
          // console.log(args)
          a.toId = this.comments[args[0]].fromId
          a.parentId = this.comments[args[0]]._id
          // this.replyComment = ''
          // document.getElementsByClassName('reply-comment-input')[args[0]].innerHTML =
          //   ''
        }

        a.articleid = this.articleId
        a.content = this.replyComment

        a.time = timeNow
        a.commentNum = 0
        a.like = 0
        let that = this
        request({
          method: 'post',
          url: '/api/home/' + this.$route.params.id,
          data: a
        })
          .then(res => {
            // alert(res.msg);
            this.$message({
              showClose: true,
              type: 'success',
              message: res.msg
            })
            // if (args[2] && args[2] == 'reply') {
            //   this.comments[args[0]].reply.push(res.data)
            // } else {
            //   this.comments.push(res.data)
            // }

            this.replyComment = ''
            input.innerHTML = ''
            this.hideReplyBtn()
            // console.log(this.id)
            request({
              url: '/api/home/' + this.id + '?timestamp=' + new Date().getTime()
            }).then(res => {
              this.$store.commit('UpdateCommentList', res.data.comment)
              // sessionStorage.commentList = res.data.comment
              // this.$set(this.comments, res.data.comment)
              // this.comments.splice(0,this.comments.length,res.data.comment)
              // console.log(this.comments)
            })
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    sendCommentReply(i) {
      this.sendComment(i, 'reply')
      // if (!this.replyComment) {
      //   this.$message({
      //     showClose: true,
      //     type: 'warning',
      //     message: '评论不能为空'
      //   })
      // } else {
      //   let a = {}
      //   let timeNow = new Date().getTime()
      //   // let time = this.dateStr(timeNow)
      //   a.fromId = this.myId
      //   a.toId = this.comments[i].fromId
      //   a.articleid = this.articleId
      //   a.content = this.replyComment

      //   a.time = timeNow
      //   a.commentNum = 0
      //   a.like = 0
      //   a.parentId = this.comments[i]._id
      // let that = this
      // this.comments[i].reply.push(a)
      // request({
      //   method: 'post',
      //   url: '/api/home/' + this.$route.params.id,
      //   data: a
      // })
      //   .then(res => {
      //     this.$message({
      //       showClose: true,
      //       type: 'success',
      //       message: res.msg
      //     })
      //     request({
      //       url: '/api/home/' + this.$route.params.id
      //     }).then(res => {

      //       this.comments = res.data.comment
      //     })
      //   })

      //   .catch(err => {
      //     console.log(err)
      //   })
      this.replyComment = ''
      document.getElementsByClassName('reply-comment-input')[i].innerHTML = ''
      // }
    },
    onDivInput: function(e) {
      // let m = document.defaultView.getComputedStyle(e.target, ':before')
      // if (e.target.innerHTML) {
      //   e.target.setAttribute('placeholder', '')
      // }
      // console.log(e.target.innerHTML)
      this.replyed = ''
      this.replyComment = e.target.innerHTML
      // console.log(m.content)
      // e.cancelBubble = true
    },
    dateStr(date) {
      //获取js 时间戳
      let time = new Date().getTime()
      let dates = Date.parse(date)
      //去掉 js 时间戳后三位，与php 时间戳保持一致
      time = parseInt((time - dates) / 1000)
      //存储转换值
      let s
      if (time < 60 * 10) {
        //十分钟内
        return '刚刚'
      } else if (time < 60 * 60 && time >= 60 * 10) {
        //超过十分钟少于1小时
        s = Math.floor(time / 60)
        return s + '分钟前'
      } else if (time < 60 * 60 * 24 && time >= 60 * 60) {
        //超过1小时少于24小时
        s = Math.floor(time / 60 / 60)
        return s + '小时前'
      } else if (time < 60 * 60 * 24 * 30 && time >= 60 * 60 * 24) {
        //超过1天少于30天内
        s = Math.floor(time / 60 / 60 / 24)
        return s + '天前'
      } else {
        //超过30天ddd
        let date = new Date(parseInt(dates))
        return (
          date.getFullYear() +
          '年' +
          (date.getMonth() + 1) +
          '月' +
          date.getDate() +
          '日'
        )
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.my-reply
  padding: 10px
  background-color: #fafbfc
  .infoShow
    background-color: red
    position: absolute
    width: 40px
    height: 40px
    .innerDiv
      z-index: 1
      width: 0
      height: 0
      border-left: 10px solid transparent
      border-bottom: 10px solid transparent
      border-top: 10px solid blue
  .header-img
    display: inline-block
    vertical-align: top
    cursor: pointer
  .reply-info
    display: inline-block
    margin-left: 5px
    width: 90%
    @media screen and (max-width: 1200px)
      width: 80%
    .reply-input
      min-height: 20px
      line-height: 22px
      padding: 10px 10px
      color: #ccc
      background-color: #fff
      border-radius: 5px
      &:empty:before
        content: attr(placeholder)
      &:focus:before
        content: none
      &:focus
        padding: 8px 8px
        border: 2px solid blue
        box-shadow: none
        outline: none
    .reply-comment-input
      &:focus:before
        content: attr(placeholder)
  .reply-btn-box
    height: 25px
    margin: 10px 0
    .reply-btn
      position: relative
      float: right
      margin-right: 15px
.my-comment-reply
  margin-left: 50px
  .reply-input
    width: flex
.author-title:not(:last-child)
  border-bottom: 1px solid rgba(178, 186, 194, 0.3)
.author-title
  padding: 10px
  .header-img
    display: inline-block
    vertical-align: top
    cursor: pointer
  .author-info
    display: inline-block
    margin-left: 5px
    width: 60%
    height: 40px
    line-height: 20px
    >span
      display: block
      overflow: hidden
      white-space: nowrap
      text-overflow: ellipsis
    .author-name
      color: #000
      font-size: 18px
      font-weight: bold
      cursor: pointer
      &:hover
        color: #098ff2
    .author-time
      font-size: 14px
  .icon-btn
    width: 30%
    padding: 0 !important
    float: right
    @media screen and (max-width: 1200px)
      width: 20%
      padding: 7px
    >span
      cursor: pointer
    .iconfont el-icon-chat-dot-round
      margin: 0 5px
      .like-icon
        vertical-align: 0.02em
  .talk-box
    margin: 0 50px
    >p
      margin: 0
    .reply
      font-size: 16px
      color: #000
    .text
      color: #777888
      margin: 0 6px
  .reply-box
    margin: 10px 0 0 50px
    .comment-rest
      color: #777888
      cursor: pointer
      span
        padding-left: 10px
.el-pagination
  text-align: center
</style>
