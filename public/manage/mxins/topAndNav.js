
Vue.component('topAndNav',{
    template:`
        <div>
            <!--顶栏-->
            <header>
                <h1 v-text="webname"></h1>
                <div class="breadcrumb">
                    <i class="layui-icon">&#xe715;</i>
                    <ul>
                        <li v-for="vo,index in address">
                            <a v-text="vo.name" :href="vo.url"></a>
                            <span v-if="index==0">/</span>
                        </li>
                    </ul>
                </div>
                <div style="float:right;margin-right: 40px;">
                    <a href="javascript:;">{{username}}</a>
                    <a href="javascript:;" @click="logout">退出</a>
                </div>
            </header>
        
            <!--左侧导航-->
            <div class="main">
                <!--左栏-->
                <div class="left">
                    <ul class="cl">
                        <!--顶级分类-->
                        <li v-for="vo,index in menu">
                            <a href="javascript:;" :class="{active:vo.active}" @click="onActive(index,vo)">
                                <i class="layui-icon" v-html="vo.icon"></i>
                                <span v-text="vo.name"></span>
                                <i class="layui-icon arrow" v-show="vo.url.length==0">&#xe61a;</i>
                                <i v-show="vo.active" class="layui-icon active">&#xe623;</i>
                            </a>
                            <!--子级分类-->
                            <div v-for="vo2,index2 in vo.list" v-if="!vo.hidden">
                                <a href="javascript:;" :class="{active:address[1].name==vo2.name}"
                                   @click="onActive2(index,vo,vo2)" v-text="vo2.name"></a>
                                <i v-show="vo2.active" class="layui-icon active">&#xe623;</i>
                            </div>
                        </li>
                    </ul>
                </div>
                <!--右侧-->
        
            </div>
        </div>
    `,
    data(){
        return{
            username:'',
            webname: 'Haike',
            menu: [],
        }
    },
    mounted(){
        // 获取导航数据和页码地址
        this.getNav()
        this.getUser()
    },
    computed:{
        // 记录当前进入的页面地址
        address(){
            if(window.sessionStorage.getItem('address')){
                var ad = JSON.parse(window.sessionStorage.getItem('address'))
                var one = ad[0]
                //console.log(one);
                this.menu.forEach((item)=>{
                    if(item.name == one.name){
                        //console.log(item);
                        item.hidden =false
                    }else{
                        //console.log(123);
                    }
                })
                return ad
            }else{
                var re = []
                var path = window.location.pathname
                //console.log(path);
                //console.log(this.menu);
                this.menu.forEach((item,index)=>{
                    //console.log(item, index);
                    if(item.list){
                        item.list.forEach((item2,index2)=>{
                            if(path.includes(item2.url)){
                                console.log(item2,index2,index)
                                re.push(
                                    {
                                        name:this.menu[index].name,
                                        url:'javascript:;'
                                    },
                                    {
                                        name:item2.name,
                                        url:item.url
                                    }
                                )
                                // 当前页面的模块默认打开
                                console.log(this.menu[index]);
                                this.menu[index].hidden = false
                            }else{
                                //console.log(123);
                            }
                        })
                    }
                })
                //console.log(re);
                return re
            }
        }
    },
    methods:{
        getUser(){
            // ajax拦截
            $.ajax({
                url:'/users/getUser',
                success:(res)=>{
                    if(res.code>0){
                        this.username = res.data[0].username
                    }else{
                        window.location.href="./login.html"
                    }
                }
            })
        },
        logout(){
            $.ajax({
                url:'/users/logout',
                success:(res)=>{
                   window.location.href="./login.html"
                }
            })
        },
        getNav(){
            $.ajax({
                url: 'data/menu.json',
                dataType: 'text',
                success: (menu) => {
                    menu = eval('(' + menu + ')');
                    this.menu = menu;
                }
            })
        },
        onActive(index, data){
            // 不等于的隐藏 等于的不要设置
            this.menu.forEach(item=>{
                if(item.name != data.name){
                    item.hidden = true
                }
            })
            data.hidden = !data.hidden
        },
        onActive2(index, data, data2){
            var address = []
            address.push(
                {
                    name: data.name,
                    url: data.url
                },
                {
                    name: data2.name,
                    url: data2.url
                }
            )
            this.address = address;
            window.sessionStorage.setItem('address', JSON.stringify(address))

            if (data2.target) {
                if (data2.target == '_blank') {
                    window.open(data2.url);
                } else {
                    window.location.href = data2.url;
                }
            } else {
                window.location.href = data2.url;
            }
        },
    }
})
