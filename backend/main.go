package main


import (
	"github.com/gin-gonic/gin"
	"invoice-factory-backend/handlers"
)

func main() {
	r := gin.Default()
	r.POST("/generate-invoice", handlers.GenerateInvoice)
	r.Run(":8080")
}
