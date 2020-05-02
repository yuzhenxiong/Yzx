<template>
  <div class="cinema_body">
    <Loading v-if="loading"/>
    <Scroller :handleToScroll="handleToScroll2" :handleToTouchEnd="handleToTouchEnd2" v-else>
      <ul>
        <li class="pullDown">{{pullDownMsg}}</li>
        <li v-for="item in cinemaList" :key="item.id">
          <div>
            <span>{{item.nm}}</span>
            <span class="q">
              <span class="price">{{item.sellPrice}}</span> 元起
            </span>
          </div>
          <div class="address">
            <span>{{item.addr}}</span>
            <span>{{item.distance}}</span>
          </div>
          <div class="card">
            <div
              v-for="(i,key) in item.tag"
              :key="key"
              v-if="i===1"
              :class="key|formatColor()"
            >{{key|formatCard()}}</div>
          </div>
        </li>
      </ul>
    </Scroller>
  </div>
</template>

<script>
export default {
  name: "cinemalist",
  data() {
    return {
      cinemaList: [],
      pullDownMsg: "",
      loading:true,
      prevCityId:-1
    };
  },
  activated() {
    var cityId = this.$store.state.city.id;
     if(this.prevCityId ===cityId){//如果城市没有改变直接结束函数
      return;
    }
    this.loading = true;
    this.axios.get("/api/cinemaList?cityId="+cityId).then(res => {
      var msg = res.data.msg;
      if (msg === "ok") {
        this.loading=false;
        var data = res.data.data;
        console.log(data);
        this.cinemaList = data.cinemas;
      }
    });
  },
  filters: {
    formatCard(key) {
      var arr = [
        { key: "allowRefund", val: "改签" },
        { key: "endorse", val: "退票" },
        { key: "sell", val: "折扣" },
        { key: "snack", val: "小吃" }
      ];
      for (var i = 0; i < arr.length; i++) {
        if (key == arr[i].key) {
          return arr[i].val;
        }
      }
    },
    formatColor(key) {
      var arr = [
        { key: "allowRefund", val: "or" },
        { key: "endorse", val: "or" },
        { key: "sell", val: "bl" },
        { key: "snack", val: "bl" }
      ];
      for (var i = 0; i < arr.length; i++) {
        if (key == arr[i].key) {
          return arr[i].val;
        }
      }
    }
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
#content .cinema_body {
  flex: 1;
  overflow: auto;
}
.cinema_body ul {
  padding: 20px;
}
.cinema_body li {
  border-bottom: 1px solid #e6e6e6;
  margin-bottom: 20px;
}
.cinema_body div {
  margin-bottom: 10px;
}
.cinema_body .q {
  font-size: 11px;
  color: #f03d37;
}
.cinema_body .price {
  font-size: 18px;
}
.cinema_body .address {
  font-size: 13px;
  color: #666;
}
.cinema_body .address span:nth-of-type(2) {
  float: right;
}
.cinema_body .card {
  display: flex;
}
.cinema_body .card div {
  padding: 0 3px;
  height: 15px;
  line-height: 15px;
  border-radius: 2px;
  color: #f90;
  border: 1px solid #f90;
  font-size: 13px;
  margin-right: 5px;
}
.cinema_body .card div.or {
  color: #f90;
  border: 1px solid #f90;
}
.cinema_body .card div.bl {
  color: #589daf;
  border: 1px solid #589daf;
}
.cinema_body .pullDown {
  margin: 0;
  padding: 0;
  border: none;
}
</style>