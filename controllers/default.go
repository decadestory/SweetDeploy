package controllers

import (
	"SweetDeploy/libs"
	"fmt"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/astaxie/beego"
)

var installerPath string
var backupPath string
var webPath string
var accSet string
var pwdSet string

var mutex sync.Mutex

func init() {
	installerPath = beego.AppConfig.String("appPath::installerPath")
	backupPath = beego.AppConfig.String("appPath::backupPath")
	webPath = beego.AppConfig.String("appPath::webPath")
	accSet = beego.AppConfig.String("login::acc")
	pwdSet = beego.AppConfig.String("login::pwd")

	mutex.Lock()
	if !libs.Exist(installerPath) {
		if os.Mkdir(installerPath, 0777) != nil {
			return
		}
	}

	if !libs.Exist(backupPath) {
		if os.Mkdir(backupPath, 0777) != nil {
			return
		}
	}

	if !libs.Exist(webPath) {
		if os.Mkdir(webPath, 0777) != nil {
			return
		}
	}
	mutex.Unlock()

}

// MainController ...
type MainController struct {
	beego.Controller
}

//Get 首页
func (c *MainController) Get() {
	sess := c.GetSession("uname")
	if sess != accSet {
		c.TplName = "login.html"
		return
	}

	c.TplName = "index.html"
}

//Login 登录页面
func (c *MainController) Login() {
	c.TplName = "login.html"
}

//LoginOut 注销
func (c *MainController) LoginOut() {
	c.DelSession("uname")
	c.TplName = "login.html"
}

//Submit 登录提交
func (c *MainController) Submit() {
	acc := c.GetString("sd_account")
	pwd := c.GetString("sd_password")

	if acc == accSet && pwd == pwdSet {
		c.SetSession("uname", accSet)

		c.Data["json"] = map[string]string{
			"error": "0",
			"data":  "登录成功",
		}
		c.ServeJSON()
	}

	c.Data["json"] = map[string]string{
		"error": "-1",
		"data":  "账号或密码错误",
	}
	c.ServeJSON()
}

//Upload 发布
func (c *MainController) Upload() {
	f, h, err := c.GetFile("deployFile") //获取上传的文件
	if err != nil {
		f.Close()
		fmt.Println(err)
		fmt.Println(err, h.Filename)
	}

	uploadPath := "./upload/"
	if !libs.Exist(uploadPath) {
		if os.Mkdir(uploadPath, 0777) != nil {
			fmt.Println("文件夹", uploadPath, "创建失败")
			return
		}
	}

	timeNow := time.Now().Format("2006_01_02 15_04_05")
	fileName := uploadPath + strings.Replace(timeNow, " ", "_", 1) + "_" + h.Filename

	c.SaveToFile("deployFile", fileName) //存文件

	c.Data["json"] = map[string]string{
		"error": "0",
		"data":  fileName,
	}
	c.ServeJSON()
}

//UnZip 解压文件
func (c *MainController) UnZip() {
	filePath := c.GetString("path")
	mutex.Lock()
	libs.DeleteAllFile(installerPath)
	libs.DeCompress(filePath, installerPath)
	defer mutex.Unlock()
	c.Data["json"] = map[string]string{
		"error": "0",
		"data":  "解压成功",
	}
	c.ServeJSON()

}

//BackUp 备份
func (c *MainController) BackUp() {
	timeNow := time.Now().Format("2006_01_02 15_04_05")
	backupSubPath := backupPath + "/" + strings.Replace(timeNow, " ", "_", 1)

	libs.CopyDir(webPath, backupSubPath)

	c.Data["json"] = map[string]string{
		"error": "0",
		"data":  "备份成功",
	}
	c.ServeJSON()
}

//Deploy 发布
func (c *MainController) Deploy() {
	libs.CopyDir(installerPath, webPath)

	c.Data["json"] = map[string]string{
		"error": "0",
		"data":  "发布成功",
	}
	c.ServeJSON()
}
