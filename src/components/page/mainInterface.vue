<template>
  <div id="p" class="page">
    <div>
      <div class="ms-doc">
        <h3>README.md</h3>
        <article>
          <h1>编译器文法分析模拟器</h1>
          <p>在编译原理课程的文法分析知识学习过程中，由于相关知识比较抽象，给学习者的学习带来困难。</p>
          <h2>目的</h2>
          <p>为解决此问题，本项目将研发一款针对编译器文法分析模拟器，通过可视化的方式，动态地展示分析算法的构造过程，帮助学习者更好地理解词法、语法和语义的分析知识。</p>
          <!--<p></p>-->

          <h2>功能特点</h2>
          <el-checkbox disabled checked>1、 词法分析：依据词法规则，以可视化方式展示NFA和DFA构造，自动转换词法分析算法的实现；</el-checkbox>
          <br>
          <el-checkbox disabled checked>2、 语法分析：依据语法规则，以可视化方式展示top-down和bottom-up的算法构造过程；</el-checkbox>
          <br>
          <el-checkbox disabled checked>3、 语义分析：依据语义规则，构造依赖图，可视化展示属性计算过程；</el-checkbox>
          <br>
          <el-checkbox disabled checked>4、 基于Web的模拟器系统方面学习这通过网络利用本模拟器。</el-checkbox>
          <br>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mainInterface',
  methods: {
    turnToHome () {
      this.$router.push('/')
    },
    randomNum (minNum, maxNum) {
      switch (arguments.length) {
        case 1:
          return parseInt(Math.random() * minNum + 1, 10)
        case 2:
          return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
        default:
          return 0
      }
    }
  },
  mounted () {
    document.getElementById('p').style.minHeight = (window.innerHeight) + 'px'

    switch (this.randomNum(0, 1)) {
      case 0:
        document.getElementById('p').style.backgroundImage = "url('/static/img/login.jpg')"
        break
      case 1:
        document.getElementById('p').style.backgroundImage = "url('/static/img/main.jpg')"
        break
      // case 2:
      //   document.getElementById('p').style.backgroundImage = "url('/static/img/city.jpg')"
      //   break
      // case 3:
      //   document.getElementById('p').style.backgroundImage = "url('/static/img/dawn.jpg')"
      //   break
      // case 4:
      //   document.getElementById('p').style.backgroundImage = "url('/static/img/sword.png')"
      //   break
      // case 13:
      //   document.getElementById('p').style.backgroundImage = "url('/static/img/regex.jpg')"
      //   break
      // case 14:
      //   document.getElementById('p').style.backgroundImage = "url('/static/img/1.jpg')"
      //   break
      // case 15:
      //   document.getElementById('p').style.backgroundImage = "url('/static/img/2.jpg')"
      //   break
      // case 5:
      //   document.getElementById('p').style.backgroundImage = "url('/static/img/3.jpg')"
      //   break
      // case 6:
      //   document.getElementById('p').style.backgroundImage = "url('/static/img/4.jpg')"
      //   break
      // case 7:
      //   document.getElementById('p').style.backgroundImage = "url('/static/img/5.jpg')"
      //   break
      // case 8:
      //   document.getElementById('p').style.backgroundImage = "url('/static/img/6.jpg')"
      //   break
      // case 9:
      //   document.getElementById('p').style.backgroundImage = "url('/static/img/7.jpg')"
      //   break
      // case 10:
      //   document.getElementById('p').style.backgroundImage = "url('/static/img/8.jpg')"
      //   break
      // case 11:
      //   document.getElementById('p').style.backgroundImage = "url('/static/img/9.jpg')"
      //   break
      // case 12:
      //   document.getElementById('p').style.backgroundImage = "url('/static/img/10.jpg')"
      //   break
    }
  }
}
</script>

<style scoped>
.page {
  height: 100%;
  position: absolute;
  width: 100%;
  z-index: -5;
  margin-top: -7rem;
  background-image: url('/static/img/main.jpg');
  background-size: cover;
}
.ms-doc {
  width: 100%;
  max-width: 980px;
  /*margin-left: 100px;
  margin-top: 10%;*/
  position: absolute;
  height: auto;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial,
    sans-serif;
  color: #fff;
}
.ms-doc h3 {
  padding: 9px 10px 10px;
  margin: 0;
  font-size: 14px;
  line-height: 17px;
  background-color: rgba(80, 80, 80, 0.5);
  border: 1px solid #d8d8d8;
  border-bottom: 0;
  border-radius: 3px 3px 0 0;
  color: #fff;
}
.ms-doc article {
  padding: 45px;
  word-wrap: break-word;
  min-height: 50%;
  background-color: rgba(120, 120, 120, 0.5);
  border: 1px solid #ddd;
  border-bottom-right-radius: 3px;
  border-bottom-left-radius: 3px;
  color: #fff;
}
.ms-doc article h1 {
  font-size: 32px;
  padding-bottom: 10px;
  margin-bottom: 15px;
  border-bottom: 1px solid #ddd;
  color: #fff;
}
.ms-doc article h2 {
  margin: 24px 0 16px;
  font-weight: 600;
  line-height: 1.25;
  padding-bottom: 7px;
  font-size: 24px;
  border-bottom: 1px solid #eee;
  color: #fff;
}
.ms-doc article p {
  margin-bottom: 15px;
  line-height: 1.5;
  color: #fff;
  font-size: 1.8rem;
}
.ms-doc article .el-checkbox {
  margin-bottom: 5px;
}
</style>
