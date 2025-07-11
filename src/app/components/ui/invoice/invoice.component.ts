import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { QRCodeComponent } from 'angularx-qrcode';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [CommonModule, MatButtonModule, QRCodeComponent,MatIconModule],  // Use QRCodeModule here
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent {
  @ViewChild('invoice') invoiceElement!: ElementRef;
  email="info@nrwa.ac.mw"
  // QR Code data with payment information
  qrData = `NRWA Payment
Invoice: WR570-2024
Amount: MWK 1,642,711.00
Account: 1234567890
Bank: National Reserve Bank
Branch: 987654
SWIFT: NRWAMWMW`;

  // Current date for the invoice
  invoiceDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  generatePDF() {
    const element = this.invoiceElement.nativeElement;

    // Hide the download button before capturing
    const button = document.querySelector('button');
    if (button) button.style.display = 'none';

    html2canvas(element, {
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`NRWA_Invoice_${this.invoiceDate.replace(/ /g, '_')}.pdf`);

      // Show the button again after capture
      if (button) button.style.display = 'flex';
    }).catch(error => {
      console.error('Error generating PDF:', error);
      if (button) button.style.display = 'flex';
    });
  }
}

