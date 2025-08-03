package handlers

import (
	"fmt"
	"net/http"
	"bytes"
	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/jung-kurt/gofpdf"
)

type Invoice struct {
	InvoiceNumber string     `json:"invoiceNumber"`
	Date          string     `json:"date"`
	Client        Client     `json:"client"`
	Items         []LineItem `json:"items"`
	Notes         string     `json:"notes"`
}

type Client struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Address string `json:"address"`
}

type LineItem struct {
	Description string  `json:"description"`
	Quantity    int     `json:"quantity"`
	Price       float64 `json:"price"`
}

func GenerateInvoice(c *gin.Context) {
	var invoice Invoice
	contentType := c.ContentType()
	if contentType == "multipart/form-data" {
		invoice.InvoiceNumber = c.PostForm("invoiceNumber")
		invoice.Date = c.PostForm("date")
		clientStr := c.PostForm("client")
		itemsStr := c.PostForm("items")
		invoice.Notes = c.PostForm("notes")
		// Parse client JSON
		if err := json.Unmarshal([]byte(clientStr), &invoice.Client); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid client data"})
			return
		}
		// Parse items JSON
		if err := json.Unmarshal([]byte(itemsStr), &invoice.Items); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid items data"})
			return
		}
	} else {
		if err := c.ShouldBindJSON(&invoice); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid invoice data"})
			return
		}
	}

	pdf := gofpdf.New("P", "mm", "A4", "")
	pdf.AddPage()
	pdf.SetFont("Arial", "B", 16)
	pdf.Cell(40, 10, "Invoice")
	pdf.Ln(12)
	pdf.SetFont("Arial", "", 12)
	pdf.Cell(40, 10, "Invoice Number: "+invoice.InvoiceNumber)
	pdf.Ln(8)
	pdf.Cell(40, 10, "Date: "+invoice.Date)
	pdf.Ln(8)
	pdf.Cell(40, 10, "Client: "+invoice.Client.Name)
	pdf.Ln(8)
	pdf.Cell(40, 10, "Email: "+invoice.Client.Email)
	pdf.Ln(8)
	pdf.MultiCell(0, 10, "Address: "+invoice.Client.Address, "", "", false)
	pdf.Ln(8)
	pdf.Cell(40, 10, "Notes: "+invoice.Notes)
	pdf.Ln(12)

	pdf.SetFont("Arial", "B", 12)
	pdf.Cell(60, 10, "Description")
	pdf.Cell(30, 10, "Quantity")
	pdf.Cell(30, 10, "Price")
	pdf.Cell(30, 10, "Total")
	pdf.Ln(10)
	pdf.SetFont("Arial", "", 12)

	var grandTotal float64
	for _, item := range invoice.Items {
		pdf.Cell(60, 10, item.Description)
		pdf.CellFormat(30, 10, formatInt(item.Quantity), "", 0, "C", false, 0, "")
		pdf.CellFormat(30, 10, formatFloat(item.Price), "", 0, "C", false, 0, "")
		total := float64(item.Quantity) * item.Price
		pdf.CellFormat(30, 10, formatFloat(total), "", 0, "C", false, 0, "")
		pdf.Ln(10)
		grandTotal += total
	}
	pdf.Ln(8)
	pdf.SetFont("Arial", "B", 12)
	pdf.Cell(40, 10, "Grand Total: "+formatFloat(grandTotal))

	// Output PDF to buffer
	var b bytes.Buffer
	err := pdf.Output(&b)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate PDF"})
		return
	}
	c.Data(http.StatusOK, "application/pdf", b.Bytes())
}

func formatFloat(f float64) string {
	return fmt.Sprintf("%.2f", f)
}

func formatInt(i int) string {
	return fmt.Sprintf("%d", i)
}
