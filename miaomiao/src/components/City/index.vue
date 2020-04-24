<template>
<div class="city_body">
				
				<mt-index-list>
					 <div class="city_hot">
                        <h2>热门城市</h2>
                        <ul class="clearfix">
                            <li v-for="item in hotList" :key="item.id" >{{ item.nm }}</li>
                        </ul>
                    </div>
			<mt-index-section v-for="item in cityList" :key="item.index" :index="item.index">
				<mt-cell v-for="itemList in item.list" :key="itemList.id" :title="itemList.nm"></mt-cell>
			</mt-index-section>
			</mt-index-list>
			</div>
		
</template>

<script>
export default {
name:"City",
data(){
	return{
		cityList:[],
		hotList:[]
	}
},
mounted(){
	this.axios.get('/api/cityList').then((res)=>{
	var msg = res.data.msg;
	if(msg==='ok'){
		var data = res.data.data.cities
		var {cityList,hotList} = this.formatCityList(data)
		this.cityList = cityList;
		this.hotList = hotList;
		console.log(cityList,hotList)
	}
	})

},
methods:{
	formatCityList(cityes){
		var cityList=[];
		var hotList=[];
		for(let i=0;i<cityes.length;i++){
			if(cityes[i].isHot==1){
				hotList.push(cityes[i])
			}
		}//将热门城市放入热门城市数组
		for(var i =0;i<cityes.length;i++){//通过for循环来将城市通过首字母分类
			var firstLetter = cityes[i].py.substring(0,1).toUpperCase();
			if(toCom(firstLetter)){
				cityList.push({ index : firstLetter , list : [ { nm : cityes[i].nm , id : cityes[i].id } ] })//如果没有数组中没有此字母，则新建一个包含此字母的对象
			}else{
				for (var j = 0; j < cityList.length; j++) {//如果数组中已经存在此首字母，则将其push进入list数组中
					if(cityList[j].index==firstLetter){
						cityList[j].list.push({nm:cityes[i].nm,id:cityes[i].id})
					}
				}
			}
		}
		function toCom(firstLetter){//通过方法来确定是否要在cityList中插入一个新的对象
			for(var i =0;i<cityList.length;i++){
				if(cityList[i].index==firstLetter){
					return false;
				}
			}
			return true;
		}
		 cityList.sort((n1,n2)=>{//将数组从小到大，从A-Z排序
                if( n1.index > n2.index ){
                    return 1;
                }
                else if(n1.index < n2.index){
                    return -1;
                }
                else{
                    return 0;
                }
            });
		return{
			cityList,
			hotList
		}
	}
}
}
</script>
<style scoped>
#content .city_body{ margin-top: 45px; display: flex; width:100%; position: absolute; top: 0; bottom: 0;}
.city_body .city_list{ flex:1; overflow: auto; background: #FFF5F0;}
.city_body .city_list::-webkit-scrollbar{
    background-color:transparent;
    width:0;
}
.city_body .city_hot{ margin-top: 20px;}
.city_body .city_hot h2{ padding-left: 15px; line-height: 30px; font-size: 14px; background:#F0F0F0; font-weight: normal;}

.city_body .city_hot ul li{ float: left; background: #fff; width: 29%; height: 33px; margin-top: 15px; margin-left: 3%; padding: 0 4px; border: 1px solid #e6e6e6; border-radius: 3px; line-height: 33px; text-align: center; box-sizing: border-box;}
.city_body .city_sort div{ margin-top: 20px;}
.city_body .city_sort h2{ padding-left: 15px; line-height: 30px; font-size: 14px; background:#F0F0F0; font-weight: normal;}
.city_body .city_sort ul{ padding-left: 10px; margin-top: 10px;}
.city_body .city_sort ul li{ line-height: 30px; line-height: 30px;}
.city_body .city_index{ width:20px; display: flex; flex-direction:column; justify-content:center; text-align: center; border-left:1px #e6e6e6 solid;}

</style>