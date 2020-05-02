<template>
  <div class="movie_body" ref="movie_body">
    <Loading v-if="loading" />
    <Scroller :handleToScroll="handleToScroll2" :handleToTouchEnd="handleToTouchEnd2" v-else>
      <ul>
        <li class="pullDown">{{pullDownMsg}}</li>
        <li v-for="item in movieList" :key="item.id">
          <div class="pic_show">
            <img :src="item.img | setWH('128.180')" />
          </div>
          <div class="info_list">
            <h2>
              {{item.nm}}
              <img v-if="item.version" src="@/assets/maxs.png" />
            </h2>
            <p>
              观众评
              <span class="grade">{{ item.sc }}</span>
            </p>
            <p>主演: {{ item.star }}</p>
            <p>{{ item.showInfo }}</p>
          </div>
          <div class="btn_mall">购票</div>
        </li>
      </ul>
    </Scroller>
  </div>
</template>

<script>
import { MessageBox } from "mint-ui";
export default {
  name: "NowPlaying",
  data() {
    return {
      movieList: [],
      pullDownMsg: "",
      loading: true,
      prevCityId: -1//用来与城市id做比较
    };
  },
  activated() {
    //生命周期中专属于keep-alive的钩子钩子函数
    var cityId = this.$store.state.city.id;
    if (this.prevCityId === cityId) {
      //如果城市没有改变直接结束函数
      return;
    }
    //如果城市id变化了那么则重新发送ajax请求
    this.loading = true;
    this.axios.get("/api/movieOnInfoList?cityId=" + cityId).then(res => {
      var msg = res.data.msg;
      if (msg == "ok") {
        this.movieList = res.data.data.movieList;
        this.loading = false;
        this.prevCityId = cityId;
        // 		this.$nextTick(()=>{
        // 			var scroll = new BScroll(this.$refs.movie_body,{
        // 				tap:true,
        // 				probeTyoe:1
        // 			});
        // 			scroll.on('scroll',(pos)=>{
        //                     console.log('scroll');
        //                     if(pos.y>30){
        //                         this.pullDownMsg = '正在更新中';
        // 					}

        //                 });
        // 			scroll.on('touchEnd',(pos)=>{
        // 				if(pos.y>30){
        // 					this.axios.get('/api/movieOnInfoList?cityId=10').then((res)=>{
        // 					var msg = res.data.msg;
        // 					if(msg=='ok'){
        // 						this.pullDownMsg='更新完成'
        // 					}
        // 					setTimeout(() => {
        // 						this.pullDownMsg=''
        // 					this.movieList = res.data.data.movieList;
        // 					}, 1000);
        // 					})

        // 				}
        // 			})
        // 		})
      }
    });
  },
  mounted() {//因为有keep-alive缓存，所有挂载函数只会执行一次，在第一次组件挂载时便发送ajax请求获取到当前所在城市
    
    this.axios.get("/api/getLocation").then(res => {
      console.log(res);
      var msg = res.data.msg;
      var id = res.data.data.id;
      var nm = res.data.data.nm;
      if (msg == "ok") {
        MessageBox.confirm("", {//这里使用的是mintUI的messageBox弹出框来对地址的一个确认
          title: "请确认您的城市",
          message: "您是否处于" + nm,
          confirmButtonText: "确认",
          cancelButtonText: "取消"
        })
          .then(action => {
            if (action == "confirm") {
              this.$store.commit("city/CITY_INFO", { id, nm });
              window.localStorage.setItem("nowNm", nm);
              window.localStorage.setItem("nowId", id);
            }
          })
          .catch(error => {
            if (error == "cancel") {
              console.log("点击取消");
            }
          });
      }
    });
  },

  methods: {
    handleToScroll2(pos) {
      if (pos.y > 30) {
        this.pullDownMsg = "正在更新";
      }
    },
    handleToTouchEnd2(pos) {
      if (pos.y > 30) {
        this.axios.get("/api/movieOnInfoList?cityId=10").then(res => {
          var msg = res.data.msg;
          if (msg == "ok") {
            this.pullDownMsg = "更新完成";
          }
          setTimeout(() => {
            this.pullDownMsg = "";
            this.movieList = res.data.data.movieList;
          }, 1000);
        });
      }
    }
  }
};
</script>
<style scoped>
#content .movie_body {
  flex: 1;
  overflow: auto;
}
.movie_body ul {
  margin: 0 12px;
  overflow: hidden;
}
.movie_body ul li {
  margin-top: 12px;
  display: flex;
  align-items: center;
  border-bottom: 1px #e6e6e6 solid;
  padding-bottom: 10px;
}
.movie_body .pic_show {
  width: 64px;
  height: 90px;
}
.movie_body .pic_show img {
  width: 100%;
}
.movie_body .info_list {
  margin-left: 10px;
  flex: 1;
  position: relative;
}
.movie_body .info_list h2 {
  font-size: 17px;
  line-height: 24px;
  width: 150px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.movie_body .info_list p {
  font-size: 13px;
  color: #666;
  line-height: 22px;
  width: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.movie_body .info_list .grade {
  font-weight: 700;
  color: #faaf00;
  font-size: 15px;
}
.movie_body .info_list img {
  width: 50px;
  position: absolute;
  right: 10px;
  top: 5px;
}
.movie_body .btn_mall,
.movie_body .btn_pre {
  width: 47px;
  height: 27px;
  line-height: 28px;
  text-align: center;
  background-color: #f03d37;
  color: #fff;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
}
.movie_body .btn_pre {
  background-color: #3c9fe6;
}
.movie_body .pullDown {
  margin: 0;
  padding: 0;
  border: none;
}
</style>