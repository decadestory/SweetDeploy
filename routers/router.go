package routers

import (
	"SweetDeploy/controllers"

	"github.com/astaxie/beego"
)

func init() {
	beego.Router("/", &controllers.MainController{})
	beego.Router("/login", &controllers.MainController{}, "get:Login")
	beego.Router("/submit", &controllers.MainController{}, "post:Submit")
	beego.Router("/upload", &controllers.MainController{}, "post:Upload")
	beego.Router("/unzip", &controllers.MainController{}, "post:UnZip")
	beego.Router("/backup", &controllers.MainController{}, "post:BackUp")
	beego.Router("/deploy", &controllers.MainController{}, "post:Deploy")
}
