/**
 * Created by wuxinmeng on 2018/2/1.
 */
new Vue({
    el:'#app',
    data:{
        totalMoney:0,
        productList:[],
        checkAll:false,
        delFlag:false,
        currProduct:null
    },
    filters:{
        formatMoney:function(value){
            return '￥'+value.toFixed(2);
        }
    },
    mounted:function(){
        this.$nextTick(function(){
            this.cartView();
        });
    },
    methods:{
        cartView:function(){
            var _this=this;
            this.$http.get("data/cartData.json",{"id":123}).then(function(res){
                _this.productList=res.body.result.list ;
                //_this.totalMoney = res.body.result.totalMoney;
            });
        },
        changeMoney:function(product,way){
            if(way>0){
                product.productQuantity++;
            }else{
                product.productQuantity--;
                if(product.productQuantity<1){
                    product.productQuantity=1;
                }
            }
            this.cacTotalPrice();
        },
        setChecked:function(product){
            //debugger;
            if(product.hasOwnProperty("checked")){
                product.checked = ! product.checked;
            } else{
                Vue.set(product,"checked",true);
            }
            this.cacTotalPrice();
            var arrFlag =[];
            this.productList.forEach((value,index)=>{
                if(value.hasOwnProperty("checked")){
                    if(value.checked){
                        arrFlag.push(1);
                    }else{
                        arrFlag.push(-1);
                    }
                }else{
                    arrFlag.push(-1);
                }
            });
            //debugger;
            if(arrFlag.join("").indexOf("-1")!=-1){
                this.checkAll = false;
            }else{
                this.checkAll = true;
            }
        },
        setCheckAll:function(){
            //Vue.set(data,"checkAll",false);
            this.checkAll = !this.checkAll;
            this.productList.forEach((value,index)=>{
                if(value.hasOwnProperty("checked")){
                    value.checked = this.checkAll;
                }else{
                    Vue.set(value,"checked",this.checkAll);
                }
            });
            this.cacTotalPrice();
        },
        cacTotalPrice:function(){
            this.totalMoney = 0;
            this.productList.forEach((value,index)=>{
                if(value.checked){
                    this.totalMoney += value.productPrice * value.productQuantity;
                }
            })
        },
        delProduct:function(item){
            this.delFlag  = true;
            this.currProduct = item;
        },
        sureDelProduct:function(){
            var index = this.productList.indexOf(this.currProduct);
            this.productList.splice(index,1);
            this.delFlag  = false;
        }
    }
});
Vue.filter('money',function(value){
    return '￥'+value.toFixed(2);
});