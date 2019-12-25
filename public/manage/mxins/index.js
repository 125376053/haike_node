var pub = {
    data: {
        // 页面通用参数
        eneditor:'',
        search:'',
        dialogVisible:false,
        dialogVisible1:false,
        imgUrl:api+'/common/upload/img',
        videoUrl:api+'/common/uploadVideo/',
        count: 0, //总条数
        pages:0,
        page: 1, //当前页码
        pageCount:3, //每页条数
        search:''
    },
    methods:{

        // 格式化日期
        date(time){
            var time = new Date(time).toLocaleString()
            return time
        },
        // 日历返回值
        changeTime(v){
            console.log(v);
        },
        changeShijian(v){
            console.log(v);
        },
        changeDay(v){
            console.log(v);
        },
        // 分页
        pageChange(page){
            this.page = page
            this.getData()
        },

        /*changeImg(file, fileList){
            //console.log(file, fileList);
            this.ruleForm.imgPath = file.name
        },*/
        //上传图片新建
        successImg(response, file, fileList){
            console.log(response, file, fileList);
            this.ruleForm.imgPath = response.data
        },
        errorImg(error, file, fileList){
            console.log(error, file, fileList);
        },

        //上传图片更新
        successImg2(response, file, fileList){
            console.log(response, file, fileList);
            this.editObj.imgPath = response.data
        },
        errorImg2(error, file, fileList){
            console.log(error, file, fileList);
        },

        // 视频地址 新建
        successVideo(response, file, fileList){
            console.log(response, file, fileList);
            this.ruleForm.videoPath = response.data
        },
        errorVideo(error, file, fileList){
            console.log(error, file, fileList);
        },

        // 视频地址 更新
        successVideo2(response, file, fileList){
            console.log(response, file, fileList);
            this.editObj.videoPath = response.data
        },
        errorVideo2(error, file, fileList){
            console.log(error, file, fileList);
        },

        // 新建弹出层
        add1(){
            this.dialogVisible = true
            this.$nextTick(()=>{
                if($('#eneditor').length>0){
                    if(this.eneditor){
                        this.eneditor.txt.html('')
                    }
                    this.showEditor('#eneditor')
                }
                this.$refs.ruleForm.resetFields()
            })
        },
        // 编辑弹出
        edit(obj){
            console.log('编辑数据');
            console.log(this.editObj);
            this.dialogVisible1 = true
            // 解决双向绑定导致弹出内容修改 列表自动改变问题
            this.editObj = Object.assign(this.editObj,obj)
            this.$nextTick(()=>{
                // 编辑的编辑器
                if($('#eneditor2').length>0){
                    this.showEditor('#eneditor2')
                }
                // 设置内容---表格是detail 就设置detail
                if(this.eneditor){
                    if(obj.detail){
                        this.eneditor.txt.html(obj.detail)
                    }else{
                        this.eneditor.txt.html(obj.content)
                    }
                }
                this.$refs.editForm.resetFields()
            })
        },
        beforeImgUpload(file) {
            console.log(file);
            const isLt2M = file.size / 1024 / 1024 < 1;
            if (!isLt2M) {
                this.$message.error('上传图片不能超过1MB!');
            }
            return isLt2M;
        },
        beforeVideoUpload(file) {
            console.log(file);
            const isLt2M = file.size / 1024 / 1024 < 5;
            if (!isLt2M) {
                this.$message.error('上传视频不能超过5MB!');
            }
            return isLt2M;
        },
        // 足迹详情
        showEditor(id){
            // 避免重复创建
            if($(id).children().length>1){
                return false
            }
            var EE = window.wangEditor;
            var eneditor = new EE(id);
            this.eneditor = eneditor;
            // 配置服务器端地址,也就是controller的请求路径，不带项目路径，前面没有/
            // http://192.168.101.83/haike/common/upload/wangEditImg
            eneditor.customConfig.uploadImgServer = api+'/common/upload/wangEditImg'
            //eneditor.customConfig.withCredentials = true
            eneditor.customConfig.uploadImgTimeout = 50000;
            eneditor.customConfig.uploadImgMaxSize = 10 * 1024 * 1024;
            //配置属性名称，绑定请求的图片数据
            //controller会用到，可以随便设置，但是一定要与controller一致
            eneditor.customConfig.uploadFileName = 'myFile';



            eneditor.customConfig.uploadImgHooks = {
                customInsert: function (insertImg, result, editor) {
                    console.log(insertImg, result, editor);
                    // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
                    // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

                    // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
                    var url =api+'/'+result.data;
                    console.log(url);
                    insertImg(url);
                }
            }

            //创建编辑器
            eneditor.create();
        },
    }
}

