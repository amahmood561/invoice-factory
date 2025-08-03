package handlers

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

// GenerateInvoice is a stub handler for PDF generation
func GenerateInvoice(c *gin.Context) {
	c.String(http.StatusOK, "Invoice PDF generation endpoint (stub)")
}
