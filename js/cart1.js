/**
 * Created by wuxinmeng on 2018/2/2.
 */

new Vue({
    el:'#app',
    data:{
        //存储后台数据商品
        productList:[],
        //总金额
        totalMoney:0,
        //全选：
        checkedAll:false,
        //删除：
        delFlag:false,
        //当前要删除的商品
        currProduct:null
    },
    filters:{
        //金额局部过滤：
        formatMoney:function(value){
            return  '￥'+value.toFixed(2);
        }
    },
    mounted:function(){
        this.$nextTick(function(){
            this.cartView();
        });
    },
    methods:{
        //初次渲染视图：
        cartView:function(){
            //使用vue-resource加载json数据
            this.$http.get("data/cartData.json").then(res=>{
                this.productList = res.body.result.list;
            })
        },
        //加减改变数量：
        changeQuantity:function(product,type){
            if(type>0){
                product.productQuantity++;
            }else{
                product.productQuantity--;
                if(product.productQuantity<1){
                    product.productQuantity=1;
                }
            }
            this.calMoney();
        },
        //单选：
        setCheck:function(item){
            if(item.hasOwnProperty("checked")){
                item.checked = ! item.checked;
            }else{
                Vue.set(item,"checked",true);
            }
            //全选和单选联动：
            var arrCheck=[];
            this.productList.forEach((value)=>{
                if(value.checked){
                    arrCheck.push(1);
                } else{
                    arrCheck.push(-1)
                }
            });
            if(arrCheck.indexOf(-1)==-1){
                this.checkedAll =true;
            }else{
                this.checkedAll = false;
            }
            this.calMoney();
        },
        //全选：
        setCheckAll:function(){
            this.checkedAll = !this.checkedAll;
            this.productList.forEach((value,index)=>{
                if(value.hasOwnProperty("checked")){
                    value.checked = this.checkedAll;
                }else{
                    Vue.set(value,"checked",this.checkedAll);
                }
            });
            this.calMoney();
        },
        //删除：
        delProduct:function(item){
            this.delFlag = ! this.delFlag;
            this.currProduct = item;
        },
        sureDelProduct:function(){
            var index = this.productList.indexOf(this.currProduct);
            this.productList.splice(index,1);
            this.delFlag = !this.delFlag;
            this.calMoney();
        },
        //计算总金额:
        calMoney:function(){
            this.totalMoney = 0;
            this.productList.forEach((value,index)=>{
                if(value.checked){
                    this.totalMoney += value.productPrice * value.productQuantity;
                }
            });
        }
    }
});
//全局过滤
Vue.filter('money',function(value){
    return '￥' + value.toFixed(2);
});