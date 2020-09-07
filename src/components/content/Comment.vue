<template>
  <div id="comment">
    <div v-clickoutside="hideReplyBtn" @click.stop.stop="inputFocus()" class="my-reply">
      <el-avatar class="header-img" :size="40" :src="myHeader"></el-avatar>
      <div class="reply-info">
        <div
          tabindex="0"
          contenteditable="true"
          id="replyInput"
          spellcheck="false"
          placeholder="输入评论..."
          class="reply-input"
          @focus="showReplyBtn"
          @input="onDivInput($event)"
        ></div>
      </div>
      <div class="reply-btn-box" v-show="btnShow">
        <el-button class="reply-btn" size="medium" @click.stop="sendComment" type="primary">发表评论</el-button>
      </div>
    </div>
    <div v-for="(item, i) in comments" :key="i" class="author-title reply-father">
      <el-avatar class="header-img" :size="40" :src="item.fromHeadImg"></el-avatar>
      <div class="author-info">
        <span class="author-name">{{ item.fromName }}</span>
        <span class="author-time">{{ dateStr(item.time) }}</span>
      </div>
      <div class="icon-btn">
        <span @click.stop="showReplyInput(i, item.fromName, item.fromId)">
          <i class="iconfont el-icon-chat-dot-round"></i>
          回复({{ item.commentNum }})
        </span>
        <span @click.stop="likeClick(item,i)">
          <i class="iconfont">
            <img
              class="like-icon"
              v-show="!show(i)"
              id="is-like-imgactive"
              src="https://blog.csdn.net/static_files/template/new_img/commentUnHeart.png"
              width="15px"
              height="15px"
              alt
            />
            <img
              class="like-icon"
              v-show="show(i)"
              id="is-like-img"
              src="https://blog.csdn.net/static_files/template/new_img/commentActiveHeart.png"
              width="15px"
              height="15px"
              alt
            />
          </i>

          <!-- <i class="iconfont el-icon-thumb" :class="{active:item.isLike}"></i> -->
          <span class="like-num">{{item.like > 0 ? item.like + '人赞' : '点赞'}}</span>
        </span>
      </div>
      <div class="talk-box">
        <p>
          <span class="reply">{{ item.content }}</span>
        </p>
      </div>
      <div class="reply-box">
        <div v-for="(reply, j) in item.reply" :key="j">
          <div v-if="!pullDown || j < 3" class="author-title">
            <el-avatar class="header-img" :size="40" :src="reply.fromHeadImg"></el-avatar>
            <div class="author-info">
              <span class="author-name">{{ reply.fromName }}</span>
              <span class="author-time">{{ dateStr(reply.time) }}</span>
            </div>
            <div class="icon-btn">
              <span @click.stop="showReplyInput(i, reply.fromName, reply.fromId)">
                <i class="iconfont el-icon-chat-dot-round"></i>
                回复
              </span>
              <span @click.stop="likeClicks(reply,i,j)">
                <i class="iconfont">
                  <img
                    class="like-icon"
                    v-show="shows(i,j)"
                    id="is-like-imgactive"
                    src="https://csdnimg.cn/release/phoenix/template/new_img/tobarThumbUpactive.png"
                    width="20px"
                    height="20px"
                    alt
                  />
                  <img
                    class="like-icon"
                    v-show="!shows(i,j)"
                    id="is-like-img"
                    src="https://csdnimg.cn/release/phoenix/template/new_img/tobarThumbUp.png"
                    width="20px"
                    height="20px"
                    alt
                  />
                </i>
                <span class="like-num">{{reply.like > 0 ? reply.like + '人赞' : '点赞'}}</span>
              </span>
            </div>
            <div class="talk-box">
              <p>
                <span>回复 {{ reply.toName }}:</span>
                <span class="reply">{{ reply.content }}</span>
              </p>
            </div>
          </div>
        </div>
        <div class="comment-rest" v-if="item.reply.length > 3">
          <span v-if="pullDown" @click.stop="setPullDown(false)">显示全部{{item.reply.length}}条</span>
          <span v-else @click="setPullDown(true)">收起评论</span>
        </div>
      </div>
      <div v-show="_inputShow(i)" class="my-reply my-comment-reply">
        <el-avatar class="header-img" :size="40" :src="myHeader"></el-avatar>
        <div class="reply-info">
          <div
            tabindex="0"
            contenteditable="true"
            spellcheck="false"
            :placeholder="replyed"
            @input="onDivInput($event)"
            class="reply-input reply-comment-input"
            v-focus="comments[i].inputShow"
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
  </div>
</template>


<script>
import { request } from '../../network/request'

const clickoutside = {
  // 初始化指令
  bind(el, binding, vnode) {
    function documentHandler(e) {
      // 这里判断点击的元素是否是本身，是本身，则返回
      if (el.contains(e.target)) {
        return false
      }
      // 判断指令中是否绑定了函数
      if (binding.expression) {
        // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
        binding.value(e)
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
  inject: ['reload'],
  name: 'comment',
  props: {
    articleComment: {
      type: Array
    },
    articleId: {
      type: String
    }
  },
  // mounted() {
  //   console.log(JSON.stringify(this.comments))
  // },
  data() {
    return {
      replyed: '',
      btnShow: false,
      index: '0',
      replyComment: '',

      myHeader: sessionStorage.getItem('avator'),
      myId: this.$store.state.logId || sessionStorage.getItem('logid'),
      to: '',
      toId: -1,
      comments: this.$store.state.commentList,
      pullDown: true
      // focusState: false
    }
  },
  watch: {
    myId: function(newVal, oldVal) {
      this.myId = newVal
    }
  },

  directives: {
    clickoutside,
    focus: {
      update(el, binding) {
        // console.log(el)
        if (binding.value) {
          el.focus()
          el.scrollIntoView()
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
  // created() {
  //   if (sessionStorage.getItem(this.$route.params.id)) {
  //     // this.comments = JSON.parse(sessionStorage.getItem(this.$route.params.id))
  //     this.$store.state.commentList = this.articleComment
  //     // console.log(this.$store.state.commentList)
  //   }
  // },
  mounted() {
    // window.onbeforeunload = () => {
    //   // sessionStorage.removeItem('commentList')
    //   sessionStorage.setItem(
    //     this.$route.params.id,
    //     JSON.stringify(this.$store.state.commentList)
    //   )
    // }

    document.onclick = e => {
      // console.log(e.target.className.indexOf('reply-input'))
      if (e.target.className.indexOf('reply-input') == -1) {
        for (let item of this.comments) {
          // console.log(this.comments.inputShow)
          // console.log(item)
          item.inputShow = false
        }
      }
    }
  },

  // computed: {
  //   comments: {
  //     get() {
  //       return this.articleComment
  //     }
  //     // set(val) {
  //     //   this.articleComment = val
  //     // }
  //   }
  // },
  destroyed() {
    document.onclick = null
  },
  methods: {
    show(i) {
      // console.log(this.comments)
      // console.log(JSON.stringify(this.comments))
      let m = this.comments[i].users.indexOf(this.myId)

      return m >= 0
    },
    shows(i, j) {
      // console.log(this.comments[2].reply)
      // JSON.parse(JSON.stringify(this.comments[i].reply[j].users))
      let m = this.comments[i].reply[j].users.indexOf(this.myId)
      // console.log(i, j, m)
      return m >= 0
    },
    setPullDown(data) {
      this.pullDown = data
    },
    likeClick(item, i) {
      // console.log(this.$store.state.logId)
      // let userid = this.$store.state.logId
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
            this.$set(this.comments[i], 'users', res.data.users)
            this.$set(this.comments[i], 'like', res.data.like)
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
            this.$set(this.comments[i], 'users', res.data.users)
            this.$set(this.comments[i], 'like', res.data.like)
            // location.reload()
          })
          .catch(err => {
            console.log(err)
          })
      }
      // if (item.isLike === null) {
      //   this.$set(item, 'isLike', true)
      //   item.like++
      // } else {
      //   if (item.isLike) {
      //     item.like--
      //   } else {
      //     item.like++
      //   }

      //   item.isLike = !item.isLike
      // }
      // this.$store.state.commentList[i] = item
      // console.log()
    },
    likeClicks(item, i, j) {
      // let userid = this.$store.state.logId
      // console.log(this.comments[i].reply[j].users)
      // console.log(this.myId)
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
            this.$set(this.comments[i].reply[j], 'users', res.data.users)
            this.$set(this.comments[i].reply[j], 'like', res.data.like)
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
            id: item._id
          }
        })
          .then(res => {
            console.log(res)
            this.$set(this.comments[i].reply[j], 'users', res.data.users)
            this.$set(this.comments[i].reply[j], 'like', res.data.like)
            // location.reload()
          })
          .catch(err => {
            console.log(err)
          })
      }
      // if (item.isLike === null) {
      //   this.$set(item, 'isLike', true)
      //   item.like++
      // } else {
      //   if (item.isLike) {
      //     item.like--
      //   } else {
      //     item.like++
      //   }

      //   item.isLike = !item.isLike
      // }
      // this.$store.state.commentList[i].reply[j] = item
    },
    inputFocus() {
      if (!this.myId) {
        this.$message({
          showClose: true,
          type: 'warning',
          message: '请先登录哦'
        })
        this.$router.push('/login')
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
    hideReplyBtn() {
      this.btnShow = false
      replyInput.style.padding = '10px'
      replyInput.style.border = 'none'
    },
    showReplyInput(i, name, id) {
      // console.log(window.sessionStorage.getItem('logid'))
      if (!this.myId) {
        this.$message({
          showClose: true,
          type: 'warning',
          message: '请先登录哦'
        })
        // this.$router.push('/login')
      } else {
        this.$set(this.comments[this.index], 'inputShow', false)
        // this.comments[this.index].inputShow = false
        this.index = i
        this.$set(this.comments[i], 'inputShow', true)
        // this.comments[i].inputShow = true
        this.to = name
        this.toId = id
        this.replyed = '回复：' + name
      }
    },
    _inputShow(i) {
      return this.comments[i].inputShow
    },
    sendComment() {
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
        a.fromId = this.$store.state.logId
        // a.from = this.myName
        // a.toId = ''
        // a.parentId = ''
        a.articleid = this.articleId
        a.content = this.replyComment
        a.headImg = this.myHeader
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
            alert(res.msg)

            // this.comments.push(a)
            that.replyComment = ''
            input.innerHTML = ''
            request({
              url: '/api/home/' + this.$route.params.id
            }).then(res => {
              // console.log(res)

              that.comments = res.data.comment
            })
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    sendCommentReply(i) {
      if (!this.replyComment) {
        this.$message({
          showClose: true,
          type: 'warning',
          message: '评论不能为空'
        })
      } else {
        let a = {}
        let timeNow = new Date().getTime()
        // let time = this.dateStr(timeNow)
        a.fromId = this.$store.state.logId
        a.toId = this.comments[i].fromId
        a.articleid = this.articleId
        a.content = this.replyComment
        a.headImg = this.myHeader
        a.time = timeNow
        a.commentNum = 0
        a.like = 0
        a.parentId = this.comments[i]._id
        let that = this
        // this.comments[i].reply.push(a)
        request({
          method: 'post',
          url: '/api/home/' + this.$route.params.id,
          data: a
        })
          .then(res => {
            alert(res.msg)
            request({
              url: '/api/home/' + this.$route.params.id
            }).then(res => {
              // console.log(res)

              that.comments = res.data.comment
            })
          })

          .catch(err => {
            console.log(err)
          })
        this.replyComment = ''
        document.getElementsByClassName('reply-comment-input')[i].innerHTML = ''
      }
    },
    onDivInput: function(e) {
      this.replyComment = e.target.innerHTML
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
          '-' +
          (date.getMonth() + 1) +
          '-' +
          date.getDate()
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
  .header-img
    display: inline-block
    vertical-align: top
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
  .author-info
    display: inline-block
    margin-left: 5px
    width: 60%
    height: 40px
    line-height: 20px
    >span
      display: block
      cursor: pointer
      overflow: hidden
      white-space: nowrap
      text-overflow: ellipsis
    .author-name
      color: #000
      font-size: 18px
      font-weight: bold
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
    .iconfont
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
  .reply-box
    margin: 10px 0 0 50px
    background-color: #efefef
</style>
